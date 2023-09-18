import BasePlayer from "./BasePlayer";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class WebPlayer extends BasePlayer {


    playMusic(music, loop, _volume=1) {
        super.playMusic(music, loop, _volume)
        console.log('web播放音乐')
        cc.audioEngine.setMusicVolume(_volume);
        this.bgmusic = cc.audioEngine.playMusic(music, loop);
    }
    stopMusic() {
        super.stopMusic();
        console.log('web停止音乐')
        cc.audioEngine.stopMusic();
    }

    pauseMusic() {
        super.pauseMusic();
        console.log('web暂停音乐')
        if (this.bgmusic == -1) return;
        cc.audioEngine.pauseMusic();
        this.pauseMusicTime = cc.audioEngine.getCurrentTime(this.bgmusic);
        console.log("this.pauseMusicTime  "+this.pauseMusicTime );
        
    }
    resumeMusic() {
        super.resumeMusic();
        console.log('WEB恢复音乐')
        if (this.bgmusic == -1) return;
        cc.audioEngine.resumeMusic();
    }

    resumeMusicToTime(curtime:number)
    {
        console.log("curtime   "+curtime);
        
        super.resumeMusicToTime(curtime);
        cc.audioEngine.setCurrentTime(this.bgmusic, curtime);
        cc.audioEngine.resumeMusic();
        console.log("cc.audioEngine.getCurrentTime(this.bgmusic) "+cc.audioEngine.getCurrentTime(this.bgmusic) );
    }
    getCurrentTime() {
        super.getCurrentTime();
        return cc.audioEngine.getCurrentTime(this.bgmusic)
    }

    //获得歌曲的总时长
    getDurationTime() {
        super.getDurationTime();
        if (this.bgmusic == -1) return;
        return cc.audioEngine.getDuration(this.bgmusic)
    }

    /**
     * 设置歌曲的音量
     */
    setVolume(num:number)
    {
        cc.audioEngine.setMusicVolume(num);
    }
}
