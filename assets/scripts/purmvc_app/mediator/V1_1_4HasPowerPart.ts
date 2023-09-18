
const { ccclass, property } = cc._decorator;

@ccclass
export default class V1_1_4HasPowerPart extends cc.Component {
    private powerNode: cc.Node = null;
    private powerTargetPos: cc.Vec2;

    private static _instance: V1_1_4HasPowerPart;
    public static getInstance(): V1_1_4HasPowerPart {
        return V1_1_4HasPowerPart._instance
    }
    onLoad() {
        if(cc.director.getScene().name!=="guideGame")
        {
            if (!V1_1_4HasPowerPart._instance) {
                V1_1_4HasPowerPart._instance = this;
            } else if (V1_1_4HasPowerPart._instance != this) {
                this.destroy();
            }
            cc.game.addPersistRootNode(this.node);
        }
        this.node.setPosition(65, cc.view.getVisibleSize().height -200);
        this.powerNode = this.node.getChildByName("Power");
    }

    start() {
    }

    /**
       * 获得体力卷的目标点
       */
    getPowertargetPos() {
        this.powerTargetPos = this.powerNode.getChildByName("Iron").convertToWorldSpaceAR(cc.v2(0, 0));
        return this.powerTargetPos;
    }

   
    /**
     * 设置体力的数量显示
     */
    setPowerLabel(str: string) {
        this.powerNode.getChildByName("Label").getComponent(cc.Label).string =str;
    }
}
