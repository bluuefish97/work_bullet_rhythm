import { CONSTANTS } from "../Constants";
import { PoolManager } from "../util/PoolManager";
import { Utility } from "../util/Utility";
import PointRunner, { RunnerType } from "./PointRunner";
import PlayStage, { PlayHardLv, PlayPattern } from "./PlayStage";
import GameManager from "../GameManager";
import { Facade } from "../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../purmvc_app/proxy/proxyDefine";
import { GamePxy } from "../purmvc_app/proxy/GamePxy";
import { V1_1_4Pxy } from "../purmvc_app/proxy/V1_1_4Pxy";
import { ActivityEventState } from "../purmvc_app/proxy/ActivityPxy";

const { ccclass, property } = cc._decorator;
const WaitHealthPointNum = 15; //15     //损失生命值后相隔多少了节奏点产生恢复节奏点
@ccclass
export default class PointGenerator extends cc.Component {



    @property(cc.Prefab)
    point: cc.Prefab = null
    @property(cc.Prefab)
    lifePoint: cc.Prefab = null
    @property(cc.Prefab)
    specialPoint: cc.Prefab = null
    // @property(cc.Prefab)
    // v1_1_4Point: cc.Prefab = null
    @property(cc.Prefab)
    rewardPoint: cc.Prefab = null
    @property
    bestFireDir: number = 0;
    MAXcontinueDirNum: number = 3;   //在同一个方向的最大节奏个数 

    activePointRunners: Array<PointRunner> = new Array<PointRunner>();
    endCreatePointId: number = 0;           //生成的节奏点的最后的id
    tempEndCreatePointId: number = 0;       //暂存的节奏点的最后的id
    endCreateSpecialPointId: number = 0;     //创造的特殊的节奏点最后的id
    EndCreateRewardPointId: number = 0;       //生成的奖励钻石的最后的id
    finalHitPointID: number = 0;       //最后击中的节奏点下标
    lastPointHorVal: number = 0;
    lastHorDirIsL: boolean = false;   //上一次的方向是否为左边
    continueDirNum: number = 0;        //在同一个方向的节奏个数 
    continueDirOriginNum: number = 0;     //开启同一个方向的节奏的起始值
    isOpenContinueDir: boolean = false;        //是否开启在同一个方向的节奏个数连续 
    sumDurTime: number = 0;
    doubleHitX: number = 0;                 //连击的点的x坐标
    curOfferChipNum: number = 0;                 //已经提供的碎片数
    lastDiaHorX: number = null;                 //上一个钻石的位置
    DiaHorDir: number = 1;                 //上一个钻石的位置
    curPoint: cc.Node = null;

    minOffset: number = 0;
    localPointRatioHorVal: number = CONSTANTS.PointRatioHorVal;
    curOfferChipIds: Array<number> = new Array<number>();
    gamePxy: GamePxy;
    isContineState: boolean = false;

    waitHealthPointNumThreads: Array<number>;
    lifePointIsReady0: boolean = false;
    lifePointIsReady1: boolean = false;
    isStartCreateScondLife: boolean = false;
    isMissLife: boolean = false;
    curRecoverLifeNum: number = 0;
    localMaxLifeNum: number = 0;
    localMinHorVal: number = 0;
    localForwardSpeed: number = 0;
    localPointRatioHorValMultiple = 0;    //本地的水平点间的难度倍数
    localWaitHealthPointNum: number = 0;   //本地的等待通过的节奏点
    loseLiftTime: number = 0;            //损失生命值的次数
    curCreatePoint: cc.Prefab = null          //目前选择的正常的节奏块
    curSpecialCreatePoint: cc.Prefab = null     //目前选择的特殊的节奏块

    private static instance: PointGenerator;
    public static getIntance() {
        return PointGenerator.instance
    }
    onLoad() {
        PointGenerator.instance = this;

    }
    start() {
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;

    }



    setHardLv(HardLv, _parttern = PlayPattern.Normal) {
        this.minOffset = 0.4
        this.MAXcontinueDirNum = 3;
        switch (HardLv) {
            case PlayHardLv.Normal:
                this.minOffset = 0.4
                this.localPointRatioHorVal = this.localPointRatioHorVal;   //CONSTANTS.PointRatioHorVal;
                this.localMaxLifeNum = CONSTANTS.MaxRecoverLifeNUM;
                if (_parttern == PlayPattern.Endless) {

                }
                break;
            case PlayHardLv.Hard:
                this.minOffset = 0.2
                this.localPointRatioHorVal = this.localPointRatioHorVal * 2
                this.localMaxLifeNum = 1;
                if (_parttern == PlayPattern.Endless) {

                }
                break;
            case PlayHardLv.VaryHard:
                this.minOffset = 0.2
                this.localPointRatioHorVal = this.localPointRatioHorVal * 1;
                this.localMaxLifeNum = 0;
                let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
                console.log("_parttern  " + _parttern);
                if (_parttern == PlayPattern.Normal) {
                    if (gamePxy.getCurGameSongInfo().musicName == "神曲混合") {
                        this.minOffset = 0.3
                        console.log("特别调整 " + gamePxy.getCurGameSongInfo().musicName);
                        this.MAXcontinueDirNum = 7;
                    }
                } else {

                }
                break;
            default:
                break;
        }
    }

    /**
     * 设置LocalMaxHorVal
     */
    setLocalMinHorVal(partten = PlayPattern.Normal, MinHorValMult = 0) {
        if (partten == PlayPattern.Normal) {
            this.localMinHorVal = CONSTANTS.MinHorVal;
            this.localPointRatioHorValMultiple = CONSTANTS.PointRatioHorValMultiple;
            this.localPointRatioHorVal = CONSTANTS.PointRatioHorVal;
            this.localForwardSpeed = CONSTANTS.ForwardSpeed;
        }
        else {
            this.localMinHorVal = CONSTANTS.ELPMinHorVal * (1 + MinHorValMult * CONSTANTS.ElPMinHorBasemult);
            this.localPointRatioHorValMultiple = CONSTANTS.PointRatioHorValMultiple * (1 + MinHorValMult * CONSTANTS.ELPPointRatioHorValMultipleBasemult);
            this.localPointRatioHorVal = CONSTANTS.PointRatioHorVal * (1 + MinHorValMult * CONSTANTS.ELPPointRatioHorValBasemult);
            this.localForwardSpeed = CONSTANTS.ForwardSpeed * (1 + MinHorValMult * CONSTANTS.ELPForwardSpeedBasemult);
            this.localForwardSpeed = this.localForwardSpeed >= CONSTANTS.ELPMAXForwardSpeed ? CONSTANTS.ELPMAXForwardSpeed : this.localForwardSpeed;
        }
    }

    /**
     * 创造节奏点
     * @param proceedTime 
     * @param pointArr 
     * @param offsetArray 
     */
    CreatePoint(proceedTime: number, pointArr, offsetArray) {
        let durTime = CONSTANTS.MaxDistance / this.localForwardSpeed;
        if (pointArr[this.endCreatePointId] &&
            Number((pointArr[this.endCreatePointId].time - proceedTime).toFixed(8)) <= Number(durTime.toFixed(8))) {
            let actualTime = pointArr[this.endCreatePointId].time > proceedTime ?
                pointArr[this.endCreatePointId].time - proceedTime
                : pointArr[this.endCreatePointId].time;
            let actualDis = actualTime * this.localForwardSpeed + this.bestFireDir;

            let pointType = this.getPointType();
            let point;
            switch (pointType) {
                case PointType.normalPoint:
                    pointType=this.V1_1_4RandomPointType(pointArr[this.endCreatePointId].pressKey == "startLong");
                    // if(pointType==PointType.V1_1_4SpecialPoint){
                    //     point = PoolManager.instance.getNode(this.v1_1_4Point, this.node); 
                    // }
                    // else{
                    //     point = PoolManager.instance.getNode(this.curCreatePoint, this.node);
                    // }
                    point = PoolManager.instance.getNode(this.curCreatePoint, this.node);
                    break;
                case PointType.lifePoint:
                    point = PoolManager.instance.getNode(this.lifePoint, this.node);
                    this.curRecoverLifeNum++;
                    //  GameManager.getInstance().showMsgTip("已经提供的生命值节奏点数量：  "+ this.curRecoverLifeNum)
                    break;
                default:
                    point = PoolManager.instance.getNode(this.curCreatePoint, this.node);
                    break;
            }

            let pointRuner = point.getComponent(PointRunner) as PointRunner;
            pointRuner.setPointID(this.endCreatePointId);
            pointRuner.setPointType(pointType);
            pointRuner.isContine = false;
            let x = this.setPointHorVal(this.endCreatePointId, pointArr);
            this.doubleHitX = x;
            pointRuner.setInitPosition(cc.v3(x, 0, -actualDis), RunnerType.rhythmRuner)
            this.tempEndCreatePointId = this.endCreatePointId;
            if (pointArr[this.endCreatePointId].pressKey == "startLong") {
                this.endCreatePointId += 2;
            }
            else {
                this.endCreatePointId++;
            }
            this.addActivePointRunner(pointRuner);
            this.endCreateSpecialPointId = 1;
        }
        if (pointArr[this.tempEndCreatePointId].pressKey == "startLong"
            && this.endCreateSpecialPointId < Math.floor(offsetArray[this.tempEndCreatePointId + 1] / 0.08)
        ) {
            let actualTime = pointArr[this.tempEndCreatePointId].time + 0.08 * this.endCreateSpecialPointId > proceedTime ?
                pointArr[this.tempEndCreatePointId].time + 0.08 * this.endCreateSpecialPointId - proceedTime
                : pointArr[this.tempEndCreatePointId].time + 0.08 * this.endCreateSpecialPointId;
            let actualDis = actualTime * this.localForwardSpeed + this.bestFireDir;
            let point = PoolManager.instance.getNode(this.curSpecialCreatePoint, this.node);
            let pointRuner = point.getComponent(PointRunner);
            pointRuner.setPointID(this.tempEndCreatePointId);
            pointRuner.setPointType(PointType.normalPoint);
            pointRuner.isContine = true;
            pointRuner.setInitPosition(cc.v3(this.doubleHitX, 0, -actualDis), RunnerType.rhythmRuner);
            //  console.log("this.endCreateSpecialPointId    "+this.endCreateSpecialPointId)
            this.endCreateSpecialPointId++;
            this.addActivePointRunner(pointRuner);
        }
    }

    /**
     * 创造节奏实体对象
     */
    getPointType() {
        let pointType: PointType;
        if (PlayStage.getIntance().remainLifeNum == 3) {
            return PointType.normalPoint;
        } else if (PlayStage.getIntance().remainLifeNum <= 2) {
            if (this.curRecoverLifeNum >= this.localMaxLifeNum && PlayStage.getIntance().playingPattern == PlayPattern.Normal) {
                //  GameManager.getInstance().showMsgTip("可提供的恢复生命节奏点已用完  "+ this.curRecoverLifeNum)
                return PointType.normalPoint;
            }
            if ((PlayStage.getIntance().remainLifeNum == 1 || this.waitHealthPointNumThreads[1] < this.localWaitHealthPointNum)
                && this.isStartCreateScondLife == true) {
                //只剩一条生命时,并且开始创造开启了创造第二条生命值的进程
                if (this.waitHealthPointNumThreads[1] > 0) {
                    if (!this.lifePointIsReady1) {
                        this.waitHealthPointNumThreads[1]--;
                        // GameManager.getInstance().showMsgTip("提供第二条生命的回复倒计时:  " + this.waitHealthPointNumThreads[1])
                    }
                    return PointType.normalPoint;
                }
                else {
                    this.waitHealthPointNumThreads[1] = this.localWaitHealthPointNum;
                    this.isStartCreateScondLife = false;
                    //  GameManager.getInstance().showMsgTip("提供第二条生命的回复")
                    return PointType.lifePoint   //生成第二条命的回复

                }
            }
            //生命值不满时,并且没有创造开启了创造第二条生命值的进程
            if (this.waitHealthPointNumThreads[0] > 0) {
                if (!this.lifePointIsReady0) {
                    this.waitHealthPointNumThreads[0]--;
                    // GameManager.getInstance().showMsgTip("提供第一条生命的回复倒计时:  " + this.waitHealthPointNumThreads[0])
                }

                return PointType.normalPoint;
            }
            else {
                //生命值不满时创造第一条生命值的进程完成
                this.waitHealthPointNumThreads[0] = this.localWaitHealthPointNum;
                this.lifePointIsReady0 = true;
                //判断此时的生命值是否去掉了两条, 是的话,开启第二条生命值的创造进程
                if (PlayStage.getIntance().remainLifeNum == 1) {
                    this.isStartCreateScondLife = true;
                    //GameManager.getInstance().showMsgTip("开启第二条生命值的创造进程")
                }
                // GameManager.getInstance().showMsgTip("提供第一条生命的回复")
                return PointType.lifePoint;
            }
        }
    }


    /**
     * V1_1_4生成收集物
     */
    V1_1_4RandomPointType(IsStartSong:boolean) {
        let pxy=Facade.getInstance().retrieveProxy(ProxyDefine.V1_1_4Pxy) as V1_1_4Pxy;
        let pointType: PointType;
        if (!IsStartSong&&this.v1_1_4Point&&pxy.V1_1_4EventState==ActivityEventState.ING&&Math.random() < 0.05) {
            return PointType.V1_1_4SpecialPoint;
        }else{
            return PointType.normalPoint;
        }
    }

    /**
     *重置 lifePointIsReady0 lifePointIsReady1
     */
    resetLifePointIsReady() {
        if (PlayStage.getIntance().remainLifeNum == 2) {
            if (this.lifePointIsReady0) {
                this.lifePointIsReady0 = false;
                //  GameManager.getInstance().showMsgTip("第一条生命的回复创建被重置")
            }
            else {
                this.lifePointIsReady1 = false;
                // GameManager.getInstance().showMsgTip("第二条生命的回复创建被重置")
            }
        }
        else if (PlayStage.getIntance().remainLifeNum == 3) {
            this.lifePointIsReady0 = false;
            //GameManager.getInstance().showMsgTip("第一条生命的回复创建被重置")
        }
        else if (PlayStage.getIntance().remainLifeNum == 1) {
            if (this.lifePointIsReady0) {
                this.lifePointIsReady0 = false;
                //  GameManager.getInstance().showMsgTip("第一条生命的回复创建被重置")
            }
            this.lifePointIsReady1 = false;
            // GameManager.getInstance().showMsgTip("第二条生命的回复创建被重置")
        }
    }

    /**
     * 创造奖励钻石
     * @param proceedTime 
     * @param num 
     */
    createRewardPoint(proceedTime: number, num: number) {
        if (this.EndCreateRewardPointId >= num) {
            //   console.log("奖励钻石生成完成")
            return;
        }
        if (proceedTime >= CONSTANTS.IntervalFinishToReward + CONSTANTS.IntervalReward * this.EndCreateRewardPointId) {
            let actualTime = CONSTANTS.IntervalFinishToReward + CONSTANTS.IntervalReward * this.EndCreateRewardPointId;
            let actualDis = CONSTANTS.MaxDistance + this.bestFireDir;
            let point = PoolManager.instance.getNode(this.rewardPoint, this.node);
            let pointRuner = point.getComponent(PointRunner);
            pointRuner.setPointID(this.EndCreateRewardPointId);

            let x = this.setDiaHorVal();   //  Utility.random(-0.2, 0.2);
            pointRuner.setInitPosition(cc.v3(x, 0, -actualDis), RunnerType.diaRunner)
            this.EndCreateRewardPointId++;
            this.addActivePointRunner(pointRuner);
        }
    }


    /**
     * 从某一个节奏重新开始生成
     */
    createPointById(id: number) {
        this.pointRunnerReset();
        this.endCreatePointId = id;
        this.tempEndCreatePointId = id;
        this.endCreateSpecialPointId = 1;
        this.waitHealthPointNumThreads = [this.localWaitHealthPointNum, this.localWaitHealthPointNum];
        this.isStartCreateScondLife = false;
        this.lifePointIsReady0 = false;
        this.lifePointIsReady1 = false;
        this.curRecoverLifeNum = 0;
    }

    /**
     * 添加场景处于活跃的节奏点
     */
    addActivePointRunner(pr: PointRunner) {
        this.activePointRunners.push(pr);
    }

    /**
     * 删除场景处于活跃的节奏点
     */
    delActivePointRunner(): PointRunner {
        return this.activePointRunners.shift();
    }

    /**
     * 设置节奏点的水平值
     */
    setPointHorVal(id: number, pointArr) {
        if (!GameManager.getInstance().horChange) return 0;

        let horVal = 0;
        if (id == 0) {
            horVal = Utility.randomRange(-CONSTANTS.MaxHorVal, CONSTANTS.MaxHorVal);
        }
        else {
            let offTime = pointArr[id].time - pointArr[id - 1].time;
            if (offTime > this.minOffset) {
                let minOff = offTime * this.localPointRatioHorVal + (Math.random() * 1 - 0.5) * this.localPointRatioHorValMultiple;
                if (this.lastPointHorVal >= 0) {
                    horVal = -minOff;
                    //  console.log("1    "+horVal );

                }
                else {
                    horVal = minOff;
                    //  console.log("2    "+minOff );
                }
                this.continueDirNum = 0;              //在同一个方向的节奏个数为0 
            } else {

                let minOff = offTime * this.localPointRatioHorVal + (Math.random() * 1 - 0.5) * this.localPointRatioHorValMultiple;
                minOff = minOff < CONSTANTS.MinHorVal ? CONSTANTS.MinHorVal : minOff;
                let tempNum = this.continueDirNum % (this.MAXcontinueDirNum);
                this.isOpenContinueDir = pointArr[id + 1] && (pointArr[id + 1].time - pointArr[id].time) < 0.4;
                if (tempNum == 0 && this.continueDirNum >= this.MAXcontinueDirNum && this.isOpenContinueDir)    //当一个方向的连续周期结束后，决定是否开始新一轮的连续周期
                {
                    this.isOpenContinueDir = Math.random() > 0.4 && pointArr[id + 1] && (pointArr[id + 1].time - pointArr[id].time) < 0.4
                }
                let isCycle = this.isOpenContinueDir && this.continueDirNum >= this.MAXcontinueDirNum;  //补偿的连续数量
                if (this.isOpenContinueDir)      //开启同一个方向
                {
                    if (tempNum == 0) {
                        if (isCycle) {         //
                            if (this.continueDirOriginNum >= 0) {   //0
                                horVal = this.continueDirOriginNum - minOff * this.MAXcontinueDirNum
                            }
                            else {
                                horVal = this.continueDirOriginNum + minOff * this.MAXcontinueDirNum
                            }
                            this.continueDirOriginNum = horVal;
                        }
                        else {
                            if (this.lastPointHorVal >= 0) {   //0
                                horVal = -minOff * Math.random() * this.localPointRatioHorValMultiple;
                            }
                            else {
                                horVal = +minOff * Math.random() * this.localPointRatioHorValMultiple;
                            }
                            this.continueDirOriginNum = horVal;
                        }


                    }
                    else {
                        if (this.continueDirOriginNum >= 0) {  //0
                            horVal = (this.continueDirOriginNum - minOff * tempNum) * Math.random();
                        }
                        else {
                            horVal = (this.continueDirOriginNum + minOff * tempNum) * Math.random();
                        }
                    }
                    this.continueDirNum++;
                }
                else {
                    if (this.lastPointHorVal >= 0) {
                        horVal = -minOff;
                    }
                    else {
                        horVal = minOff;

                    }
                    this.continueDirNum = 0;
                }

            }
        }

        horVal = Math.abs(horVal) > CONSTANTS.MaxHorVal ? CONSTANTS.MaxHorVal * (horVal / Math.abs(horVal)) : horVal;
        this.lastPointHorVal = horVal;
        return this.lastPointHorVal;
    }


    /**
     * 设置奖励钻石的水平位置
     */
    setDiaHorVal() {
        if (this.lastDiaHorX == null) {
            this.lastDiaHorX = 0;
        }
        else {
            if (this.lastDiaHorX < CONSTANTS.MaxHorVal && this.DiaHorDir == 1) {
                this.lastDiaHorX += CONSTANTS.IntervalReward
                if (this.lastDiaHorX >= CONSTANTS.MaxHorVal) {
                    this.DiaHorDir = 0;
                }
            }
            else if (this.DiaHorDir == 0) {
                this.lastDiaHorX -= CONSTANTS.IntervalReward
                if (this.lastDiaHorX <= -CONSTANTS.MaxHorVal) {
                    this.DiaHorDir = 1;
                }
            }
        }
        return this.lastDiaHorX;
    }

    /**
     * 是否击中目标检测
     */
    checkHit(checkValx: number): boolean {
        let target = this.delActivePointRunner();
        this.curPoint = target.node;
        if (!target) return true;
        this.finalHitPointID = target.getPointID();
        this.isMissLife = false;
        this.isContineState = target.isContine;
        if (Math.abs(target.getPosition().x - checkValx) < 160) {
            target.onHit();
            return true;
        }
        else if (target.PointType == PointType.lifePoint) { this.isMissLife = true; return true; }
        else return false;
    }


    /**
     *获得要击中目标的x值
     */
    getHitTargetX() {
        let target = this.activePointRunners[0];
        return -target.getPosition().x;
    }

    /**
     * 判断是否是碎片奖励
     */
    checkIsMapChipPoint() {
        if (this.curOfferChipIds.indexOf(this.finalHitPointID) >= 0) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 设置localWaitHealthPointNum
     */
    setLocalWaitHealthPointNum(partern = PlayPattern.Normal, mult) {
        if (partern == PlayPattern.Normal) {
            this.localWaitHealthPointNum = WaitHealthPointNum
        } else {
            this.localWaitHealthPointNum = WaitHealthPointNum + mult * CONSTANTS.ELPWaitHealthPointNumBasemult;
        }
    }
    /**
     * 重置生成器
     */
    generatorReset() {
        this.endCreatePointId = 0;
        this.tempEndCreatePointId = 0;
        this.endCreateSpecialPointId = 1;
        this.EndCreateRewardPointId = 0;
        this.curOfferChipNum = 0;
        this.waitHealthPointNumThreads = [this.localWaitHealthPointNum, this.localWaitHealthPointNum];
        this.lifePointIsReady0 = false;
        this.lifePointIsReady1 = false;
        this.isStartCreateScondLife = false;
        this.curRecoverLifeNum = 0;
        this.lastDiaHorX = null;
        this.DiaHorDir = 1;
        this.curPoint = null;
        this.curOfferChipIds = [];
        this.pointRunnerReset();
    }

    /**
     * Runner重置
     */
    pointRunnerReset() {
        if (this.activePointRunners.length > 0) {
            this.activePointRunners.forEach((runner) => {
                runner.onPut();
            })
        }
        this.activePointRunners = [];
    }

    /**
     * 2020中秋版本 设置生成的节奏块的类型
     */
    public ZQA_SetCurPointType(ison: boolean) {
        if (ison) {
            // this.curCreatePoint=this.moonCakePoint;
            // this.curSpecialCreatePoint=this.moonCakeSpecialPoint;
        }
        else {
            this.curCreatePoint = this.point;
            this.curSpecialCreatePoint = this.specialPoint;
        }
    }
}


export enum PointType {
    normalPoint = 0,
    lifePoint = 1,
    V1_1_4SpecialPoint=2, 
}