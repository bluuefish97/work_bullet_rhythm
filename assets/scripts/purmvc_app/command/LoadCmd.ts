import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import GameManager from "../../GameManager";
import { ProxyDefine } from "../proxy/proxyDefine";
import { MusicPxy } from "../proxy/MusicPxy";
import { MediatorDefine } from "../mediator/mediatorDefine";
import { PanelType } from "../../util/PanelType";
import UIPanelCtr from "../../util/UIPanelCtr";
import { GamePxy } from "../proxy/GamePxy";
import { CoinPartMediator } from "../mediator/CoinPartMediator";
import { CommandDefine } from "./commandDefine";
import { OpenPanelBody } from "./OpenPanelCmd";
import { PlaySongInfo, SongPlayType, SongInfo } from "../repositories/Rep";
import { CONSTANTS } from "../../Constants";
import AdController from "../../plugin/ADSdk/AdController";
import config, { Platform } from "../../../config/config";
import Load from "../../Load";
import { PoolManager } from "../../util/PoolManager";
import { V1_1_4HasPowerPartMediator } from "../mediator/V1_1_4HasPowerPartMediator";
import { V1_1_4Pxy } from "../proxy/V1_1_4Pxy";
import { ActivityEventState } from "../proxy/ActivityPxy";

export class LoadCmd extends SimpleCommand {
    private gamePxy: GamePxy;
    private musicPxy: MusicPxy;
    private v1_1_4Pxy: V1_1_4Pxy;
    private guideJson: any;
    private guideClip: any;
    private guideSongInfo: any;
    private onLoadCallback: Function = null;
    private time2;
    public execute(notification: INotification): void {
        console.log("execute:" + "LoadCmd");
        console.log("平台:  " + config.platform);
        this.onLoadCallback = notification.getBody();
        this.musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        this.gamePxy.parseGameAsync(() => { });
        this.v1_1_4Pxy = Facade.getInstance().retrieveProxy(ProxyDefine.V1_1_4Pxy) as V1_1_4Pxy;
        this.v1_1_4Pxy.getEventState();
        if (this.gamePxy.getGameNew()) {
            let info = {
                coverFile: "https://tencentcnd.minigame.xplaymobile.com/MusicGames/Music_zdjz/fm/zdjz15fm.jpg",
                ex_new: "Y",
                json_normal: "https://tencentcnd.minigame.xplaymobile.com/MusicGames/Music_zdjz/json/zdjz15normal.json",
                musicFile: "https://tencentcnd.minigame.xplaymobile.com/MusicGames/Music_zdjz/zdjz15.mp3",
                musicId: "zdjz15",
                musicName: "旧梦一场",
                orderNumber: "0",
                singerName: "阿悠悠",
                style: "节奏",
                unlockCost: "0",
                unlockType: "coin",
            }
            Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, info);
        }
        else {
            this.time2 = new Date();
            console.log("开始加载场景：  " + this.time2);
            PoolManager.instance.resetDictPool();
            cc.director.preloadScene("home", function (completedCount, totalCount, item) {
                if (cc.director.getScene().getChildByName("Canvas").getComponent(Load)) {
                    cc.director.getScene().getChildByName("Canvas").getComponent(Load).showProcess(completedCount, totalCount, item)
                }
            }, () => {
                if (!this.musicPxy.checkTable()) {
                    //  GameManager.getInstance().showMsgTip("请检查网络连接！！！！", 3)
                    var loadSongtask = setInterval(() => {
                        if (!this.musicPxy.checkTable()) {

                        } else {
                            clearInterval(loadSongtask);
                            cc.director.loadScene("home", this.onSceneLoad.bind(this));
                        }
                    }, 1000)
                } else {
                    cc.director.loadScene("home", this.onSceneLoad.bind(this));
                }


            });
        }
    }

    //场景加载成功后
    private onSceneLoad() {
        this.onLoadCallback && this.onLoadCallback();
        let time3 = new Date();
        console.log("加载场景加载成功!!：  " + time3);
        console.log("加载场景耗时!!：  " + (time3.getTime() - this.time2.getTime()));
        let UIRoot = cc.director.getScene().getChildByName("UIRoot");
        UIRoot.setPosition(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);
        cc.game.addPersistRootNode(UIRoot);
        this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.HomePartView));
        this.musicPxy.postTable();
        GameManager.getInstance().closeBlockInput();
        let coinPart = cc.director.getScene().getChildByName("CoinPart");
        Facade.getInstance().registerMediator(new CoinPartMediator(MediatorDefine.CoinPartMediator, coinPart));
        let hasPowerPart = cc.director.getScene().getChildByName("HasPowerPart");
        Facade.getInstance().registerMediator(new V1_1_4HasPowerPartMediator(MediatorDefine.V1_1_4HasPowerPartMediator, hasPowerPart));
        let arr = this.musicPxy.getData();
        if (!this.gamePxy.getIsSigned()) {
            this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.SignPanel));
            CONSTANTS.isAutoPop = true;
            let lastSongName = this.musicPxy.getLastPlaySongName();
            Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
        }
        else {
            // //玩家当天已经签到
            // if (this.gamePxy.ZQA_checkValidTime())    //在中秋的活动日期内
            // {
            //     this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.ZQVAnnouncementPanel));
            //     let lastSongName = this.musicPxy.getLastPlaySongName();
            //     Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
            // }
            // else {                         //正常的弹专属推荐
            //     if (this.gamePxy.V1_1_2CheckIsNeedOpenNofPanl()) {
            //         this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.V1_1_2AnnouncementPanel));
            //         let lastSongName = this.musicPxy.getLastPlaySongName();
            //         Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
            //     }
            //     else {
            //         if (this.gamePxy.affordLockSongInfoList(arr)) {
            //     this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.SongRecommendPanel));
            // }
            //     else {
            //     let lastSongName = this.musicPxy.getLastPlaySongName();
            //     Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
            // }

            //     }

            // }

            let normalCal = () => {
                if (this.gamePxy.affordLockSongInfoList(arr)) {
                    this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.SongRecommendPanel));
                }
                else {
                    let lastSongName = this.musicPxy.getLastPlaySongName();
                    Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
                }
            }

            // if (this.gamePxy.V1_1_3CheckIsNeedOpenNofPanl()) {
            //     this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.V1_1_3AnnouncementPanel));
            //     let lastSongName = this.musicPxy.getLastPlaySongName();
            //     Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
            // }
            if (this.v1_1_4Pxy.V1_1_4EventState != ActivityEventState.END && !this.v1_1_4Pxy.getSettleAnnoucePanelPut()) {
                this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.V1_1_4AnnouncementPanel));
                let lastSongName = this.musicPxy.getLastPlaySongName();
                Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
                this.v1_1_4Pxy.setSettleAnnoucePanelPut();
            }
            else {
                normalCal();
            }
        }
        cc.resources.preload(CONSTANTS.PATH_SettlePanel);
        cc.resources.preload(CONSTANTS.PATH_achievementPanel);
        cc.assetManager.loadBundle('remoteSkins', (err, bundle) => {
            bundle.preload("GunShowStage", function (err, prefab: cc.Prefab) {
            });
        });
        AdController.instance.AdSDK.showBanner();
    }


}