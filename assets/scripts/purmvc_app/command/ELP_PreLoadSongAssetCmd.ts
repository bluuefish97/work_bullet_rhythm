import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { EndlessPlayingPxy } from "../proxy/EndlessPlayingPxy";
import MusicManager from "../../plugin/musicLoader/MusicManager";
import { CommandDefine } from "./commandDefine";

const { ccclass, property } = cc._decorator;

@ccclass
export class ELP_PreLoadSongAssetCmd extends SimpleCommand {
    public execute(notification: INotification): void {
        console.log("execute:" + "ELP_PreLoadSongAssetCmd");
        let ELPPxy = Facade.getInstance().retrieveProxy(ProxyDefine.EndlessPlayingPxy) as EndlessPlayingPxy;
        let nextSongInfo=ELPPxy.provideNormalNextChalleng();
        ELPPxy.waitPlaySongInfo=nextSongInfo;
        console.log(nextSongInfo);
        let forward1 = new Date();
        console.log("开始加载节奏点：  " + forward1);
        MusicManager.GetInstance(MusicManager).Loader.LoadPoint(nextSongInfo.json_normal, (res) => {
            let forward2 = new Date()
            console.log("完成加载节奏点：  " + forward2);
            console.log("节奏点加载耗时:  " + (forward2.getTime() - forward1.getTime()));
            ELPPxy.waitPlayPointRes = res;
        });
        let forward3 = new Date()
        console.log("开始加载歌曲文件：  " + forward3);
        let url = nextSongInfo.musicFile
        MusicManager.GetInstance(MusicManager).Loader.LoadSongClip(url, nextSongInfo.musicId, (res) => {
            let forward4 = new Date()
            console.log("完成加载歌曲文件:  " + forward4);
            console.log("歌曲加载耗时:  " + (forward4.getTime() - forward3.getTime()));
            ELPPxy.waitPlayClipRes = res;
        });
        

    }
}