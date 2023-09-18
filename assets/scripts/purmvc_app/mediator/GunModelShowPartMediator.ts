
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import RevivePanel from "./RevivePanel";
import { CommandDefine } from "../command/commandDefine";
import { FinishType } from "../command/FinishCmd";
import WelcomeNewPanel from "./WelcomeNewPanel";
import { MusicPxy } from "../proxy/MusicPxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { SongInfo } from "../repositories/Rep";
import ZQVAnnouncementPanel from "./ZQVAnnouncementPanel";
import UIPanelCtr from "../../util/UIPanelCtr";
import GunModelShowPart from "./GunModelShowPart";
import ExhibitionGun from "../../Game/eft/ExhibitionGun";
import RecController, { RecState } from "../../RecController";
import { PanelType } from "../../util/PanelType";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import config, { Platform } from "../../../config/config";
import { ClipEffectType } from "../../AudioEffectCtrl";
import GameManager from "../../GameManager";

export class GunModelShowPartMediator extends Mediator {
    private gunModelShowPart: GunModelShowPart = null;
    private musicPxy: MusicPxy;
    private newSong: SongInfo;
    private GunShowStage: cc.Node = null;
    private localID: number = 0;
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
        this.gunModelShowPart = viewNode.getComponent(GunModelShowPart);


        this.bindListener();
    }

    private bindListener(): void {
        this.gunModelShowPart.setSureBtnClickEvent(() => {
         //   cc.audioEngine.play(this.gunModelShowPart.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();
            this.GunShowStage.active = false;
        });

        this.gunModelShowPart.setShareBtnClickEvent(() => {
          //  cc.audioEngine.play(this.gunModelShowPart.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.ShareRec);
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "GunSkinUnlockRec_Click", 1);
        })

        this.gunModelShowPart.onEnterCall = () => {
            if (this.GunShowStage) {
                this.GunShowStage.active = true
            }
            if (config.platform == Platform.douYin) {

                setTimeout(() => {
                    if (RecController.getInstance().recState == RecState.InRecing) {
                        console.log("结束录屏！！！！");
                        this.sendNotification(CommandDefine.EndRec);
                    }

                }, 4000)
                setTimeout(() => {
                    this.gunModelShowPart.showSureBtn();
                }, 5000)
            }
            else {
                this.gunModelShowPart.showSureBtn();

            }

        }
        this.gunModelShowPart.onExitCall = () => {
            if (this.GunShowStage) {
                this.GunShowStage.active = false
            }

        }
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.showGunIDResponce,
            CommandDefine.EndRecResponce
        ];
    }

    public handleNotification(notification: INotification): void {
        let info=notification.getBody();
        switch (notification.getName()) {
            case CommandDefine.showGunIDResponce:
                this.gunModelShowPart.show(info.skinID);
                if (this.GunShowStage) {
                    console.log(this.GunShowStage.name);
                    this.GunShowStage.active=true;
                    setTimeout(() => {
                        this.GunShowStage.getChildByName("gunModel").getComponent(ExhibitionGun).setMeshs(info.id);
                        this.gunModelShowPart.playBoomRibinEft();
                    },300);
                } else {
                    let self = this;
                    cc.assetManager.loadBundle('remoteSkins', (err, bundle) => {
                        bundle.load("GunShowStage", function (err, prefab: cc.Prefab) {
                            self.GunShowStage = cc.instantiate(prefab)
                            self.GunShowStage.getChildByName("gunModel").getComponent(ExhibitionGun).setMeshs(info.id);
                            self.GunShowStage.parent = GameManager.getInstance().node;
                            self.gunModelShowPart.playBoomRibinEft();
                        });
                    });


                    // cc.resources.load("prefabs/GunShowStage", function (err, prefab: cc.Prefab) {
                    //     self.GunShowStage = cc.instantiate(prefab)
                    //     self.GunShowStage.getChildByName("gunModel").getComponent(ExhibitionGun).setMeshs(notification.getBody());
                    //     self.GunShowStage.parent = cc.director.getScene();
                    //     self.gunModelShowPart.playBoomRibinEft();
                    // });
                }
                break;
            case CommandDefine.EndRecResponce:
                console.log("UIPanelCtr.getInstance().checkIsTopPanel(PanelType.FinishPanel)  " + UIPanelCtr.getInstance().checkIsTopPanel(PanelType.FinishPanel));

                if (UIPanelCtr.getInstance().checkIsTopPanel(PanelType.GunModelShowPart)) {
                    this.gunModelShowPart.shareBtnShowAct();
                    // this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.ShareRecPanel));
                }
            default:
                break;
        }
    }
}