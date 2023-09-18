
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { MusicPxy } from "../proxy/MusicPxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { SongInfo } from "../repositories/Rep";
import ZQVAnnouncementPanel from "./ZQVAnnouncementPanel";
import UIPanelCtr from "../../util/UIPanelCtr";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";

export class ZQVAnnouncementPanelMediator extends Mediator {
    private zQVAnnouncementPanel: ZQVAnnouncementPanel = null;
    private musicPxy: MusicPxy;
    private newSong:SongInfo;
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        this.zQVAnnouncementPanel = viewNode.getComponent(ZQVAnnouncementPanel);
        this.bindListener();
    }

    private bindListener(): void {
          this.zQVAnnouncementPanel.setSureBtnClickEvent(()=>{
           // cc.audioEngine.play(this.zQVAnnouncementPanel.btnClip,false,1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();
        });
        this.zQVAnnouncementPanel.onEnterCall=()=>{
            ReportAnalytics.getInstance().reportAnalytics("View_Show","ZQnoticeView_Show",1);
        }
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: INotification): void {
    }
}