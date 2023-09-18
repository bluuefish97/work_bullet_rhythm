import { Utility } from "../util/Utility";
import { PoolManager } from "../util/PoolManager";
import BezierObj from "./BezierObj";
import GameManager from "../GameManager";
import { ClipEffectType } from "../AudioEffectCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Coin extends BezierObj {
    protected targetPos: cc.Vec2 = cc.v2(0, 0);

    public set TargetPos(v: cc.Vec2) {
        this.targetPos = v;
    }
    protected MAXTargetX = 200;
    protected MAXTargetY = 100;
    protected flyDur = 0.8;
    protected expandDur = 0.7;
    protected angleDur = 0.2;
    protected targetX;
    protected expanelX;
    protected targetY;
    protected delay;
    protected light: cc.Node;
    onLoad() {
        this.light = this.node.getChildByName("Light");
        this.light.scale = 0;
    }

    /**
     * 金币获得动画
     */
    public getActShow()
    {
        this.targetX = Utility.random(-this.MAXTargetX, this.MAXTargetX);
        this.expanelX = Utility.random(-600, 600);
        this.targetY = Utility.random(-this.MAXTargetY, this.MAXTargetY);
        this.delay = (500 - Math.abs(this.targetX)) / 600 + Utility.random(-0.2, 0.2);
        this.delay = this.delay <= 0 ? 0 : this.delay;
        this.mainNodeAct(this.targetX, this.delay);
        this.chidrenNodeAct(this.targetX, this.targetY, this.delay)
    }

    /**
     * 主物体动作
     */
    protected mainNodeAct(targetX: number, delay: number) {
        let self = this;
        let cal = function () {
            self.lightFlash();
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.diafly);
            self.scheduleOnce(() => {
                self.node.stopAllActions();
                PoolManager.instance.putNode(self.node);
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
        let expandAct = cc.moveTo(this.expandDur, cc.v2(targetX + 50 * this.targetX / Math.abs(this.targetX), targetY)).easing(cc.easeSineOut());
        let angleAct = cc.rotateTo(this.angleDur, Utility.random(-15, 15));
        let closeAct = cc.moveTo(this.flyDur + delay - this.expandDur, cc.v2(0, 0)).easing(cc.easeSineIn())
        let angleBackAct = cc.rotateTo(this.flyDur + delay - this.angleDur, 0);    //旋转纠正
        let scaleAct = cc.sequence(
            cc.scaleTo((this.flyDur + delay) / 3, 1.3),
            cc.scaleTo((this.flyDur + delay) * 2 / 3, 1))   //飞升过程缩放

        this.node.children[0].scale = Utility.randomRange(1.2, 2);
        this.node.children[0].runAction(
            cc.sequence(cc.spawn(expandAct, angleAct),
                cc.spawn(closeAct, angleBackAct, scaleAct)));

        cc.tween(this.node.children[0]).delay(this.flyDur + delay).to(this.flyDur * 0.2, { opacity: 0 }).start();
    }

    /**
     * 灯光闪
     */
    protected lightFlash() {
        this.light.stopAllActions();
        this.light.scale = 0;
        this.light.opacity = 255;
        cc.tween(this.light).to(2, { scale: 1.5, opacity: 0 },{easing:cc.easing.expoOut}).start();
    }

    //钻石飞动画
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
