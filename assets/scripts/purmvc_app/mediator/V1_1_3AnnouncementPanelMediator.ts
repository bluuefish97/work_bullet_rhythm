
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import UIPanelCtr from "../../util/UIPanelCtr";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import { MediatorDefine } from "./mediatorDefine";
import V1_1_3AnnouncementPanel from "./V1_1_3AnnouncementPanel";
import { EndlessPlayingPxy } from "../proxy/EndlessPlayingPxy";
import { CoinPartMediator } from "./CoinPartMediator";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import { CommandDefine } from "../command/commandDefine";
import { OpenPanelBody } from "../command/OpenPanelCmd";
import { PanelType } from "../../util/PanelType";

export class V1_1_3AnnouncementPanelMediator extends Mediator {
    private v1_1_3AnnouncementPanel: V1_1_3AnnouncementPanel = null;
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
        this.v1_1_3AnnouncementPanel = viewNode.getComponent(V1_1_3AnnouncementPanel);
        this.bindListener();
    }

    private bindListener(): void {
          this.v1_1_3AnnouncementPanel.setSureBtnClickEvent(()=>{
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click","MWPKView_Start_Click",1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();
            Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.EndlessPlayingHomePanel));
           
        });
        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        this.v1_1_3AnnouncementPanel.onEnterCall=()=>{
            ReportAnalytics.getInstance().reportAnalytics("View_Show", "MWPKView_Show", 1);
            med && med.partSwitch(false);
        }
        this.v1_1_3AnnouncementPanel.onExitCall=()=>{
           
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