import { CONSTANTS } from "../Constants";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loop extends cc.Component {

    private targetDis: number = 10;
    private speed: number = CONSTANTS.IdieSpeed;
    private frames: number = 0;
    private offsetframe: number = 60;
    start() {

    }
    update(dt) {
        if (this.frames >= this.offsetframe) {
            this.frames = 0;
            return;
        }
        this.frames++
        this.node.y -= dt * this.speed;
     
        if (this.node.y <= -this.node.height/2) {
            this.node.y = 0;
            this.endCal();

        }
    }
    initSet(_speed: number) {
        this.speed = _speed;
    }
    endCal() {

    }
}
