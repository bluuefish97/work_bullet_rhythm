

const { ccclass, property } = cc._decorator;

@ccclass
export default class LabelRoll extends cc.Component {

    /**
      * 字符串滚动
      * @param node 
      * @param speed 
      * @param context 
      */
    roll(speed: number = 60) {
        let dt = 0.016
        let self = this;
        let   /**滚动 */
            rollBg = function () {
                self. node.x -= dt / self. node.scale * speed;
                if (self. node.x <= -(self. node.width) / self. node.scale) {
                    self. node.x = (self. node.width / self. node.scale) / 2;
                }
            }
        if (self. node.width * self. node.scale > self. node.parent.width * self. node.parent.scale) {
            this.schedule(rollBg, dt)
        }
        else {
            this.unscheduleAllCallbacks();
        }
    }

    reset()
    {
        this.node.width=0;
        this.node.x=0;
        this.unscheduleAllCallbacks();
    }
}
