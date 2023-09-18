import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "./commandDefine";
import RecController, { RecState } from "../../RecController";
import GameManager from "../../GameManager";
import UIPanelCtr from "../../util/UIPanelCtr";
import { ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { GamePxy } from "../proxy/GamePxy";
import { PanelType } from "../../util/PanelType";


export class ShareRecCmd extends SimpleCommand { 
    public execute(notification: INotification): void {
        console.log("execute:" + "StartRecCmd");
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        let self=this;
        if (RecController.getInstance().recPath != null) {
            if (GameManager.getInstance().develop) {
                GameManager.getInstance().showMsgTip("分享视频成功");
                UIPanelCtr.getInstance().popPanel();
                this.sendNotification(CommandDefine.Consumables,
                    {
                        info: new ConsumablesAlterInfo(ConsumablesType.dia, 100),
                        callback: null
                    });
            }
            else {
                let name=""
                if(gamePxy.getCurGameSongInfo()){
                    //刚刚玩完一局游戏的分享
                    name=gamePxy.getCurGameSongInfo().musicName
                }
                else
                {
                    name=gamePxy.getCurPlaySongInfo().musicName
                    //首页录屏的分享
                }
              
            }
        }
        else {
            GameManager.getInstance().showMsgTip("分享视频失败");
        }
    }
}