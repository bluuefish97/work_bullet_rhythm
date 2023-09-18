import { CONSTANTS } from "../Constants";
import { PoolManager } from "../util/PoolManager";
import PlayStage, { PlayState } from "./PlayStage";
import { Utility } from "../util/Utility";
import PointGenerator, { PointType } from "./PointGenerator";
import { ClipEffectType } from "../AudioEffectCtrl";
import GameManager from "../GameManager";
import FlyUnit from "./FlyUnit";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PointRunner extends cc.Component {
    @property(cc.Prefab)
    fragPre: cc.Prefab = null;

    @property(cc.Prefab)
    V1_1_4fryUnitPre: cc.Prefab = null;


    private V1_1_4fryPreUnit;
    // @property
    // ZQV_isMoonCake: boolean = false;     //是否是月饼
    private LocalType: RunnerType
    private pointID: number = 0;
    private pointType: PointType;
    private fragPreUnit;
    public isContine: boolean = false;
    public getPointID() {
        return this.pointID;
    }

    public setPointID(val: number) {
        this.pointID = val;
    }

    public get PointType(): PointType {
        return this.pointType
    }

    public setPointType(val: PointType) {
        this.pointType = val;
    }
    /**
     * 获得节奏点的坐标值
     */
    getPosition(): cc.Vec2 {
        let eviCamera = cc.director.getScene().getChildByName('3D Stage').getChildByName("3D Camera").getComponent(cc.Camera);
        let sceenTargetFirePos: cc.Vec2 = cc.v2(0, 0);
        eviCamera.getWorldToScreenPoint(this.node.getPosition(), sceenTargetFirePos);
        return sceenTargetFirePos;
    }

    setInitPosition(pos: cc.Vec3, type: RunnerType) {
        this.LocalType = type;
        this.node.active = true;
        this.node.getChildByName("mesh").active = true;
        if (this.LocalType == RunnerType.rhythmRuner) {
            this.node.getChildByName("shadow").active = true
        }
        this.node.setPosition(pos);
    }
    update(dt) {
        this.node.z += dt * PointGenerator.getIntance().localForwardSpeed;                             // CONSTANTS.ForwardSpeed;
        if (this.node.z > 0) {
            this.onPut();
        }
    }

    /**
     * 被击中回调
     */
    onHit() {
        this.node.getChildByName("mesh").active = false
        if (this.LocalType == RunnerType.rhythmRuner) {
            this.node.getChildByName("shadow").active = false
            this.fragPreUnit = PoolManager.instance.getNode(this.fragPre, cc.director.getScene());
            let pos = cc.v2(0, 0);
            PlayStage.getIntance().eviCamera.getWorldToScreenPoint(this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0)), pos);
            if (this.pointType == PointType.lifePoint) {
                PlayStage.getIntance().getLife(1);
                PointGenerator.getIntance().resetLifePointIsReady();
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.lifeReviver);
            }
            this.fragPreUnit.setPosition(cc.v2(pos.x, pos.y + 200));
        }


    }

    /**
     * 回收
     */
    onPut() {
        this.isContine = false;
        this.pointID = 0;
        if (this.pointType == PointType.lifePoint && this.node.getChildByName("mesh").active) {
            PointGenerator.getIntance().resetLifePointIsReady();
        }
        PoolManager.instance.putNode(this.node);
    }
}

export enum RunnerType {
    diaRunner = 0,
    rhythmRuner = 1
}
