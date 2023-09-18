import { CONSTANTS } from "../Constants";
import PointGenerator from "./PointGenerator";
import { Facade } from "../core/puremvc/patterns/facade/Facade";
import { CommandDefine } from "../purmvc_app/command/commandDefine";
import { PanelType } from "../util/PanelType";
import Gun from "./Gun";
import { SongInfo, ConsumablesAlterInfo, ConsumablesType } from "../purmvc_app/repositories/Rep";
import AudioManager from "../plugin/audioPlayer/AudioManager";
import { OpenPanelBody } from "../purmvc_app/command/OpenPanelCmd";
import { FinishType } from "../purmvc_app/command/FinishCmd";
import Loop from "./Loop";
import GameManager from "../GameManager";
import { AchiUpdateInfo } from "../purmvc_app/command/UpdateAchiProCmd";
import { ProxyDefine } from "../purmvc_app/proxy/proxyDefine";
import { GamePxy } from "../purmvc_app/proxy/GamePxy";
import { PoolManager } from "../util/PoolManager";
import config, { Platform } from "../../config/config";
import { ClipEffectType } from "../AudioEffectCtrl";
import StageSkinManager from "./StageSkinManager";
import RankManager from "../Rank/RankManager";

/**
 * 
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayStage extends cc.Component {
    @property(cc.Prefab)
    comboPre: cc.Prefab = null;
    @property(cc.Node)
    StageUI: cc.Node = null;

    @property(cc.Camera)
    eviCamera: cc.Camera = null;
    @property(cc.Camera)
    bgCamera: cc.Camera = null;
    @property(cc.Node)
    bgNode: cc.Node = null;

    @property(Gun)
    gun: Gun = null;
    @property(cc.Node)       //生命值减少警告框
    WarnBox: cc.Node = null;
    @property(cc.Label)       //得分显示
    scroceLabel: cc.Label = null;
    @property(cc.ProgressBar)       //进度条
    Bar: cc.ProgressBar = null;
    @property(cc.Node)       //进度星星
    Stars: cc.Node = null;
    @property(cc.Node)       //生命值
    lifes: cc.Node = null;
    @property(Loop)       //循环背景
    private eviLoop: Loop = null;

    private glassBroken: cc.Node = null;          //玻璃破碎

    private hardTipBox: cc.Node = null;
    private varyHardTipBox: cc.Node = null;
    private contiueMissNum: number = 0;   //连续打空的数量
    private static instance: PlayStage;
    private wind: sp.Skeleton;      //风spine
    private comboNum: number = 0;    //连击数
    public proStarGrade: number = 0; //星星的进度等级
    public remainLifeNum: number = 3; //剩下的生命值
    public survivalTime: number = 0;       //游戏的存活时间
    originAngleX: number = 0           //主相机初始值
    playHardLv: PlayHardLv           //游戏难度
    stageSkinManager: StageSkinManager = null;     //场景的皮肤变化控制
    localClip: cc.AudioClip = null;
    localJSON: any = null;
    playState: PlayState;
    pointArray: Array<any> = new Array<any>();
    efsPointArray: Array<any> = new Array<any>();    //不会产生节点的音效时间戳
    entityPointArray: Array<any> = new Array<any>();    //会产生节点的时间戳
    pointOffsetArray: Array<number> = new Array<number>();
    proceedTime: number = 0;               //游戏正常进行的时间
    rewardProceedTime: number = 0;               //游戏正常进行的时间
    chipNum: number = 0;                 //地图碎片数
    scoreVal: number = 0;            //分数
    idealityRewardDiaVal: number = 0;          //理想的奖励的钻石数
    realityRewardDiaVal: number = 0;          //理想的奖励的钻石数
    public ZQV_moonCakeVal: number = 0;            //月饼数
    private gunSkinSucceed: boolean = false;
    private stageSkinSucceed: boolean = false;
    private comboLevelNum: number = 1;         //连击的等级
    private scoreMultiple: number = 1;         //分数多加的倍数
    private WaitHealthPointNumMultiple: number = 0;         //等待复活点多加的倍数
    private pointMinHorMultiple: number = 0;        //节奏点最大的左右间隔多加的倍数
    public playingPattern;

    public bestScoreTarget: number = 100;
    private survivalTimeCallback = null;
    private passNum: number = null;                      //无尽模式通关数
    private bestComboNum: number = null;                      //无尽模式最大通关数
    private ELPSongName: string = "";                //无尽模式当前歌曲数
    private ELPisOpenNewTip: boolean = false;                //无尽模式是否打开新记录的提示

    protected v1_1_4GetPowerVal: number = 0;                 //v1_1_4版本一局游戏收集到的星光值
    private gamePxy;
    public static getIntance() {
        return PlayStage.instance
    }
    onLoad() {
        PlayStage.instance = this;
        this.hardTipBox = this.StageUI.getChildByName("HardTipBox");
        this.varyHardTipBox = this.StageUI.getChildByName("VaryHardTipBox");
        this.glassBroken = this.node.getChildByName("GlassBroken");
        this.stageSkinManager = this.getComponent(StageSkinManager);
        // this.wind = this.StageUI.getChildByName("Windskeleton").getComponent(sp.Skeleton) as sp.Skeleton;
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy
        this.originAngleX = this.eviCamera.node.eulerAngles.x;
    }

    update(dt) {
        if (this.playState == PlayState.Underway) {
            PointGenerator.getIntance().CreatePoint(this.proceedTime, this.entityPointArray, this.pointOffsetArray);
            this.updateProBar(this.getProTime());
            this.updateProStar(this.getProTime());
            this.proceedTime += dt;
            this.survivalTime += dt;
        }
        else if (this.playState == PlayState.Reward) {
            PointGenerator.getIntance().createRewardPoint(this.rewardProceedTime, this.idealityRewardDiaVal);
            this.rewardProceedTime += dt;
        }
    }
    /**
     * 从某一个节奏重新开始生成
     */
    createPointById(id: number) {
        PointGenerator.getIntance().createPointById(id);
        let durTime = CONSTANTS.MaxDistance / PointGenerator.getIntance().localForwardSpeed;                            //CONSTANTS.ForwardSpeed;
        this.proceedTime = this.entityPointArray[id].time > durTime
            ? this.entityPointArray[id].time - durTime
            : this.entityPointArray[id].time;

        // console.log("durTime  "+durTime);
        // console.log(" this.proceedTimee  " + this.proceedTime);


    }

    /**
     * 游戏舞台处于背景状态
     */
    public stageIdie() {
        this.playState = PlayState.Finish;
        this.closeStageUI();
        this.gun.hide();
    }

    /**
     * 显示引导
     */
    showGuidance() {
        this.StageUI.getChildByName("guidance").active = true;
    }

    /**
     * 关闭引导
     */
    closeGuidance() {
        this.StageUI.getChildByName("guidance").active = false;
    }

    /**
     * 显示首次引导引导
     */
    showNewGuidance() {
        let box = this.StageUI.getChildByName("NewWelcome")
        this.StageUI.getChildByName("NewWelcome").scale = 0;
        cc.tween(box).to(0.2, { scale: 1.3 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut }).delay(1)
            .to(0.2, { scale: 0, opacity: 0 })
            .call(() => {
                this.StageUI.getChildByName("NewWelcome").active = false;
                this.showGuidance();
            }).start();
    }

    /**
       * 关闭首次引导引导
       */
    closeNewGuidance() {
        if (this.StageUI.getChildByName("NewWelcome")) {
            this.StageUI.getChildByName("NewWelcome").active = false;
        }
    }


    /**
     * 游戏舞台重置
     */
    public stageReset() {
        this.playState = PlayState.Ready;
        this.showStageUI();
        this.glassBroken.opacity = 0; //效果重置
        this.WarnBox.opacity = 0;  //效果重置
        this.Bar.progress = 0;     //进度条重置
        this.scoreVal = 0;         //分数重置
        this.realityRewardDiaVal = 0
        this.proceedTime = 0;
        this.rewardProceedTime = 0;
        this.proStarGrade = 0;
        this.remainLifeNum = 3;
        this.survivalTime = 0;
        this.contiueMissNum = 0;
        this.chipNum = 0;
        this.comboNum = 0;
        this.ZQV_moonCakeVal = 0;
        this.pointMinHorMultiple = 0;
        this.WaitHealthPointNumMultiple = 0;
        this.comboLevelNum = 1;         //连击的等级
        this.scoreMultiple = 0;         //分数多加的倍数
        this.passNum = 0;
        this.bestComboNum = 0;
        this.v1_1_4GetPowerVal = 0;
        // this.wind.paused = true;
        this.gunSkinSucceed = false;
        this.stageSkinSucceed = false;
        let hitlight = this.StageUI.getChildByName("Hitlight");
        hitlight.opacity = 0;
        console.log("是否显示首次引导:" + this.gamePxy.getGameNew());


        if (!this.gamePxy.getGameNew()) {
            this.showGuidance();
            this.closeNewGuidance();
        }
        else {
            this.showNewGuidance();
            this.closeGuidance();
        }
        this.eviLoop.initSet(CONSTANTS.IdieSpeed)
        this.updateScoreLabel(this.scoreVal);
        this.Stars.children.forEach((child) => {
            child.getChildByName("light").active = false;
        });
        this.lifes.children.forEach((child) => {
            child.getChildByName("light").active = true;
        });
        PointGenerator.getIntance().setLocalWaitHealthPointNum(this.playingPattern, this.WaitHealthPointNumMultiple)
        PointGenerator.getIntance().generatorReset();
        PointGenerator.getIntance().setLocalMinHorVal(this.playingPattern)
        this.gun.show();
        //this.openWind(false);
        this.eviCamera.node.eulerAngles = cc.v3(this.originAngleX, 0, 0)
        this.bgNode.y = 0;
        this.closeCombo()
        this.unscheduleAllCallbacks();
    }

    /**
     * 游戏舞台配置
     */
    public stageConfig(clip: cc.AudioClip, pointArr, lv: string, cal: Function, stageSkinId = 0, playPattern = PlayPattern.Normal) {
        this.stageReset();
        this.playingPattern = playPattern;
        this.setPlayUI(playPattern);
        this.localClip = clip;
        this.pointArray = pointArr;// this.isRemix?this.remixJson.json:  this.testJson.json;   //    //  pointArr;
        this.entityPointArray = new Array<any>();
        this.efsPointArray = new Array<any>();
        for (let i = 0; i < this.pointArray.length; i++) {
            if (this.pointArray[i].pressKey == "pistolShot" || this.pointArray[i].pressKey == "light"
                || this.pointArray[i].presskey == "light"
                || this.pointArray[i].pressKey == "heavy" || this.pointArray[i].pressKey == "startLong"
                || this.pointArray[i].pressKey == "endLong" || this.pointArray[i].pressKey == "try2") {
                this.entityPointArray.push(
                    {
                        time: this.pointArray[i].time / 1000,
                        pressKey: this.pointArray[i].pressKey
                    })
            }
            else {
                this.efsPointArray.push(
                    {
                        time: this.pointArray[i].time / 1000,
                        pressKey: this.pointArray[i].pressKey
                    })
            }
        }
        this.switchPlayHardLv(lv)
        this.calculateOffsetVal();
        this.gun.replaceGun(() => {
            if (this.stageSkinSucceed) {
                cal();
            }
            this.gunSkinSucceed = true;
        });
        if (this.stageSkinManager) {
            this.stageSkinManager.configureStageSkin(stageSkinId, () => {
                if (this.gunSkinSucceed) {
                    cal();
                }
                this.stageSkinSucceed = true;
            })
        }
        else {
            this.stageSkinSucceed = true;
        }
        let isOnMoonCakePoint = this.gamePxy.ZQA_checkValidTime() && this.gamePxy.ZQA_getIsOpenActivity() && this.gamePxy.ZQA_getMoonCakeNum() < CONSTANTS.ZQA_MinConvertMoonCakeNum
        PointGenerator.getIntance().ZQA_SetCurPointType(isOnMoonCakePoint);
        //    this.createPointById(0)

        //       console.log(this.entityPointArray);
        // console.log(this.efsPointArray);

        // this.scheduleOnce(cal, 2);
    }

    /**
        * 游戏难度
        */
    public switchPlayHardLv(str: string, _parttern = PlayPattern.Normal) {
        switch (str) {
            case "hard":
                this.playHardLv = PlayHardLv.Hard
                break;
            case "superhard":
                this.playHardLv = PlayHardLv.VaryHard
                break;
            default:
                this.playHardLv = PlayHardLv.Normal
                break;
        }
        PointGenerator.getIntance().setHardLv(this.playHardLv, _parttern);
    }
    /**
     * 显示游戏难度
    */
    public showPlayHardLv() {
        switch (this.playHardLv) {
            case PlayHardLv.Hard:
                this.showHardTip();
                break;
            case PlayHardLv.VaryHard:
                this.showVaryHardTip();
                break;
            default:
                this.showNotHardTip();
                break;
        }
    }
    /**
 * 不显示hard提示
 */
    private showNotHardTip() {
        this.StageUI.getChildByName("HardTipBox").active = false;
    }

    /**
     * 显示hard提示
     */
    private showHardTip() {
        //  this.node.zIndex = -1;
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.warn);
        this.varyHardTipBox.active = false;
        this.hardTipBox.active = true;
        this.hardTipBox.getComponent(cc.Animation).play();
        this.WarnBox.color = cc.color("cb1e1e");
        this.WarnBox.stopAllActions();
        cc.tween(this.WarnBox).repeat(10,
            cc.tween().sequence(
                cc.tween().to(0.1, { opacity: 255 }),
                cc.tween().to(0.1, { opacity: 0 }
                )
            )
        ).start();
    }
    /**
        * 显示varyhard提示
        */
    private showVaryHardTip() {
        // this.node.zIndex = -1;
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.warn);
        this.hardTipBox.active = false;
        this.varyHardTipBox.active = true;
        this.varyHardTipBox.getComponent(cc.Animation).play();
        this.WarnBox.color = cc.color("d005fc");
        this.WarnBox.stopAllActions();
        cc.tween(this.WarnBox).repeat(10,
            cc.tween().sequence(
                cc.tween().to(0.2, { opacity: 255 }),
                cc.tween().to(0.2, { opacity: 0 }
                )
            )
        ).start();
    }
    /**
     * 配置节奏点间差值
     */
    private calculateOffsetVal() {
        this.pointOffsetArray = [];
        for (let i = 0; i < this.entityPointArray.length; i++) {
            if (i == 0) {
                this.pointOffsetArray.push(this.entityPointArray[i].time);
            }
            else {
                this.pointOffsetArray.push(this.entityPointArray[i].time - this.entityPointArray[i - 1].time);
            }
        }
        //console.log( this.pointOffsetArray);
    }
    /**
     * 展示游戏场景的UI
     */
    private showStageUI() {
        this.StageUI.active = true;
    }

    /**
    * 关闭游戏场景的UI
    */
    private closeStageUI() {
        // this.closeWind();
        this.StageUI.active = false;
    }
    /**
     * 游戏开始
     */
    public startPlay() {
        GameManager.getInstance().isStartSongReadyState = false;
        this.closeGuidance();
        this.playState = PlayState.Underway;
        this.eviLoop.initSet(CONSTANTS.fastSpeed)
        AudioManager.GetInstance(AudioManager).player.playMusic(this.localClip, false, 0.6);
        // ASCAd.getInstance().showNativeIcon(200, 200, cc.winSize.width * 90 / 1080, cc.winSize.height * 1620 / 1920);
    }

    /**
     * 游戏暂停
     */
    public pausePlay() {
        //  this.node.zIndex = -1;
        this.playState = PlayState.Pause;
        this.eviLoop.initSet(CONSTANTS.IdieSpeed)
        this.gun.pauseGun();
        AudioManager.GetInstance(AudioManager).player.pauseMusic();
        console.log(" pausePlay   this.proceedTime  " + this.proceedTime);
    }

    /**
     * 游戏继续
     */
    public resumePlay() {
        //  this.node.zIndex = 10;
        this.eviLoop.initSet(CONSTANTS.fastSpeed)
        console.log("resumePlay  this.proceedTime  " + this.proceedTime);
        //旧梦一场 复活的播放歌曲有问题特意修改
        let playTime = this.playingPattern == PlayPattern.Normal && this.gamePxy.getCurGameSongInfo().musicName == "旧梦一场" && config.platform == Platform.douYin ? this.proceedTime - 0.5 : this.proceedTime;
        AudioManager.GetInstance(AudioManager).player.resumeMusicToTime(playTime);
        this.playState = PlayState.Underway;
    }

    /**
     * 进入获得游戏奖励阶段
     */
    private rewardPlay() {
        this.idealityRewardDiaVal = this.diaSettle();
        this.idealityRewardDiaVal = this.idealityRewardDiaVal > 50 ? 50 : this.idealityRewardDiaVal;
        this.eviLoop.initSet(CONSTANTS.fleetingSpeed)
        this.playState = PlayState.Reward;
        console.log("进入奖励阶段");

    }
    /**
    * 获得一局游戏的时间
    */
    getSumDurTime() {
        let count = this.pointArray.length;
        return this.pointArray[count - 1].time / 1000 + 0.5;
    }

    /**
    * 获得一局游戏的时间
    */
    getProTime() {
        return this.proceedTime / this.getSumDurTime()
    }

    /**
     * 得分
     */
    public goal(baseScore = CONSTANTS.UnitScore, mult = 0) {
        this.scoreVal += baseScore * (1 + mult);
        this.updateScoreLabel(this.scoreVal);
    }

    /**
     * 打空
     */
    public missing(pos: cc.Vec3) {
        this.glassBroken.position = pos;
        this.glassBroken.opacity = 255;
        this.lossOneLife();
        cc.tween(this.glassBroken).sequence(
            cc.tween().delay(0.1),
            cc.tween().to(0.1, { opacity: 0 }
            )
        ).start();
    }

    /**
     * 损失一条命
     */
    lossOneLife() {
        this.remainLifeNum--;

        this.updateLifeList(this.remainLifeNum);
        if (this.remainLifeNum <= 0) {
            this.withoutLife()

        }
        else {
            PointGenerator.getIntance().setLocalWaitHealthPointNum(this.playingPattern, this.WaitHealthPointNumMultiple++)
        }
    }

    /**
     *   * 获得val 条命
     * @param val 
     */
    getLife(val: number) {
        for (let i = 0; i < val; i++) {
            if (this.remainLifeNum >= 3) return;
            this.lifes.children[this.remainLifeNum].getChildByName("light").active = true;
            this.remainLifeNum++;
        }


    }

    /**
     * 游戏生命值为0
     */
    private withoutLife() {
        this.pausePlay();
        if (true) {

            Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.RevivePanel));   //打开复活界面   
            this.playState = PlayState.Revive;
        }
        else {
            Facade.getInstance().sendNotification(CommandDefine.Finish, FinishType.FAIL);
        }
    }

    /**
     * 游戏胜利
     */
    public win() {
        Facade.getInstance().sendNotification(CommandDefine.Finish, FinishType.WIN);
        Facade.getInstance().sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(6, 1))
    }

    /**
     * 游戏复活
     */
    revive() {
        // cc.audioEngine.play(GameManager.getInstance().gunstartClip, false, 0.7);
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.gunstart);
        this.getLife(3);
        this.contiueMissNum = 0;
        this.createPointById(PointGenerator.getIntance().finalHitPointID);
        this.playState = PlayState.Resume;
        this.gun.reumeGun();
    }

    /**
     * 游戏结算 
     */
    settle() {
        this.eviLoop.initSet(CONSTANTS.IdieSpeed)
        this.unschedule(this.survivalTimeCallback);
        let tempStars = this.proStarGrade;
        let tempScore = this.scoreVal;
        let tempSurvialTime = Math.floor(this.survivalTime);
        this.mapChipSettle();
        let tempDia = this.diaSettle();
        Facade.getInstance().sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(3, tempStars))
        return new SettleInfo(tempStars, tempScore, this.chipNum, tempDia, this.ZQV_moonCakeVal, tempSurvialTime);
    }

    /**
     * 游戏星光结算
     */
    v1_1_4GetPowerSettle() {
        return this.v1_1_4GetPowerVal;
    }
    /**
    * 无尽模式游戏结算 
    */
    ELPSettle() {
        this.eviLoop.initSet(CONSTANTS.IdieSpeed)
        this.unschedule(this.survivalTimeCallback);
        let tempScore = this.scoreVal;
        let tempSurvialTime = Math.floor(this.survivalTime);
        return new ELPSettleInfo(tempScore, this.passNum, this.bestComboNum, tempSurvialTime);
    }

    /**
     * 奖励地图碎片的结算
     */
    private mapChipSettle() {
        if (this.gamePxy.getGameNew()) {
            this.chipNum = 1;
        }
        Facade.getInstance().sendNotification(CommandDefine.Consumables,
            {
                info: new ConsumablesAlterInfo(ConsumablesType.voucher, this.chipNum),
                callback: null
            })
    }

    /**
     * 奖励钻石的结算
     */
    private diaSettle() {
        return Math.round(this.scoreVal / (4 * CONSTANTS.UnitScore))
    }


    /**
     * 生命值减少警告
     */
    public lifeLossWarn() {
        this.WarnBox.stopAllActions();
        this.WarnBox.opacity = 255;
        cc.tween(this.WarnBox).sequence(
            cc.tween().delay(0.1),
            cc.tween().to(0.1, { opacity: 0 }
            )
        ).start();
    }

    /**
     * 更新分数显示
     */
    private updateScoreLabel(val: number) {
        this.scroceLabel.string = val.toString();
        this.updateScoreAct();
    }

    /**
     * 更新分数显示动画
     */
    private updateScoreAct() {
        let bg = this.scroceLabel.node.parent;
        cc.tween(bg).stop();
        cc.tween(bg).to(0.15, { scale: 1.2 }).to(0.15, { scale: 1 }).start();
    }
    /**
     * 更新游戏进度显示
     */
    private updateProBar(val: number) {
        this.Bar.progress = val;
    }

    /**
    * 更新进度星星
    */
    private updateProStar(val: number) {
        if (val > 0.3 && this.proStarGrade == 0) {
            this.Stars.children[0].getChildByName("light").active = true;
            this.proStarLightShow(this.Stars.children[0].getChildByName("light"))
            this.proStarGrade++;
        }
        else if (val > 0.6 && this.proStarGrade == 1) {
            this.Stars.children[1].getChildByName("light").active = true;
            this.proStarLightShow(this.Stars.children[1].getChildByName("light"))
            this.proStarGrade++;
        }
        else if (val > 0.95 && this.proStarGrade == 2) {
            this.Stars.children[2].getChildByName("light").active = true;
            this.proStarLightShow(this.Stars.children[2].getChildByName("light"))
            this.proStarGrade++;
        }
    }

    /**
     * 进度星星动画
     */
    private proStarLightShow(node: cc.Node) {
        node.stopAllActions();
        node.scale = 0;
        node.angle = 0;
        let dur = 0.5;
        let scaleAct = cc.tween().to(dur / 2, { scale: 1.3 })
            .to(dur / 2, { scale: 1 })
        let rotateAct = cc.tween().to(dur, { angle: 90 });
        cc.tween(node).parallel(scaleAct, rotateAct).start();
    }

    /**
    * 更新剩下的生命数
    */
    private updateLifeList(val: number) {
        this.lifes.children[val].getChildByName("light").active = false;
    }

    /**
    * 是否击中目标检测
    */
    checkHit(checkVal: cc.Vec3, cal = this.onHitPoint.bind(this)) {
        cal(PointGenerator.getIntance().checkHit(checkVal.x), checkVal);
    }

    /**
     *摄像头震动 
     */
    shakeCamera() {
        let angle = 0.2
        let hitlight = this.StageUI.getChildByName("Hitlight");
        hitlight.opacity = 175;
        cc.tween(hitlight).to(0.1, { opacity: 0 }).start();
        cc.tween(this.eviCamera.node).by(0.05, { eulerAngles: cc.v3(-angle, 0, 0) })
            .to(0.02, { eulerAngles: cc.v3(this.originAngleX, 0, 0) }).start();
        cc.tween(this.bgNode).to(0.05, { y: angle * 29 }).to(0.02, { y: 0 }).start();
    }
    /**
     * 节奏点击中回调
     */
    onHitPoint(isHit: boolean, pos: cc.Vec3) {
        if (this.gun.isCompeteFire) {                 //正常的节奏点都发射完了
            if (this.playingPattern == PlayPattern.Normal) {
                this.rewardPlay();
                this.closeCombo()
                // this.openWind(true);
                this.eviLoop.initSet(CONSTANTS.IdieSpeed);
            }
            else {
                console.log("当前进行的是无尽模式！！！");
                Facade.getInstance().sendNotification(CommandDefine.ELP_EnterNextChanllenge);
                Facade.getInstance().sendNotification(CommandDefine.ELP_PreLoadSongAsset);
            }

        }
        else {
            if (!isHit) {

                this.comboNum = 0;
                this.closeCombo()
                // this.closeWind();
                if (PointGenerator.getIntance().isMissLife) return;
                if (this.contiueMissNum == 0) {
                    this.missing(pos);
                    this.lifeLossWarn();
                }
                else if (this.contiueMissNum % 2 == 0) {
                    this.missing(pos);
                    this.lifeLossWarn();
                }
                this.contiueMissNum++;
            }
            else {
                this.shakeCamera();
                this.gun.createSmoke();
                this.goal();
                this.contiueMissNum = 0;
                this.comboNum++;
                this.saveBestCombo(this.comboNum);
                this.updateCombo(this.comboNum)
            }
        }

        this.showMuchComeEft(10);
    }



    /**
    * 奖励点击中回调
    */
    onHitRewardPoint(isHit: boolean, pos: cc.Vec3) {
        if (!isHit) {

        }
        else {
            PlayStage.getIntance().gun.createSmoke();
        }
    }


    /**
     * 显示Combo
     */
    showCombo() {
        let combo = PoolManager.instance.getNode(this.comboPre, this.StageUI);
        // let widget=combo.getComponent(cc.Widget);
        // widget.top=400;
        // widget.right=100;
        combo.x = cc.winSize.width / 2 - 250;
        combo.stopAllActions();
        combo.scale = 0;
        combo.opacity = 0;
        combo.y = cc.winSize.height / 2 - 600;
        cc.tween(combo).to(0.2, { scale: 1.2, opacity: 255 })
            .to(0.3, { scale: 1 })
            .by(0.5, { y: 200, opacity: -255 })
            .delay(1)
            .call(() => { PoolManager.instance.putNode(combo) })
            .start();
        return combo;
    }

    /**
     *关闭Combo
     */
    closeCombo() {
        // this.combo.opacity=0;
    }
    /**
     * 更新Combo
     */
    updateCombo(val: number) {
        let combo = this.showCombo();
        let label = combo.getComponentInChildren(cc.Label);
        label.string = "x" + val;
    }


    /**
     * 显示多连击效果
     */
    showMuchComeEft(minComboNum: number) {
        if (this.comboNum >= minComboNum) {
            // this.openWind(true);
        }
    }

    /**
     * 打开风
     */
    openWind(isLoop: boolean) {
        if (this.wind.paused) {
            this.wind.paused = false;
            this.wind.node.opacity = 255;
            this.wind.setAnimation(0, "animation", isLoop);
        }

    }

    /**
     * 关闭风
     */
    closeWind() {
        this.wind.paused = true;
        this.wind.node.opacity = 0;
    }

    public ZQV_getMoonCake(num: number) {
        console.log("月饼数增加  " + num);
        this.ZQV_moonCakeVal += num;
        console.log("现在的月饼数为  " + this.ZQV_moonCakeVal);
    }

    /**
     * 设置游戏的的UI
     */
    private setPlayUI(_pattern) {
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.gunstart);
        this.Bar.node.active = true;
        this.Stars.active = true;
    }

    /**
     * 设置无尽模式的目标值
     */
    setELPScoreTarget() {
        RankManager.getInstance().getUserRank((res) => {
            if (res != false) {
                // console.log("先拉取用户排行!!!");
                // console.log(res);
                this.bestScoreTarget = res.rankScore.rankScore;
            }
        })
    }

    /**
    * 显示ELP下一关引导
    */
    showELPNext() {
        let tips = this.StageUI.getChildByName("ELPNextTip");
        let box = this.StageUI.getChildByName("ELPNextTip");
        let banner = this.StageUI.getChildByName("ELPNextTip");
        let songNameLabel = banner.getComponentInChildren(cc.Label)
        songNameLabel.string = this.ELPSongName;
        tips.active = true;
        tips.scale = 1;
        box.scale = 0;
        banner.scaleY = 0
        let cal = () => {
            cc.tween(banner).to(0.2, { scaleY: 1 }).delay(1.3).call(() => {
                cc.tween(tips).to(0.2, { scale: 0 }).call(() => { tips.active = false }).start();
            }).start();
        }
        cc.tween(box).to(0.2, { scale: 1.3 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut })
            .call(() => {
                cal()
            }).start();
    }

    /**
     * 无尽模式   进入下一关卡
     */
    public startNextChanllengePlay(clip, pointArr, stageSkinId, lv, name) {
        this.ELPSongName = name;
        this.showELPNext();
        let cal = () => {
            this.passNum++;
            PointGenerator.getIntance().generatorReset();
            PointGenerator.getIntance().setLocalMinHorVal(this.playingPattern, this.pointMinHorMultiple++)
            this.gun.gunReset();
            this.playState = PlayState.Underway;    //  this.playState = PlayState.Underway;
            this.comboNum = 0;
            this.closeCombo()
            // this.closeWind();
            this.localClip = clip;
            this.pointArray = pointArr;
            this.proceedTime = 0;
            this.rewardProceedTime = 0;
            this.entityPointArray = new Array<any>();
            this.efsPointArray = new Array<any>();
            for (let i = 0; i < this.pointArray.length; i++) {
                if (this.pointArray[i].pressKey == "pistolShot" || this.pointArray[i].pressKey == "light"
                    || this.pointArray[i].pressKey == "heavy" || this.pointArray[i].pressKey == "startLong"
                    || this.pointArray[i].pressKey == "endLong" || this.pointArray[i].pressKey == "try2") {
                    this.entityPointArray.push(
                        {
                            time: this.pointArray[i].time / 1000,
                            pressKey: this.pointArray[i].pressKey
                        })
                }
                else {
                    this.efsPointArray.push(
                        {
                            time: this.pointArray[i].time / 1000,
                            pressKey: this.pointArray[i].pressKey
                        })
                }
            }
            if (this.stageSkinManager) {
                this.stageSkinManager.configureStageSkin(stageSkinId, () => { })
            }
            this.switchPlayHardLv(lv, PlayPattern.Endless)
            this.calculateOffsetVal();
            // this.showPlayHardLv();
            AudioManager.GetInstance(AudioManager).player.playMusic(this.localClip, false, 0.6);
        }
        this.scheduleOnce(() => {
            cal();
        }, 2.5)
    }

    /**
     * 停止存活时间的计时
     */
    public stopSurvivalTimeSchedule() {
        this.unschedule(this.survivalTimeCallback);
    }

    /**
     *保存最大combo数
     */
    private saveBestCombo(num) {
        if (this.bestComboNum < num)
            this.bestComboNum = num;
    }

    /**
     * 根据连击数更新分数的倍数
     */
    public alterScoreMultiple(_comboNum: number) {
        if (_comboNum < 10) {
            this.comboLevelNum = 1;
            this.scoreMultiple = 0;

        }
        else {
            if (_comboNum > this.comboLevelNum * 10 && _comboNum < (this.comboLevelNum + 1) * 10) {

            }
            else if (_comboNum == (this.comboLevelNum + 1) * 10) {
                this.comboLevelNum++;   //等级加一
                this.scoreMultiple++;
                //   GameManager.getInstance().showMsgTip("连击等级加一 " + this.comboLevelNum + "   分数倍数为  " + this.scoreMultiple)
            }
        }
        return this.scoreMultiple;
    }

}

export enum PlayState {
    Idie = "Idie",
    Ready = "Ready",
    Underway = "Underway",
    Reward = "Reward",
    Pause = "Pause",
    Resume = "Resume",
    Revive = "Revive",
    Finish = "Finish"
}

export enum PlayHardLv {
    Normal = 0,
    Hard = 1,
    VaryHard = 2

}
/**
 * 结算信息
 */
export class SettleInfo {
    starNum: number = 0;
    scoreNum: number = 0;
    mapChipNum: number = 0;
    diaNum: number = 0;
    finalSurvivalNum: number = 0;
    ZQV_moonCakeNum: number = 0;
    constructor(star: number, score: number, mapChip: number, dia: number, moonCake: number, finalSurvivaltime) {
        this.starNum = star;
        this.scoreNum = score;
        this.mapChipNum = mapChip;
        this.diaNum = dia;
        this.ZQV_moonCakeNum = moonCake
        this.finalSurvivalNum = finalSurvivaltime;
    }
}

/**
 * 无尽模式结算信息
 */
export class ELPSettleInfo {
    scoreNum: number = 0;
    passNum: number = 0;
    beseComboNum: number = 0;
    finalSurvivalNum: number = 0;
    constructor(score: number, pass: number, beseCombo: number, finalSurvivaltime: number) {
        this.scoreNum = score;
        this.passNum = pass;
        this.beseComboNum = beseCombo;
        this.finalSurvivalNum = finalSurvivaltime;
    }
}


//无尽模式
export enum PlayPattern {
    Normal = 0,
    Endless = 1,

}