// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BezierObj extends cc.Component {
    protected targetPos: cc.Vec2 = cc.v2(0, 0);

    public set TargetPos(v: cc.Vec2) {
        this.targetPos = v;
    }
    protected flyDur = 0.8;
       /**
     * 主物体动作
     */
    protected mainNodeAct(targetX: number, delay: number,targetCal) {
        this.node.getComponent(cc.ParticleSystem).resetSystem();
        let self = this;
        let cal = function () {
            self.node.getComponent(cc.ParticleSystem).stopSystem();
            self.scheduleOnce(() => {
                self.node.stopAllActions();
                self.node.setPosition(cc.v2(0, 0));
                self.node.angle = 0;
                self.node.children[0].opacity = 255;
            },2)

        }
        let flyAct = cc.callFunc(() => {
            let point1offSetX = 30 * targetX / Math.abs(targetX);   //200 * targetX / Math.abs(targetX)
            let point1offSetY = 25 - targetX / 10;   //500 - targetX / 10;
            let point2offSetX = 200 + targetX / 10; // 200 + targetX / 10;
            let point2offSetY = -500;  //-(500)
            self.FlyAnimation(cc.v2(targetX, 0), this.targetPos, this.flyDur, self.node, point1offSetX, point1offSetY, point2offSetX, point2offSetY, cal);
        })
        this.node.runAction(cc.sequence(cc.delayTime(delay), flyAct));

    }
    /**
    * 子物体动作
    */
    protected chidrenNodeAct(targetX: number, targetY: number, delay: number) {
       
    }

   //bezier动画
   protected FlyAnimation(firstPos: cc.Vec2, endPos: cc.Vec2, dur: number, obj: cc.Node, point1offSetX, point1offSetY, point2offSetX, point2offSetY, _cal?: Function) {
    let cPoint1 = cc.v2(firstPos.x + point1offSetX, firstPos.y + point1offSetY);
    let cPoint2 = cc.v2(endPos.x + point2offSetX, endPos.y + point2offSetY);
    let bezier = [cPoint1, cPoint2, endPos];
    let bezierTo = cc.bezierTo(dur, bezier);
    let cal = cc.callFunc(function () {
        if (_cal) {
            _cal();
        }
    })
    obj.runAction(cc.sequence(bezierTo, cal));
}
}
