import BasePanel from "../../util/BasePanel";
import ActUtil from "../../ActUtil";


const {ccclass, property} = cc._decorator;

@ccclass
export default class DetailPowersPanel extends BasePanel {
    private closeBtn: cc.Button = null;

    onLoad(){
        super.onLoad();
      this.closeBtn= this.node.getChildByName("Detail_Power").getChildByName("Close_btn").getComponent(cc.Button);
    }

    onEnter(){
        super.onEnter();
        let view = this.node.getChildByName("Detail_Power");
        view.zIndex=10;
        let closeBtn = view.getChildByName("Close_btn");
        closeBtn.opacity = 0;
        let cal = function () {
            closeBtn.runAction(cc.fadeIn(0.05));
        }
        ActUtil.popupElastAct(view, cal)
    }
    onExit()
    {
        super.onExit();
        let view = this.node.getChildByName("Detail_Power");
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
   * 设置体力详情页面关闭按钮的点击事件监听
   * @param callback 
   */
  setPowerCloseBtnClickEvent(callback: Function) {
    this.closeBtn.node.on("click", callback, this);
}

}
