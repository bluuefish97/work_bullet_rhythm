import { PoolManager } from "../util/PoolManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class PiontFrag extends cc.Component {

    private ske:sp.Skeleton;

    onLoad()
    {
        this.ske=this.node.getComponent(sp.Skeleton);
       
        this.ske.timeScale=3
        this.node.zIndex=9;
    }

   onEnable()
   {
        let idx=Math.floor(Math.random()*4);        
        this.ske.setAnimation(0, "boom_"+idx.toString(),false);
        this.scheduleOnce(()=>{PoolManager.instance.putNode(this.node)},1)
   }
}
