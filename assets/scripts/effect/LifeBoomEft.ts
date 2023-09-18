import { PoolManager } from "../util/PoolManager";

const { ccclass, property } = cc._decorator;
@ccclass
export default class LifeBoomEft extends cc.Component {

    onLoad() {      
        this.node.scale=1;
        this.node.zIndex = 9;
      //  this.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
        this.node.setPosition(cc.view.getVisibleSize().width / 2,0);
    }

    onEnable() {
        this.node.getComponent(cc.ParticleSystem).resetSystem();
        this.scheduleOnce(()=>{
            PoolManager.instance.putNode(this.node);
        },4)
    }
}
