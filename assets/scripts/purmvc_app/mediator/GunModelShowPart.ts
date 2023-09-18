import GameManager from "../../GameManager";
import BasePanel from "../../util/BasePanel";
import { ClipEffectType } from "../../AudioEffectCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GunModelShowPart extends BasePanel {
   // private titileSprs: cc.SpriteFrame[] = [];
    private title: cc.Node;
    private stageLight: cc.Node;
    private sureBtn: cc.Node;
    private shareBtn: cc.Node;
    private titleSpine: sp.Skeleton;
    public boomRibinEft: cc.ParticleSystem;
    public chassisIdieEft: cc.ParticleSystem;
    public titleEftLift: cc.ParticleSystem;
    public titleEftRight: cc.ParticleSystem;
    public idieEft: cc.ParticleSystem;
    private isOpeningShow = false;
    private titlePath: string = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        super.onLoad();
        this.title = this.node.getChildByName("Title");
        this.stageLight = this.node.getChildByName("StageLight");
        this.sureBtn = this.node.getChildByName("sureBtn");
        this.shareBtn = this.node.getChildByName("ShareBtn");
        this.boomRibinEft = this.node.getChildByName("BoomRibin").getComponent(cc.ParticleSystem);
        this.chassisIdieEft = this.node.getChildByName("ChassisIdieEft").getComponent(cc.ParticleSystem);
        this.titleEftLift = this.node.getChildByName("TitleEftLift").getComponent(cc.ParticleSystem);
        this.titleEftRight = this.node.getChildByName("TitleEftRight").getComponent(cc.ParticleSystem);
        this.idieEft = this.node.getChildByName("IdieEft").getComponent(cc.ParticleSystem);
        this.titleSpine = this.node.getChildByName("TitleSpine").getComponent(sp.Skeleton);
        this.sureBtn.active = false;
        this.shareBtn.active = false;
        this.titleSpine.node.opacity = 0;
        let self=this;
       // this.titileSprs.reverse();
    }


    onEnter() {
        super.onEnter();
        this.unscheduleAllCallbacks();
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.gunUnlockShowClip);
        this.titleSpine.node.opacity = 255;
        this.titleSpine.setAnimation(0, "animation", false);

    }

    onExit() {
        this.node.scale = 0;
        setTimeout(() => {
            if (!this.isOpeningShow) {
                this.node.active = false;
                this.node.scale = 1;
            }
        }, 2000);
        this.onExitCall && this.onExitCall();
        console.log(this.node.name + ': onExit')
        this.sureBtn.active = false;
        this.shareBtn.active = false;
        this.shareBtn.stopAllActions();
        this.chassisIdieEft.stopSystem();
        this.titleEftLift.stopSystem();
        this.titleEftRight.stopSystem();
        this.boomRibinEft.stopSystem();
        this.idieEft.stopSystem();
        this.titleSpine.node.opacity = 0;
        let iron = this.title.getChildByName("Iron");
        iron.getComponent(cc.Sprite).spriteFrame = null;
    }
    onDisable() {

    }
    /**
    * 设置确定按钮点击事件监听
    */
    public setSureBtnClickEvent(callback: Function) {
        this.sureBtn.on("click", callback, this);
    }

    /**
    * 设置分享按钮点击事件监听
    */
    public setShareBtnClickEvent(callback: Function) {
        this.shareBtn.on("click", callback, this);
    }
    /**
     * show
     */
    show(id: number) {
        this.isOpeningShow = true;
        this.node.scale = 1;
        this.titleShowAct(id);
        // this.stageLightShowAct();
        this.scheduleOnce(() => {
            this.isOpeningShow = false;
            this.titleEftLift.resetSystem();
            this.titleEftRight.resetSystem();
        }, 1)
    }

    /**
     * 标题动画
     */
    titleShowAct(id) {
        this.title.stopAllActions();
        let iron = this.title.getChildByName("Iron");
        iron.scale = 0;
        iron.opacity = 0;
        iron.stopAllActions();
        cc.assetManager.loadBundle('remoteSkins', (err, bundle) => {
            bundle.load("gunTitle/"+id, cc.SpriteFrame, function (err, frame: cc.SpriteFrame) {
                if (err) {
                    console.error(err);
                    return;
                }
                iron.getComponent(cc.Sprite).spriteFrame = frame
            })
        })
       // iron.getComponent(cc.Sprite).spriteFrame = this.titileSprs[id];
        cc.tween(iron).to(1.5, { scale: 1.5, opacity: 255 })
            .to(0.2, { scale: 1 }).start();
    }
    /**
     * 舞台动画
     */
    stageLightShowAct() {
        this.stageLight.stopAllActions();
        this.stageLight.opacity = 0
        this.stageLight.scale = 0
        cc.tween(this.stageLight).to(1.5, { scale: 1, opacity: 255 })
            .call(() => {
                this.idieEft.resetSystem();
            })
            .start();
    }


    /**
     * 彩花粒子播放
     */
    playBoomRibinEft() {
        this.boomRibinEft.resetSystem();
        this.chassisIdieEft.resetSystem();
    }

    // /**
    //  * 确定按钮
    //  */
    // sureBtnShowAct() {
    //     this.sureBtn.y = -550;
    //     // this.sureBtn.stopAllActions();
    //     // this.sureBtn.opacity = 0
    //     // this.sureBtn.y = -550;
    //     // cc.tween(this.sureBtn).to(0.5, { y: -480, opacity: 255 })
    //     //     .start();
    // }


    /**
     * 分享按钮
     */
    shareBtnShowAct() {
        this.shareBtn.active = true;
        this.shareBtn.stopAllActions();
        this.shareBtn.opacity = 0
        this.shareBtn.y = -550;
        cc.tween(this.shareBtn).to(0.2, { y: -480, opacity: 255 }).call(() => {
            this.sureBtn.active = true;
        }).start();
    }

    /**
     * 确定按钮
     */
    showSureBtn() {
        this.sureBtn.active = true;
    }
}
