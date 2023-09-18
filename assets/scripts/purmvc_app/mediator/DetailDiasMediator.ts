
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "../command/commandDefine";
import GameManager from "../../GameManager";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import DetailDiasPanel from "./DetailDiasPanel";
import UIPanelCtr from "../../util/UIPanelCtr";
import AdController from "../../plugin/ADSdk/AdController";
import { ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";
import { ClipEffectType } from "../../AudioEffectCtrl";

export class DetailDiasMediator extends Mediator {
    private detailDiasPanel: DetailDiasPanel = null;
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
        this.detailDiasPanel = viewNode.getComponent(DetailDiasPanel);
        this.bindListener();
    }

    private bindListener(): void {
        this.detailDiasPanel.setDiaCloseBtnClickEvent(
            () => {
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                UIPanelCtr.getInstance().popPanel();
            })

        this.detailDiasPanel.setDiaAdBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "getCoinUI_getCoin_Vclick", 1);
            if (AdController.instance.AdSDK.getVideoFlag()) {
                AdController.instance.AdSDK.showVideo((isSucces) => {
                    if (isSucces) {
                        this.sendNotification(CommandDefine.Consumables,
                            {
                                info: new ConsumablesAlterInfo(ConsumablesType.dia, 100),
                                callback: null
                            }
                        );
                    }
                })

            }


        })
        this.detailDiasPanel.onEnterCall = () => {
            ReportAnalytics.getInstance().reportAnalytics("View_Show", "getCoinUI_Show", 1);
        }
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: INotification): void {
    }
}