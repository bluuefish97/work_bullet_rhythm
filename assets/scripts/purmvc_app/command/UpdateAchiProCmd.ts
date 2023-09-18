import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import { CONSTANTS } from "../../Constants";

export class UpdateAchiProCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "UpdateAchiProCmd");
       
        let achiUpdateInfo=notification.getBody() as AchiUpdateInfo;
        let gamePxy=Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        if(gamePxy.getAchivGradeById(achiUpdateInfo.id)>CONSTANTS.MAXAchivGrade)
        {
            console.warn("该成就的所有等级奖励已领取完毕!!!");
            return;
        }
        let originPro=gamePxy.getAchivProById(achiUpdateInfo.id);
        let pro=originPro+achiUpdateInfo.data;
        gamePxy.setAchivProById(achiUpdateInfo.id,pro);
    }
}


/**
 * 成就更新传递的字段
 */
export class AchiUpdateInfo{
    id:number;
    data:number;
    target:number;
    constructor(_id:number,_data:number,_target?:number){
        this.id=_id;
        this.data=_data;
        this.target=_target;
    }
}
