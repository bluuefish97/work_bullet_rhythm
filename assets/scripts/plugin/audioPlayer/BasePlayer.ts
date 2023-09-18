
const { ccclass, property } = cc._decorator;

@ccclass
export default class BasePlayer {

  protected  innerAudioContext: any;
  protected  bgmusic;      //当前播放的歌曲
  protected pauseMusicTime: number = 0;
  protected isPausePlaying: boolean = false;
  
  public get IsPausePlaying() : boolean {
      return this.isPausePlaying
  }
  
    //音乐控制接口
    initAudioEngine() {
    }


    playMusic(music, loop, _volume=1) {
        this.isPausePlaying = false;
    }
    stopMusic() {
    }

    pauseMusic() {
        this.isPausePlaying = true;
    }
    resumeMusic() {
        this.isPausePlaying = false;
        
    }

    resumeMusicToTime(curtime:number)
    {
        this.isPausePlaying = false;
    }
    getCurrentTime() {
   
    }

    //获得歌曲的总时长
    getDurationTime() {
   
    }


    //音效
    playEffect(music, loop, _volume=1) {
       
    }
    stopEffect() {
    }

    pauseEffect() {
        
    }
    resumeEffect() {
    }
         /**
     * 设置歌曲的音量
     */
    setVolume(num:number)
    {
    }
}
