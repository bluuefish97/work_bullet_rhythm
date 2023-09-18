import { PowerInfo } from "../repositories/Rep";
import { Utility } from "../../util/Utility";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PowerUnit extends cc.Component {

    private awardLabel: cc.Label = null;
    private adBtn: cc.Button = null;
    private diaBtn: cc.Button = null;
    private iron: cc.Node = null;
    onLoad() {
        this.awardLabel = this.node.getChildByName("AwardLabel").getComponent(cc.Label);
        this.adBtn = this.node.getChildByName("Ad_btn").getComponent(cc.Button);
        this.diaBtn = this.node.getChildByName("Dias_btn").getComponent(cc.Button);
        this.iron = this.node.getChildByName("Iron");
        this.adBtn.node.active = false;
        this.diaBtn.node.active = false;
    }
    onEnable(){
       this.ironBounce();
    }
    

    initPowerInfo(info: PowerInfo) {
        this.awardLabel.string = "+" + info.awardVal.toString();
        if (info.obtainType == "ad")   //广告获得
        {
            this.adBtn.node.active = true;
        }
        else {
            this.diaBtn.node.active = true;
            this.diaBtn.node.getComponentInChildren(cc.Label).string = info.consumeVal.toString();
        }
    }

    /**
    * 设置广告按钮点击事件监听
    */
    setAdBtnClickEvent(callback: Function) {
        this.adBtn.node.on("click",callback,this)
    }

    /**
    * 设置钻石按钮点击事件监听
    */
   setDiasBtnClickEvent(callback: Function) {
    this.diaBtn.node.on("click",callback,this)
    }

    /**
     * 图标跳动
     */
    ironBounce()
    {
        let dur=2;
        this.iron.y=10;
        this.iron.stopAllActions();
        this.scheduleOnce(()=>{
            cc.tween(this.iron).repeatForever(
                cc.tween().to(dur/2,{y:0},{easing:cc.easing.sineIn}).to(dur/2,{y:15},{easing:cc.easing.sineOut})
            ).start();
        },Utility.randomRange(0.2,0.6));
      
    } 
}
