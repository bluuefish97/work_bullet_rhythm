import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "./commandDefine";
import RecController, { RecState } from "../../RecController";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { MediatorDefine } from "../mediator/mediatorDefine";
import { HomePartMediator } from "../mediator/HomePartMediator";


export class StartRecCmd extends SimpleCommand { 
    public execute(notification: INotification): void {
        console.log("execute:" + "StartRecCmd");
        RecController.getInstance().recState=RecState.InRecing;
        this.sendNotification(CommandDefine.StartRecResponce);
        let med=Facade.getInstance().retrieveMediator(MediatorDefine.HomePartMediator) as HomePartMediator;
        if(med){
            RecController.getInstance().startRec(med.updateRecTime.bind(med));
        }
        else
        {
            RecController.getInstance().startRec(()=>{});
        }
        
    }
}