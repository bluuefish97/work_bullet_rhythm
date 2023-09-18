

const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioEffectCtrl extends cc.Component {

    private effectBundle:any

    playEffect(type: ClipEffectType, vol = 1) {
        let ClipStr;
        switch (type) {
            case ClipEffectType.diafly:
             //   tempClip = this.diafly;
                ClipStr="diafly"
                break;
            case ClipEffectType.downTime:
               // tempClip = this.downTime;
                ClipStr="downTime"
                break;
            case ClipEffectType.equipGun:
               // tempClip = this.equipGun;
                ClipStr="equipGun"
                break;
            case ClipEffectType.finishStar:
               // tempClip = this.finishStar;
                ClipStr="finishStar"
                break;
            case ClipEffectType.gameGetDia:
               // tempClip = this.gameGetDia;
                ClipStr="gameGetDia"
                break;
            case ClipEffectType.gunstart:
               // tempClip = this.gunstart;
                ClipStr="gunstart"
                break;
            case ClipEffectType.gunUnlockShowClip:
               // tempClip = this.gunUnlockShowClip;
                ClipStr="gunUnlockShowClip"
                break;
            case ClipEffectType.lifeReviver:
               // tempClip = this.lifeReviver;
                ClipStr="lifeReviver"
                break;
            case ClipEffectType.normalBtn:
               // tempClip = this.normalBtn;
                ClipStr="normalBtn"
                break;
            case ClipEffectType.panerlEnter:
              //  tempClip = this.panerlEnter;
                ClipStr="panerlEnter"
                break;
            case ClipEffectType.songListScroll:
               // tempClip = this.songListScroll;
                ClipStr="songListScroll"
                break;
            case ClipEffectType.startplayBtn:
              //  tempClip = this.startplayBtn;
                ClipStr="startplayBtn"
                break;
            case ClipEffectType.toggle:
              //  tempClip = this.toggle;
                ClipStr="toggle"
                break;
            case ClipEffectType.warn:
               // tempClip = this.warn;
                ClipStr="warn"
                break;
            case ClipEffectType.ZQGunReward:
               // tempClip = this.ZQGunReward;
                ClipStr="ZQGunReward"
                break;
            // case ClipEffectType.ELPWelCome:
            //     tempClip = this.ELPWelCome;
            //     ClipStr="ELPWelCome"
            //     break;
            default:
                break;
        }

        this.getEffectBundle(ClipStr,vol)
        
    }

    getEffectBundle( clipName:string,vol ){
        if(this.effectBundle){
            this.effectBundle.load(clipName, cc.AudioClip, function (err, tempClip) {
                cc.audioEngine.play(tempClip, false, vol);
            });
        }else{
            let self=this;
            cc.assetManager.loadBundle('audioClips', function (err, bundle) {
                if (err) {
                    return console.error(err);
                }
                self.effectBundle=bundle;
                self.effectBundle.load(clipName, cc.AudioClip, function (err, tempClip) {
                    cc.audioEngine.play(tempClip, false, vol);
                });
            });
        }
    }


    onLoad(){
        let self=this;
        cc.assetManager.loadBundle('audioClips', function (err, bundle) {
            if (err) {
                return console.error(err);
            }
            console.log('load bundle successfully.');
            self.effectBundle=bundle;
        });
    }


}

export enum ClipEffectType {
    diafly,
    downTime,
    equipGun,
    finishStar,
    gameGetDia,
    gunstart,
    gunUnlockShowClip,
    lifeReviver,
    normalBtn,
    panerlEnter,
    songListScroll,
    startplayBtn,
    toggle,
    warn,
    ZQGunReward,
    ELPWelCome
}