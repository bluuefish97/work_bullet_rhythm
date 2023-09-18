
import miniGameSDK from "./miniGameSDK";
import DouYinGameSDK from "./DouYinGameSDK";
import IOSSDK from "./IOSSDK";
import QQMiniGameSDK from "./QQMiniGameSDK";
import AudioManager from "../audioPlayer/AudioManager";
import GameManager from "../../GameManager";


const { ccclass, property } = cc._decorator;

interface SDKConstructor {
    new(): SDKInterface;
}


function createSDK(ctor: SDKConstructor): SDKInterface {
    return new ctor();
}



@ccclass
export default class AdController extends cc.Component implements IPVJudgment {

    static instance: AdController;
    AdSDK: SDKInterface;

    douyinAppId: string = "";  //   
    QQChannelId: string = "5371155";
    OPPOChannelId: string = "5371142";  // "5371142";


    videoPath;  //录制视频的地址
    videoCallback;


    // LIFE-CYCLE CALLBACKS:
    bannnerShowIng: boolean = false;

    videoShowing: boolean = false;
    Isoffline: boolean = false;
    isImmediatelyReuse = true;
    isIntersVideostate = false;

    isPlayGameVideo: boolean = false;
    ADOK: boolean = false;       //广告是否初始化成功


    onLoad() {
        cc.game.addPersistRootNode(this.node);
        this.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
        this.node.setPosition(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);

        if (AdController.instance) {
            if (AdController.instance != this) {
                this.destroy();
            }
        }
        else {
            AdController.instance = this;
        }
        this.ADOK = false;
    }

    start() {
       this.InitAdSdk();
    }

    InitAdSdk() {
        GameManager.getInstance().PlatformDeal(this);
        this.AdSDK.InitAD();
    }

    

    //安卓广告回调
    AndroidCallback() {
        if (this.videoCallback) {
            //安卓广告成功回调
            this.videoCallback(true);
        }

    }

    //安卓广告观看失败回调
    AndroidFailCallback() {
        if (this.isImmediatelyReuse) {
            console.log('立刻恢复音乐');
            AudioManager.GetInstance(AudioManager).player.resumeMusic();
        }
    }


    MiniGameDeal(): void {
        this.AdSDK = createSDK(miniGameSDK);
        console.log('local-----:' + '平台:小游戏')
    }
    DouYinGameDeal(): void {
        this.AdSDK = createSDK(DouYinGameSDK);
        console.log('local-----:' + '平台:抖音游戏')
    }
    QQMiniGameDeal(): void {
        this.AdSDK = createSDK(QQMiniGameSDK);
        console.log('local-----:' + '平台:QQ小游戏')
    }
    AndroidOPPOGameDeal(): void {
        //  this.AdSDK = createSDK(AndroidSDK);
        this.AdSDK = createSDK(miniGameSDK);
        console.log('local-----:' + '平台:安卓游戏')
    }
    AndroidVIVOGameDeal(): void {


        console.log('local-----:' + '平台:安卓游戏')
    }
    AndroidDOUYINGameDeal(): void {
        console.log('local-----:' + '平台:安卓游戏')
    }
    IOSOPPOGameDeal(): void {
        // this.AdSDK = createSDK(IOSSDK);
        this.AdSDK = createSDK(miniGameSDK);
        console.log('local-----:' + '平台:IOS游戏')
    }
    IOSVIVOGameDeal(): void {
        this.AdSDK = createSDK(IOSSDK);

        console.log('local-----:' + '平台:IOS游戏')
    }
    IOSDOUYINGameDeal(): void {
        this.AdSDK = createSDK(IOSSDK);
        console.log('local-----:' + '平台:IOS游戏')
    }

}
