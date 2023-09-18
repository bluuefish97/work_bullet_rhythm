import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { EndlessPlayingPxy } from "../proxy/EndlessPlayingPxy";
import { SongInfo, PlaySongInfo, SongPlayType } from "../repositories/Rep";
import GameManager from "../../GameManager";
import { GamePxy } from "../proxy/GamePxy";
import AudioManager from "../../plugin/audioPlayer/AudioManager";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import { MediatorDefine } from "../mediator/mediatorDefine";
import { CoinPartMediator } from "../mediator/CoinPartMediator";
import UIPanelCtr from "../../util/UIPanelCtr";
import PlayStage, { PlayPattern } from "../../Game/PlayStage";
import MusicManager from "../../plugin/musicLoader/MusicManager";
import { CommandDefine } from "./commandDefine";
import { PoolManager } from "../../util/PoolManager";
import GameLoad from "../../GameLoad";
import config, { Platform } from "../../../config/config";
import AdController from "../../plugin/ADSdk/AdController";


const { ccclass, property } = cc._decorator;

@ccclass
export default class StartEndlessPlayingCmd extends SimpleCommand {
    private isLoadedSuccee: boolean = false;       //场景是否加载成功
    public execute(notification: INotification): void {
        console.log("execute:" + "StartEndlessPlayingCmd");
        let ELPPxy = Facade.getInstance().retrieveProxy(ProxyDefine.EndlessPlayingPxy) as EndlessPlayingPxy;
        ELPPxy.postPhaseSongInfos(() => {
            let firstSongInfo = ELPPxy.provideFirstChallenge();
            this.startFirstSong(firstSongInfo);
            this.sendNotification(CommandDefine.ELP_PreLoadSongAsset);
        });
    }
    private startFirstSong(firstSongInfo: SongInfo) {
        GameManager.getInstance().isStartSongReadyState = true;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        let stagerSKinIdx = Math.floor(Math.random() * 4);
        // console.log("重新随机个皮肤下标"+skinID);
        if (stagerSKinIdx == gamePxy.lastStageSkinID) {
            stagerSKinIdx = (gamePxy.lastStageSkinID + 1) % 4;
        }
        gamePxy.lastStageSkinID = stagerSKinIdx;
        AudioManager.GetInstance(AudioManager).player.stopMusic();
        //  ReportAnalytics.getInstance().reportAnalytics("Song_Massage", "Song_Click", this.info.musicName);
        let pointRes: any = null;
        let ClipRes: any = null;
        let gameLoadSucces: boolean = false;

        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        med && med.partSwitch(false);
        let self = this;
        if (cc.director.getScene().name != "home" && cc.director.getScene().name != "load" && cc.director.getScene().name != "New Node") {
            GameManager.getInstance().openPurdah((gameLoad) => {          //从结算页开始游戏
                UIPanelCtr.getInstance().clearPanelStack();
                //  ReportAnalytics.getInstance().reportAnalytics("View_Show", "GameStartLoading_Show", 1);
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
                            PlayStage.getIntance().stageConfig(ClipRes, pointRes, firstSongInfo.ex_lv, this.onStageConsted.bind(this), stagerSKinIdx, PlayPattern.Endless);
                        } else {
                            setTimeout(() => {
                                if (!ClipRes || !pointRes) {
                                    // GameManager.getInstance().showMsgTip("请检查网络连接！！！！", 3);
                                    var loadSongtask = setInterval(() => {
                                        if (gameLoad.isCancalTryConnet || this.isLoadedSuccee)   //加载页面关闭了，不再请求加载了
                                        {
                                            clearInterval(loadSongtask);
                                            return;
                                        }
                                        else {
                                            MusicManager.GetInstance(MusicManager).Loader.LoadPoint(firstSongInfo.json_normal, (res) => {
                                                pointRes = res;
                                                if (ClipRes && !gameLoad.isCancalTryConnet && !this.isLoadedSuccee) {
                                                    clearInterval(loadSongtask);
                                                    console.log("节奏点后加载完成！！");
                                                    PlayStage.getIntance().stageConfig(ClipRes, pointRes, firstSongInfo.ex_lv, this.onStageConsted.bind(this), stagerSKinIdx, PlayPattern.Endless);
                                                }
                                            });
                                            let url = firstSongInfo.musicFile
                                            MusicManager.GetInstance(MusicManager).Loader.LoadSongClip(url, firstSongInfo.musicId, (res) => {
                                                this.sendNotification(CommandDefine.PlaySongResponce, new PlaySongInfo(firstSongInfo.musicName, SongPlayType.Wait));
                                                ClipRes = res;
                                                if (pointRes && !gameLoad.isCancalTryConnet && !this.isLoadedSuccee) {
                                                    clearInterval(loadSongtask);
                                                    console.log("歌曲文件后加载完成！！");
                                                    PlayStage.getIntance().stageConfig(ClipRes, pointRes, firstSongInfo.ex_lv, this.onStageConsted.bind(this), stagerSKinIdx, PlayPattern.Endless);
                                                }
                                            });
                                        }
                                    }, 5000)
                                }
                            }, 3000)

                        }

                    }
                }, 1)
            });
        }
        else {
            var time2 = new Date();
            console.log("开始加载游戏场景：  " + time2);
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

                            PlayStage.getIntance().stageConfig(ClipRes, pointRes, firstSongInfo.ex_lv, this.onStageConsted.bind(this), stagerSKinIdx, PlayPattern.Endless);
                            gameLoad.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
                        }
                        else {
                            setTimeout(() => {
                                if (!ClipRes || !pointRes) {
                                    // GameManager.getInstance().showMsgTip("请检查网络连接！！！！", 3)

                                    var loadSongtask = setInterval(() => {
                                        if (gameLoad.isCancalTryConnet || this.isLoadedSuccee)   //加载页面关闭了，不再请求加载了
                                        {
                                            console.log("加载页面关闭了，不再请求加载了");
                                            clearInterval(loadSongtask);
                                            return;
                                        }
                                        else {
                                            MusicManager.GetInstance(MusicManager).Loader.LoadPoint(firstSongInfo.json_normal, (res) => {
                                                pointRes = res;
                                                if (ClipRes && !gameLoad.isCancalTryConnet && !this.isLoadedSuccee) {
                                                    clearInterval(loadSongtask);
                                                    console.log("节奏点后加载完成！！");
                                                    PlayStage.getIntance().stageConfig(ClipRes, pointRes, firstSongInfo.ex_lv, this.onStageConsted.bind(this), stagerSKinIdx, PlayPattern.Endless);
                                                }
                                            });
                                            let url = firstSongInfo.musicFile
                                            MusicManager.GetInstance(MusicManager).Loader.LoadSongClip(url, firstSongInfo.musicId, (res) => {
                                                this.sendNotification(CommandDefine.PlaySongResponce, new PlaySongInfo(firstSongInfo.musicName, SongPlayType.Wait));
                                                ClipRes = res;
                                                if (pointRes && !gameLoad.isCancalTryConnet && !this.isLoadedSuccee) {
                                                    clearInterval(loadSongtask);
                                                    console.log("歌曲文件后加载完成！！");
                                                    PlayStage.getIntance().stageConfig(ClipRes, pointRes, firstSongInfo.ex_lv, this.onStageConsted.bind(this), stagerSKinIdx, PlayPattern.Endless);
                                                }
                                            });
                                        }


                                    }, 5000)
                                }
                            }, 3000)

                        }

                    });
                });
            })
        }

        let forward1 = new Date();
        console.log("开始加载节奏点：  " + forward1);
        MusicManager.GetInstance(MusicManager).Loader.LoadPoint(firstSongInfo.json_normal, (res) => {
            let forward2 = new Date()
            console.log("完成加载节奏点：  " + forward2);
            console.log("节奏点加载耗时:  " + (forward2.getTime() - forward1.getTime()));
            pointRes = res;
            if (ClipRes && gameLoadSucces) {
                console.log("节奏点后加载完成！！");
                PlayStage.getIntance().stageConfig(ClipRes, pointRes, firstSongInfo.ex_lv, this.onStageConsted.bind(this), stagerSKinIdx, PlayPattern.Endless);
            }
        });
        let forward3 = new Date()
        console.log("开始加载歌曲文件：  " + forward3);
        let url = firstSongInfo.musicFile
        MusicManager.GetInstance(MusicManager).Loader.LoadSongClip(url, firstSongInfo.musicId, (res) => {
            let forward4 = new Date()
            console.log("完成加载歌曲文件:  " + forward4);
            console.log("歌曲加载耗时:  " + (forward4.getTime() - forward3.getTime()));
            this.sendNotification(CommandDefine.PlaySongResponce, new PlaySongInfo(firstSongInfo.musicName, SongPlayType.Wait));
            ClipRes = res;
            if (pointRes && gameLoadSucces) {
                console.log("歌曲文件后加载完成！！");
                PlayStage.getIntance().stageConfig(ClipRes, pointRes, firstSongInfo.ex_lv, this.onStageConsted.bind(this), stagerSKinIdx, PlayPattern.Endless);
            }
        });

    }
    //舞台搭建成功后
    private onStageConsted() {
        console.log("舞台搭建成功!!!");
        this.isLoadedSuccee = true;
        GameManager.getInstance().closePurdah();
        PlayStage.getIntance().showPlayHardLv();
        AdController.instance.AdSDK.showBanner();
        ReportAnalytics.getInstance().reportAnalytics("View_Show", "Infinite_Games_Show", 1);
    }
}