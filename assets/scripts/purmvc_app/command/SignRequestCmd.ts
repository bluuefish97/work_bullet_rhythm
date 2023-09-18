import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { SignInfo, ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";
import { CommandDefine } from "./commandDefine";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { MediatorDefine } from "../mediator/mediatorDefine";
import { SignMediator } from "../mediator/SignMediator";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import AdController from "../../plugin/ADSdk/AdController";
import GameManager from "../../GameManager";




export class SignRequestCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "SignRequestCmd");
        let Info = notification.getBody();
        let type = Info.type;
        let signInfo = Info.value;
        let signMed = Facade.getInstance().retrieveMediator(MediatorDefine.SignMediator) as SignMediator;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        if (signInfo.rewardType == "dia" || (signInfo.rewardType == "skin" && gamePxy.getLockGunIds().length <= 0)) {
            if (signInfo.rewardType == "skin" && gamePxy.getLockGunIds().length <= 0) {
                GameManager.getInstance().showMsgTip("所有皮肤已经解锁！！")
            }
            if (type == "normal") {
                console.log("普通签到奖励钻石")
                this.sendNotification(CommandDefine.Consumables,
                    {
                        info: new ConsumablesAlterInfo(ConsumablesType.dia, signInfo.rewardValue),
                        callback: null
                    });
                gamePxy.setLastSignDate();
                signMed.setSignState(gamePxy.getIsSigned());
                signMed.assignSignNumShow();
            }
            else if (type == "video") {
                console.log("看广告签到奖励钻石");
                if (AdController.instance.AdSDK.getVideoFlag()) {
                    AdController.instance.AdSDK.showVideo((isSucces) => {
                        if (isSucces) {
                            this.sendNotification(CommandDefine.Consumables,
                                {
                                    info: new ConsumablesAlterInfo(ConsumablesType.dia, signInfo.rewardValue * 2),
                                    callback: null
                                })
                            gamePxy.setLastSignDate();
                            signMed.setSignState(gamePxy.getIsSigned());
                            signMed.assignSignNumShow();
                        }
                    })

                }
            }
        }
        else {
            if (type == "normal") {
                console.log("签到奖励皮肤")
                gamePxy.UnlockGunSkinRandom()
                gamePxy.setLastSignDate();
                signMed.setSignState(gamePxy.getIsSigned());
                signMed.assignSignNumShow();
            }
            else if (type == "video") {
                console.log("看广告签到奖励钻石");
                if (AdController.instance.AdSDK.getVideoFlag()) {
                    AdController.instance.AdSDK.showVideo((isSucces) => {
                        if (isSucces) {
                            gamePxy.UnlockGunSkinRandom()
                            this.sendNotification(CommandDefine.Consumables,
                                {
                                    info: new ConsumablesAlterInfo(ConsumablesType.dia, signInfo.rewardValue),
                                    callback: null
                                })
                            gamePxy.setLastSignDate();
                            signMed.setSignState(gamePxy.getIsSigned());
                            signMed.assignSignNumShow();
                        }
                    })

                }
            }

        }

    }
}
