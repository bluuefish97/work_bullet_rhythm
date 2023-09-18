
import { SimpleCommand } from "../../core/puremvc/patterns/command/SimpleCommand";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { PlaySongInfo, SongInfo, SongPlayType } from "../repositories/Rep";
import { CommandDefine } from "./commandDefine";
import { ProxyDefine } from "../proxy/proxyDefine";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { MusicPxy } from "../proxy/MusicPxy";
import MusicManager from "../../plugin/musicLoader/MusicManager";
import AudioManager from "../../plugin/audioPlayer/AudioManager";
import PlayStage, { PlayState } from "../../Game/PlayStage";
import { GamePxy } from "../proxy/GamePxy";
import GameManager from "../../GameManager";
import AdController from "../../plugin/ADSdk/AdController";

export class PlaySongCmd extends SimpleCommand {
    public  execute(notification: INotification) {
        console.log("execute:" + "PlaySongCmd");
        let playSongInfo = notification.getBody() as PlaySongInfo
        let musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        let songInfo = musicPxy.getSongInfo(playSongInfo.songName) as SongInfo;
        if (!songInfo) {
            let array = musicPxy.getData();
            songInfo = array[0];
            playSongInfo.songName = songInfo.musicName
        }
        //  console.log(songInfo.musicFile);
        var forwdMusicFile = songInfo.musicFile.slice(0, -4);
        let tryPlayMusicFile = forwdMusicFile.concat("_try.mp3");
        gamePxy.saveCurPlaySongInfo(songInfo);
        MusicManager.GetInstance(MusicManager).Loader.LoadSongClip(tryPlayMusicFile, songInfo.musicId + "_try", (clip) => {
            if (clip != null) {
                if (playSongInfo.playState == SongPlayType.Immediately) {
                    if (GameManager.getInstance().isStartSongReadyState) {
                        console.log("玩家处于游戏载入阶段不播歌曲！！！");
                    }
                    else {
                        if(AdController.instance.isIntersVideostate){
                            console.log("玩家处于插屏视频不播歌曲！！！");
                            return;
                        }
                        AudioManager.GetInstance(AudioManager).player.playMusic(clip, true, 1);
                    }

                }
                else {
                }
                musicPxy.TempSongInfo = songInfo;
                gamePxy.setPlayState(songInfo.musicName)
            }
            else {
                GameManager.getInstance().showMsgTip("啊哦！ 歌曲下载失败了。。。。")
                gamePxy.setPlayState(musicPxy.TempSongInfo.musicName)
                playSongInfo = new PlaySongInfo(musicPxy.TempSongInfo.musicName, SongPlayType.Immediately);
            }

            this.sendNotification(CommandDefine.PlaySongResponce, playSongInfo);
        });

       
    }
}
