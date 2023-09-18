
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import UIPanelCtr from "../../util/UIPanelCtr";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import { MediatorDefine } from "./mediatorDefine";
import { EndlessPlayingPxy } from "../proxy/EndlessPlayingPxy";
import { CoinPartMediator } from "./CoinPartMediator";
import V1_1_4AnnouncementPanel from "./V1_1_4AnnouncementPanel";
import { CommandDefine } from "../command/commandDefine";
import { OpenPanelBody } from "../command/OpenPanelCmd";
import { PanelType } from "../../util/PanelType";
import { V1_1_4HasPowerPartMediator } from "./V1_1_4HasPowerPartMediator";
import { ReportAnalytics } from "../../plugin/reportAnalytics";

export class V1_1_4AnnouncementPanelMediator extends Mediator {
    private v1_1_4AnnouncementPanel: V1_1_4AnnouncementPanel = null;
    private ELPPxy: EndlessPlayingPxy;
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.ELPPxy = Facade.getInstance().retrieveProxy(ProxyDefine.EndlessPlayingPxy) as EndlessPlayingPxy;
        this.v1_1_4AnnouncementPanel = viewNode.getComponent(V1_1_4AnnouncementPanel);
        this.bindListener();
    }

    private bindListener(): void {
        this.v1_1_4AnnouncementPanel.setSureBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();

             ReportAnalytics.getInstance().reportAnalytics("Noad_Click","V1_1_4Announcement_Start_Click",1);
            Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.V1_1_4HomePanel));

        });
        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        this.v1_1_4AnnouncementPanel.onEnterCall = () => {
           ReportAnalytics.getInstance().reportAnalytics("View_Show", "V1_1_4Announcement_Show", 1);
            let V1_1_4Powermed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HasPowerPartMediator) as V1_1_4HasPowerPartMediator;
            V1_1_4Powermed&&V1_1_4Powermed.partSwitch(false);
            med && med.partSwitch(false);
        }
        this.v1_1_4AnnouncementPanel.onExitCall = () => {
            med && med.partSwitch(true);
        }
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: INotification): void {
    }
}