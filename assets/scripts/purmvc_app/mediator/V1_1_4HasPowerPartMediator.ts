/**
 * 金币top节点中介
 */
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { CommandDefine } from "../command/commandDefine";
import { Utility } from "../../util/Utility";
import { CONSTANTS } from "../../Constants";
import V1_1_4HasPowerPart from "./V1_1_4HasPowerPart";
import { V1_1_4Pxy } from "../proxy/V1_1_4Pxy";
import { ActivityEventState } from "../proxy/ActivityPxy";

export class V1_1_4HasPowerPartMediator extends Mediator {
    private v1_1_4HasPowerPart: V1_1_4HasPowerPart = null;


    public getPowertargetPos(): cc.Vec2 {
        return this.v1_1_4HasPowerPart.getPowertargetPos();
    }

    private v1_1_4Pxy: V1_1_4Pxy;
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }
        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.v1_1_4Pxy = Facade.getInstance().retrieveProxy(ProxyDefine.V1_1_4Pxy) as V1_1_4Pxy;

        this.v1_1_4HasPowerPart = viewNode.getComponent(V1_1_4HasPowerPart);
        this.v1_1_4HasPowerPart.setPowerLabel(this.v1_1_4Pxy.getUserHasPowers());
        if (this.v1_1_4Pxy.V1_1_4EventState != ActivityEventState.ING) {
            viewNode.active = false;
        }
        this.bindListener();
    }

    private bindListener(): void {
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.V1_1_4UserHasPowerResponce,
            CommandDefine.v1_1_4GetPowerSettle,
        ];
    }

    public handleNotification(notification: INotification): void {
        let info = notification.getBody();
        switch (notification.getName()) {
            case CommandDefine.V1_1_4UserHasPowerResponce:
                this.v1_1_4HasPowerPart.setPowerLabel(info)
                break;
            case CommandDefine.v1_1_4GetPowerSettle:
                this.v1_1_4Pxy.addUserHasPowers(info);
                break;
            default:
                break;
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
                this.v1_1_4HasPowerPart.setPowerLabel(str)
            }, this.v1_1_4HasPowerPart)
        }
        else {
            let val = orignVal + offset
            let str = val + "/" + CONSTANTS.MaxPowerValue
            this.v1_1_4HasPowerPart.setPowerLabel(str);
        }
    }

    /**
     * 打开或关闭页面
     */
    public partSwitch(ison: boolean) {
        let view = this.getViewComponent() as cc.Node;
        if (this.v1_1_4Pxy.V1_1_4EventState != ActivityEventState.ING) {
            view.active = false;
        } else {
            view.zIndex = 50;
            view.active = ison;
        }


    }



}