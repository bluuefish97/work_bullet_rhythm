
import Coin from "./coin";
import { Utility } from "../util/Utility";
import { PoolManager } from "../util/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PowerUnitFly extends Coin {
    protected MAXTargetX = 200;
    protected MAXTargetY = 30;
    protected flyDur = 0.6;
    onEnable()
    {
        this.node.getChildByName("number").active=false;
    }
    chidrenNodeAct(targetX: number, targetY: number, delay: number) {
        let expandAct = cc.moveTo(this.expandDur, cc.v2(targetX + 50 * this.targetX / Math.abs(this.targetX), targetY)).easing(cc.easeSineOut());
        let closeAct = cc.moveTo(this.flyDur + delay - this.expandDur, cc.v2(0, 0)).easing(cc.easeSineIn())
        let scaleAct = cc.sequence(
            cc.scaleTo((this.flyDur + delay) / 3, 1.3),
            cc.scaleTo((this.flyDur + delay) * 2 / 3, 1))   //飞升过程缩放
        this.node.children[0].scale = Utility.randomRange(1.2, 2);
        this.node.children[0].runAction(
            cc.sequence(expandAct,
                cc.spawn(closeAct, scaleAct)));
        cc.tween(this.node.children[0]).delay(this.flyDur + delay).to(this.flyDur * 0.2, { opacity: 0 }).start();
    }

    
    /**
     * 体力使用获得动画
     */
    public consumeActShow(flyDur:number originLocalPos:cc.Vec2, targetLocalpos: cc.Vec3,cal:Function, p1OffestX=400,p1OffestY=100,p2OffestX=200,p2OffestY=-100)
    {
        let self=this;
        this.node.setPosition(originLocalPos);
        self.FlyAnimation(originLocalPos,  targetLocalpos, flyDur, this.node, p1OffestX, p1OffestY, p2OffestX, p2OffestY,cal);    
        this.appendAct(flyDur);    
    }

    /**
     * 附加动画
     */
    protected appendAct(flyDur){
        this.node.children[0].scale = 0;
        this.node.children[0].opacity=255;
        let scaleAct = cc.tween(this.node.children[0]).to(0.3,{scale:1.3})
        .to(flyDur*0.7,{scale:0.8});
        let hideAct= cc.tween(this.node.children[0]).delay(flyDur*0.9)
        .to(flyDur*0.2,{opacity:0});
        cc.tween(this.node.children[0]).parallel(scaleAct,hideAct).start();
    }

    /**
     * 体力使用后提示动画
     */
    public numberShow()
    {
        let self=this;
        let numberObj=this.node.getChildByName("number");
        numberObj.active=true;
        numberObj.y=0;
        let scaleAct=cc.tween().to(0.3,{scale:2})
        .to(0.7,{scale:1,opacity:0});
        cc.tween(numberObj).parallel(scaleAct,
            cc.tween().by(0.5,{y:250}))
            .call(()=>{ PoolManager.instance.putNode(self.node)})
            .start();
    }
}
