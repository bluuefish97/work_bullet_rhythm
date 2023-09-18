
const {ccclass, property} = cc._decorator;

@ccclass
export default class ActUtil  {

    /**
     * 提示信息的动画
     */
    static msgTipAct(tipNode:cc.Node,time=0.2)
    {
        tipNode.opacity=255;
        tipNode.y=-40;
        tipNode.active=true;
        tipNode.stopAllActions();
        cc.tween(tipNode).sequence(
            cc.tween().to(0.2,{y:0},{easing:"expoOut"}),
            cc.tween().delay(time),
            cc.tween().to(0.5,{opacity:0}),
            cc.tween().call(()=>{
                tipNode.active=false;
            })
        ).start();
    }

    /**
     * 弹窗动画
     */
    static popupElastAct(view:cc.Node,cal?:Function)
    {
        view.active=true;
        view.scale=0;
        view.opacity=255;
        view.stopAllActions();
        // let scaleAct=cc.scaleTo(0.4,1).easing(cc.easeElasticOut(0.5));
        // let calAct=cc.callFunc(()=>{cal&&cal()});
        // let act=cc.sequence(scaleAct, calAct);
        // view.runAction(act);
        cc.tween(view).to(0.1,{scale:0.5}).to(0.2,{scale:1},{easing:cc.easing.backOut})
        .call(()=>{cal&&cal()}).start();

       // cc.tween(view).to(0.4,{scale:1},{easing:"elasticOut"}).start();
    }

     /**
     * 弹窗退出
     */
    static popdownElastAct(view:cc.Node,cal?:Function)
    {
        // let scaleAct=cc.scaleTo(0.4,0).easing(cc.easeElasticIn(1));
        // let fadeAct=cc.sequence(
        //     cc.delayTime(0.3),
        //     cc.fadeOut(0.1)
        // ) 
        // let calAct=cc.callFunc(()=>{cal&&cal()});
        // let act=cc.sequence(cc.spawn(scaleAct,fadeAct) ,cc.delayTime(0.2), calAct);
        // view.runAction(act);

        cc.tween(view).to(0.3,{scale:0.8},{easing:cc.easing.backIn}).to(0.2,{scale:0})
        .call(()=>{cal&&cal()}).start();

       // cc.tween(view).to(0.4,{scale:1},{easing:"elasticOut"}).start();
    }
}
