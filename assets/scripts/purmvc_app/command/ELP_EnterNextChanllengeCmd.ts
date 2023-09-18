import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { EndlessPlayingPxy } from "../proxy/EndlessPlayingPxy";
import PlayStage from "../../Game/PlayStage";
import { GamePxy } from "../proxy/GamePxy";

const { ccclass, property } = cc._decorator;

@ccclass
export class ELP_EnterNextChanllengeCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "ELP_EnterNextChanllengeCmd");
        let ELPPxy = Facade.getInstance().retrieveProxy(ProxyDefine.EndlessPlayingPxy) as EndlessPlayingPxy;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        let stagerSKinIdx = Math.floor(Math.random() * 4);
        if (stagerSKinIdx == gamePxy.lastStageSkinID) {
            stagerSKinIdx = (gamePxy.lastStageSkinID + 1) % 4;
        }
        gamePxy.lastStageSkinID = stagerSKinIdx;
        if (ELPPxy.waitPlayClipRes && ELPPxy.waitPlayPointRes) {
            PlayStage.getIntance().startNextChanllengePlay(ELPPxy.waitPlayClipRes, ELPPxy.waitPlayPointRes,stagerSKinIdx, ELPPxy.waitPlaySongInfo.ex_lv,ELPPxy.waitPlaySongInfo.musicName);
        }


    }
}