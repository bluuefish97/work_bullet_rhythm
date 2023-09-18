import BasePanel from "../../util/BasePanel";
import PlayStage, { PlayPattern } from "../../Game/PlayStage";
import { CONSTANTS } from "../../Constants";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RevivePanel extends BasePanel {

    // @property({ type: cc.AudioClip })
    // public downTimeClip: cc.AudioClip = null;
    @property(cc.Label)
    timeLabel: cc.Label = null;
    @property(cc.Sprite)
    timerProSpr: cc.Sprite = null;
    private curProLabel: cc.Label = null;
    private ELPTipLabel: cc.Label = null;
    private closeBtn: cc.Button = null;
    private adReviveBtn: cc.Button = null;
    private efts: Array<cc.ParticleSystem> = new Array<cc.ParticleSystem>();

    private reconfirmView: cc.Node = null;
    private sureBtn: cc.Button = null;
    private canelBtn: cc.Button = null;

    isStop: boolean = true;           //停止计时
    isBreak: boolean = false;
    isReconfirm: boolean = false;
    timer: number = 0;
    t: number = 0

    onAutoStop: Function;
    onLoad() {
        super.onLoad();
        this.closeBtn = this.node.getChildByName("Close_btn").getComponent(cc.Button);
        this.adReviveBtn = this.node.getChildByName("AdRevive_btn").getComponent(cc.Button);
        this.curProLabel = this.node.getChildByName("ProLabel").getComponent(cc.Label);
        this.ELPTipLabel = this.node.getChildByName("ELPTipLabel").getComponent(cc.Label);
        this.reconfirmView = this.node.getChildByName("ReconfirmView")
        this.sureBtn = this.reconfirmView.getChildByName("iron").getChildByName("SureBtn").getComponent(cc.Button);
        this.canelBtn = this.reconfirmView.getChildByName("iron").getChildByName("CanelBtn").getComponent(cc.Button);
        this.efts = this.node.getComponentsInChildren(cc.ParticleSystem);
    }

    start() {
    }

    onEnter() {
        super.onEnter();
        // ASCAd.getInstance().hideNativeIcon();
        GameManager.getInstance().node.zIndex = 100
        if (PlayStage.getIntance && PlayStage.getIntance().playingPattern == PlayPattern.Normal) {
            let proTime = Math.floor(PlayStage.getIntance().getProTime() * 100);
            this.setCurProLabel(proTime);
        } else if (PlayStage.getIntance && PlayStage.getIntance().playingPattern == PlayPattern.Endless) {
            let proScore = PlayStage.getIntance().bestScoreTarget - PlayStage.getIntance().scoreVal;
            this.setELPCurProLabel(proScore);
        }

        this.clickReset(CONSTANTS.downTime)
        this.playDownEfts();
        this.closeBtn.node.active = true;
        this.reconfirmView.active = false;
     
        // ASCAd.getInstance().getNavigateSettleFlag() && ASCAd.getInstance().showNavigateSettle(2, 0, 400);
    }
    onExit() {
        super.onExit();
        // ASCAd.getInstance().hideNativeImage();
        // ASCAd.getInstance().hideNativeIcon();
        // ASCAd.getInstance().hideNavigateSettle();
        GameManager.getInstance().node.zIndex = 51;
    }
    /**
     * 设置关闭按钮点击事件监听
     */
    setCloseBtnClickEvent(callback: Function) {
        this.closeBtn.node.on("click", callback, this);
    }


    /**
     * 设置看广告复活按钮点击事件监听
     */
    setAdReviveBtnClickEvent(callback: Function) {
        this.adReviveBtn.node.on("click", callback, this);
    }

    /**
   * 设置确定关闭按钮点击事件监听
   */
    setSureBtnClickEvent(callback: Function) {
        this.sureBtn.node.on("click", callback, this);
    }

    /**
   * 设置取消按钮点击事件监听
   */
    setCanelBtnClickEvent(callback: Function) {
        this.canelBtn.node.on("click", callback, this);
    }

    /**
     * 是否显示地图获得碎片按钮
     */
    switchShowMapChipIron(isShow: boolean, str: string) {
        let mapchipIron = this.node.getChildByName("MapChip");
        if (isShow) {
            mapchipIron.active = true;
            mapchipIron.getComponentInChildren(cc.Label).string = str;
            let bgLight = mapchipIron.getChildByName("BgLight");
            bgLight.active = true;
            bgLight.active = false;
            bgLight.stopAllActions()
            bgLight.active = true;
            cc.tween(bgLight).repeatForever(
                cc.tween().by(4, { angle: 360 })
            ).start();
        }
        else {
            mapchipIron.active = false;
        }
    }

    /**
     * 打开再次确认页面
     */
    openReconfirmView() {
        let box = this.reconfirmView.getChildByName("iron");
        box.stopAllActions();
        box.scale = 0;
        this.isReconfirm = true;
        this.reconfirmView.active = true;
        // iron.getComponentInChildren(cc.Label).string=str;
        // let lightAct=function()
        // {
        //     let bgLight = iron.getChildByName("BgLight");
        //     bgLight.active = true;
        //     bgLight.active = false;
        //     bgLight.stopAllActions()
        //     bgLight.active = true;
        //     cc.tween(bgLight).repeatForever(
        //         cc.tween().by(4, { angle: 360 })
        //     ).start();
        // }

        // cc.tween(iron)
        // .to(0.2,{scale:1.2})
        // .to(0.2,{scale:1},{easing:cc.easing.elasticOut})
        // .call(lightAct)
        // .start();

        box.scale = 0;
        cc.tween(box).to(0.2, { scale: 1.3 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut }).start();
    }

    /**
    * 设置死亡时的进度显示
    */
    setCurProLabel(val: number) {
        this.curProLabel.node.active = true;
        this.ELPTipLabel.node.active = false;
        this.curProLabel.string = val + "%";
    }


    /**
    * 设置无尽模式死亡时的进度显示
    */
    setELPCurProLabel(val: number) {
        this.curProLabel.node.active = false;
        this.ELPTipLabel.node.active = true;
        if (val <= 0) {
            this.ELPTipLabel.string = "离冠军越来越近了!!";
        }
        else {
            this.ELPTipLabel.string = "距离新纪录还剩" + val + "分";
        }

    }

    /**
     * 重置倒计时
     */
    clickReset(num: number) {
        //  cc.audioEngine.play(this.downTimeClip, false, 1);
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.downTime);
        this.t = 0;
        this.isBreak = false;
        this.isStop = false;
        this.isReconfirm = false;
        this.timerProSpr.fillRange = 0;
        this.timeLabel.node.scale = 1;
        this.timeLabel.node.opacity = 255;
        this.timeLabel.string = num.toString();
        this.timeLabel.node.stopAllActions();
        this.timeLabel.node.runAction(
            cc.spawn(
                cc.scaleTo(1, 1.5),
                cc.fadeOut(1)
            )
        );

        this.timer = num;
    }

    update(dt) {
        if (!this.isReconfirm && !this.isBreak && !this.isStop) {
            this.t += dt;
            this.timerProSpr.fillRange += dt / 10;
            if (this.t > 1) {
                if (!this.isBreak) {
                    this.timer--;
                    this.timeLabel.node.scale = 1;
                    this.timeLabel.node.opacity = 255;
                    this.timeLabel.string = this.timer.toString();
                    this.timeLabel.node.stopAllActions();
                    this.timeLabel.node.runAction(
                        cc.spawn(
                            cc.scaleTo(1, 1.5),
                            cc.fadeOut(1)
                        )
                    );
                    if (this.timer >= 0) {
                        //  cc.audioEngine.play(this.downTimeClip, false, 1);
                        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.downTime);
                    }
                }
                this.t = 0;
            }
            if (this.timer < 0) {
                this.isStop = true;
                this.onAutoStop();
            }
        }

    }

    private playDownEfts() {
        this.efts.forEach((eft: cc.ParticleSystem) => {
            eft.resetSystem();
        })
    }
}
