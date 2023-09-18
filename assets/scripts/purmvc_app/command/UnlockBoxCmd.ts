import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { GunSkinInfo, ConsumablesAlterInfo, ConsumablesType, BoxSkinInfo } from "../repositories/Rep";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { CommandDefine } from "./commandDefine";
import AdController from "../../plugin/ADSdk/AdController";


export class UnlockBoxCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "UnlockBoxCmd");
        let boxSkinInfo = notification.getBody() as BoxSkinInfo
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        console.log(boxSkinInfo);
        if (boxSkinInfo.unlockType == "ad") {
            console.log("广告解锁一个方块的皮肤")

            if (AdController.instance.AdSDK.getVideoFlag()) {
                AdController.instance.AdSDK.showVideo((isSucces) => {
                    if (isSucces) {
                        gamePxy.UnlockBoxSkin(boxSkinInfo.id);
                    }
                })

            }

        }
        else if (boxSkinInfo.unlockType == "dia") {
            console.log("钻石解锁一个方块的皮肤")

            let succeCallback = () => { gamePxy.UnlockBoxSkin(boxSkinInfo.id); };
            this.sendNotification(CommandDefine.Consumables,
                {
                    info: new ConsumablesAlterInfo(ConsumablesType.dia, -boxSkinInfo.unlockVal),
                    callback: succeCallback
                }
            );
        }


    }
}