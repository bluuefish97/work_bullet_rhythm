
import { PoolManager } from "../util/PoolManager";
import PowerUnitFly from "./PowerUnitFly";

const { ccclass, property } = cc._decorator;

@ccclass
export default class V1_1_4powerUnitFly  extends PowerUnitFly {
    protected MAXTargetX = 200;
    protected MAXTargetY = 30;
    protected flyDur = 0.6;
    onLoad(){

    }
    onEnable()
    {
    }

    /**
     * V1_1_4附加动画
     */
    protected appendAct(flyDur){
        this.node.getComponentInChildren(cc.ParticleSystem).resetSystem()
        this.node.children[0].scale = 0.5;
        this.node.children[0].opacity=255;
        let scaleAct = cc.tween(this.node.children[0]).to(flyDur*0.5,{scale:1.2})
        let hideAct= cc.tween(this.node.children[0]).delay(flyDur*0.8)
        .to(flyDur*0.2,{opacity:0});
        cc.tween(this.node.children[0]).parallel(scaleAct,hideAct).start();
    }
    /**
     *  V1_1_4end提示动画
     */
    public endCall()
    {
        
        this.node.getComponentInChildren(cc.ParticleSystem).stopSystem();
        setTimeout(() => {
            
            PoolManager.instance.putNode(this.node)
        }, 1000);
        
    }
}
