import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import UIPanelCtr from "../../util/UIPanelCtr";
import SignUnit from "./SignUnit";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { CommandDefine } from "../command/commandDefine";
import { SignInfo, SongInfo, PlaySongInfo, SongPlayType, ConsumablesAlterInfo, ConsumablesType } from "../repositories/Rep";
import SongRecommendPanel from "./SongRecommendPanel";
import { MusicPxy } from "../proxy/MusicPxy";
import AudioManager from "../../plugin/audioPlayer/AudioManager";
import GameManager from "../../GameManager";
import { CONSTANTS } from "../../Constants";
import { PoolManager } from "../../util/PoolManager";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import { ClipEffectType } from "../../AudioEffectCtrl";

export class SongRecommendMediator extends Mediator {
    private songRecommendPanel: SongRecommendPanel = null;
    private recommendSong: SongInfo = null;
    private isPlayState: boolean;     //是否处于播放
    private signUnits: Array<SignUnit> = new Array<SignUnit>();
    private signConfig: Array<SignInfo> = new Array<SignInfo>();
    private waitSignInfo: SignInfo;
    private originMaxShowRecomdSongNum: number = 0;
    private originUnlockType: string;
    private gamePxy: GamePxy;
    private musicPxy: MusicPxy;
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        this.recommendSong = this.gamePxy.affordAdInfo(this.musicPxy.getData());
        console.log("提供的未解锁的歌曲--------------");
        console.log(this.recommendSong.musicName);
        this.originUnlockType = this.recommendSong.unlockType;
        this.recommendSong.unlockType = "video";
        this.originMaxShowRecomdSongNum = CONSTANTS.MaxShowRecomdSongNum;
        this.songRecommendPanel = viewNode.getComponent(SongRecommendPanel);
        this.bindListener();
    }

    private bindListener(): void {
        this.songRecommendPanel.setPlayBtnClickEvent(() => {
            this.isPlayState = !this.isPlayState;
            this.songRecommendPanel.setPlayStateShow(this.isPlayState);
            if (!this.isPlayState) {
                AudioManager.GetInstance(AudioManager).player.pauseMusic();
            }
            else {
                AudioManager.GetInstance(AudioManager).player.resumeMusic();
            }
        })

        this.songRecommendPanel.setCanelBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);

            let lastSongName = this.musicPxy.getLastPlaySongName();
            Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
            UIPanelCtr.getInstance().popPanel();
            CONSTANTS.IsUnlockRecomdSong = false;
            this.recommendSong.unlockType = this.originUnlockType;
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MusicRec_GiveUpBtn", 1);
            // if (ASCAd.getInstance().getErrVideoFlag()) {
            //     // 可进入误触模式,调用展示视频方法
            //     ASCAd.getInstance().showVideo((isSu) => {
            //         let self = this;
            //         let succeCallback = () => {
            //             GameManager.getInstance().closeBlockInput();
            //             Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, self.recommendSong)
            //         };
            //         if (isSu) {
            //             CONSTANTS.IsUnlockRecomdSong = true;
            //             this.gamePxy.UnlockSong(this.recommendSong.musicId);
            //             self.songRecommendPanel.switchUnlockState(true);
            //             GameManager.getInstance().openBlockInput();
            //             Facade.getInstance().sendNotification(CommandDefine.Consumables,
            //                 {
            //                     info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
            //                     callback: succeCallback,
            //                     targetPos: self.songRecommendPanel.AD_UnLockBtn.node.convertToWorldSpaceAR(cc.v2(0, 0))
            //                 }
            //             );
            //         } else {
            //             // let lastSongName = this.musicPxy.getLastPlaySongName();
            //             // Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
            //             // UIPanelCtr.getInstance().popPanel();
            //             // CONSTANTS.IsUnlockRecomdSong = false;
            //             // this.recommendSong.unlockType = this.originUnlockType;
            //         }

            //     });
            // }
            // else {
            //     let lastSongName = this.musicPxy.getLastPlaySongName();
            //     Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(lastSongName, SongPlayType.Immediately));
            //     UIPanelCtr.getInstance().popPanel();
            //     CONSTANTS.IsUnlockRecomdSong = false;
            //     this.recommendSong.unlockType = this.originUnlockType;
            //     ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MusicRec_GiveUpBtn", 1);
            // }


        });
        this.songRecommendPanel.setADUnLockBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "MusicRec_Vlick", 1);
            CONSTANTS.IsUnlockRecomdSong = true;
            this.newPlay();
        })
        this.songRecommendPanel.setUnLockBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.oldPlay();
        })
        this.songRecommendPanel.onEnterCall = () => {
            this.isPlayState = true;
            CONSTANTS.MaxShowRecomdSongNum--;
            this.songRecommendPanel.setPlayStateShow(this.isPlayState);
            this.songRecommendPanel.setRecommendSongName(this.recommendSong.musicName);

            let self = this;
            let id = this.musicPxy.getSongListId(this.recommendSong.musicName);
            let tempId = id % 10;
            let str = "songirons/" + tempId;
            PoolManager.instance.getSpriteFrame(str, (spriteFrame: cc.SpriteFrame) => {
                self.songRecommendPanel.setSongIronSpr(spriteFrame);
            })
            ReportAnalytics.getInstance().reportAnalytics("View_Show", "MusicRecUI_Show", 1);
            Facade.getInstance().sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(this.recommendSong.musicName, SongPlayType.Immediately));
        };
    }


    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: INotification): void {
    }

    /**
   * 挑战新游戏
   */
    public newPlay() {
        console.log("解锁游戏提供的待解锁的歌曲：" + this.recommendSong.musicName);
        let self = this;
        let succeCallback = () => {
            GameManager.getInstance().closeBlockInput();
            Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, self.recommendSong)
        };
        let onUnlockCallBack = function (isSucces) {
            if (isSucces) {
                self.songRecommendPanel.switchUnlockState(true);
                GameManager.getInstance().openBlockInput();
                Facade.getInstance().sendNotification(CommandDefine.Consumables,
                    {
                        info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                        callback: succeCallback,
                        targetPos: self.songRecommendPanel.AD_UnLockBtn.node.convertToWorldSpaceAR(cc.v2(0, 0))
                    }
                );
            }
        }
        Facade.getInstance().sendNotification(CommandDefine.UnluckSongRequest, ({
            song: this.recommendSong,
            cal: onUnlockCallBack
        }))

    }

    public oldPlay() {
        let self = this;
        let succeCallback = () => {
            GameManager.getInstance().closeBlockInput();
            Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, self.recommendSong)
        };
        GameManager.getInstance().openBlockInput();
        Facade.getInstance().sendNotification(CommandDefine.Consumables,
            {
                info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                callback: succeCallback,
                targetPos: self.songRecommendPanel.AD_UnLockBtn.node.convertToWorldSpaceAR(cc.v2(0, 0))
            }
        );

    }

}