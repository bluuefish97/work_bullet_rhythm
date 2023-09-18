import BasePanel from "../../util/BasePanel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class V1_1_3AnnouncementPanel extends BasePanel {

    private box: cc.Node = null;
    private sureBtn: cc.Button = null;
    private rightBox: cc.Node = null;
    

    onExit() {
        super.onExit()
        console.log("V1_1_3AnnouncementPanel  退出");
    }

    onLoad() {
        super.onLoad();
        this.box = this.node.getChildByName("Box");
        this.rightBox = this.box.getChildByName("RightBox");
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
