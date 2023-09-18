import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { SongInfo, AchivInfo, GunSkinInfo } from "../repositories/Rep";
import GunSkinUnit from "./GunSkinUnit";
import { CommandDefine } from "../command/commandDefine";
import GameManager from "../../GameManager";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import config, { Platform } from "../../../config/config";
import Android from "../../../Android/Android";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import RecController, { RecState } from "../../RecController";
import { ClipEffectType } from "../../AudioEffectCtrl";
import { EndlessPlayingPxy } from "../proxy/EndlessPlayingPxy";


export class GunSkinUnitMediator extends Mediator {
    private gunSkinUnit: GunSkinUnit = null;
    private gunSkinInfo: GunSkinInfo = null;
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
        this.gunSkinUnit = viewNode.getComponent(GunSkinUnit);
        this.gunSkinUnit.InitAssign();
        this.bindListener();
    }

    private bindListener(): void {
        this.gunSkinUnit.setAdBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.UnluckGunRequest, this.gunSkinInfo)
            ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "SkinUI_Unlock_Vclick", 1);
        })
        this.gunSkinUnit.setDiasBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.UnluckGunRequest, this.gunSkinInfo)
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "SkinUI_CoinUnlock_Click", 1);
        })
        this.gunSkinUnit.setEquipBtnClickEvent(() => {
            this.sendNotification(CommandDefine.EquipGunRequest, this.gunSkinInfo)
        })

        this.gunSkinUnit.setLimitBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            console.log("限时活动获取");
            GameManager.getInstance().showMsgTip("限时活动获取");
        })
        this.gunSkinUnit.setActivityGetBtnClickEvent(() => {
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                this.sendNotification(CommandDefine.UnluckGunRequest, this.gunSkinInfo)
            })
        
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.UnluckGunSucceedResponce,
            CommandDefine.EquipGunSucceedResponce,
        ];
    }

    public handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CommandDefine.UnluckGunSucceedResponce:
                if (this.gunSkinInfo&&notification.getBody() == this.gunSkinInfo.id)     //解锁的当前的枪
                {
                    if (RecController.getInstance().recState == RecState.WaitRecing) {
                        console.log("开启自动录屏中！！！！");
                        Facade.getInstance().sendNotification(CommandDefine.StartRec);
                    }
                    else if (RecController.getInstance().recState == RecState.InRecing) {
                        console.log("正在录屏中！！！！");
                    }
                    let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
                    let id = gamePxy.getGunSkinIdx(this.gunSkinInfo);
                    GameManager.getInstance().openGunSkinUnlockSucceCelebrateView(id,this.gunSkinInfo.id);
                    this.gunSkinUnit.setUnlockState()
                    this.sendNotification(CommandDefine.EquipGunRequest, this.gunSkinInfo)
                }
                break;
            case CommandDefine.EquipGunSucceedResponce:
                if (this.gunSkinInfo&&notification.getBody() == this.gunSkinInfo.id)     //装备当前的枪
                {
                    this.gunSkinUnit.setEquipState();
                    this.isEquipState = true;
                    this.gunSkinUnit.gunSkinSuccesEquipAnim();
                }
                else if (this.isEquipState)        //如果是装备状态
                {
                    this.isEquipState = false;
                    this.gunSkinUnit.setUnlockState();   //改成解锁状态
                }
                break;
            default:
                break;
        }
    }

    public initGunSkiniInfo(info: GunSkinInfo, isVaild) {
        this.gunSkinInfo = info;
        this.gunSkinUnit.setIronSprite(info.ironPath);
        this.gunSkinUnit.setDesSprite("gunDes/" + info.id)
        this.gunSkinUnit.setlockType(info.unlockType, info.unlockVal);
        this.gunSkinUnit.setLimitTypeState(info.unlockType, isVaild);
        // 
    }
    public setGunSkinBg(type:string){
        this.gunSkinUnit.setBgType(type)
    }

    //设置枪的解锁状态
    public setGunSkinUnlockState() {
        this.gunSkinUnit.setUnlockState()
    }

     //设置枪的预告状态
     public setForeshowState(info: GunSkinInfo) {
        this.gunSkinInfo = info;
        this.gunSkinUnit.setIronSprite(info.ironPath);
        this.gunSkinUnit.setForeshowState()
    }

    //设置枪的装备状态
    public setGunSkinEquipState() {
        this.gunSkinUnit.setEquipState()
        this.isEquipState = true;
        this.gunSkinUnit.showEquipIron();
    }
}