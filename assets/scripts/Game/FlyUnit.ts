import BezierObj from "./BezierObj";
import { PoolManager } from "../util/PoolManager";
import PowerUnitFly from "./PowerUnitFly";


const { ccclass, property } = cc._decorator;

@ccclass
export default class FlyUnit extends PowerUnitFly {
    onLoad(){

    }
    onEnable(){
        
    }
    // flyAct(target: cc.Vec3,targetCal) {
    //     this.TargetPos = cc.v2(target.x, target.y);
    //     this.mainNodeAct(0, 0,targetCal);
    //     this.getComponentInChildren(cc.ParticleSystem).resetSystem();
    //     this.chidrenNodeAct();
    // }
    // public onActEnd:Function=null;
//     /**
//  * 主物体动作
//  */
//     protected mainNodeAct(targetX: number, delay: number,targetCal) {
//         let self = this;
//         let cal = function () {
//             self.node.stopAllActions();
//             self.node.setPosition(cc.v2(0, 0));
//             targetCal&&targetCal();
//             setTimeout(() => {
//                 PoolManager.instance.putNode(self.node);
//             }, 2000);
//             self.getComponentInChildren(cc.ParticleSystem).stopSystem();
//             self.onActEnd&&self.onActEnd();
//         }
//         let flyAct = cc.callFunc(() => {
//             let point1offSetX = 100;
//             let point1offSetY = 50;
//             let point2offSetX = 20;
//             let point2offSetY = -20;
//             self.FlyAnimation(this.node.getPosition(), this.targetPos, this.flyDur, self.node, point1offSetX, point1offSetY, point2offSetX, point2offSetY, cal);
//         })
//         this.node.runAction(cc.sequence(cc.delayTime(delay), flyAct));

//     }

//     /**
//     * 子物体动作
//     */
//     protected chidrenNodeAct() {
//         this.node.children[0].stopAllActions();
//         this.node.children[0].scale=1;
//         this.node.children[0].angle=0;
//         let rotateAct=cc.tween().to(this.flyDur,{angle:45 },{easing:cc.easing.quadIn});
//         let scale=cc.tween().to(this.flyDur*0.2,{scale:2.5 }).to(this.flyDur*0.8,{scale:1});
//         cc.tween(this.node.children[0]).parallel(
//             rotateAct,
//             scale
//         ).start();
//     }
}
