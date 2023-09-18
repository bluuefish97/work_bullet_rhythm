import BasePanel from "../../util/BasePanel";
import config, { Platform } from "../../../config/config";
import AudioManager from "../../plugin/audioPlayer/AudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class V1_1_2AnnouncementPanel extends BasePanel {

    private box: cc.Node = null;
    private sureBtn: cc.Button = null;
    private rightBox: cc.Node = null;
    

    onExit() {
        super.onExit()
        console.log("ZQVAnnouncementPanel  退出");
    }

    onLoad() {
        super.onLoad();
        this.box = this.node.getChildByName("Box");
        this.rightBox = this.box.getChildByName("RightBox");
        this.sureBtn = this.box.getChildByName("SureBtn").getComponent(cc.Button);
        this.rightBox.x=cc.winSize.width;
        this.sureBtn.node.x=-cc.winSize.width;
    }

    onEnter() {
        super.onEnter();
        // this.box.scale = 0;
        
        cc.tween(this.rightBox).to(0.2, { x: -100 },{ easing: cc.easing.cubicIn }).to(0.5, { x: 0 },{ easing: cc.easing.elasticOut }).start();
        cc.tween(this.sureBtn.node).to(0.2, { x: 100 },{ easing: cc.easing.cubicIn }).to(0.5, { x: 0 },{ easing: cc.easing.elasticOut }).start();
    
       
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
