import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import RecController, { RecState } from "../../RecController";
import { CommandDefine } from "./commandDefine";
import GameManager from "../../GameManager";


 export class EndRecCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "EndRecCmd");
        
        if(RecController.getInstance().recTime<3)
        {
            GameManager.getInstance().showMsgTip("录制时间小于3秒");
            RecController.getInstance().recPath=null;
            return;
        }
      
        if(GameManager.getInstance().develop)
        {
            let videoPath=null
            RecController.getInstance().recPath=videoPath;
            RecController.getInstance().recState=RecState.WaitRecing;
            RecController.getInstance().StopRec();
            this.sendNotification(CommandDefine.EndRecResponce);
        }
        else
        {
           
            RecController.getInstance().recState=RecState.WaitRecing;
            RecController.getInstance().StopRec();
        }
      
    }
}