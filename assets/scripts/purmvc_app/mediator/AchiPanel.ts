import BasePanel from "../../util/BasePanel";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import config, { Platform } from "../../../config/config";
import AdController from "../../plugin/ADSdk/AdController";


const { ccclass, property } = cc._decorator;

@ccclass
export default class AchiPanel extends BasePanel {
    @property(cc.Prefab)
    achivUnitPref: cc.Prefab = null;
    private ironBg: cc.Node = null;
    private closeBtn: cc.Button = null;
    private listScrollView: cc.ScrollView = null;
    private EnterEvent;
    onLoad() {
        super.onLoad();
        this.ironBg = this.node.getChildByName("Iron");
        this.closeBtn = this.node.getChildByName("Close_btn").getComponent(cc.Button);
        this.listScrollView = this.node.getChildByName("AchiListScrollView").getComponent(cc.ScrollView);
        this.ironBg.y = -cc.view.getVisibleSize().height / 2;
    }

    start() {

    }
    onEnter() {
        super.onEnter();
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.panerlEnter);
        GameManager.getInstance().openBlockInput();
        this.listScrollView.content.y = 0;
        this.ironUpdown();
        this.scheduleOnce(() => {
            GameManager.getInstance().closeBlockInput();
        }, 0.6);
    }

    onExit() {
        super.onExit();
    
    }

    /**
     * 设置关闭按钮点击事件监听
     */
    setCloseBtnClickEvent(callback: Function) {
        this.closeBtn.node.on("click", callback, this);
    }


    /**
     * 生成成就单元
     */
    public createAchivUnit() {
        let achivUnit = cc.instantiate(this.achivUnitPref);
        this.listScrollView.content.addChild(achivUnit);
        return achivUnit;
    }

    /**
     * 设置成就列表content的高度
     */
    setListScrollViewContentSizeY(value: number) {
        this.listScrollView.content.height = value;
    }

    /**
     * 背景上移
     */
    ironUpdown() {
        this.ironBg.stopAllActions();
        this.ironBg.y = -cc.view.getVisibleSize().height / 2;
        this.ironBg.height = cc.view.getVisibleSize().height - 500
        let target = (cc.view.getVisibleSize().height / 2 - 500);
        cc.tween(this.ironBg).to(0.2, { y: target }).start();
    }
}
