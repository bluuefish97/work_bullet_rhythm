import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";


export class UseMapSkinCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "UseMapSkinCmd");
        let idx=notification.getBody() as number
        let gamePxy=Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        gamePxy.setMapSkinOfUsingId(idx)
    }
}