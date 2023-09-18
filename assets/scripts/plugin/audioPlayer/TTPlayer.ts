import BasePlayer from "./BasePlayer";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TTPlayer extends BasePlayer {

    initAudioEngine() {
        this.innerAudioContext = tt.createInnerAudioContext();
    }


    playMusic(music, loop, _volume = 0) {
        console.log('tt播放音乐')
        this.innerAudioContext.stop();
        this.innerAudioContext.startTime = 0;
        this.innerAudioContext.src = music;
        this.innerAudioContext.loop = loop;
        super.playMusic(music, loop, _volume);
        // this.innerAudioContext.volume = _volume;
        this.innerAudioContext.play()
        return 0;
    }
    stopMusic() {
        super.stopMusic();
        console.log('tt停止音乐')
        if (!this.innerAudioContext.paused) {
            this.innerAudioContext.stop();
        }
    }



    pauseMusic() {
        super.pauseMusic();
        console.log('tt暂停音乐 时间' + this.innerAudioContext.currentTime)
        this.innerAudioContext.pause();

    }
    resumeMusic() {
        super.resumeMusic();
        console.log('tt恢复音乐')
        this.innerAudioContext.play();
    }
    resumeMusicToTime(curtime: number) {
        super.resumeMusicToTime(curtime);
        this.innerAudioContext.stop();
        console.log('tt恢复到音乐： ' + curtime)
        this.innerAudioContext.seek(curtime);
        this.innerAudioContext.play();

        console.log('tt暂停音乐 this.innerAudioContext.currentTime   ' + this.innerAudioContext.currentTime)

    }
    getCurrentTime() {
        super.getCurrentTime();
        var time = this.innerAudioContext.currentTime;
        if (time > 0 && time <= 300) time = time
        else time = 0;
        return time
    }

    //获得歌曲的总时长
    getDurationTime() {
        super.getDurationTime();
        var time = this.innerAudioContext.duration;
        if (time > 0 && time <= 300) time = time
        else time = 0;
        return time
    }
     /**
     * 设置歌曲的音量
     */
    setVolume(num:number)
    {
        this.innerAudioContext.volume =num;
    }
}
