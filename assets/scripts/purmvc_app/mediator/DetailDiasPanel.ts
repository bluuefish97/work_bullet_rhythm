import BasePanel from "../../util/BasePanel";
import ActUtil from "../../ActUtil";
import config, { Platform } from "../../../config/config";


const {ccclass, property} = cc._decorator;

@ccclass
export default class DetailDiasPanel extends BasePanel {

    private adBtn: cc.Button = null;
    private closeBtn: cc.Button = null;

    onLoad(){
        super.onLoad();
      this.adBtn= this.node.getChildByName("Detail_Dias").getChildByName("Ad_btn").getComponent(cc.Button);
      this.closeBtn= this.node.getChildByName("Detail_Dias").getChildByName("Close_btn").getComponent(cc.Button);
    }

    start () {

    }
    onEnter(){
        super.onEnter();
        let view = this.node.getChildByName("Detail_Dias");
        view.zIndex=10;
        let closeBtn = view.getChildByName("Close_btn");
        let cal=()=>{};
        if(config.platform!=Platform.douYin){
            closeBtn.opacity = 0;
            cal = function () {
                closeBtn.runAction(cc.fadeIn(0.05));
            }
        }
        ActUtil.popupElastAct(view, cal)
    }

    onExit()
    {
        super.onExit();
        let view = this.node.getChildByName("Detail_Dias");
        let self = this;
        let cal = function () {
            view.active = false;
            self.node.zIndex =0;
            self.node.active=false;
            self.onExitCall&&self.onExitCall();
            console.log(self.node.name + ': onExit') 
        }
        ActUtil.popdownElastAct(view, cal);
    }
 /**
  * 设置钻石详情页面关闭按钮的点击事件监听
  * @param callback 
  */
 setDiaCloseBtnClickEvent(callback: Function) {
    this.closeBtn.node.on("click", callback, this);
}

/**
* 设置钻石详情页面广告获取按钮的点击事件监听
* @param callback 
*/
setDiaAdBtnClickEvent(callback: Function) {
    this.adBtn.node.on("click", callback, this);
}
}
