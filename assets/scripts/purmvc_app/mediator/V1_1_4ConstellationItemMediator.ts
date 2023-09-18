import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "../command/commandDefine";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { MediatorDefine } from "./mediatorDefine";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import V1_1_4ConstellationItem from "./V1_1_4ConstellationItem";
import { V1_1_4Pxy } from "../proxy/V1_1_4Pxy";
import { ProxyDefine } from "../proxy/proxyDefine";
import { V1_1_4HasPowerPartMediator } from "./V1_1_4HasPowerPartMediator";
import { V1_1_4HomePanelMediator } from "./V1_1_4HomePanelMediator";
import { ActivityEventState } from "../proxy/ActivityPxy";
import config, { Platform } from "../../../config/config";

export class V1_1_4ConstellationItemMediator extends Mediator {
    private v1_1_4ConstellationItem: V1_1_4ConstellationItem = null;
    private powersNum: number = 0;
    private constellatioName: string = "";
    private v1_1_4Pxy: V1_1_4Pxy;
    private fillPrice: number = 10;

    private isTouchEnd: boolean = false;

    private TimeoutTouchCal;
    private IntervalTouchCal;

    private startTouchTime: number = 0;
    private endTouchTime: number = 0;

    public set ConstellatioName(v: string) {
        this.constellatioName = v;
    }

    public get ConstellatioName(): string {
        return this.constellatioName;
    }



    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.v1_1_4ConstellationItem = viewNode.getComponent(V1_1_4ConstellationItem);
        this.v1_1_4Pxy = Facade.getInstance().retrieveProxy(ProxyDefine.V1_1_4Pxy) as V1_1_4Pxy;
        this.bindListener();
    }

    private bindListener(): void {
        this.v1_1_4ConstellationItem._OnDisable=()=>{
            clearInterval(this.IntervalTouchCal);
            clearTimeout(this.TimeoutTouchCal);
        }
        let self = this;
        let fillPower = function (ismore = false) {
            // 暂定点击一次充能10点
            self.v1_1_4ConstellationItem.onBeFillPowerAct();
            if(config.platform==Platform.web){
                console.log("this.ConstellatioName  " + self.constellatioName);
                console.log("this.fillPrice  " + self.fillPrice);
                self.v1_1_4Pxy.setUserRank(self.ConstellatioName, self.fillPrice, ismore);
                return;
            }
            if (self.v1_1_4Pxy.getUserHasPowers() < self.fillPrice) {
                console.log("能量不足！！");
                GameManager.getInstance().showMsgTip("星座能量不足!!!")

            } else {
                console.log("this.ConstellatioName  " + self.constellatioName);
                console.log("this.fillPrice  " + self.fillPrice);
                self.v1_1_4Pxy.setUserRank(self.ConstellatioName, self.fillPrice, ismore);
            }
            // console.log("this.ConstellatioName  " + self.constellatioName);
            // console.log("this.fillPrice  " + self.fillPrice);
            // self.v1_1_4Pxy.setUserRank(self.ConstellatioName, self.fillPrice, ismore);
        }
        let touchEvent = () => {
            console.log("引导点击");

            this.v1_1_4Pxy.setUserLongTouch();
        }
        this.v1_1_4ConstellationItem._OnTouchStart = () => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (this.v1_1_4Pxy.V1_1_4EventState != ActivityEventState.ING) {
                GameManager.getInstance().showMsgTip("活动已经截止!!");
                return;
            }
            this.startTouchTime = new Date().getTime();
            this.isTouchEnd = false;
            fillPower();
            this.TimeoutTouchCal = setTimeout(() => {
                if (!this.isTouchEnd) {
                    this.v1_1_4Pxy.setUserLongTouch();
                    this.IntervalTouchCal = setInterval(function () {
                        fillPower(true);
                    }, 200);
                }
            }, 1000);
        }
        this.v1_1_4ConstellationItem._OnTouchEnd = () => {
            this.endTouchTime = new Date().getTime();
            let V1_1_4HomeMed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HomePanelMediator) as V1_1_4HomePanelMediator;
            let worlPos = this.v1_1_4ConstellationItem.getButtonPos();
            console.log("长按结束！！");
            if (this.endTouchTime - this.startTouchTime < 1000 && !this.v1_1_4Pxy.getUserLongTouch() && self.v1_1_4Pxy.getUserHasPowers() >= self.fillPrice) {      //在一秒后结束了点击,并且没有被引导过

                clearInterval(this.IntervalTouchCal);
                clearTimeout(this.TimeoutTouchCal);
                V1_1_4HomeMed.showTouchGuidance(worlPos, touchEvent)
            } else {
                this.isTouchEnd = true;
                clearInterval(this.IntervalTouchCal);
                clearTimeout(this.TimeoutTouchCal);
            }

        }
        this.v1_1_4ConstellationItem.registerTouchEvent();
    }
    public listNotificationInterests(): string[] {
        return [
            CommandDefine.V1_1_4UserUploadFillPowerResponce,
        ];
    }

    public handleNotification(notification: INotification): void {
        let info = notification.getBody();
        switch (notification.getName()) {
            case CommandDefine.V1_1_4UserUploadFillPowerResponce:
                let name = info.name;
                let more = info.more
                if (name == this.ConstellatioName) {
                    this.v1_1_4Pxy.decreaseUserHasPowers(this.fillPrice);
                    this.v1_1_4Pxy.getUserRank();
                    this.v1_1_4Pxy.getAllUserRank();
                    //    this.v1_1_4Pxy.getConstellationRank();
                    this.sendNotification(CommandDefine.V1_1_4UserSumFPForUnitCRequest, this.constellatioName)
                    let V1_1_4Powermed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HasPowerPartMediator) as V1_1_4HasPowerPartMediator;
                    let num = more ? 3 : 1;
                    // GameManager.getInstance().V1_1_4showFillPowerAni(num, V1_1_4Powermed.getPowertargetPos(), this.v1_1_4ConstellationItem.getBodyPos(), () => {
                    //     this.v1_1_4ConstellationItem.endPlist.resetSystem();
                    //     this.v1_1_4Pxy.getConstellationRank();
                    // });
                }
                break;
        }
    }

    /**
     * 设置星座的充能数
     */
    public setFillPowers(num) {
        this.powersNum = num;
        this.v1_1_4ConstellationItem.setFillPowers(num);
    }


    /**
    * 设置星座的充能进度
    */
    public setFillPowersPro(num, target, isMax = false) {
        this.v1_1_4ConstellationItem.setFillPowersPro(num, target, isMax);
    }

    /**
     * 读取图片
     */
    public setSpr(idx) {
        // cc.assetManager.loadBundle("v1.1.4res", (err, bundle) => {
        //     this.v1_1_4ConstellationItem.setBgSpr(idx, bundle);
        //     this.v1_1_4ConstellationItem.setFillSpr(idx, bundle);
        // });
    }
}