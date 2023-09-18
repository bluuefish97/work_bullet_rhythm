import { PoolManager } from "../util/PoolManager";
import { Utility } from "../util/Utility";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundWave extends cc.Component {

    private startPos;
    private sumDistance=1000;
    private isActive=true;
    onLoad()
    {
       // this.node.getComponentInChildren(cc.MotionStreak).node.destroy();
    }
    public setStartPos(pos: cc.Vec2) {
        this.isActive=true;
        this.node.setPosition(pos)
        this.node.opacity=255;
        //this.node.getComponentInChildren(cc.MotionStreak).fadeTime=3;
        this.moveAct();
        this.node.getComponent(cc.ParticleSystem).resetSystem();
    }


    moveAct(){
        let interval=80
        let height=Utility.randomRange(40,80) 
        let dur=1
        if(!this.isActive) return;
        cc.tween(this.node).bezierTo(dur, this.node.getPosition(), cc.v2(this.node.x - interval,height), cc.v2(this.node.x - interval*2, this.node.y))
        .call(()=>
        { 
            cc.tween(this.node).bezierTo(dur, this.node.getPosition(), cc.v2(this.node.x - interval,-height), cc.v2(this.node.x - interval*2, this.node.y))
            .start();
        })
        .delay(dur)
        .call(()=>{
            if(this.node.x<-800&&this.isActive)
            {
                this.node.getComponent(cc.ParticleSystem).stopSystem();
                this.isActive=false;
                this.scheduleOnce(()=>{PoolManager.instance.putNode(this.node);},3)
                        
            }
            this.moveAct()})
        .start()
    }


    hideAct()
    {
        cc.tween(this.node).to(0.5,{opacity:0}).start();
    }


  
}
