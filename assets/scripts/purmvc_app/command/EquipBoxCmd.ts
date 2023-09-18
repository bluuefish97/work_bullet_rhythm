import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { GunSkinInfo, BoxSkinInfo } from "../repositories/Rep";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";


export class EquipBoxCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "EquipBoxCmd");
        let boxSkinInfo=notification.getBody() as BoxSkinInfo
        let gamePxy=Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        console.log(boxSkinInfo);
        gamePxy.EquipBoxSkin(boxSkinInfo.id)
    }
}