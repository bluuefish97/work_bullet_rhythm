
import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import PlayStage from "../../Game/PlayStage";
import UIPanelCtr from "../../util/UIPanelCtr";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { CommandDefine } from "./commandDefine";
import { PanelType } from "../../util/PanelType";
import { OpenPanelBody } from "./OpenPanelCmd";
import { ProxyDefine } from "../proxy/proxyDefine";
import { MusicPxy } from "../proxy/MusicPxy";
import { GamePxy } from "../proxy/GamePxy";
import { MediatorDefine } from "../mediator/mediatorDefine";
import { SongUnitMediator } from "../mediator/SongUnitMediator";
import { FinishMediator } from "../mediator/FinishMediator";
import { ConsumablesAlterInfo, ConsumablesType, SongPlayType, PlaySongInfo, SongInfo } from "../repositories/Rep";
import config, { Platform } from "../../../config/config";
import RecController, { RecState } from "../../RecController";
import AdController from "../../plugin/ADSdk/AdController";
import { CoinPartMediator } from "../mediator/CoinPartMediator";
import { V1_1_4HasPowerPartMediator } from "../mediator/V1_1_4HasPowerPartMediator";


export class FinishCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "FinishCmd");
        let musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        let finishType = notification.getBody();
        console.log("finishType " + finishType);
        PlayStage.getIntance().stageIdie();
        UIPanelCtr.getInstance().clearPanelStack();
        if (finishType != FinishType.ENDLESSEND) {
            let songInfo: SongInfo;     //结束面板要显示的歌曲信息
            let tempUnlockType: string;   //结束面板要显示的歌曲信息配置的解锁类型
            let isHaveNewSong: boolean;
            let arr = musicPxy.getData();
            if (!gamePxy.affordLockSongInfoList(arr)) {
                isHaveNewSong = false;

                songInfo = arr[Math.floor(Math.random() * arr.length)];
            }
            else {
                isHaveNewSong = true;
                songInfo = gamePxy.affordAdInfo(musicPxy.getData());
                console.log("提供的未解锁的歌曲--------------");
                tempUnlockType = songInfo.unlockType;
                //   console.log(songInfo);
                songInfo.unlockType = "video";
            }
            let tempSettle = PlayStage.getIntance().settle();
            let curSongInfo = gamePxy.getCurGameSongInfo();
            if (gamePxy.getSongStarNum(curSongInfo.musicId) < tempSettle.starNum) {
                gamePxy.setSongStarNum(curSongInfo.musicId, tempSettle.starNum);   //更新当前歌的最大星星数
            }
            if (gamePxy.getSongBestScore(curSongInfo.musicId) < tempSettle.scoreNum) {
                gamePxy.setSongBestScore(curSongInfo.musicId, tempSettle.scoreNum);   //更新当前歌的最高分数
            }

            let tempGetGameNew = gamePxy.getGameNew();       //暂时保存用户是否是新玩家状态
            //解算页打开后回调
            let onOpened = function () {
                let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
                med.partSwitch(true);
                let V1_1_4Powermed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HasPowerPartMediator) as V1_1_4HasPowerPartMediator;
                V1_1_4Powermed && V1_1_4Powermed.partSwitch(true);
                let songMed = Facade.getInstance().retrieveMediator(MediatorDefine.SongUnitMediator + "FinishUnit") as SongUnitMediator;
                let FinishMed = Facade.getInstance().retrieveMediator(MediatorDefine.FinishMediator) as FinishMediator;
                AdController.instance.AdSDK.showBanner();
                if (finishType == FinishType.FAIL) {
                    FinishMed.setFailShow(curSongInfo, songInfo, isHaveNewSong, tempUnlockType);
                    FinishMed.IsWin = false;
                    songMed.initEndSongInfo(songInfo, false, isHaveNewSong, false);
                }
                else if (finishType == FinishType.WIN) {

                    let isFirst = gamePxy.getSongIdIsFirstWinState(curSongInfo.musicId);
                    if (isFirst) {
                        console.log("这首歌是首次通关")
                        let lockArr = gamePxy.affordLockSongInfoList(musicPxy.getData());
                        let unlockInfo;
                        if (!isHaveNewSong) {
                            console.log("歌曲全部解锁完");
                            unlockInfo = songInfo;
                            FinishMed.setWinShow(curSongInfo, songInfo, isHaveNewSong, tempUnlockType);
                            songMed.initEndSongInfo(songInfo, false, isHaveNewSong, true);
                        }
                        else {
                            unlockInfo = tempGetGameNew ? lockArr[1] : lockArr[0]
                            gamePxy.UnlockSong(unlockInfo.musicId);
                            songInfo = unlockInfo;
                            FinishMed.setFirstWinShow(curSongInfo, songInfo, isHaveNewSong, tempUnlockType);
                            songMed.initEndSongInfo(songInfo, true, isHaveNewSong, true);
                            console.log("奖励歌曲 ");
                            gamePxy.setSongIdIsFirstWinState(curSongInfo.musicId);
                        }

                    }
                    else {
                        console.log("这首歌已经通关了")
                        FinishMed.setWinShow(curSongInfo, songInfo, isHaveNewSong, tempUnlockType);
                        songMed.initEndSongInfo(songInfo, false, isHaveNewSong, true);
                    }
                    FinishMed.IsWin = true;

                }
                Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(songInfo.musicName, SongPlayType.Immediately));
                Facade.getInstance().sendNotification(CommandDefine.Settle, tempSettle);
                // Facade.getInstance().sendNotification(CommandDefine.v1_1_4GetPowerSettle, PlayStage.getIntance().v1_1_4GetPowerSettle());
                Facade.getInstance().sendNotification(CommandDefine.Consumables, {
                    info: new ConsumablesAlterInfo(ConsumablesType.dia, tempSettle.diaNum),
                    callback: null
                });
            }
            if (gamePxy.getGameNew()) {
                gamePxy.setGameNew();
            }
            Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.FinishPanel, onOpened));
            console.log("RecController.getInstance().recState " + RecController.getInstance().recState);
        }
        else {
            let endlessOpen = () => {
                let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
                med.partSwitch(false);
                let FinishMed = Facade.getInstance().retrieveMediator(MediatorDefine.FinishMediator) as FinishMediator;
                FinishMed.setELPShow();
                let musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
                let lastSongName = musicPxy.getLastPlaySongName();
                Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
                let tempSettle = PlayStage.getIntance().ELPSettle();
                Facade.getInstance().sendNotification(CommandDefine.Settle, tempSettle);
            };
            Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.FinishPanel, endlessOpen));
        }


    }
}

export enum FinishType {
    FAIL = "FAIL",
    WIN = "WIN",
    ENDLESSEND = "ENDLESSEND"
}