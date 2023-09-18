import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { GunSkinInfo, ConsumablesAlterInfo, ConsumablesType, SongInfo } from "../repositories/Rep";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { CommandDefine } from "./commandDefine";
import AdController from "../../plugin/ADSdk/AdController";


export class UnlockSongCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "UnlockSongCmd");
        let info = notification.getBody();
        let songInfo = info.song as SongInfo
        let callback = info.cal;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        if (songInfo.unlockType == "video") {
            //   console.log("广告解锁一首歌")
            if (AdController.instance.AdSDK.getVideoFlag()) {
                AdController.instance.AdSDK.showVideo((isSucces) => {
                    if (isSucces) {
                        gamePxy.UnlockSong(songInfo.musicId);

                    }
                    callback && callback(isSucces);
                })
            }
        }
        else if (songInfo.unlockType == "coin") {
            //  console.log("钻石解锁一首歌")
            let succeCallback = () => {
                gamePxy.UnlockSong(songInfo.musicId);
                callback && callback(true);
            };
            this.sendNotification(CommandDefine.Consumables,
                {
                    info: new ConsumablesAlterInfo(ConsumablesType.dia, -songInfo.unlockCost),
                    callback: succeCallback
                }
            );
        }

    }
}