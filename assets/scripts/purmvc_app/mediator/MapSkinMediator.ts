
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "../command/commandDefine";
import MapSkinView, { MapSkinState } from "./MapSkinView";
import { MapSkinInfo, ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GetMapSkinChipInfo } from "../command/GetMapSkinChipCmd";
import GameManager from "../../GameManager";
import MapSkinUnit from "./MapSkinUnit";
import { ClipEffectType } from "../../AudioEffectCtrl";

export class MapSkinMediator extends Mediator {
    private mapSkinView: MapSkinView = null;
    private gamePxy: GamePxy;
    private mapConfig: Array<MapSkinInfo> = new Array<MapSkinInfo>();
    private originChipVals: Array<number> = new Array<number>();
    private curSelectSkinId: number;
    private consumeVoucherVal: number = 0;
    private accumulationVals: Array<number> = new Array<number>();
    private isPointerMove: boolean = false;
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
        this.mapSkinView = viewNode.getComponent(MapSkinView);
        this.mapSkinView.findCompent();
        console.log("this.gamePxy.getMapChipVoucher()   " + this.gamePxy.getMapChipVoucher());
        this.mapSkinView.setVoucherLabel(this.gamePxy.getMapChipVoucher());
        this.bindListener();
    }

    private bindListener(): void {
        this.mapSkinView.setForwardPointerClickEvent(() => {
          //  cc.audioEngine.play(this.mapSkinView.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.scrollToPageLastOrNext(true);
        })
        this.mapSkinView.setBackBtnClickEvent(() => {
         //   cc.audioEngine.play(this.mapSkinView.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.scrollToPageLastOrNext(false);
        })
        this.mapSkinView.setAdGetMapShipBtnClickEvent(() => {
          //  cc.audioEngine.play(this.mapSkinView.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.GetMapSkinChip,
                {
                    type: "video",
                    info: new GetMapSkinChipInfo(this.curSelectSkinId, 2)
                })
        });
        this.mapSkinView.setVoucherButtonClickEvent(() => {
          //  cc.audioEngine.play(this.mapSkinView.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.Consumables,
                {
                    info: new ConsumablesAlterInfo(ConsumablesType.voucher, -this.consumeVoucherVal),
                    callback: () => {
                        this.sendNotification(CommandDefine.GetMapSkinChip,
                            {
                                type: "voucher",
                                info: new GetMapSkinChipInfo(this.curSelectSkinId, this.consumeVoucherVal)
                            })
                    }
                })
            this.gamePxy.getIsCanCompoundMap();
        })
        this.mapSkinView.setEquipButtonClickEvent(() => {
          //  cc.audioEngine.play(this.mapSkinView.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.UseMapSkin, this.curSelectSkinId)
        })
        this.mapSkinView.setEquipedButtonClickEvent(() => {
          //  cc.audioEngine.play(this.mapSkinView.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            GameManager.getInstance().showMsgTip("该场景已经装备")
        })

        this.mapSkinView.setPageturningClickEvent(this.onPageturning, this)
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.MapConfigResponce,
            CommandDefine.MapSkinChipNumIdResponce,
            CommandDefine.UseMapSkin,
        ];
    }

    public handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CommandDefine.MapConfigResponce:
                this.mapConfig = notification.getBody() as Array<MapSkinInfo>;
                console.log(this.mapConfig);
                this.loaderMapConfig(this.mapConfig);
                this.setSkinDataByID(0);
                break;
            case CommandDefine.MapSkinChipNumIdResponce:
                let info = notification.getBody() as GetMapSkinChipInfo;
                this.accumulationVals[info.mapId] += info.chipVal;
                console.log(this.mapConfig);
                if (this.mapSkinView.IsTopShow) {
                    this.mapShipTransition(info.mapId, this.originChipVals[info.mapId], this.accumulationVals[info.mapId],
                        this.mapConfig[info.mapId].targetCost);
                }
                break;
            case CommandDefine.UseMapSkin:
                let idx = notification.getBody() as number;
                if (idx == this.gamePxy.getMapSkinOfUsingId()) {
                    this.mapSkinView.switchToState(MapSkinState.Using);
                }
                break;
            default:
                break;
        }
    }


    /**
     * 加载皮肤配置
     */
    private loaderMapConfig(mapConfig: Array<MapSkinInfo>) {
        for (let i = 0; i < mapConfig.length; i++) {
            this.mapSkinView.addMapSkinPage(mapConfig[i].ironPath);
            let val = this.gamePxy.getMapSkinChipNumId(i);
            this.originChipVals.push(val);
            this.accumulationVals.push(0);
        }
    }
    /**
     * 获得指定的皮肤数据
     */
    private setSkinDataByID(idx: number) {
        let pages = this.mapSkinView.PageView.getPages();
        if (idx != this.curSelectSkinId && this.curSelectSkinId >= 0) {

            pages[this.curSelectSkinId].getComponent(MapSkinUnit).hide();
        }
        this.curSelectSkinId = idx;
        let target = this.mapConfig[idx].targetCost;
        let curVal = this.gamePxy.getMapSkinChipNumId(idx);
        if (curVal < target) {
            this.mapSkinView.switchToState(MapSkinState.NotHold);
            this.voucherAlterShow(this.gamePxy.getMapChipVoucher(), 0);
        }
        else {
            if (idx == this.gamePxy.getMapSkinOfUsingId()) {
                this.mapSkinView.switchToState(MapSkinState.Using);
            }
            else {
                this.mapSkinView.switchToState(MapSkinState.Hold);
            }

        }
        this.mapSkinView.switchMapShipProress(curVal < target);
        this.mapSkinView.setMapShipLabelShow(curVal, target);
        this.mapSkinView.setMapShipBar(curVal, target);
        pages[idx].getComponent(MapSkinUnit).showAct();
        pages[idx].getComponent(MapSkinUnit).playDownClip();
    }

    /**
     * 左翻页或右翻页
     */
    private scrollToPageLastOrNext(isLast: boolean) {
        let targetID = this.mapSkinView.scrollToPageLastOrNext(isLast);
        this.isPointerMove = true;
        if (targetID != -1) {
            this.setSkinDataByID(targetID);
        } else {
            this.isPointerMove = false;
        }

    }

    /**
     * Pageturning
     */
    onPageturning(pageView: cc.PageView) {
        if (this.isPointerMove == true) {
            this.isPointerMove = false;
            return;
        }
        this.setSkinDataByID(pageView.getCurrentPageIndex());
    }

    /**
     * 皮肤数据进度变化
     */
    private mapShipTransition(idx: number, originVal: number, accVal: number, target: number) {
        if (accVal > 0) {
            let self = this;
            let callback = function () {
                self.voucherAlterShow(self.gamePxy.getMapChipVoucher(), 0);
                if (originVal + accVal >= target) {
                    self.mapSkinView.switchMapShipProress(false);
                    self.mapSkinView.switchToState(MapSkinState.Hold);
                }
            }

            this.mapSkinView.transMapShipPro(originVal, accVal, target, callback);
            this.accumulationVals[idx] = 0;
            this.originChipVals[idx] = originVal + accVal;
        }
    }

    /**
     * 抵用券改变
     * @param orignVal 
     * @param offset 
     */
    public voucherAlterShow(orignVal: number, offset: number) {

        // console.log("orignVal   " + orignVal + "  offset   " + offset);
        let tempSum = orignVal + offset + this.gamePxy.getMapSkinChipNumId(this.curSelectSkinId);
        if (tempSum >= this.mapConfig[this.curSelectSkinId].targetCost) {
            let self = this;
            this.consumeVoucherVal = this.mapConfig[this.curSelectSkinId].targetCost - this.gamePxy.getMapSkinChipNumId(this.curSelectSkinId);
            let callback = function () {
                if (self.mapConfig[self.curSelectSkinId].targetCost == self.gamePxy.getMapSkinChipNumId(self.curSelectSkinId)) {
                    return;
                }
                self.mapSkinView.switchToState(MapSkinState.CanHold);
                self.mapSkinView.setConsumeVoucherLabel(self.consumeVoucherVal);
            }
            this.mapSkinView.transMapShipPro(this.gamePxy.getMapSkinChipNumId(this.curSelectSkinId), this.consumeVoucherVal, this.mapConfig[this.curSelectSkinId].targetCost, callback);
        }
        this.mapSkinView.setVoucherLabel(orignVal + offset);
    }

    /**
     * 页面打开时
     */
    onOpen() {
        let pages = this.mapSkinView.PageView.getPages();
        pages[this.mapSkinView.PageView.getCurrentPageIndex()].getComponent(MapSkinUnit).showAct();
    }

}
