import BasePanel from "../../util/BasePanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ZQVAnnouncementPanel extends BasePanel {

    private box: cc.Node = null;
    private sureBtn: cc.Button = null;

    onExit() {
        super.onExit()
        console.log("ZQVAnnouncementPanel  退出");
    }

    onLoad() {
        super.onLoad();
        this.sureBtn = this.box.getChildByName("SureBtn").getComponent(cc.Button);
    }

    onEnter() {
        super.onEnter();
        this.box.scale = 0;

        cc.tween(this.box).to(0.2, { scale: 1.3 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut }).start();


    }

    start() {

    }



    /**
     * 设置确定按钮点击事件监听
     */
    public setSureBtnClickEvent(callback: Function) {
        this.sureBtn.node.on("click", callback, this);
    }
}
