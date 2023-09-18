
import BasePlayer from "./BasePlayer";
import VivoPlayer from "./VivoPlayer";
import OppoPlayer from "./OppoPlayer";
import { Singleton } from "../Singleton";
import TTPlayer from "./TTPlayer";
// import config, { Platform } from "../../../config/config";
import WebPlayer from "./WebPlayer";
import config, { Platform } from "../../../config/config";


const { ccclass, property } = cc._decorator;


interface PlayerConstructor {
    new(): BasePlayer;
}


function createPlayer(ctor: PlayerConstructor): BasePlayer {
    return new ctor();
}

@ccclass
export default class AudioManager extends Singleton<AudioManager> {

    player: BasePlayer;
    constructor() {
        super();
        console.log('新建单例:  AudioManager');
        this.InitAudioPlayer();
    }

    private InitAudioPlayer() {
        console.log('初始化: AudioManager')
        switch (config.platform) {
            case Platform.vivo:
                this.player = createPlayer(VivoPlayer);
                break;
            case Platform.oppo:
                this.player = createPlayer(OppoPlayer);
                //this.player = createPlayer(WebPlayer);
                break;
            case Platform.douYin:
                this.player = createPlayer(TTPlayer);
               // this.player = createPlayer(WebPlayer);
                break;
            default:
                this.player = createPlayer(WebPlayer)
                break;
        }
        this.player.initAudioEngine();
    }
}
