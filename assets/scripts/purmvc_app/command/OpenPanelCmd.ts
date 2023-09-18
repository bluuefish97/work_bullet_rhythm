import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { PanelType } from "../../util/PanelType";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { MediatorDefine } from "../mediator/mediatorDefine";
import { CONSTANTS } from "../../Constants";
import GameManager from "../../GameManager";
import BasePanel from "../../util/BasePanel";
import { FinishMediator } from "../mediator/FinishMediator";
import UIPanelCtr from "../../util/UIPanelCtr";
import { ReviveMediator } from "../mediator/ReviveMediator";
import { SignMediator } from "../mediator/SignMediator";
import { AchiMediator } from "../mediator/AchiMediator";
import { CoinPartMediator } from "../mediator/CoinPartMediator";
import { WelcomeNewMediator } from "../mediator/WelcomeNewMediator";
import { ShareRecMediator } from "../mediator/ShareRecMediator";
import { SongRecommendMediator } from "../mediator/SongRecommendMediator";
import { HomePartMediator } from "../mediator/HomePartMediator";
import { DetailDiasMediator } from "../mediator/DetailDiasMediator";
import { DetailPowersMediator } from "../mediator/DetailPowersMediator";
import { ZQVAnnouncementPanelMediator } from "../mediator/ZQVAnnouncementPanelMediator";
import { GunModelShowPartMediator } from "../mediator/GunModelShowPartMediator";
import { V1_1_2AnnouncementPanelMediator } from "../mediator/V1_1_2AnnouncementPanelMediator";
import { EndlessPlayingHomePanelMediator } from "../mediator/EndlessPlayingHomePanelMediator";
import { V1_1_3AnnouncementPanelMediator } from "../mediator/V1_1_3AnnouncementPanelMediator";
import { V1_1_4AnnouncementPanelMediator } from "../mediator/V1_1_4AnnouncementPanelMediator";
import { V1_1_4HomePanelMediator } from "../mediator/V1_1_4HomePanelMediator";

export class OpenPanelCmd extends SimpleCommand {
    private cb: Function;
    public execute(notification: INotification): void {
        console.log("execute:" + "OpenPanelCmd");
        let body = notification.getBody() as OpenPanelBody;
        let type = body.type;
        this.cb = body.callback;
        switch (type) {
            case PanelType.HomePartView:
                {
                    this.openHomePanel();
                    break;
                }
            case PanelType.SignPanel:
                {
                    this.openSignPanel();
                    break;
                }
            case PanelType.AchiPanel:
                {
                    this.openAchiPanel();
                    break;
                }
            case PanelType.RevivePanel:
                {
                    this.openRevivePanel()
                    break;
                }
            case PanelType.FinishPanel:
                {
                    this.openFishPanel();
                    break;
                }
            case PanelType.ShareRecPanel:
                {
                    this.openShareRecPanel();
                    break;
                }
            case PanelType.WelcomeNewPanel:
                {
                    this.openWelcomeNewPanel();
                    break;
                }
            case PanelType.SongRecommendPanel:
                {
                    this.openSongRecommendPanel();
                    break;
                }
            case PanelType.DetailDiasPanel:
                {
                    this.openDetailDiasPanel();
                    break;
                }
            case PanelType.DetailPowersPanel:
                {
                    this.openDetailPowersPanel();
                    break;
                }
            case PanelType.GunModelShowPart:
                {
                    this.openGunModelShowPart();
                    break;
                }
            case PanelType.ZQVAnnouncementPanel:
                {

                    this.openZQVAnnouncementPanel();
                    break;
                }
            case PanelType.V1_1_2AnnouncementPanel:
                {

                    this.openV1_1_2AnnouncementPanel();
                    break;
                }
            case PanelType.EndlessPlayingHomePanel:
                {

                    this.openEndlessPlayingHomePanel();
                    break;
                }
            case PanelType.V1_1_3AnnouncementPanel:
                {

                    this.openV1_1_3AnnouncementPanel();
                    break;
                }
            case PanelType.V1_1_4HomePanel:
                {

                    this.openV1_1_4HomePanel();
                    break;
                }
            case PanelType.V1_1_4AnnouncementPanel:
                {

                    this.openV1_1_4AnnouncementPanel();
                    break;
                }

            default:
                break;
        }
    }
    /**
       * 打开主页面
       */
    private openHomePanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.HomePartMediator)) {
            var newNode = cc.director.getScene().getChildByName("UIRoot").getChildByName("HomePart");
            let basePanel = newNode.getComponent(BasePanel);
            Facade.getInstance().registerMediator(new HomePartMediator(MediatorDefine.HomePartMediator, newNode))
            UIPanelCtr.getInstance().pushExistPanelDict(PanelType.HomePartView, basePanel);
            UIPanelCtr.getInstance().pushPanel(PanelType.HomePartView);
            self.cb && self.cb();
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.HomePartView);
            this.cb && this.cb();
        }
    }


    /**
    * 打开结算页面
    */
    private openFishPanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.FinishMediator)) {
            cc.resources.load(CONSTANTS.PATH_SettlePanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new FinishMediator(MediatorDefine.FinishMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.FinishPanel, basePanel);
                self.cb && self.cb();
                UIPanelCtr.getInstance().pushPanel(PanelType.FinishPanel);

            });
        }
        else {
            this.cb && this.cb();
            UIPanelCtr.getInstance().pushPanel(PanelType.FinishPanel);
        }
    }

    /**
     * 打开复活页面
     */
    private openRevivePanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.ReviveMediator)) {
            GameManager.getInstance().openBlockInput();
            cc.resources.load(CONSTANTS.PATH_RevivePanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new ReviveMediator(MediatorDefine.ReviveMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.RevivePanel, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.RevivePanel);
                GameManager.getInstance().closeBlockInput();
                self.cb && self.cb();
            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.RevivePanel);
            this.cb && this.cb();
        }
    }

    /**
    * 打开签到页面
    */
    private openSignPanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.SignMediator)) {
            GameManager.getInstance().openBlockInput();
            cc.resources.load(CONSTANTS.PATH_SignPanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new SignMediator(MediatorDefine.SignMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.SignPanel, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.SignPanel);
                GameManager.getInstance().closeBlockInput();
                self.cb && self.cb();
            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.SignPanel);
            this.cb && this.cb();
        }
    }

    /**
    * 打开成就页面
    */
    private openAchiPanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.AchiMediator)) {
            GameManager.getInstance().openBlockInput();
            let start = +new Date();
            cc.resources.load(CONSTANTS.PATH_achievementPanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new AchiMediator(MediatorDefine.AchiMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.AchiPanel, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.AchiPanel);
                GameManager.getInstance().closeBlockInput();
                self.cb && self.cb();
                let end = +new Date();
                console.log("end- start" + (end - start));

            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.AchiPanel);
            this.cb && this.cb();
        }
    }
    /**
      * 打开分享录屏页面
      */
    private openShareRecPanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.ShareRecMediator)) {
            GameManager.getInstance().openBlockInput();
            cc.resources.load(CONSTANTS.PATH_ShareRecPanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new ShareRecMediator(MediatorDefine.ShareRecMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.ShareRecPanel, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.ShareRecPanel);
                GameManager.getInstance().closeBlockInput();
                self.cb && self.cb();
            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.ShareRecPanel);
            this.cb && this.cb();
        }
    }
    /**
   * 打开新手引导页面
   */
    private openWelcomeNewPanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.WelcomeNewMediator)) {
            cc.resources.load(CONSTANTS.PATH_WelcomeNewPanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new WelcomeNewMediator(MediatorDefine.WelcomeNewMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.WelcomeNewPanel, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.WelcomeNewPanel);
                self.cb && self.cb();
            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.WelcomeNewPanel);
            this.cb && this.cb();
        }
    }
    /**
   * 打开专属页面
   */
    private openSongRecommendPanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.SongRecommendMediator)) {
            GameManager.getInstance().openBlockInput();
            cc.resources.load(CONSTANTS.PATH_SongRecommendPanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new SongRecommendMediator(MediatorDefine.SongRecommendMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.SongRecommendPanel, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.SongRecommendPanel);
                GameManager.getInstance().closeBlockInput();
                self.cb && self.cb();
            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.SongRecommendPanel);
            this.cb && this.cb();
        }
    }

    /**
 * 打开钻石详细页面
 */
    private openDetailDiasPanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.DetailDiasMediator)) {
            GameManager.getInstance().openBlockInput();
            cc.resources.load(CONSTANTS.PATH_DetailDiasPanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new DetailDiasMediator(MediatorDefine.DetailDiasMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.DetailDiasPanel, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.DetailDiasPanel);
                GameManager.getInstance().closeBlockInput();
                self.cb && self.cb();
            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.DetailDiasPanel);
            this.cb && this.cb();
        }
    }

    /**
     * 打开体力详细页面
     */
    private openDetailPowersPanel() {
        let self = this;
        if (UIPanelCtr.getInstance().checkIsTopPanel(PanelType.DetailDiasPanel)) {
            UIPanelCtr.getInstance().popPanel();
        }
        if (!Facade.getInstance().hasMediator(MediatorDefine.DetailPowersMediator)) {
            GameManager.getInstance().openBlockInput();
            cc.resources.load(CONSTANTS.PATH_DetailPowersPanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new DetailPowersMediator(MediatorDefine.DetailPowersMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.DetailPowersPanel, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.DetailPowersPanel);
                GameManager.getInstance().closeBlockInput();
                self.cb && self.cb();
            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.DetailPowersPanel);
            this.cb && this.cb();
        }
    }


    /**
   * 打开枪的详细展示页面
   */
    private openGunModelShowPart() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.GunModelShowPartMediator)) {
            GameManager.getInstance().openBlockInput();
            cc.resources.load(CONSTANTS.PATH_GunModelShowPart, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new GunModelShowPartMediator(MediatorDefine.GunModelShowPartMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.GunModelShowPart, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.GunModelShowPart);
                GameManager.getInstance().closeBlockInput();
                self.cb && self.cb();
            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.GunModelShowPart);
            this.cb && this.cb();
        }
    }

    /**
    * 打开中秋版本详细公告页面
    */
    private openZQVAnnouncementPanel() {
        let self = this;
        if (!Facade.getInstance().hasMediator(MediatorDefine.ZQVAnnouncementPanelMediator)) {
            GameManager.getInstance().openBlockInput();
            cc.resources.load(CONSTANTS.PATH_ZQVAnnouncementPanel, function (err, prefab: cc.Prefab) {
                if (err) {
                    console.log((err));
                    return;
                }
                var newNode = cc.instantiate(prefab);
                cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
                let basePanel = newNode.getComponent(BasePanel);
                Facade.getInstance().registerMediator(new ZQVAnnouncementPanelMediator(MediatorDefine.ZQVAnnouncementPanelMediator, newNode))
                UIPanelCtr.getInstance().pushExistPanelDict(PanelType.ZQVAnnouncementPanel, basePanel);
                UIPanelCtr.getInstance().pushPanel(PanelType.ZQVAnnouncementPanel);
                GameManager.getInstance().closeBlockInput();
                self.cb && self.cb();
            });
        }
        else {
            UIPanelCtr.getInstance().pushPanel(PanelType.ZQVAnnouncementPanel);
            this.cb && this.cb();
        }
    }


    /**
    * 打开v1_1_2版本详细公告页面
    */
    private openV1_1_2AnnouncementPanel() {
        // let self = this;
        // if (!Facade.getInstance().hasMediator(MediatorDefine.V1_1_2AnnouncementPanelMediator)) {
        //     GameManager.getInstance().openBlockInput();
        //     cc.assetManager.loadBundle('v1.1.2Pop', (err, bundle) => {
        //         bundle.load('V1_1_2AnnouncementPanel', cc.Prefab, function (err, prefab) {
        //             if (err) {
        //                 console.log((err));
        //                 return;
        //             }
        //             var newNode = cc.instantiate(prefab);
        //             cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
        //             let basePanel = newNode.getComponent(BasePanel);
        //             Facade.getInstance().registerMediator(new V1_1_2AnnouncementPanelMediator(MediatorDefine.V1_1_2AnnouncementPanelMediator, newNode))
        //             UIPanelCtr.getInstance().pushExistPanelDict(PanelType.V1_1_2AnnouncementPanel, basePanel);
        //             UIPanelCtr.getInstance().pushPanel(PanelType.V1_1_2AnnouncementPanel);
        //             GameManager.getInstance().closeBlockInput();
        //             self.cb && self.cb();
        //         });
        //     });
        // }
        // else {
        //     UIPanelCtr.getInstance().pushPanel(PanelType.V1_1_2AnnouncementPanel);
        //     this.cb && this.cb();
        // }
    }


    /**
   * 打开v1_1_3版本详细公告页面
   */
    private openV1_1_3AnnouncementPanel() {
        // let self = this;
        // if (!Facade.getInstance().hasMediator(MediatorDefine.V1_1_3AnnouncementPanelMediator)) {
        //     GameManager.getInstance().openBlockInput();
        //     cc.assetManager.loadBundle('v1.1.3Pop', (err, bundle) => {
        //         bundle.load('V1_1_3AnnouncementPanel', cc.Prefab, function (err, prefab) {
        //             if (err) {
        //                 console.log((err));
        //                 return;
        //             }
        //             var newNode = cc.instantiate(prefab);
        //             cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
        //             let basePanel = newNode.getComponent(BasePanel);
        //             Facade.getInstance().registerMediator(new V1_1_3AnnouncementPanelMediator(MediatorDefine.V1_1_3AnnouncementPanelMediator, newNode))
        //             UIPanelCtr.getInstance().pushExistPanelDict(PanelType.V1_1_3AnnouncementPanel, basePanel);
        //             UIPanelCtr.getInstance().pushPanel(PanelType.V1_1_3AnnouncementPanel);
        //             GameManager.getInstance().closeBlockInput();
        //             self.cb && self.cb();
        //         });
        //     });
        // }
        // else {
        //     UIPanelCtr.getInstance().pushPanel(PanelType.V1_1_3AnnouncementPanel);
        //     this.cb && this.cb();
        // }
    }

    /**
    * 打开v1_1_3无尽模式版本主页面
    */
    private openEndlessPlayingHomePanel() {
        // let self = this;
        // let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        // med && med.partSwitch(false);
        // if (!Facade.getInstance().hasMediator(MediatorDefine.EndlessPlayingHomePanelMediator)) {
        //     GameManager.getInstance().openBlockInput();
        //     GameManager.getInstance().showReadingTip();
        //     cc.assetManager.loadBundle('v1.1.3Pop', (err, bundle) => {
        //         bundle.load('EndlessPlayingHomePanel', cc.Prefab, function (err, prefab) {
        //             if (err) {
        //                 console.log((err));
        //                 return;
        //             }
        //             GameManager.getInstance().closeReadingTip();
        //             var newNode = cc.instantiate(prefab);
        //             cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
        //             let basePanel = newNode.getComponent(BasePanel);
        //             Facade.getInstance().registerMediator(new EndlessPlayingHomePanelMediator(MediatorDefine.EndlessPlayingHomePanelMediator, newNode))
        //             UIPanelCtr.getInstance().pushExistPanelDict(PanelType.EndlessPlayingHomePanel, basePanel);
        //             UIPanelCtr.getInstance().pushPanel(PanelType.EndlessPlayingHomePanel);
        //             GameManager.getInstance().closeBlockInput();
        //             self.cb && self.cb();
        //         });
        //     });
        // }
        // else {
        //     UIPanelCtr.getInstance().pushPanel(PanelType.EndlessPlayingHomePanel);
        //     this.cb && this.cb();
        // }
    }

    /**
   * 打开v1_1_4版本详细公告页面
   */
    private openV1_1_4AnnouncementPanel() {
        // let self = this;
        // if (!Facade.getInstance().hasMediator(MediatorDefine.V1_1_4AnnouncementPanelMediator)) {
        //     GameManager.getInstance().openBlockInput();
        //     cc.assetManager.loadBundle('v1.1.4Pop', (err, bundle) => {
        //         bundle.load('V1_1_4AnnouncementPanel', cc.Prefab, function (err, prefab) {
        //             if (err) {
        //                 console.log((err));
        //                 return;
        //             }
        //             var newNode = cc.instantiate(prefab);
        //             cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
        //             let basePanel = newNode.getComponent(BasePanel);
        //             Facade.getInstance().registerMediator(new V1_1_4AnnouncementPanelMediator(MediatorDefine.V1_1_4AnnouncementPanelMediator, newNode))
        //             UIPanelCtr.getInstance().pushExistPanelDict(PanelType.V1_1_4AnnouncementPanel, basePanel);
        //             UIPanelCtr.getInstance().pushPanel(PanelType.V1_1_4AnnouncementPanel);
        //             GameManager.getInstance().closeBlockInput();
        //             self.cb && self.cb();
        //         });
        //     });
        // }
        // else {
        //     UIPanelCtr.getInstance().pushPanel(PanelType.V1_1_4AnnouncementPanel);
        //     this.cb && this.cb();
        // }
    }

    /**
    * 打开v1_1_4版本主页面
    */
    private openV1_1_4HomePanel() {
        // let self = this;
        // let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        // med && med.partSwitch(true);
        // if (!Facade.getInstance().hasMediator(MediatorDefine.V1_1_4HomePanelMediator)) {
        //     GameManager.getInstance().openBlockInput();
        //     cc.assetManager.loadBundle('v1.1.4Pop', (err, bundle) => {
        //         bundle.load('V1_1_4HomePanel', cc.Prefab, function (err, prefab) {
        //             if (err) {
        //                 console.log((err));
        //                 return;
        //             }
        //             var newNode = cc.instantiate(prefab);
        //             cc.director.getScene().getChildByName("UIRoot").addChild(newNode);
        //             let basePanel = newNode.getComponent(BasePanel);
        //             Facade.getInstance().registerMediator(new V1_1_4HomePanelMediator(MediatorDefine.V1_1_4HomePanelMediator, newNode))
        //             UIPanelCtr.getInstance().pushExistPanelDict(PanelType.V1_1_4HomePanel, basePanel);
        //             UIPanelCtr.getInstance().pushPanel(PanelType.V1_1_4HomePanel);
        //             GameManager.getInstance().closeBlockInput();
        //             self.cb && self.cb();
        //         });
        //     });
        // }
        // else {
        //     UIPanelCtr.getInstance().pushPanel(PanelType.V1_1_4HomePanel);
        //     this.cb && this.cb();
        // }
    }
}

export class OpenPanelBody {
    type: PanelType;
    callback: Function;
    constructor(t: PanelType, c?: Function) {
        this.type = t;
        this.callback = c;
    }
}