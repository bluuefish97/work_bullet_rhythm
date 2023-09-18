
import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import PlayStage, { PlayState } from "../../Game/PlayStage";
import UIPanelCtr from "../../util/UIPanelCtr";
import { SongInfo, PlaySongInfo, SongPlayType, ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { MediatorDefine } from "../mediator/mediatorDefine";
import { CoinPartMediator } from "../mediator/CoinPartMediator";
import GameManager from "../../GameManager";
import { ProxyDefine } from "../proxy/proxyDefine";
import { MusicPxy } from "../proxy/MusicPxy";
import MusicManager from "../../plugin/musicLoader/MusicManager";
import { CommandDefine } from "./commandDefine";
import AudioManager from "../../plugin/audioPlayer/AudioManager";
import { GamePxy } from "../proxy/GamePxy";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import AdController from "../../plugin/ADSdk/AdController";
import Load from "../../Load";
import { PoolManager } from "../../util/PoolManager";
import config, { Platform } from "../../../config/config";
import GameLoad from "../../GameLoad";
import { CONSTANTS } from "../../Constants";

import { V1_1_4HasPowerPartMediator } from "../mediator/V1_1_4HasPowerPartMediator";

export class StartSongCmd extends SimpleCommand {
    private info: SongInfo;
    private isLoadedSuccee: boolean = false;       //场景是否加载成功
    private guideTimeout: any;
    public execute(notification: INotification) {
        console.log("execute:" + "StartSongCmd");
        GameManager.getInstance().isStartSongReadyState = true;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        let musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        this.info = notification.getBody() as SongInfo;
        //  console.log("上一次的歌曲" + musicPxy.getLastPlaySongName());

        let skinID;
        // console.log("上一次的场景皮肤下标" + gamePxy.lastStageSkinID);
        if (musicPxy.getLastPlaySongName() == this.info.musicName) {
            if (!gamePxy.lastStageSkinID) {
                //首次玩上次打开的歌曲
                skinID = Math.floor(Math.random() * 4);
                // console.log("首次玩上次打开的歌曲   skinID  " + skinID);

            }
            else {
                skinID = gamePxy.lastStageSkinID;
                //  console.log("重玩刚刚打开的歌曲   skinID  " + skinID);
            }

        }
        else {
            skinID = Math.floor(Math.random() * 4);
            // console.log("重新随机个皮肤下标"+skinID);

            if (skinID == gamePxy.lastStageSkinID) {
                skinID = (gamePxy.lastStageSkinID + 1) % 4;
            }
            //  console.log("最新的随机皮肤下标"+skinID);

        }
        gamePxy.lastStageSkinID = skinID;


        gamePxy.saveCurGameSongInfo(this.info);
        musicPxy.setLastPlaySongName(this.info.musicName);
        gamePxy.setSongIdIsNewState(this.info.musicId);
        AudioManager.GetInstance(AudioManager).player.stopMusic();
        ReportAnalytics.getInstance().reportAnalytics("Song_Massage", "Song_Click", this.info.musicName);
        let pointRes: any = null;
        let ClipRes: any = null;
        let gameLoadSucces: boolean = false;

        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        med && med.partSwitch(false);
        let V1_1_4Powermed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HasPowerPartMediator) as V1_1_4HasPowerPartMediator;
        V1_1_4Powermed && V1_1_4Powermed.partSwitch(false);
        let self = this;
        if (cc.director.getScene().name != "home" && cc.director.getScene().name != "load" && cc.director.getScene().name != "New Node") {
            GameManager.getInstance().openPurdah((gameLoad) => {          //从结算页开始游戏
                UIPanelCtr.getInstance().clearPanelStack();
                ReportAnalytics.getInstance().reportAnalytics("View_Show", "GameStartLoading_Show", 1);
                let tempCount = 0;
                gameLoad.isCancalTryConnet = false;
                var loadSong = setInterval(() => {
                    tempCount++;
                    gameLoad.showProcess(tempCount, 100)
                    if (tempCount >= 100) {
                        clearInterval(loadSong);
                        gameLoadSucces = true;
                        if (ClipRes && pointRes) {
                            console.log("场景后加载完成！！");
                            PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
                            return;
                        } else {
                            setTimeout(() => {
                                if (!ClipRes || !pointRes) {
                                    //  GameManager.getInstance().showMsgTip("请检查网络连接！！！！", 3);
                                    var loadSongtask = setInterval(() => {
                                        if (gameLoad.isCancalTryConnet || this.isLoadedSuccee)   //加载页面关闭了，不再请求加载了
                                        {
                                            clearInterval(loadSongtask);
                                            return;
                                        }
                                        else {
                                            MusicManager.GetInstance(MusicManager).Loader.LoadPoint(this.info.json_normal, (res) => {
                                                pointRes = res;
                                                if (ClipRes && !gameLoad.isCancalTryConnet && !this.isLoadedSuccee) {
                                                    clearInterval(loadSongtask);
                                                    console.log("节奏点后加载完成！！");
                                                    PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
                                                }
                                            });
                                            let url = this.info.musicFile
                                            MusicManager.GetInstance(MusicManager).Loader.LoadSongClip(url, this.info.musicId, (res) => {
                                                this.sendNotification(CommandDefine.PlaySongResponce, new PlaySongInfo(this.info.musicName, SongPlayType.Wait));
                                                ClipRes = res;
                                                if (pointRes && !gameLoad.isCancalTryConnet && !this.isLoadedSuccee) {
                                                    clearInterval(loadSongtask);
                                                    console.log("歌曲文件后加载完成！！");
                                                    PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
                                                }
                                            });
                                        }
                                    }, 5000)
                                }
                            }, 10000)

                        }
                    }
                }, 1)
            });
        }
        else {
            var time2 = new Date();
            console.log("开始加载游戏场景：  " + time2);
            if (gamePxy.getGameNew()) {
                cc.director.preloadScene("guideGame", function (completedCount, totalCount, item) {
                    cc.director.getScene().getChildByName("Canvas").getComponent(Load).showProcess(completedCount, totalCount, item)
                }, () => {
                    let isFirstOffline = true;
                    cc.director.loadScene("guideGame", () => {
                        gameLoadSucces = true;
                        console.log("guideGame： gameLoadSucces ");
                        let UIRoot = cc.director.getScene().getChildByName("UIRoot");
                        UIRoot.setPosition(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);
                        let coinPart = cc.director.getScene().getChildByName("CoinPart");
                        Facade.getInstance().registerMediator(new CoinPartMediator(MediatorDefine.CoinPartMediator, coinPart));
                        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
                        med && med.partSwitch(false);
                        cc.resources.preload(CONSTANTS.PATH_SettlePanel);
                        if (!ClipRes || !pointRes) {
                            this.guideTimeout = setTimeout(() => {
                                //  GameManager.getInstance().showMsgTip("请检查网络连接！！！！", 3)
                                console.log("请检查网络连接！！！！");
                                var loadSongtask = setInterval(() => {
                                    let forward1 = new Date();
                                    console.log("开始加载节奏点：  " + forward1);
                                    MusicManager.GetInstance(MusicManager).Loader.LoadPoint(this.info.json_normal, (res) => {
                                        let forward2 = new Date()
                                        console.log("完成加载节奏点：  " + forward2);
                                        console.log("节奏点加载耗时:  " + (forward2.getTime() - forward1.getTime()));
                                        pointRes = res;
                                        if (ClipRes) {
                                            clearInterval(loadSongtask);
                                            console.log("loadSongtask    节奏点后加载完成！！");
                                            cc.director.loadScene("guideGame", () => {
                                                musicPxy.checkTable();
                                                console.log("引导场景后加载完成！！");
                                                PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
                                                ReportAnalytics.getInstance().reportAnalytics("View_Show", "GameGuid_Show", 1);
                                            });
                                        }
                                    });
                                    let forward3 = new Date()
                                    console.log("loadSongtask     开始加载歌曲文件：  " + forward3);
                                    let url = this.info.musicFile
                                    MusicManager.GetInstance(MusicManager).Loader.LoadSongClip(url, this.info.musicId, (res) => {
                                        let forward4 = new Date()
                                        console.log("完成加载歌曲文件:  " + forward4);
                                        console.log("歌曲加载耗时:  " + (forward4.getTime() - forward3.getTime()));
                                        this.sendNotification(CommandDefine.PlaySongResponce, new PlaySongInfo(this.info.musicName, SongPlayType.Wait));
                                        ClipRes = res;
                                        if (pointRes) {
                                            clearInterval(loadSongtask);
                                            console.log("歌曲文件后加载完成！！");
                                            cc.director.loadScene("guideGame", () => {
                                                musicPxy.checkTable();
                                                console.log("引导场景后加载完成！！");
                                                PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
                                                ReportAnalytics.getInstance().reportAnalytics("View_Show", "GameGuid_Show", 1);
                                            });
                                        }
                                    });

                                }, 5000)
                            }, 10000);
                        }
                        else {
                            let UIRoot = cc.director.getScene().getChildByName("UIRoot");
                            UIRoot.setPosition(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);
                            let coinPart = cc.director.getScene().getChildByName("CoinPart");
                            Facade.getInstance().registerMediator(new CoinPartMediator(MediatorDefine.CoinPartMediator, coinPart));
                            let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
                            med && med.partSwitch(false);
                            if (ClipRes && pointRes) {
                                console.log("引导场景后加载完成！！");
                                PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
                                ReportAnalytics.getInstance().reportAnalytics("View_Show", "GameGuid_Show", 1);
                            }
                        }
                    });

                });
            }
            else {
                PoolManager.instance.resetDictPool();
                GameManager.getInstance().openPurdah((gameLoad: GameLoad) => {
                    UIPanelCtr.getInstance().clearPanelStack();
                    ReportAnalytics.getInstance().reportAnalytics("View_Show", "GameStartLoading_Show", 1);
                    gameLoad.isCancalTryConnet = false;
                    cc.director.preloadScene("game", function (completedCount, totalCount, item) {
                        gameLoad.showProcess(completedCount, totalCount)
                    }, () => {
                        cc.director.loadScene("game", () => {
                            gameLoadSucces = true;
                            GameManager.getInstance().node.setPosition(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);
                            GameManager.getInstance().node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
                            let UIRoot = cc.director.getScene().getChildByName("UIRoot");
                            UIRoot.setPosition(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);
                            if (ClipRes && pointRes) {
                                console.log("场景后加载完成！！");

                                PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
                                gameLoad.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
                            }
                            else {
                                this.guideTimeout = setTimeout(() => {
                                    if (!ClipRes || !pointRes) {
                                        GameManager.getInstance().showMsgTip("请检查网络连接！！！！", 3)
                                        var loadSongtask = setInterval(() => {
                                            if (gameLoad.isCancalTryConnet || this.isLoadedSuccee)   //加载页面关闭了，不再请求加载了
                                            {
                                                console.log("加载页面关闭了，不再请求加载了");
                                                clearInterval(loadSongtask);
                                                return;
                                            }
                                            else {
                                                MusicManager.GetInstance(MusicManager).Loader.LoadPoint(this.info.json_normal, (res) => {
                                                    pointRes = res;
                                                    if (ClipRes && !gameLoad.isCancalTryConnet && !this.isLoadedSuccee) {
                                                        clearInterval(loadSongtask);
                                                        console.log("节奏点后加载完成！！");
                                                        PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
                                                    }
                                                });
                                                let url = this.info.musicFile
                                                MusicManager.GetInstance(MusicManager).Loader.LoadSongClip(url, this.info.musicId, (res) => {
                                                    this.sendNotification(CommandDefine.PlaySongResponce, new PlaySongInfo(this.info.musicName, SongPlayType.Wait));
                                                    ClipRes = res;
                                                    if (pointRes && !gameLoad.isCancalTryConnet && !this.isLoadedSuccee) {
                                                        clearInterval(loadSongtask);
                                                        console.log("歌曲文件后加载完成！！");
                                                        PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
                                                    }
                                                });
                                            }


                                        }, 5000)
                                    }
                                }, 10000)

                            }

                        });
                    });
                })
            }
        }

        let forward1 = new Date();
        console.log("开始加载节奏点：  " + forward1);
        MusicManager.GetInstance(MusicManager).Loader.LoadPoint(this.info.json_normal, (res) => {
            let forward2 = new Date()
            console.log("完成加载节奏点：  " + forward2);
            console.log("节奏点加载耗时:  " + (forward2.getTime() - forward1.getTime()));
            pointRes = res;
            if (ClipRes && gameLoadSucces) {
                console.log("节奏点后加载完成！！");
                clearTimeout(this.guideTimeout);
                PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
            }
        });
        let forward3 = new Date()
        console.log("开始加载歌曲文件：  " + forward3);
        let url = this.info.musicFile
        MusicManager.GetInstance(MusicManager).Loader.LoadSongClip(url, this.info.musicId, (res) => {
            let forward4 = new Date()
            console.log("完成加载歌曲文件:  " + forward4);
            console.log("歌曲加载耗时:  " + (forward4.getTime() - forward3.getTime()));
            this.sendNotification(CommandDefine.PlaySongResponce, new PlaySongInfo(this.info.musicName, SongPlayType.Wait));
            ClipRes = res;
            if (pointRes && gameLoadSucces) {
                console.log("歌曲文件后加载完成！！");
                clearTimeout(this.guideTimeout);
                PlayStage.getIntance().stageConfig(ClipRes, pointRes, this.info.ex_lv, this.onStageConsted.bind(this), skinID);
            }
        });

    }

    //舞台搭建成功后
    private async onStageConsted() {
        console.log("舞台搭建成功!!!");
        this.isLoadedSuccee = true;
        this.sendNotification(CommandDefine.StartSongSucceedResponce, this.info.musicId);
        GameManager.getInstance().closePurdah();
        // if (ASCAd.getInstance().getErrBannerFlag()) {
        //     let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        //     med.partSwitch(true);
        //     AdController.instance.AdSDK.hideBanner();
        //     let errBannerCal = () => {
        //         AdController.instance.AdSDK.showBanner()
        //         med.partSwitch(false);
        //         GameManager.getInstance().isStartSongReadyState = false;
        //         PlayStage.getIntance().showPlayHardLv();
        //         AdController.instance.AdSDK.showBanner();
        //         AdController.instance.bannnerShowIng = true;
        //         ReportAnalytics.getInstance().reportAnalytics("View_Show", "GameStart_Show", 1);
        //         ASCAd.getInstance().showNativeIcon(200, 200, cc.winSize.width * 0.083, cc.winSize.height * 4 / 5);
        //     }
        //     let callback = () => {
        //         Facade.getInstance().sendNotification(CommandDefine.Consumables, {
        //             info: new ConsumablesAlterInfo(ConsumablesType.dia, 100),
        //             callback: errBannerCal
        //         });
        //     }
        //     ASCAd.getInstance().showErrBanner(callback)
        // } else {
           
        // }
        if (await  AdController.instance.AdSDK.getBlockFlag(1,100,2100)) {
            AdController.instance.AdSDK.showBlock(1,100,2100);
        }

        if ( await AdController.instance.AdSDK.getBlockFlag(2,800,2100)) {
            AdController.instance.AdSDK.showBlock(2,800,2100);
        }

        PlayStage.getIntance().showPlayHardLv();
        AdController.instance.AdSDK.showBanner();
        AdController.instance.bannnerShowIng = true;
        ReportAnalytics.getInstance().reportAnalytics("View_Show", "GameStart_Show", 1);
    }
}