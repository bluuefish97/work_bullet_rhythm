import BasePanel from "../../util/BasePanel";
import config, { Platform } from "../../../config/config";



const { ccclass, property } = cc._decorator;

@ccclass
export default class ShareRecPanel extends BasePanel {
    private box: cc.Node = null;
    private shareBtn: cc.Button = null;
    private cancelBtn: cc.Button = null;
    onLoad() {
        super.onLoad();
        this.box = this.node.getChildByName("Box");
        this.shareBtn = this.box.getChildByName("ShareBtn").getComponent(cc.Button);
        this.cancelBtn = this.box.getChildByName("CancelBtn").getComponent(cc.Button);
    }

    start() {
    }

    onEnter() {
        super.onEnter();

        this.box.scale = 0;
        this.box.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1)))
        if(config.platform==Platform.douYin){
            this.cancelBtn.node.active=true;
        }
        else{
            this.cancelBtn.node.active=false;
            this.scheduleOnce(()=>{
                this.cancelBtn.node.active=true;
            },3)
        }
      
    }

    onExit() {
        super.onExit();
    }
    /**
     * 设置分享按钮点击事件监听
     */
    setShareBtnClickEvent(callback: Function, targert?) {
        this.shareBtn.node.on("click", callback, targert);
    }

      /**
     * 设置关闭按钮点击事件监听
     */
    setCancelBtnClickEvent(callback: Function, targert?) {
        this.cancelBtn.node.on("click", callback, targert);
    }
   
}
