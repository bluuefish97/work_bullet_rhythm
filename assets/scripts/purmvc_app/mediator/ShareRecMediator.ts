import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "../command/commandDefine";
import ShareRecPanel from "./ShareRecPanel ";
import UIPanelCtr from "../../util/UIPanelCtr";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { MediatorDefine } from "./mediatorDefine";
import { FinishMediator } from "./FinishMediator";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";

export class ShareRecMediator extends Mediator {
    private shareRecPanel: ShareRecPanel = null;
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.shareRecPanel = viewNode.getComponent(ShareRecPanel);
        this.bindListener();
    }

    private bindListener(): void {
            this.shareRecPanel.setShareBtnClickEvent(()=>{
              //  cc.audioEngine.play(this.shareRecPanel.btnClip,false,1);
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                this.sendNotification(CommandDefine.ShareRec);
                ReportAnalytics.getInstance().reportAnalytics("Noad_Click","ShareUI_ShareBtn_Click",1);
                let finishMed=Facade.getInstance().retrieveMediator(MediatorDefine.FinishMediator) as FinishMediator;
                if(finishMed&&finishMed.IsExit)
                {
                    if(finishMed.IsWin)
                    {
                        ReportAnalytics.getInstance().reportAnalytics("Noad_Click","WinUI_ShareBtn_Click",1);
                    }
                    else
                    {
                        ReportAnalytics.getInstance().reportAnalytics("Noad_Click","FailureUI_ShareBtn_Click",1);
                    }
                }
            })
            this.shareRecPanel.setCancelBtnClickEvent(()=>{
                UIPanelCtr.getInstance().popPanel();
            })
            this.shareRecPanel.onEnterCall=()=>{
                ReportAnalytics.getInstance().reportAnalytics("View_Show","ShareUI_Show",1);
            }
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: INotification): void {
    }
    

}