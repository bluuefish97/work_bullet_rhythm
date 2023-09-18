import GameManager from "../GameManager";
import { ClipEffectType } from "../AudioEffectCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GunSkinSuccesEquipEft extends cc.Component {
    @property(cc.AudioClip)
    equipClip:cc.AudioClip=null;
    @property(cc.Node)
    mainIron:cc.Node=null;
    @property(cc.Node)
    light:cc.Node=null;
    @property(cc.ParticleSystem)
    smoke:cc.ParticleSystem=null;
    @property(cc.ParticleSystem)
    fragmentParticle :cc.ParticleSystem=null;
    onEnable()
    {   
    }

    anim()
    {
        
        this.node.stopAllActions();
        this.node.active=true
        this.unscheduleAllCallbacks();
        this.light.stopAllActions();
        this.mainIron.stopAllActions();
        this.mainIron.angle=-45;
        this.mainIron.scale=3;
        this.light.scale=0;
        this.light.opacity=255;
        cc.tween(this.mainIron).to(0.05,{scale:1,angle:0}).start();
        let lightHideTween= cc.tween().delay(0.3).to(0.2,{opacity:0})
        cc.tween(this.light).delay(0.1).parallel(
           cc.tween().to(0.4,{scale:2},{easing:cc.easing.quartOut}),
           lightHideTween
        ).start();
        this.scheduleOnce(()=>{
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.equipGun);
          //  cc.audioEngine.play(this.equipClip,false,1);
            this.smoke.resetSystem();
            this.fragmentParticle.resetSystem();
        },0.2);
    }

    hide()
    {
        this.node.active=false; 
    }
    show()
    {
        this.node.stopAllActions();
        this.node.active=true
        this.light.stopAllActions();
        this.mainIron.stopAllActions();
        this.mainIron.scale=1;
        this.light.scale=0;
    }
}
