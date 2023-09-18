
import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import { CommandDefine } from "./commandDefine";
import { ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";

export class GetAchiRewardCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "GetAchiRewardCmd");
        let achiRewardInfo = notification.getBody() as AchiRewardInfo;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        this.sendNotification(CommandDefine.GetAchiRewardResponce,achiRewardInfo.id);        
        
        let lastGrade = gamePxy.getAchivGradeById(achiRewardInfo.id);
        let curGrade = lastGrade + 1;
        gamePxy.setAchivGradeById(achiRewardInfo.id, curGrade);
        this.sendNotification(CommandDefine.Consumables,
            {
                info: new ConsumablesAlterInfo(ConsumablesType.dia, achiRewardInfo.reward),
                callback: null
            }
        );
    }
}


/**
 * 成就奖励传递的字段
 */
export class AchiRewardInfo {
    id: number;
    reward: number;
    constructor(_id: number, _reward: number) {
        this.id = _id;
        this.reward = _reward;
    }
}
/**
 * 成就等级更新传递的字段
 */
export class AchiGradeUpdateInfo {
    id: number;
    data: number;
    constructor(_id: number, _data: number) {
        this.id = _id;
        this.data = _data;
    }
}
