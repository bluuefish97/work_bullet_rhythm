import GameManager from "./GameManager";
import { Utility } from "./util/Utility";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Load extends cc.Component {
    @property(cc.ProgressBar)
    bar: cc.ProgressBar = null;

    @property(cc.Node)
    LoadPage: cc.Node = null;

    onLoad() {
        this.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
        this.node.setPosition(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);



    }

    start() {

        GameManager.getInstance().applicationFacade.startup();
    }

    showProcess(completedCount, totalCount, item) {
        //  console.log("completedCount" +completedCount +"totalCount  "+totalCount);
        // console.log(item);

        this.bar.progress = completedCount / totalCount;
    }


    /**
     * 准心动画
     */
    public loadAimPointAct() {
        let aimPoint = this.LoadPage.getChildByName("bg").getChildByName("AimPoint");
        cc.tween(aimPoint).to(1.5, { x: Utility.randomRange(-60, 60), y: Utility.randomRange(-30, 30) }, { easing: cc.easing.sineInOut })
            .start();
        this.schedule(() => {
            cc.tween(aimPoint).to(1.5, { x: Utility.randomRange(-60, 60), y: Utility.randomRange(-30, 30) }, { easing: cc.easing.sineInOut })
                .start();
        }, 1)
    }
}
