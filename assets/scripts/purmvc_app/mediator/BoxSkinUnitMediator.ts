import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { SongInfo, AchivInfo, GunSkinInfo, BoxSkinInfo } from "../repositories/Rep";
import GunSkinUnit from "./GunSkinUnit";
import { CommandDefine } from "../command/commandDefine";
import GameManager from "../../GameManager";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import config, { Platform } from "../../../config/config";
import Android from "../../../Android/Android";
import BoxSkinUnit from "./BoxSkinUnit";
import { ClipEffectType } from "../../AudioEffectCtrl";


export class BoxSkinUnitMediator extends Mediator {
    private boxSkinUnit: BoxSkinUnit = null;
    private boxSkinInfo: BoxSkinInfo = null;
    private isEquipState: boolean = false;    //是否是装备状态
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.boxSkinUnit = viewNode.getComponent(BoxSkinUnit);
        this.boxSkinUnit.InitAssign();
        this.bindListener();
    }

    private bindListener(): void {
        this.boxSkinUnit.setAdBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.UnluckBoxRequest, this.boxSkinInfo)
            ReportAnalytics.getInstance().reportAnalytics("Ad_Click","SkinUI_Unlock_Vclick",1);
        })
        this.boxSkinUnit.setDiasBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.UnluckBoxRequest, this.boxSkinInfo)

            ReportAnalytics.getInstance().reportAnalytics("Noad_Click","SkinUI_CoinUnlock_Click",1);
        })
        this.boxSkinUnit.setEquipBtnClickEvent(() => {
            this.sendNotification(CommandDefine.EquipBoxRequest, this.boxSkinInfo)
        })
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.UnluckBoxSucceedResponce,
            CommandDefine.EquipBoxSucceedResponce,
        ];
    }

    public handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CommandDefine.UnluckBoxSucceedResponce:
                if (notification.getBody() == this.boxSkinInfo.id)     //解锁的当前的枪
                {
                    this.boxSkinUnit.setUnlockState()
                    if(config.platform!==Platform.android)
                    {
                        GameManager.getInstance().openGunSkinUnlockSucceCelebrateView(this.boxSkinInfo.id);
                    }
                   
                }
                break;
            case CommandDefine.EquipBoxSucceedResponce:
                if (notification.getBody() == this.boxSkinInfo.id)     //装备当前的枪
                {
                    this.boxSkinUnit.setEquipState();
                    this.isEquipState = true;
                    this.boxSkinUnit.gunSkinSuccesEquipAnim();
                }
                else if (this.isEquipState)        //如果是装备状态
                {
                    this.isEquipState = false;
                    this.boxSkinUnit.setUnlockState();   //改成解锁状态
                }
                break;
            default:
                break;
        }
    }

    public initBoxSkiniInfo(info: BoxSkinInfo) {
        this.boxSkinInfo = info;
        this.boxSkinUnit.setIronSprite(info.ironPath);
        this.boxSkinUnit.setlockType(info.unlockType, info.unlockVal);
    }

    //设置方块的解锁状态
    public setBoxSkinUnlockState() {
        this.boxSkinUnit.setUnlockState()
    }

    //设置方块的装备状态
    public setBoxSkinEquipState() {
        this.boxSkinUnit.setEquipState()
        this.isEquipState = true;
        this.boxSkinUnit.showEquipIron();
    }
}