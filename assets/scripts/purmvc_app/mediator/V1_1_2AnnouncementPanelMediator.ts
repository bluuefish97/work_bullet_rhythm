
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { MusicPxy } from "../proxy/MusicPxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { SongInfo } from "../repositories/Rep";
import UIPanelCtr from "../../util/UIPanelCtr";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import V1_1_2AnnouncementPanel from "./V1_1_2AnnouncementPanel";
import { MediatorDefine } from "./mediatorDefine";
import { HomePartMediator } from "./HomePartMediator";

export class V1_1_2AnnouncementPanelMediator extends Mediator {
    private v1_1_2AnnouncementPanel: V1_1_2AnnouncementPanel = null;
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.v1_1_2AnnouncementPanel = viewNode.getComponent(V1_1_2AnnouncementPanel);
        this.bindListener();
    }

    private bindListener(): void {
          this.v1_1_2AnnouncementPanel.setSureBtnClickEvent(()=>{
           // cc.audioEngine.play(this.zQVAnnouncementPanel.btnClip,false,1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();
            let homeMed=Facade.getInstance().retrieveMediator(MediatorDefine.HomePartMediator) as HomePartMediator;
            if(homeMed)
            {
                homeMed.switchOverSkin();
            }
        });
        this.v1_1_2AnnouncementPanel.onEnterCall=()=>{
        }
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: INotification): void {
    }
}