
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "../command/commandDefine";
import GameManager from "../../GameManager";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import { PowerInfo, ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";
import PowerUnit from "./PowerUnit";
import AdController from "../../plugin/ADSdk/AdController";
import DetailPowersPanel from "./DetailPowersPanel";
import UIPanelCtr from "../../util/UIPanelCtr";
import { ClipEffectType } from "../../AudioEffectCtrl";

export class DetailPowersMediator extends Mediator {
    private powerUnits: Array<PowerUnit> = new Array<PowerUnit>();
    private powerInfo: Array<PowerInfo> = new Array<PowerInfo>();
    private detailPowersPanel: DetailPowersPanel = null;
    private gamePxy: GamePxy = null;
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        this.detailPowersPanel = viewNode.getComponent(DetailPowersPanel);
        this.gamePxy.getPowerConfig(this.assignPowerUnit.bind(this));
        this.bindListener();
    }

    private bindListener(): void {
        this.detailPowersPanel.setPowerCloseBtnClickEvent(
            () => {
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                UIPanelCtr.getInstance().popPanel();
            })
        this.detailPowersPanel.onEnterCall = () => {
            ReportAnalytics.getInstance().reportAnalytics("View_Show", "LifeUI_Show", 1);
        }
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.ReviveResponce
        ];
    }

    public handleNotification(notification: INotification): void {
    }

    /**
     * 配置体力的获取单元
     */
    private assignPowerUnit(configs: Array<PowerInfo>) {
        this.powerInfo = configs;
        this.detailPowersPanel.getComponentsInChildren(PowerUnit).forEach((unit: PowerUnit) => {
            this.powerUnits.push(unit);
        });
        for (let i = 0; i < configs.length; i++) {
            this.powerUnits[i].initPowerInfo(configs[i]);
            this.powerUnits[i].setAdBtnClickEvent(() => {
                //    cc.audioEngine.play(this.detailPowersPanel.btnClip, false, 1);
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "LifeUI_getLife_Vclick", 1);
                if (AdController.instance.AdSDK.getVideoFlag()) {
                    AdController.instance.AdSDK.showVideo((isSucces) => {
                        if (isSucces) {
                            this.sendNotification(CommandDefine.Consumables,
                                {
                                    info: new ConsumablesAlterInfo(ConsumablesType.power, this.powerInfo[i].awardVal),
                                    callback: null
                                }
                            );
                        }
                    })

                }

            })

            let succeCallback = () => {
                this.sendNotification(CommandDefine.Consumables,
                    {
                        info: new ConsumablesAlterInfo(ConsumablesType.power, this.powerInfo[i].awardVal),
                        callback: null
                    }
                )
            };
            this.powerUnits[i].setDiasBtnClickEvent(() => {
                //   cc.audioEngine.play(this.detailPowersPanel.btnClip, false, 1);
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "LifeUI_CoinLife_Vclick", 1);
                this.sendNotification(CommandDefine.Consumables,
                    {
                        info: new ConsumablesAlterInfo(ConsumablesType.dia, -this.powerInfo[i].consumeVal),
                        callback: succeCallback
                    });


                // if (this.gamePxy.getPowerNum() >= CONSTANTS.MaxPowerValue) {
                //     GameManager.getInstance().showMsgTip("体力值已满！");
                // }
                // else {
                //     this.sendNotification(CommandDefine.Consumables,
                //         {
                //             info: new ConsumablesAlterInfo(ConsumablesType.dia, -this.powerInfo[i].consumeVal),
                //             callback: succeCallback
                //         });
                // }

            })
        }
    }
}