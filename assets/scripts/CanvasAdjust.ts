import config, { Platform } from "../config/config";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CanvasAdjust extends cc.Component {


    private canvas:cc.Canvas=null;
    onLoad () {
        this.canvas=this.node.getComponent(cc.Canvas);
        if(config.platform==Platform.ios){
            this.canvas.fitHeight= jsb.reflection.callStaticMethod("systemSetting", "isPhone")===0
            this.canvas.fitWidth= jsb.reflection.callStaticMethod("systemSetting", "isPhone")===1
        }
     
    }

    start () {
     
    }
}
