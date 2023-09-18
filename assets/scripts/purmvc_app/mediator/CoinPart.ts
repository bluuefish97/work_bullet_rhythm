import ActUtil from "../../ActUtil";



const { ccclass, property } = cc._decorator;

@ccclass
export default class CoinPart extends cc.Component {
    private diaNode: cc.Node = null;
    private powerNode: cc.Node = null;
    private coinTargetPos: cc.Vec2;
    private powerTargetPos: cc.Vec2;

    private static _instance: CoinPart;
    public static getInstance(): CoinPart {
        return CoinPart._instance
    }
    onLoad() {
        if(cc.director.getScene().name!=="guideGame")
        {
            if (!CoinPart._instance) {
                CoinPart._instance = this;
            } else if (CoinPart._instance != this) {
                this.destroy();
            }
            cc.game.addPersistRootNode(this.node);
        }
        this.node.setPosition(65, cc.view.getVisibleSize().height -100);
        this.diaNode = this.node.getChildByName("dia");
        this.powerNode = this.node.getChildByName("power");
    }

    start() {
    }

    /**
     * 获得钻石的目标点
     */
    getCointargetPos() {
        this.coinTargetPos = this.diaNode.getChildByName("Iron").convertToWorldSpaceAR(cc.v2(0, 0));
        return this.coinTargetPos;
    }
    /**
       * 获得体力卷的目标点
       */
    getPowertargetPos() {
        this.powerTargetPos = this.powerNode.getChildByName("Iron").convertToWorldSpaceAR(cc.v2(0, 0));
        return this.powerTargetPos;
    }

    /**
    * 设置钻石按钮的点击事件监听
    * @param callback 
    */
    setDiaBtnClickEvent(callback: Function) {
        this.diaNode.getComponentInChildren(cc.Button).node.on("click", callback, this);
    }


    /**
    * 设置体力按钮的点击事件监听
    * @param callback 
    */
    setPowerBtnClickEvent(callback: Function) {
        this.powerNode.getComponentInChildren(cc.Button).node.on("click", callback, this);
    }


    /**
     * 设置钻石的数量显示
     */
    setDiaLabel(val: number) {
        this.diaNode.getComponentInChildren(cc.Label).string = val.toString();
    }

    /**
     * 设置体力的数量显示
     */
    setPowerLabel(str: string) {
        this.powerNode.getChildByName("Label").getComponent(cc.Label).string =str;
    }

    /**
     *  设置体力值奖励倒计时显示
     */
    public setTimingLabel(str:string) {
        this.powerNode.getChildByName("Time").getComponentInChildren(cc.Label).string = str;
    }

    /**
     *  打开体力值奖励倒计时显示
     */
    public openTiming() {
        let view=this.powerNode.getChildByName("Time");
        view.stopAllActions();
        view.active=true;
        view.y=view.height;
        view.scaleY=0;
        view.opacity=0;
        cc.tween(view).to(0.3,{y:-80,scaleY:0.8,opacity:255})
        .to(0.8,{y:-73,scaleY:1},{easing:cc.easing.elasticOut}).start();
    }

    /**
     *  关闭体力值奖励倒计时显示
     */
    public closeTiming() {
       
        let view=this.powerNode.getChildByName("Time");
        view.stopAllActions();
        cc.tween(view).to(0.15,{y:-40,scaleY:0.8,opacity:175},{easing:cc.easing.elasticIn})
            .to(0.7,{y:0,scaleY:0,opacity:0}).start();
    }
    
    /**
     * 体力值奖励获得动画
     */
    public showPowerRewardActShow()
    {
        let iron=this.powerNode.getChildByName("Iron");
        let scaleAct=cc.tween(iron).to(0.2,{scale:0.4})
        .to(0.1,{scale:0.31});
        let moveAct=cc.tween(iron).to(0.15,{y:10},{easing:cc.easing.sineOut})
        .to(0.1,{y:0},{easing:cc.easing.sineIn});
        scaleAct.start();
    }

}
