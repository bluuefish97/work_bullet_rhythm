
import { Utility } from "./util/Utility";
import Load from "./Load";
import { Facade } from "./core/puremvc/patterns/facade/Facade";
import { MediatorDefine } from "./purmvc_app/mediator/mediatorDefine";
import UIPanelCtr from "./util/UIPanelCtr";
import { CommandDefine } from "./purmvc_app/command/commandDefine";
import { OpenPanelBody } from "./purmvc_app/command/OpenPanelCmd";
import { PanelType } from "./util/PanelType";
import { ProxyDefine } from "./purmvc_app/proxy/proxyDefine";
import { MusicPxy } from "./purmvc_app/proxy/MusicPxy";
import { PlaySongInfo, SongPlayType } from "./purmvc_app/repositories/Rep";
import GameManager from "./GameManager";
import { CoinPartMediator } from "./purmvc_app/mediator/CoinPartMediator";
import { GamePxy } from "./purmvc_app/proxy/GamePxy";
import AdController from "./plugin/ADSdk/AdController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameLoad extends Load {
    @property({
        type: cc.ProgressBar,
        override: true
    })
    bar: cc.ProgressBar = null;

    @property({
        type: cc.Node,
        override: true
    })
    cancalBtnNode: cc.Node = null;

    @property({
        type: cc.Node,
        override: true
    })
    LoadPage: cc.Node = null;

    isCancalTryConnet: boolean = false;

    onLoad() {
        this.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
        this.node.setPosition(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);

    }

    start() {
        this.bar.progress = 0;
        //this.isCancalTryConnet=false;
    }
    showProcess(completedCount, totalCount) {
        this.bar.progress = completedCount / totalCount;
    }

    onEnable() {
        this.cancalBtnNode.active = false;
        this.scheduleOnce(() => {
            this.cancalBtnNode.active = true;
        }, 5)
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

    public cancalLoad() {
        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        med && med.partSwitch(true);
        GameManager.getInstance().isStartSongReadyState = false;
        let musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        gamePxy.restitutionPowerNum(3);
        this.isCancalTryConnet = true;
        if (cc.director.getScene().name == "guideGame") {
            Facade.getInstance().removeMediator(MediatorDefine.ReviveMediator);
            Facade.getInstance().removeMediator(MediatorDefine.FinishMediator);
            Facade.getInstance().removeMediator(MediatorDefine.ShareRecMediator);
            Facade.getInstance().removeMediator(MediatorDefine.CoinPartMediator);
            Facade.getInstance().removeMediator(MediatorDefine.SongUnitMediator + "FinishUnit");
            UIPanelCtr.getInstance().resetPanelStack();
            Facade.getInstance().sendNotification(CommandDefine.LoadRequest);
            this.node.active = false;
            let lastSongName = musicPxy.getLastPlaySongName();
            Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
        }
        else {
            let self = this;
            cc.director.loadScene("home", () => {
                console.log("返回主页场景加载完成！！");
                UIPanelCtr.getInstance().clearPanelStack();
                Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.HomePartView))
                self.node.active = false;
                let lastSongName = musicPxy.getLastPlaySongName();
                Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
            });
        }
    }
}
