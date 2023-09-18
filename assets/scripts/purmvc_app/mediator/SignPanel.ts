import BasePanel from "../../util/BasePanel";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import AdController from "../../plugin/ADSdk/AdController";
import config, { Platform } from "../../../config/config";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SignPanel extends BasePanel {

    // @property({ type: cc.AudioClip })
    // public enterClip: cc.AudioClip = null;
    @property(cc.Prefab)
    signUnitPref: cc.Prefab = null;
    public closeBtn: cc.Button = null;
    private content: cc.Node = null;
    private ironDynamicSpr: cc.Sprite = null;
    private signedNode: cc.Node = null;
    private nomalBtn: cc.Button = null;
    private adBtn: cc.Button = null;

    public localOnEnter: Function = null;


    onLoad() {
        super.onLoad();
        this.closeBtn = this.node.getChildByName("Close_btn").getComponent(cc.Button);
        this.nomalBtn = this.node.getChildByName("Nomal_btn").getComponent(cc.Button);
        this.adBtn = this.node.getChildByName("Ad_btn").getComponent(cc.Button);
        this.ironDynamicSpr = this.node.getChildByName("Iron").getComponent(cc.Sprite);
        this.signedNode = this.node.getChildByName("SignedNode");
        this.content = this.node.getChildByName("Content");

        this.nomalBtn.node.active = false;
        this.adBtn.node.active = false;
        this.signedNode.active = false;
    }

    onEnter() {
        super.onEnter();
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.panerlEnter);
        this.ironExpendAct();
        this.localOnEnter && this.localOnEnter();
    }

    onExit() {
        super.onExit()
        if (config.platform == Platform.oppo || config.platform == Platform.web) {
            //ASCAd.getInstance().hideBanner();
            AdController.instance.bannnerShowIng = false;
        }
        console.log("签到面板退出");
    }

    /**
     * 设置关闭按钮点击事件监听
     */
    public setCloseBtnClickEvent(callback: Function) {
        this.closeBtn.node.on("click", callback, this);
    }
    /**
     * 设置普通签到按钮点击事件监听
     */
    public setNomalBtnClickEvent(callback: Function) {
        this.nomalBtn.node.on("click", callback, this);
    }
    /**
     * 设置看视频签到按钮点击事件监听
     */
    public setAdBtnClickEvent(callback: Function) {
        this.adBtn.node.on("click", callback, this);
    }

    /**
     * 生成签到单元
     */
    public createSignUnit(id: number) {
        let signUnit = cc.instantiate(this.signUnitPref);
        this.content.children[id].addChild(signUnit);
        signUnit.setPosition(cc.v2(0, 0));
        return signUnit;
    }

    /**
     * 设置未签到的显示
     */
    public setWaitSignShow() {
        this.nomalBtn.node.active = true;
        this.adBtn.node.active = true;
    }


    /**
     * 设置签到后的显示
     */
    public setSignedShow() {
        this.nomalBtn.node.active = false;
        this.adBtn.node.active = false;
        this.signedNode.active = true;
    }

    /**
     * 背景图片展开动画
     */
    ironExpendAct(cb?: Function) {
        this.ironDynamicSpr.fillRange = 0;
        cc.tween(this.ironDynamicSpr).sequence(
            cc.tween().to(0.2, { fillRange: 1 }, { easing: cc.easing.cubicIn }),
            cc.tween().call(() => {
                cb && cb();
            })
        ).start();
    }
}
