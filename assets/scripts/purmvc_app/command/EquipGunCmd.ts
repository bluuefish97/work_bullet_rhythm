import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { GunSkinInfo } from "../repositories/Rep";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";


export class EquipGunCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "EquipGunCmd");
        let gunSkinInfo=notification.getBody() as GunSkinInfo
        let gamePxy=Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        console.log(gunSkinInfo);
        gamePxy.EquipGunSkin(gunSkinInfo.id)
    }
}