import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import RankManager from "../../Rank/RankManager";

export class ELP_UploadingScoreAndTimeCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "ELP_UploadingScoreAndTimeCmd");
        let data=notification.getBody() as UploadData;
        console.log(data);
        RankManager.getInstance().setUserRank(data.scoreNum, data.timeNum);
    }
}

export class UploadData{
    scoreNum:number;
    timeNum:number;
    constructor(_score:number,_time:number){
        this.scoreNum=_score;
        this.timeNum=_time;
    }
}