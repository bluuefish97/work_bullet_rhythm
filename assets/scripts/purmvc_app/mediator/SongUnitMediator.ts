import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import SongUnit from "./SongUnit";
import { SongInfo, PlaySongInfo, ConsumablesAlterInfo, ConsumablesType, SongPlayType } from "../repositories/Rep";
import { CommandDefine } from "../command/commandDefine";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { PoolManager } from "../../util/PoolManager";
import GameManager from "../../GameManager";
import { MediatorDefine } from "./mediatorDefine";
import { FinishMediator } from "./FinishMediator";
import { CONSTANTS } from "../../Constants";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import AudioManager from "../../plugin/audioPlayer/AudioManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import AdController from "../../plugin/ADSdk/AdController";
 

export class SongUnitMediator extends Mediator {
    private songUnit: SongUnit = null;
    public songId: number = null;
    private songUnitInfo: SongInfo = null;
    private gamePxy: GamePxy;
    private ADInfo: any = null;
    private tempInfo: any = null;
    private iron: cc.SpriteFrame;

    private AdRefreshInterval:any;
    private isWinEndSong: boolean = false;   //是否是胜利页面的结算歌曲
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        this.songUnit = viewNode.getComponent(SongUnit);
        this.iron = null;
        this.bindListener();
    }

    private bindListener(): void {
        this.songUnit.setAdBtnClickEvent(() => {
            this.AdBtnClickEvent();
        })


        this.songUnit.setDiasBtnClickEvent(() => {
            this.diasBtnClickEvent();
        })


        this.songUnit.setStartBtnClickEvent(() => {
            this.startBtnClickEvent();
            AdController.instance.AdSDK.showInters();
        })
        this.songUnit.songPlaySwitchBtnClickEvent(() => {
            this.songPlaySwitchBtnClickEvent();
        })
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.UnluckSongSucceedResponce,
            CommandDefine.SongStarResponce,
            CommandDefine.SongScoreResponce,
            CommandDefine.PlaySongResponce,
            CommandDefine.StartSongSucceedResponce,
            CommandDefine.ADInitResponce,
        ];
    }

    public handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CommandDefine.UnluckSongSucceedResponce:
                {
                    if (this.songUnitInfo && notification.getBody() == this.songUnitInfo.musicId)     //解锁的当前的歌
                    {
                        this.songUnit.setUnlockState()
                        // console.log("解锁后");
                    }
                    break;
                }
            case CommandDefine.SongStarResponce:
                {
                    if (!this.songUnit.isFinish && this.songUnitInfo && notification.getBody().id == this.songUnitInfo.musicId)     //当前的歌的星星数
                    {
                        this.songUnit.setStarsNum(notification.getBody().val);
                    }
                    break;
                }
            case CommandDefine.SongScoreResponce:
                {
                    if (!this.songUnit.isFinish && this.songUnitInfo && notification.getBody().id == this.songUnitInfo.musicId)     //当前的歌的分数
                    {
                        this.songUnit.setBestScore(notification.getBody().val)
                    }
                    break;
                }
            case CommandDefine.PlaySongResponce:
                {
                    let playSongInfo = notification.getBody() as PlaySongInfo
                    if (this.songUnitInfo && playSongInfo.songName == this.songUnitInfo.musicName)     //播放当前的歌
                    {
                        this.songUnit.setSelectTipShowState(true);
                        this.songUnit.waitingEndAct();
                        this.songUnit.setPlayStateShow();
                    } else if (this.songUnitInfo && notification.getBody() != this.songUnitInfo.musicName && this.songUnit.IsPlayState) {
                        this.songUnit.setStopStateShow();
                        this.songUnit.isPause = false;
                        this.songUnit.setSelectTipShowState(false);
                    }
                    break;
                }
            case CommandDefine.StartSongSucceedResponce:
                {
                    if (this.songUnitInfo && notification.getBody() == this.songUnitInfo.musicId) {
                        this.songUnit.showNewStateTip(false);
                    }
                    break;
                }
            case CommandDefine.ADInitResponce:
                {
                    if (this.songUnitInfo && this.songUnitInfo.style == "AD" && !this.ADInfo) {
                        console.log("节点实例化成功，广告初始化成功");
                        this.setADshow();
                    }
                    break;
                }
            default:
                break;
        }
    }


    public AdBtnClickEvent() {
        console.log("广告解锁歌曲：" + this.songUnitInfo.musicName);
        //  cc.audioEngine.play(this.songUnit.btnClip, false, 1);
        
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
        if (!this.songUnit.isFinish) {
            ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "MainUI_UnlockMusic_Vclick", 1);
        }
        else if (this.songUnit.isFinish) {
            if (this.isWinEndSong) {
                ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "WinUI_UnlockMusic_Vclick", 1);
            }
            else {
                ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "FailureUI_UnlockMusic_Vclick", 1);
            }

        }
        let self = this;
        let onUnlockCallback = function (isSucces) {
            if (self.songUnit.isFinish) {
                let succeCallback = () => {
                    self.songUnit.StartBtnNode.active = false;
                    setTimeout(() => {
                        Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, self.songUnitInfo);
                        GameManager.getInstance().closeBlockInput();
                        self.songUnit.StartBtnNode.active = true;
                    }, 500)
                };
                if (isSucces) {
                    GameManager.getInstance().openBlockInput();
                    let finishMed = Facade.getInstance().retrieveMediator(MediatorDefine.FinishMediator) as FinishMediator;
                    finishMed.updateSongUnlockIron();
                    Facade.getInstance().sendNotification(CommandDefine.Consumables,
                        {
                            info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                            callback: succeCallback,
                            targetPos: self.songUnit.getStartBtnWorldPos()
                        }
                    );
                }


            }
            else {
                self.sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(self.songUnitInfo.musicName, SongPlayType.Immediately));
                if (isSucces) {
                    self.startBtnClickEvent();
                }

            }
        }

        Facade.getInstance().sendNotification(CommandDefine.UnluckSongRequest, ({
            song: this.songUnitInfo,
            cal: onUnlockCallback
        }))
    };
    public diasBtnClickEvent() {
        console.log("钻石解锁歌曲：" + this.songUnitInfo.musicName);
        //  cc.audioEngine.play(this.songUnit.btnClip, false, 1);
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
        ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MainUI_CoinUnlockBtn_Click", 1);
        let self = this;
        let onUnlockCallback = function (issucces) {
            self.sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(self.songUnitInfo.musicName, SongPlayType.Immediately));
            if (issucces) {
                self.startBtnClickEvent();
            }
        }
        Facade.getInstance().sendNotification(CommandDefine.UnluckSongRequest, ({
            song: this.songUnitInfo,
            cal: onUnlockCallback
        }))
    };
    public startBtnClickEvent() {
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.startplayBtn);
        // if (this.ADInfo) {
        //     ASCAd.getInstance().reportNativeAdClick(this.ADInfo.adId);
        //     return;
        // }
        GameManager.getInstance().openBlockInput();
        console.log("开始歌曲：" + this.songUnitInfo.musicName);
        let succeCallback = () => {
            this.songUnit.StartBtnNode.active = false;
            setTimeout(() => {
                Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, this.songUnitInfo);
                GameManager.getInstance().closeBlockInput();
                this.songUnit.StartBtnNode.active = true;
            }, 0.15)
        };
        Facade.getInstance().sendNotification(CommandDefine.Consumables,
            {
                info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                callback: succeCallback,
                targetPos: this.songUnit.getStartBtnWorldPos()
            }
        );

    };

    public songPlaySwitchBtnClickEvent() {
        // if (this.ADInfo) {
        //     GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.startplayBtn);
        //     ASCAd.getInstance().reportNativeAdClick(this.ADInfo.adId);
        //     return;
        // }
        if (this.songUnit.isPlayState)       //被选择的状态下
        {
            if (this.songUnit.isPause)        //当前的歌曲播放被暂停
            {
                this.songUnit.isPause = false;
                AudioManager.GetInstance(AudioManager).player.resumeMusic();
                this.songUnit.setPlayStateShow();
            }
            else {
                this.songUnit.isPause = true;
                AudioManager.GetInstance(AudioManager).player.pauseMusic();
                this.songUnit.setStopStateShow();
            }
        }
        else {
            this.songUnit.waitingAct();
            this.sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(this.songUnitInfo.musicName, SongPlayType.Immediately));
        }
    };

    public initSongInfo(info, id: number) {
        this.songUnitInfo = info as SongInfo;
        if (this.songUnitInfo.style == "AD") {
            this.ADInfo=this.tempInfo;
            this.songUnit.showHardTip(this.songUnitInfo.ex_lv);
            if(this.ADInfo)
            {
                this.setADshow(true)
                this.songUnit.setADState();
                let title=!this.ADInfo.title||this.ADInfo.title=="null"||this.ADInfo.title==null?"暂无广告":this.ADInfo.title ;
                let desc=!this.ADInfo.desc||this.ADInfo.desc=="null"||this.ADInfo.desc==null?"暂无广告":this.ADInfo.desc ;
                this.songUnit.setSongNameLabel(title);
                this.songUnit.setSingerNameLabel(desc);
                this.songUnit.showNewStateTip(false);
                let str=this.ADInfo.Native_icon?this.ADInfo.Native_icon:this.ADInfo.Native_BigImage;
                let remoteUrl = str;
                let image = new Image();
                image.onload = () => {
                    let texture = new cc.Texture2D();
                    texture.initWithElement(image);
                    texture.handleLoadedTexture();
                    let Spf=new cc.SpriteFrame(texture);
                    this.songUnit.setSongIronSpr(Spf);
                }
                image.onerror = error => {
                };
                image.src = remoteUrl;
                image.crossOrigin ="anonymous";
                return;
            }else{
                if(AdController.instance.ADOK){
                    this.setADshow();
                     return;
                 }
                 else{
                     console.log("节点实例化成功，但广告未初始化成功");
                 }
            }
           
        }else
        {
            this.ADInfo=null;
            clearInterval(this.AdRefreshInterval);
            let playState = this.gamePxy.getIsPlayState(this.songUnitInfo.musicName)
            let isPause = this.gamePxy.getIsPause(this.songUnitInfo.musicName)
            this.songUnit.setSongPlayState(playState, isPause);
            this.songUnit.setSongNameLabel(this.songUnitInfo.musicName);
            this.songUnit.setSingerNameLabel(this.songUnitInfo.singerName);
            this.songUnit.showHardTip(this.songUnitInfo.ex_lv);
            let isNewTip = this.songUnitInfo.ex_new == "Y" && this.gamePxy.getSongIdNewState(this.songUnitInfo.musicId);
            this.songUnit.showNewStateTip(isNewTip);
    
            if (this.gamePxy.getSongIdUnlockState(this.songUnitInfo.musicId)) {
                this.songUnit.setUnlockState();
                this.songUnit.setStarsNum(this.gamePxy.getSongStarNum(this.songUnitInfo.musicId));
                this.songUnit.setBestScore(this.gamePxy.getSongBestScore(this.songUnitInfo.musicId))
            }
            else {
                this.songUnit.setUnlockType(this.songUnitInfo.unlockType, parseInt(this.songUnitInfo.unlockCost));
                this.songUnit.setStarsNum(0);
                this.songUnit.setBestScore(0);
            }
            if (this.iron) {
                this.songUnit.setSongIronSpr(this.iron);
            }
            else {
                let self = this;
                let tempId = id % 10;
                let str = "songirons/" + tempId;
                PoolManager.instance.getSpriteFrame(str, (spriteFrame: cc.SpriteFrame) => {
                    self.songUnit.setSongIronSpr(spriteFrame);
                })
            }
        }
    }

    /**
     * 结束界面特殊的歌曲单元
     */
    public initEndSongInfo(info, isUnlock, isHasNewSong, isWin) {
        this.isWinEndSong = isWin
        this.songUnitInfo = info as SongInfo;
        console.log("结束界面特殊的歌曲单元  ");
        console.log(this.songUnitInfo.musicName);
        this.songUnit.setSongNameLabel(this.songUnitInfo.musicName);
        this.songUnit.setSingerNameLabel(this.songUnitInfo.singerName);
        this.songUnit.setUnlockType(this.songUnitInfo.unlockType, parseInt(this.songUnitInfo.unlockCost))
        this.songUnit.setStopStateShow();
        this.songUnit.setBestScore(0);
        this.songUnit.showHardTip(this.songUnitInfo.ex_lv);
        let isNewTip = this.songUnitInfo.ex_new == "Y" && this.gamePxy.getSongIdNewState(this.songUnitInfo.musicId);
        this.songUnit.showNewStateTip(isNewTip);
        this.songUnit.isPause = false;
        this.songUnit.setSelectTipShowState(false);
        if (!isHasNewSong) {
            this.songUnit.setEndUnlockState()
        }
        else {
            this.songUnit.setEndUnlokTipShow(isUnlock);
        }
    }

    public UnlockDefaultSong() {
        if (this.songUnitInfo.unlockType == "coin" && parseInt(this.songUnitInfo.unlockCost) == 0)  //默认解锁的歌
        {
            this.sendNotification(CommandDefine.UnluckSongRequest, ({
                song: this.songUnitInfo,
                cal: null
            }));
        }
    }
    private setADshow(isResume:boolean=false){
        // let cal=()=>{
        //     console.log("刷新广告");
        //     this.ADInfo = ASCAd.getInstance().getNativeAdInfo(1);
        //     this.tempInfo=this.ADInfo;
        //     this.songUnit.ADInfo=this.ADInfo;
        //     if(!this.ADInfo){
        //         setTimeout(()=>{
        //             cal();
        //         },10000);
        //         return;
        //     }
        //     // ASCAd.getInstance().reportNativeAdShow(this.ADInfo.adId);
        //     this.songUnit.setADState();
            
        //     let title=!this.ADInfo.title||this.ADInfo.title=="null"||this.ADInfo.title==null?"暂无广告":this.ADInfo.title ;
        //     let desc=!this.ADInfo.desc||this.ADInfo.desc=="null"||this.ADInfo.desc==null?"暂无广告":this.ADInfo.desc ;
        //     this.songUnit.setSongNameLabel(title);
        //     this.songUnit.setSingerNameLabel(desc);
        //     this.songUnit.showNewStateTip(false);
        //     let str=this.ADInfo.Native_icon?this.ADInfo.Native_icon:this.ADInfo.Native_BigImage;
        //     let remoteUrl = str;
        //     let image = new Image();
        //     image.onload = () => {
        //         let texture = new cc.Texture2D();
        //         texture.initWithElement(image);
        //         texture.handleLoadedTexture();
        //         let Spf=new cc.SpriteFrame(texture);
        //         this.songUnit.setSongIronSpr(Spf);
        //     }
        //     image.onerror = error => {
        //     };
        //     image.src = remoteUrl;
        //     image.crossOrigin ="anonymous";
        // }
        // !isResume&&cal();
        // this.AdRefreshInterval=setInterval(cal,30000);
    }


}