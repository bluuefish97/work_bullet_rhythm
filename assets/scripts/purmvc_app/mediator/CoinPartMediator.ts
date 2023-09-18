/**
 * 金币top节点中介
 */
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import CoinPart from "./CoinPart";
import { CommandDefine } from "../command/commandDefine";
import { ConsumablesAlterInfo, ConsumablesType, PowerInfo } from "../repositories/Rep";
import PowerUnit from "./PowerUnit";
import PlayStage, { PlayState } from "../../Game/PlayStage";
import { MediatorDefine } from "./mediatorDefine";
import { ReviveMediator } from "./ReviveMediator";
import { Utility } from "../../util/Utility";
import { CONSTANTS } from "../../Constants";
import GameManager from "../../GameManager";
import AdController from "../../plugin/ADSdk/AdController";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import { OpenPanelBody } from "../command/OpenPanelCmd";
import { PanelType } from "../../util/PanelType";
import UIPanelCtr from "../../util/UIPanelCtr";
import { ClipEffectType } from "../../AudioEffectCtrl";

export class CoinPartMediator extends Mediator {
    private coinPart: CoinPart = null;
    private powerUnits: Array<PowerUnit> = new Array<PowerUnit>();
    private powerInfo: Array<PowerInfo> = new Array<PowerInfo>();

    public getCointargetPos(): cc.Vec2 {
        return this.coinPart.getCointargetPos();
    }

    public getPowertargetPos(): cc.Vec2 {
        return this.coinPart.getPowertargetPos();
    }

    private gamePxy: GamePxy;
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
        this.gamePxy.getOfffLinePowerNum();
        this.coinPart = viewNode.getComponent(CoinPart);
        this.coinPart.setDiaLabel(this.gamePxy.getDiaNum());
        let str = this.gamePxy.getPowerNum() + "/" + CONSTANTS.MaxPowerValue
        this.coinPart.setPowerLabel(str)
        this.timingAddPowerNum(CONSTANTS.PowerRecoverTime);
        this.bindListener();
    }

    private bindListener(): void {

        this.coinPart.setDiaBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (UIPanelCtr.getInstance().checkIsTopPanel(PanelType.DetailDiasPanel)) return;
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MainUI_GetCoinBtn_Click", 1);
            this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.DetailDiasPanel));
        })
        this.coinPart.setPowerBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (UIPanelCtr.getInstance().checkIsTopPanel(PanelType.DetailPowersPanel)) return;
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MainUI_GetLifeBtn_Click", 1);
            this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.DetailPowersPanel));
        })


    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.openDiaDetailRequest,
            CommandDefine.openPowerDetailRequest,
            CommandDefine.ConsumablesResponce,
            CommandDefine.RPowerNumResponce,
        ];
    }

    public handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CommandDefine.ConsumablesResponce:
                let info = notification.getBody();
                if (info.type == "power") {
                    this.powerAlterShow(info.originValue, info.value)
                }
                else if (info.type == "dia") {
                    this.diaAlterShow(info.originValue, info.value)
                }
                break;
            case CommandDefine.RPowerNumResponce:
                let num = notification.getBody();
                let str = num + "/" + CONSTANTS.MaxPowerValue;
                this.coinPart.setPowerLabel(str);
            default:
                break;
        }
    }

    /**
     * 钻石值改变
     * @param orignVal 
     * @param offset 
     */
    public diaAlterShow(orignVal: number, offset: number) {
        if (offset > 0) {
            Utility.addScoreAnim(orignVal, offset, 0.05, (val) => { this.coinPart.setDiaLabel(val) }, this.coinPart);
        }
        else {
            this.coinPart.setDiaLabel(orignVal + offset);
        }

    }


    /**
     * 体力值改变
     * @param orignVal 
     * @param offset 
     */
    public powerAlterShow(orignVal: number, offset: number) {
        if (offset > 0) {
            Utility.addScoreAnim(orignVal, offset, 0.08, (val) => {
                let str = val + "/" + CONSTANTS.MaxPowerValue
                this.coinPart.setPowerLabel(str)
            }, this.coinPart)
        }
        else {
            let val = orignVal + offset
            let str = val + "/" + CONSTANTS.MaxPowerValue
            this.coinPart.setPowerLabel(str);
        }
    }


    /**
     * 打开或关闭金币系统页面
     */
    public partSwitch(ison: boolean) {
        let view = this.getViewComponent() as cc.Node;
        view.zIndex = 50;
        view.active = ison;
    }

    /**
     * 定时刷新体力值
     */
    private timingAddPowerNum(time) {
        let count = 0;
        let showCount = 0;
        let isClosed = false;
        let self = this;
        let cal = function () {
            if (self.gamePxy.getPowerNum() >= CONSTANTS.MaxPowerValue && !isClosed) {
                count = 0
                self.coinPart.closeTiming();
                isClosed = true;
            }
            else if (self.gamePxy.getPowerNum() < CONSTANTS.MaxPowerValue) {
                if (count == 0) {
                    //self.coinPart.   
                    self.coinPart.openTiming();
                    isClosed = false;
                }
                count++
                showCount = count % time;
                if (showCount == 0) {
                    console.log("增加一点体力!!!");
                    self.gamePxy.addPowerNum(1);
                    self.coinPart.showPowerRewardActShow();
                }
                let str = Utility.timeChangeToStr(time - showCount, 2);
                self.coinPart.setTimingLabel(str);
            }

        }
        this.coinPart.schedule(cal, 1);
    }

}