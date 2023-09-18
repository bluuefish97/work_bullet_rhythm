import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { GunSkinInfo } from "../repositories/Rep";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import AdController from "../../plugin/ADSdk/AdController";


export class GetMapSkinChipCmd extends SimpleCommand {
    public  execute(notification: INotification):  void {
        console.log("execute:" + "GetMapSkinChipCmd");
        let body = notification.getBody()
        let info = body.info as GetMapSkinChipInfo
        let type = body.type;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        if (type == "video") {
            if (AdController.instance.AdSDK.getVideoFlag()) {
                AdController.instance.AdSDK.showVideo((isSucces) => {
                    if (isSucces) {
                        gamePxy.setMapSkinChipNumId(info.mapId, info.chipVal);
                    }
                })

            }
          

        }
        else if (type == "voucher") {
            gamePxy.setMapSkinChipNumId(info.mapId, info.chipVal);
        }


    }
}

export class GetMapSkinChipInfo {
    mapId: number;
    chipVal: number;
    constructor(id: number, val: number) {
        this.mapId = id;
        this.chipVal = val;
    }
}
