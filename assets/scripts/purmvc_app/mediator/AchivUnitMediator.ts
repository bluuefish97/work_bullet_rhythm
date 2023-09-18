import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { AchivInfo } from "../repositories/Rep";
import AchiUnit from "./AchiUnit";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { CONSTANTS } from "../../Constants";
import { CommandDefine } from "../command/commandDefine";
import { AchiUpdateInfo } from "../command/UpdateAchiProCmd";
import { AchiRewardInfo, AchiGradeUpdateInfo } from "../command/GetAchiRewardCmd";
import GameManager from "../../GameManager";
import { AchiMediator } from "./AchiMediator";
import { MediatorDefine } from "./mediatorDefine";
import UIPanelCtr from "../../util/UIPanelCtr";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import { ClipEffectType } from "../../AudioEffectCtrl";


export class AchiUnitMediator extends Mediator {
    private achiUnit: AchiUnit = null;
    private achivInfo: AchivInfo = null;
    private achiMediator: AchiMediator
    private gamePxy: GamePxy;
    private grade: number = 1;
    private target: number = 0;          //目标值
    private curPro: number = 0;          //目前的进度
    private reward: number = 0;
    private targetPos;
    private isGeted: boolean = false;       //是否获得了奖励
    private isCanGet: boolean = false;       //是否获得了奖励
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        this.achiMediator = Facade.getInstance().retrieveMediator(MediatorDefine.AchiMediator) as AchiMediator;
        this.achiUnit = viewNode.getComponent(AchiUnit);
        this.bindListener();
    }

    private bindListener(): void {
        this.achiUnit.setTestBtnClickEvent(this.compete, this);
        this.achiUnit.setEnableGetBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.GetAchiRewardRequest, new AchiRewardInfo(this.achivInfo.id, this.reward));
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click","AchievementUI_GetBtn_Click",1);
        });
        this.achiUnit.setDisableGetBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();
        });
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.achivGradeResponce,
            CommandDefine.achivProResponce,
            CommandDefine.GetAchiRewardResponce,
        ];
    }

    public handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CommandDefine.achivProResponce:
                {
                    let achiInfo = notification.getBody() as AchiUpdateInfo;
                    if (this.achivInfo.id == achiInfo.id) {
                        this.updateAchiPro(achiInfo.data);
                    }
                    break;
                }
            case CommandDefine.achivGradeResponce:
                {
                    let achiGradeUpdateInfo = notification.getBody() as AchiGradeUpdateInfo;
                    if (this.achivInfo.id == achiGradeUpdateInfo.id) {
                        this.updateAchiGrade(achiGradeUpdateInfo.data);
                    }
                    break;
                }
            case CommandDefine.GetAchiRewardResponce:
                {
                    let tempId= notification.getBody() as number;
                    if (this.achivInfo.id ==tempId) {
                        this.isGeted=true;
                        this.isCanGet=false;
                    }
                    break;
                }
            default:
                break;
        }
    }

    /**
     * 初始化成就信息
     * @param info 
     */
    public initAchiInfo(info: AchivInfo) {
        this.achivInfo = info;
        this.grade = this.gamePxy.getAchivGradeById(info.id);
        this.curPro = this.gamePxy.getAchivProById(info.id);
        this.achiUnit.setTitleLabel(info.title);
        this.achiUnit.setIronSprite(info.ironPath);
        this.updateAchiGrade(this.grade);
        let proval = this.setProVal(this.curPro, this.target);
        this.achiUnit.setProgressLabel(proval); 
        if( this.isGeted){
            this.achiMediator.pushNormalAchivUnit(this);
            this.isGeted=false;
            return;
        }
        if (this.curPro < this.target) {
            this.achiUnit.openDisEnableGeState();
            this.achiMediator.pushNormalAchivUnit(this);
        }
        else {
            if(this.isGeted) return;
            this.isCanGet=true;
            this.achiUnit.openEnableGetState();
            this.achiMediator.unshiftTopAchivUnit(this);
        }
        this.isGeted=false;
    }

    /**
     * 更新成就等级信息
     */
    updateAchiGrade(_grade: number) {
        if (_grade > CONSTANTS.MAXAchivGrade) {
            this.grade = CONSTANTS.MAXAchivGrade;
            this.achiUnit.openOverBtnState();
            this.isGeted=true;
        }
        else {
            this.grade = _grade;
        }
        this.grade = _grade;
        this.reward = this.setRewardByGrade(this.achivInfo.baseAward, this.achivInfo.factorAward, this.grade);
        this.target = this.setTargetByGrade(this.achivInfo.baseTarget, this.achivInfo.factorTarget, this.grade);
        let des = this.synDesByGrade(this.achivInfo.des, this.target);
        this.achiUnit.setGradeLabel(CONSTANTS.RomeNumbers[this.grade]);
        this.achiUnit.setRewardLabel(this.reward);
        this.achiUnit.setDesLabel(des);
    }

    /**
     * 更新成就进度信息
     */
    updateAchiPro(_pro: number) {
        this.curPro = _pro;
        let proval = this.setProVal(this.curPro, this.target);
        this.achiUnit.setProgressLabel(proval);
        if (this.curPro < this.target) {
            this.achiUnit.openDisEnableGeState();
            if(this.isGeted)    //点击了领取按钮后成就条的进度
            {
                
                console.log("this.achiMediator.topAchiUnitList.length  "+this.achiMediator.topAchiUnitList.length);
                let idx=this.achiMediator.topAchiUnitList.indexOf(this);
                if(idx==(this.achiMediator.topAchiUnitList.length-1))     //该成就条下方没有可以领取的成就条
                {
                    this.achiMediator.unshiftNormalAchivUnit(this);
                }
                else                                 //将该成就条置底
                {
                    this.achiMediator.spliceTopAchivUnit(this);     //先将该成就条从toplist删除
                    let self=this;
                    //置底后将该歌曲push到NormalAchivList中去
                    this.achiUnitDownTown(()=>{
                        self.achiMediator.pushNormalAchivUnit(self);
                        this.achiMediator.updatemMoveAchivUnitListTargetPos();
                    });
                    this.achiMediator.updatemMoveAchivUnitListTargetPos();
                }
               
            }
            else
            {
                this.achiMediator.pushNormalAchivUnit(this);
            }
            this.isGeted=false;

        }
        else {
             if(this.isGeted||this.isCanGet) return;
             this.isCanGet=true;
            this.achiUnit.openEnableGetState();
            this.achiMediator.spliceNormalAchivUnit(this);
            this.achiUnitUp(()=>{
                this.achiMediator.unshiftTopAchivUnit(this);
                this.achiMediator.updatemMoveAchivUnitListTargetPos();
            });
            this.achiMediator.updatemMoveAchivUnitListTargetPos();
            this.isGeted=false;
        }
    }

    /**
     * 设置成就的目标值
     */
    private setTargetByGrade(baseTarget: number, factor: number, grade: number) {
        let tempTarget = baseTarget + grade * factor;
        return tempTarget;
    }

    /**
    * 设置成就的奖励值
    */
    private setRewardByGrade(baseReward: number, factor: number, grade: number) {
        let tempReward = baseReward + grade * factor;
        return tempReward;
    }

    /**
     * 设置成就的表述
     */
    private synDesByGrade(des: string, target: number) {
        let strArr = des.split('-');
        let tempArr = "<color=#4ADDFF>" + strArr[0] + "</color>"
            + "<color=#14FC00>" + "<size=40>" + " " + target + " " + "</size>" + "</color>"
            + "<color=#4ADDFF>" + strArr[1] + "</color>";
        return tempArr;
    }

    /**
     * 设置成就的进度
     */
    private setProVal(cur: number, target: number) {
        cur = cur >= target ? target : cur;
        let str = cur + "/" + target;
        return str;
    }

    /**
     * 成就条置底动画
     */
    achiUnitDownTown(cal:Function) {
        console.log("置底！！！！");
        this.achiUnit.node.zIndex=-1;
        let offset=Math.abs(-2000-this.achiUnit.node.y)/2000; 
        offset=offset<0.3?0.3:offset;
        this.achiUnit.setEntranceAct(0, cc.v2(0,-1900),offset,cal);
        this.achiUnit.setHideAct(offset*0.4,offset);
    }

    /**
     * 成就条置定动画
     */
    achiUnitUp(cal:Function) {
        console.log("置顶！！！！");
        this.achiUnit.node.zIndex=10;
        let offset=Math.abs(-150-this.achiUnit.node.y)/2500; 
        offset=offset<0.3?0.3:offset;
        this.achiUnit.setEntranceAct(0, cc.v2(0,-150),offset,cal);
        console.log("offset  "+offset);
        
        this.achiUnit.setHideAct(offset*0.4,offset);
    }



    /**
     * 设置成就条的目标坐标
     */
    public setUnitTargetPos(pos: cc.Vec2) {
        this.targetPos=pos;
    }

    
    /**
     * 成就条位置变动动画
     */
    achiUnitUpdateMove() {
        let offset=Math.abs(this.targetPos.y-this.achiUnit.node.y)/2000; 
        offset=offset<0.3?0.3:offset;
        this.achiUnit.setMoveAct(this.targetPos,offset);
    }

    /**
     * 成就条开始入场动画
     */
    achiUnitEntrance() {
        let delayTime = (Math.abs(this.targetPos.y)) / 2800;
        this.achiUnit.setEntranceAct(delayTime, this.targetPos);
    }

    //------------------test----------------------
    compete() {
        Facade.getInstance().sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(this.achivInfo.id, 1, this.target))
    }
}

