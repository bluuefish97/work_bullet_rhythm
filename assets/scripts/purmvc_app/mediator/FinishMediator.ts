/**
 * 结算界面中介
 */
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import UIPanelCtr from "../../util/UIPanelCtr";
import FinishPanel from "./FinishPanel";
import { PanelType } from "../../util/PanelType";
import { CommandDefine } from "../command/commandDefine";
import PlayStage, { SettleInfo, PlayPattern, ELPSettleInfo } from "../../Game/PlayStage";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { SongUnitMediator } from "./SongUnitMediator";
import { MediatorDefine } from "./mediatorDefine";
import { GamePxy } from "../proxy/GamePxy";
import { ProxyDefine } from "../proxy/proxyDefine";
import { SongInfo, ConsumablesAlterInfo, ConsumablesType, SongPlayType, PlaySongInfo } from "../repositories/Rep";
import { OpenPanelBody } from "../command/OpenPanelCmd";
import GameManager from "../../GameManager";
import { CONSTANTS } from "../../Constants";
import { MusicPxy } from "../proxy/MusicPxy";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import { ClipEffectType } from "../../AudioEffectCtrl";
import { UploadData } from "../command/ELP_UploadingScoreAndTimeCmd";
import RankManager from "../../Rank/RankManager";
import { EndlessPlayingPxy } from "../proxy/EndlessPlayingPxy";
import AdController from "../../plugin/ADSdk/AdController";
import config, { Platform } from "../../../config/config";

export class FinishMediator extends Mediator {
    private finishPanel: FinishPanel = null;
    private endlessPlayingPxy: EndlessPlayingPxy;
    private gamePxy: GamePxy = null;
    private musicPxy: MusicPxy = null;
    private newSong: SongInfo;
    private curSong: SongInfo;
    private isFirstWin: boolean = false;
    private isELPFinsh: boolean = false;
    public IsWin: boolean = false;
    public IsExit: boolean = false;   //是否处于结算状态
    private tempUnlockType: string;   //结束面板要显示的歌曲信息原始的配置的解锁类型
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.endlessPlayingPxy = Facade.getInstance().retrieveProxy(ProxyDefine.EndlessPlayingPxy) as EndlessPlayingPxy;
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        this.musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        this.finishPanel = viewNode.getComponent(FinishPanel);
        Facade.getInstance().registerMediator(new SongUnitMediator(MediatorDefine.SongUnitMediator + "FinishUnit", this.finishPanel.ADsongUnit.node));
        this.finishPanel.closeMoonCakeCollectBox();
        this.bindListener();
        if (cc.director.getScene().name == "guideGame") {
            cc.director.preloadScene("home");
        }
    }

    private bindListener(): void {
        this.finishPanel.setHomeBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.backHome();
            if (this.IsWin) {
                ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "WinUI_ReturnMainBtn_Click", 1);
            }
            else if (this.isELPFinsh) {
                ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MWPKfinish_Colse_Click", 1);
            }
            else {
                ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "FailureUI_ReturnMainBtn_Click", 1);
            }
        }, this);
        this.finishPanel.setAgainBtnClickEvent(
            () => {
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                this.againPlay();
                if (this.IsWin) {

                }
                else {
                    ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "FailureUI_AgainGameBtn_Click", 1);
                }
            }, this);
        this.finishPanel.setNewBtnClickEvent(
            () => {
                // cc.audioEngine.play(this.finishPanel.btnClip, false, 1);
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                // 正常调用不看视频
                this.newPlay();

                if (this.IsWin) {
                    ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "WinUI_UnlockMusic_Vclick", 1);
                }
                else {
                    ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "FailureUI_UnlockMusic_Vclick", 1);
                }
            }, this);
        this.finishPanel.setOldBtnClickEvent(
            () => {
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                // 正常调用不看视频
                this.oldPlay();

            }, this);
        this.finishPanel.setOverNewBtnClickEvent(
            () => {
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                 // 正常调用不看视频
                 this.newPlay();
            }, this);
        this.finishPanel.setShareRecBtnClickEvent(
            () => {
                //   cc.audioEngine.play(this.finishPanel.btnClip, false, 1);
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
                this.sendNotification(CommandDefine.ShareRec);
                ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "ShareUI_ShareBtn_Click", 1);
                if (this.IsWin) {
                    ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "WinUI_ShareBtn_Click", 1);
                }
                else {
                    ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "FailureUI_ShareBtn_Click", 1);
                }
            }, this);
        this.finishPanel.setELPAgainButtonClickEvent(() => {
            Facade.getInstance().sendNotification(CommandDefine.StartEndlessPlayingRequest);
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MWPKfinish_Again_Click", 1);
        })
        this.finishPanel.onEnterCall =  () =>  {

            if ( AdController.instance.AdSDK.getBlockFlag(3,120,650)) {
                AdController.instance.AdSDK.showBlock(3,120,650);
            }

            this.IsExit = true;
            if (PlayStage.getIntance && PlayStage.getIntance().playingPattern == PlayPattern.Endless) {
                ReportAnalytics.getInstance().reportAnalytics("View_Show", "Infinite_Finsh_Show", 1);
            }
            else {
                if (this.IsWin || this.isFirstWin) {
                    ReportAnalytics.getInstance().reportAnalytics("View_Show", "WinUI_Show", 1);
                    ReportAnalytics.getInstance().reportAnalytics("Song_Massage", "WinUI_Show", 1);
                }
                else {
                    ReportAnalytics.getInstance().reportAnalytics("View_Show", "FailureUI_Show", 1);
                }
            }


            if (!this.gamePxy.ZQA_checkValidTime() || !this.gamePxy.ZQA_getIsOpenActivity() || this.gamePxy.ZQA_MoonCakeNumIsEnough()) {
                this.finishPanel.ZQV_moonCakeSetteBox.active = false;
            }
        }
        this.finishPanel.onExitCall = () => {
            AdController.instance.AdSDK.hideBlock(3)
            this.IsExit = false;
            this.finishPanel.ZQV_moonCakeSetteBox.active = false;
        }
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.Settle,
            CommandDefine.EndRecResponce,
            CommandDefine.v1_1_4GetPowerSettle,
        ];
    }

    public handleNotification(notification: INotification): void {
        switch (notification.getName()) {
            case CommandDefine.Settle:
                if (!this.isELPFinsh) {
                    let settle = notification.getBody() as SettleInfo;
                    this.finishPanel.setStarsLight(settle.starNum);
                    this.finishPanel.setScoreLabelShow(settle.scoreNum);
                    this.finishPanel.setDiaLabelShow(settle.diaNum);
                }
                else {
                    let settle = notification.getBody() as ELPSettleInfo;
                    this.finishPanel.setELPScoreBoxLabelShow(settle.scoreNum);
                    this.finishPanel.setELPPassBoxLabelShow(settle.passNum);
                    this.finishPanel.setELPTimeBoxLabelShow(settle.finalSurvivalNum);
                    this.finishPanel.setELPBeseComboBoxLabelShow(settle.beseComboNum);
                    if (settle.scoreNum > this.endlessPlayingPxy.getLocalMaxScore()) {
                        this.endlessPlayingPxy.setLocalMaxScore(settle.scoreNum);
                        console.log("新记录!!!");
                        this.finishPanel.showELPSettle(true);
                    }
                    else {
                        this.finishPanel.showELPSettle(false);
                    }
                    if (settle.finalSurvivalNum > this.endlessPlayingPxy.getLocalMaxSurvivalTime()) {
                        this.endlessPlayingPxy.setLocalMaxSurvivalTime(settle.finalSurvivalNum);
                    }
                    RankManager.getInstance().getUserRank((res) => {
                        if (res != false) {
                            console.log("先拉取用户排行!!!");
                            console.log(res);
                            if (!res || res.rankScore.rankScore < settle.scoreNum) {
                                //console.log("新记录!!!");
                                // this.finishPanel.showELPSettle(true);
                            }
                            else {
                                //  this.finishPanel.showELPSettle(false);
                            }
                            this.sendNotification(CommandDefine.ELP_UploadingScoreAndTime, new UploadData(settle.scoreNum, settle.finalSurvivalNum));


                            // if (settle.scoreNum > this.endlessPlayingPxy.getLocalMaxScore()) {
                            //     this.endlessPlayingPxy.setLocalMaxScore(settle.scoreNum);
                            // }
                            // if (settle.finalSurvivalNum > this.endlessPlayingPxy.getLocalMaxSurvivalTime()) {
                            //     this.endlessPlayingPxy.setLocalMaxSurvivalTime(settle.finalSurvivalNum);
                            // }
                        }
                    })

                }
                break;
            case CommandDefine.EndRecResponce:

                if (UIPanelCtr.getInstance().checkIsTopPanel(PanelType.FinishPanel)) {
                    if (cc.director.getScene().name != "guideGame" && this.gamePxy.ZQA_checkValidTime() && this.gamePxy.ZQA_getIsOpenActivity() && !this.gamePxy.ZQA_MoonCakeNumIsEnough()) {
                        this.finishPanel.showShareRecBtn(true);
                    }
                    else {
                        this.finishPanel.showShareRecBtn(false);
                        this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.ShareRecPanel));
                    }
                    // this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.ShareRecPanel));
                }
            default:
        }
    }


    /**
     * 设置成失败页面
     */
    public setFailShow(curInfo: SongInfo, unlockInfo: SongInfo, isHaveNewSong: boolean, _unlockType: string) {
        this.isELPFinsh = false;
        this.finishPanel.isWin = false;
        this.finishPanel.showNormalSettle();
        this.curSong = curInfo;
        this.newSong = unlockInfo;
        this.tempUnlockType = _unlockType
        this.finishPanel.switchADsongUnitShow(true);
        this.finishPanel.AgainBtn.node.active = false;
        this.finishPanel.failPartShow();
        if (config.platform == Platform.oppo || config.platform == Platform.web) {
            this.finishPanel.OldBtn.node.active = true;
            this.finishPanel.NewBtn.node.active = false;
            this.finishPanel.OverNewBtn.node.active = false;
        } else {
            this.finishPanel.OldBtn.node.active = !isHaveNewSong;
            this.finishPanel.NewBtn.node.active = isHaveNewSong;
            this.finishPanel.OverNewBtn.node.active = false;
        }
        this.isFirstWin = false;
        this.finishPanel.Now_sure_node = isHaveNewSong ? this.finishPanel.NewBtn.node : this.finishPanel.OldBtn.node;

    }
    /**
     * 设置首次成功页面
     */
    public setFirstWinShow(curInfo: SongInfo, unlockInfo: SongInfo, isHaveNewSong: boolean, _unlockType: string) {
        this.isELPFinsh = false;
        this.finishPanel.isWin = true;
        this.finishPanel.showNormalSettle();
        this.curSong = curInfo;
        this.newSong = unlockInfo;
        this.tempUnlockType = _unlockType
        this.isFirstWin = true;
        // this.finishPanel.setnewSongLabel(this.newSong.musicName);
        this.finishPanel.switchADsongUnitShow(true);
        this.finishPanel.AgainBtn.node.active = false;
        // this.finishPanel.switchNewSongNodeShow(true);
        this.finishPanel.showNextBtn();
        this.finishPanel.winPartShow();
        this.finishPanel.OldBtn.node.active = !isHaveNewSong;
        this.finishPanel.NewBtn.node.active = false;
        this.finishPanel.OverNewBtn.node.active = isHaveNewSong;
        this.finishPanel.Now_sure_node = isHaveNewSong ? this.finishPanel.OverNewBtn.node : this.finishPanel.OldBtn.node;
    }
    /**
        * 设置成功页面
        */
    public setWinShow(curInfo: SongInfo, unlockInfo: SongInfo, isHaveNewSong: boolean, _unlockType: string) {
        this.isELPFinsh = false;
        this.finishPanel.isWin = true;
        this.finishPanel.showNormalSettle();
        this.curSong = curInfo;
        this.newSong = unlockInfo;
        this.tempUnlockType = _unlockType
        this.isFirstWin = false;
        this.finishPanel.switchADsongUnitShow(true);
        this.finishPanel.AgainBtn.node.active = false;
        this.finishPanel.showNextBtn();
        this.finishPanel.winPartShow();
        if (config.platform == Platform.oppo || config.platform == Platform.web) {
            this.finishPanel.OldBtn.node.active = true;
            this.finishPanel.NewBtn.node.active = false;
            this.finishPanel.OverNewBtn.node.active = false;
        } else {
            this.finishPanel.OldBtn.node.active = !isHaveNewSong;
            this.finishPanel.NewBtn.node.active = isHaveNewSong;
            this.finishPanel.OverNewBtn.node.active = false;
        }

        this.finishPanel.Now_sure_node = isHaveNewSong ? this.finishPanel.NewBtn.node : this.finishPanel.OldBtn.node;
    }

    /**
    * 设置无尽模式页面
    */
    public setELPShow() {
        this.IsWin = false;
        this.isELPFinsh = true;
        this.finishPanel.switchADsongUnitShow(false);
    }
    /**
     * 返回主页
     */
    public backHome() {
        if (this.newSong) {
            this.newSong.unlockType = this.tempUnlockType;
        }
        if (cc.director.getScene().name == "guideGame") {
            GameManager.getInstance().openBlockInput();
            this.sendNotification(CommandDefine.LoadRequest, () => {
                GameManager.getInstance().closeBlockInput();
                Facade.getInstance().removeMediator(MediatorDefine.ReviveMediator);
                Facade.getInstance().removeMediator(MediatorDefine.FinishMediator);
                Facade.getInstance().removeMediator(MediatorDefine.ShareRecMediator);
                Facade.getInstance().removeMediator(MediatorDefine.CoinPartMediator);
                Facade.getInstance().removeMediator(MediatorDefine.SongUnitMediator + "FinishUnit");
                UIPanelCtr.getInstance().resetPanelStack();
            });
        }
        else {
            cc.director.loadScene("home", () => {
                console.log("返回主页场景加载完成！！");
                UIPanelCtr.getInstance().clearPanelStack();
                Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.HomePartView))
                if (this.isELPFinsh) {
                    // this.endlessPlayingPxy.getuserInfo();
                    Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.EndlessPlayingHomePanel));
                }
                else {
                    if (this.gamePxy.affordLockSongInfoList(this.musicPxy.getData())) {
                        this.checkIsOpenRecomdPanel();
                    }
                }
            });
        }
    }

    /**
     * 判断是否还要弹专属页面
     */
    checkIsOpenRecomdPanel() {
        this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.SongRecommendPanel))
        this.curSong = this.musicPxy.getSongListNext(this.curSong.musicName);
        this.musicPxy.setLastPlaySongName(this.curSong.musicName);
        this.sendNotification(CommandDefine.WinSongRollNext);

        // if (CONSTANTS.MaxShowRecomdSongNum > 0 && CONSTANTS.IsUnlockRecomdSong == false) {
        //     this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.SongRecommendPanel))
        //     if (this.IsWin) {
        //         this.curSong = this.musicPxy.getSongListNext(this.curSong.musicName);
        //         this.musicPxy.setLastPlaySongName(this.curSong.musicName);
        //         this.sendNotification(CommandDefine.WinSongRollNext);
        //     }
        // }
        // else {

        //     if (this.IsWin) {
        //         this.curSong = this.musicPxy.getSongListNext(this.curSong.musicName);
        //         this.musicPxy.setLastPlaySongName(this.curSong.musicName);
        //         this.sendNotification(CommandDefine.WinSongRollNext);
        //     }
        //     this.sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(this.curSong.musicName, SongPlayType.Immediately));
        // }
    }

    /**
    * 再次游戏
    */
    public againPlay() {
        this.newSong.unlockType = this.tempUnlockType;
        console.log("再次挑战歌曲：" + this.curSong.musicName);
        GameManager.getInstance().openBlockInput();
        let succeCallback = () => {
            GameManager.getInstance().closeBlockInput();
            setTimeout(() => {
                Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, this.curSong);

            }, 500)

        };
        Facade.getInstance().sendNotification(CommandDefine.Consumables,
            {
                info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                callback: succeCallback,
                targetPos: this.finishPanel.AgainBtn.node.convertToWorldSpaceAR(cc.v2(0, 0))
            }
        );
    }
    /**
    * 挑战新游戏
    */
    public newPlay() {
        let self = this;
        let succeCallback = () => {
            GameManager.getInstance().closeBlockInput();
            Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, self.newSong)
        };

        if (this.isFirstWin) {
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "WinUI_StartNewMus_Click", 1);
            GameManager.getInstance().openBlockInput();
            Facade.getInstance().sendNotification(CommandDefine.Consumables,
                {
                    info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                    callback: succeCallback,
                    targetPos: self.finishPanel.NewBtn.node.convertToWorldSpaceAR(cc.v2(0, 0))
                }
            );
        }
        else {
            console.log("解锁游戏提供的待解锁的歌曲：" + this.newSong.musicName);
            let onUnlockCallBack = function (isSucces) {
                GameManager.getInstance().closeBlockInput();
                if (isSucces) {
                    self.updateSongUnlockIron();
                    GameManager.getInstance().openBlockInput();
                    Facade.getInstance().sendNotification(CommandDefine.Consumables,
                        {
                            info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                            callback: succeCallback,
                            targetPos: self.finishPanel.NewBtn.node.convertToWorldSpaceAR(cc.v2(0, 0))
                        }
                    );
                }
            }
            Facade.getInstance().sendNotification(CommandDefine.UnluckSongRequest, ({
                song: this.newSong,
                cal: onUnlockCallBack
            }))
        }


    }

    /**
     * 更新页面的解锁图标
     */
    updateSongUnlockIron() {
        this.finishPanel.NewBtn.node.active = false;
        this.finishPanel.OldBtn.node.active = true;
    }
    /**
       * 挑战旧歌曲
       */
    public oldPlay() {
        this.newSong.unlockType = this.tempUnlockType;
        let self = this;
        GameManager.getInstance().openBlockInput();
        console.log("重新玩游戏提供的已经解锁的歌曲：" + this.newSong.musicName);
        let succeCallback = () => {
            GameManager.getInstance().closeBlockInput();
            Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, this.newSong)
        };
        Facade.getInstance().sendNotification(CommandDefine.Consumables,
            {
                info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                callback: succeCallback,
                targetPos: self.finishPanel.OldBtn.node.convertToWorldSpaceAR(cc.v2(0, 0))
            }
        );
    }

    /**
     * 打开月饼结算
     */
    public ZQV_openMoonCakeSettle(num: number) {
        this.finishPanel.openMoonCakeCollectBox(() => {
            console.log("本次游戏获得了月饼数： " + num);
            this.gamePxy.ZQA_addMoonCakeNum(num);
            // let Numstr = "本次游戏获得了月饼数： " + num + "   " + this.gamePxy.ZQA_getMoonCakeNum() + "/" + CONSTANTS.ZQA_MinConvertMoonCakeNum;
            let Numstr = "+ " + num;
            this.finishPanel.updateMoonTimeNum(Numstr);
            let localcur = this.gamePxy.ZQA_getMoonCakeNum() >= CONSTANTS.ZQA_MinConvertMoonCakeNum ? CONSTANTS.ZQA_MinConvertMoonCakeNum : this.gamePxy.ZQA_getMoonCakeNum()
            let proStr = localcur + "/" + CONSTANTS.ZQA_MinConvertMoonCakeNum;
            this.finishPanel.updateMoonCakeNumProLabel(proStr);
            this.finishPanel.updateMoonTimeProBar(localcur / CONSTANTS.ZQA_MinConvertMoonCakeNum, () => {
                this.finishPanel.shareZQVSure_BtnShowAct();
            })

        });
    }
}