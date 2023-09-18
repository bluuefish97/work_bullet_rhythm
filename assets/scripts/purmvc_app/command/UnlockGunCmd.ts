import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { GunSkinInfo, ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { CommandDefine } from "./commandDefine";
import AdController from "../../plugin/ADSdk/AdController";


export class UnlockGunCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "UnluckGunCmd");
        let gunSkinInfo = notification.getBody() as GunSkinInfo
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        console.log(gunSkinInfo);
        if (gunSkinInfo.unlockType == "ad") {
            console.log("广告解锁一个枪的皮肤")

            if (AdController.instance.AdSDK.getVideoFlag()) {
                AdController.instance.AdSDK.showVideo((isSucces) => {
                    if (isSucces) {
                        gamePxy.UnlockGunSkin(gunSkinInfo.id);
                    }
                })

            }

        }
        else if (gunSkinInfo.unlockType == "dia") {
            console.log("钻石解锁一个枪的皮肤")

            let succeCallback = () => { gamePxy.UnlockGunSkin(gunSkinInfo.id); };
            this.sendNotification(CommandDefine.Consumables,
                {
                    info: new ConsumablesAlterInfo(ConsumablesType.dia, -gunSkinInfo.unlockVal),
                    callback: succeCallback
                }
            );
        } else if (gunSkinInfo.unlockType == "limit") {
            console.log("解锁中秋活动的枪的皮肤");
            gamePxy.UnlockGunSkin(gunSkinInfo.id);

        } else if (gunSkinInfo.unlockType == "v1_1_3Vlimit" || gunSkinInfo.unlockType == "v1_1_3Flimit") {
            console.log("解锁ELP活动赠送枪的皮肤");
            gamePxy.UnlockGunSkin(gunSkinInfo.id);

        }


    }
}