/**
 * 复活界面中介
 */
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import RevivePanel from "./RevivePanel";
import { CommandDefine } from "../command/commandDefine";
import { FinishType } from "../command/FinishCmd";
import PlayStage, { PlayPattern } from "../../Game/PlayStage";
import GameManager from "../../GameManager";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import { ClipEffectType } from "../../AudioEffectCtrl";
import UIPanelCtr from "../../util/UIPanelCtr";
import { AchiUpdateInfo } from "../command/UpdateAchiProCmd";
import { MediatorDefine } from "./mediatorDefine";
import { CoinPartMediator } from "./CoinPartMediator";

export class ReviveMediator extends Mediator {
    private revivePanel: RevivePanel = null;
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
        this.revivePanel = viewNode.getComponent(RevivePanel);
        this.bindListener();
    }

    private bindListener(): void {
        this.revivePanel.setCloseBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (PlayStage.getIntance && PlayStage.getIntance().playingPattern == PlayPattern.Normal) {
                let isFirst = this.gamePxy.getSongIdIsFirstWinState(this.gamePxy.getCurGameSongInfo().musicId);
                if (isFirst) {
                    this.revivePanel.openReconfirmView();
                    ReportAnalytics.getInstance().reportAnalytics("View_Show", "Rec_resurrectionUI_Show", 1);
                }
                else {
                    this.sendNotification(CommandDefine.Finish, FinishType.FAIL);
                }
                // if (ASCAd.getInstance().getErrVideoFlag()) {
                //     // 可进入误触模式,调用展示视频方法
                //     ASCAd.getInstance().showVideo((isSuc) => {
                //         if (isSuc) {
                //             UIPanelCtr.getInstance().clearPanelStack();
                //             PlayStage.getIntance().revive();
                //             this.sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(4, 1))
                //             let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
                //             med.partSwitch(false);
                //         } else {
                //             let isFirst = this.gamePxy.getSongIdIsFirstWinState(this.gamePxy.getCurGameSongInfo().musicId);
                //             if (isFirst) {
                //                 this.revivePanel.openReconfirmView();
                //                 ReportAnalytics.getInstance().reportAnalytics("View_Show", "Rec_resurrectionUI_Show", 1);
                //             }
                //             else {
                //                 this.sendNotification(CommandDefine.Finish, FinishType.FAIL);
                //             }
                //         }
                //         this.sendNotification(CommandDefine.ReviveResponce, isSuc)
                //     });
                // }
                // else {
                //     let isFirst = this.gamePxy.getSongIdIsFirstWinState(this.gamePxy.getCurGameSongInfo().musicId);
                //     if (isFirst) {
                //         this.revivePanel.openReconfirmView();
                //         ReportAnalytics.getInstance().reportAnalytics("View_Show", "Rec_resurrectionUI_Show", 1);
                //     }
                //     else {
                //         this.sendNotification(CommandDefine.Finish, FinishType.FAIL);
                //     }
                // }
            }
            else {
                this.sendNotification(CommandDefine.Finish, FinishType.ENDLESSEND);
            }

        });
        this.revivePanel.setSureBtnClickEvent(() => {
            // cc.audioEngine.play(this.revivePanel.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.revivePanel.isBreak = true;
            this.sendNotification(CommandDefine.ReviveRequest, "ad");
            ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "Rec_resurrection_Vclick", 1);
            // this.sendNotification(CommandDefine.Finish,FinishType.FAIL);
        });
        this.revivePanel.setAdReviveBtnClickEvent(() => {
            // cc.audioEngine.play(this.revivePanel.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.ReviveRequest, "ad");
            this.revivePanel.isBreak = true;
            if (PlayStage.getIntance && PlayStage.getIntance().playingPattern == PlayPattern.Endless) {
                ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "Infinite_Revive_ADClick", 1);
            } else {
                ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "ReviveUI_Vclick", 1);
                ReportAnalytics.getInstance().reportAnalytics("Song_Massage", "ReviveUI_Vclick", 1);
            }

        })
        this.revivePanel.setCanelBtnClickEvent(() => {
            // cc.audioEngine.play(this.revivePanel.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.Finish, FinishType.FAIL);
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "Rec_resurrection_GiveUpClick", 1);
        });
        this.revivePanel.onEnterCall = () => {
            if (PlayStage.getIntance && PlayStage.getIntance().playingPattern == PlayPattern.Endless) {
                ReportAnalytics.getInstance().reportAnalytics("View_Show", "Infinite_Revive_Show", 1);
            } else {
                ReportAnalytics.getInstance().reportAnalytics("View_Show", "ReviveUI_Show", 1);
            }
        }
        this.revivePanel.onAutoStop = () => {
            if (PlayStage.getIntance && PlayStage.getIntance().playingPattern == PlayPattern.Normal) {
                this.sendNotification(CommandDefine.Finish, FinishType.FAIL);
            }
            else {
                this.sendNotification(CommandDefine.Finish, FinishType.ENDLESSEND);
            }
        }
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.ReviveResponce
        ];
    }

    public handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CommandDefine.ReviveResponce:
                if (notification.getBody() == false) {
                    this.revivePanel.isBreak = false;
                }
                break;
        }
    }

    public pauseDownTime() {
        this.revivePanel.isBreak = true;
    }

    public reusmeDownTime() {
        this.revivePanel.isBreak = false;
    }
}