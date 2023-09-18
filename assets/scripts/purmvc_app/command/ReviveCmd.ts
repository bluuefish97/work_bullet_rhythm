import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import PlayStage from "../../Game/PlayStage";
import UIPanelCtr from "../../util/UIPanelCtr";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { MediatorDefine } from "../mediator/mediatorDefine";
import { CoinPartMediator } from "../mediator/CoinPartMediator";
import { CommandDefine } from "./commandDefine";
import { AchiUpdateInfo } from "./UpdateAchiProCmd";
import AdController from "../../plugin/ADSdk/AdController";


export class ReviveCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "ReviveCmd");
        let wayType = notification.getBody()
        if (wayType == "ad") {
            console.log("看广告复活")
            if (AdController.instance.AdSDK.getVideoFlag()) {
                AdController.instance.AdSDK.showVideo((isSucces) => {
                    if (isSucces) {
                        this.revive();
                        this.sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(4, 1))
                    }
                    this.sendNotification(CommandDefine.ReviveResponce, isSucces)
                })
            }

        }
        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        med.partSwitch(false);

    }

    private revive() {
        UIPanelCtr.getInstance().clearPanelStack();
        PlayStage.getIntance().revive();
    }
}