import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import { CommandDefine } from "./commandDefine";
import { MediatorDefine } from "../mediator/mediatorDefine";
import { CoinPartMediator } from "../mediator/CoinPartMediator";
import GameManager from "../../GameManager";
import { Utility } from "../../util/Utility";
import { CONSTANTS } from "../../Constants";
import { MapSkinMediator } from "../mediator/MapSkinMediator";
import { OpenPanelBody } from "./OpenPanelCmd";
import { PanelType } from "../../util/PanelType";

export class ConsumablesCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        let body = notification.getBody();
        let info = body.info as ConsumablesAlterInfo;
        let succeCallback = body.callback;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        let coinMed = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        let mapSkinMed = Facade.getInstance().retrieveMediator(MediatorDefine.MapSkinMediator) as MapSkinMediator;
        if (info.consumablesType == ConsumablesType.dia)   //消耗品为钻石
        {
            if (info.alterVal < 0 || Math.abs(info.alterVal) == 0)    //钻石减少
            {
                if (Math.abs(info.alterVal) > gamePxy.getDiaNum())   //钻石的数量不足
                {
                    console.log("钻石数量不足!!!")
                    GameManager.getInstance().showMsgTip("钻石数量不足!!!");
                    this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.DetailDiasPanel));
                }
                else {
                    gamePxy.decreaseDiaNum(Math.abs(info.alterVal));
                    if (succeCallback) {
                        succeCallback();
                    }
                }
            }
            else        //钻石增加
            {
                console.log("钻石数量增加  " + info.alterVal)
                let actNum = Utility.clamp(info.alterVal, CONSTANTS.MINCoinNum, CONSTANTS.MAXCoinNum);
                GameManager.getInstance().showCoinAni(actNum, coinMed.getCointargetPos());
                succeCallback && succeCallback();
                setTimeout(() => {
                    gamePxy.addDiaNum(info.alterVal)
                }, 1000)
            }
        }
        else if (info.consumablesType == ConsumablesType.power)     //消耗品为体力
        {
            succeCallback();
            return;
            if (info.alterVal < 0)    //体力减少
            {
                if (Math.abs(info.alterVal) > gamePxy.getPowerNum())   //体力的数量不足
                {
                    console.log("体力数量不足!!!")
                    GameManager.getInstance().showMsgTip("体力数量不足!!!");
                    GameManager.getInstance().closeBlockInput();
                    this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.DetailPowersPanel));
                }
                else {
                    console.log("体力数量减少  " + info.alterVal)
                    gamePxy.decreasePowerNum(Math.abs(info.alterVal))
                    if (body.targetPos) {
                        GameManager.getInstance().showPowerConsumeAni(-info.alterVal, coinMed.getPowertargetPos(), body.targetPos, () => { });

                    }
                    if (succeCallback) {
                        setTimeout(() => {
                            succeCallback();
                        }, 1500)

                    }
                }
            }
            else        //体力增加
            {
                console.log("体力数量增加  " + info.alterVal)
                let actNum = Utility.clamp(info.alterVal, CONSTANTS.MINCoinNum, CONSTANTS.MAXCoinNum);
                GameManager.getInstance().showPowerAni(actNum, coinMed.getPowertargetPos());
                setTimeout(() => {
                    gamePxy.addPowerNum(info.alterVal)
                }, 1000)

            }
        }
        else if (info.consumablesType == ConsumablesType.voucher)     //消耗品为地图碎片抵用券
        {
            if (info.alterVal < 0)    //抵用券减少
            {
                if (Math.abs(info.alterVal) > gamePxy.getMapChipVoucher())   //抵用券的数量不足
                {
                    console.log("抵用券数量不足!!!")
                    GameManager.getInstance().showMsgTip("抵用券数量不足!!!");
                }
                else {
                    console.log("抵用券数量减少  " + info.alterVal)
                    mapSkinMed.voucherAlterShow(gamePxy.getMapChipVoucher(), info.alterVal)
                    gamePxy.decMapChipVoucher(Math.abs(info.alterVal))

                    if (succeCallback) {
                        succeCallback();
                    }
                }
            }
            else        //抵用券增加
            {
                console.log("抵用券数量增加  " + info.alterVal)
                if (mapSkinMed) {
                    mapSkinMed.voucherAlterShow(gamePxy.getMapChipVoucher(), info.alterVal)
                }
                gamePxy.addMapChipVoucher(info.alterVal)
            }
        }
    }


}