import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import HomePartView from "./HomePartView";
import UIPanelCtr from "../../util/UIPanelCtr";
import { PanelType } from "../../util/PanelType";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { SongUnitMediator } from "./SongUnitMediator";
import { MediatorDefine } from "./mediatorDefine";
import { ProxyDefine } from "../proxy/proxyDefine";
import { MusicPxy } from "../proxy/MusicPxy";
import { CommandDefine } from "../command/commandDefine";
import { GamePxy } from "../proxy/GamePxy";
import { GunSkinInfo, SongInfo, PlaySongInfo, SongPlayType, ConsumablesAlterInfo, ConsumablesType, BoxSkinInfo } from "../repositories/Rep";
import { GunSkinUnitMediator } from "./GunSkinUnitMediator";
import { OpenPanelBody } from "../command/OpenPanelCmd";
import { MapSkinMediator } from "./MapSkinMediator";
import { TipType } from "../../util/PleaseClickSys/PleaseClickSys";
import GameManager from "../../GameManager";
import { CONSTANTS } from "../../Constants";
import RecController, { RecState } from "../../RecController";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import { BoxSkinUnitMediator } from "./BoxSkinUnitMediator";
import { Utility } from "../../util/Utility";
import { ClipEffectType } from "../../AudioEffectCtrl";
import { EndlessPlayingPxy, ELPEventState, UserInfo } from "../proxy/EndlessPlayingPxy";
import { CoinPartMediator } from "./CoinPartMediator";
import config, { Platform } from "../../../config/config";
import AdController from "../../plugin/ADSdk/AdController";
import UserData from "../../Rank/UserData";
import { V1_1_4HasPowerPartMediator } from "./V1_1_4HasPowerPartMediator";
import { V1_1_4Pxy } from "../proxy/V1_1_4Pxy";
import { ActivityEventState } from "../proxy/ActivityPxy";

export class HomePartMediator extends Mediator {
    private homePartView: HomePartView = null;
    private songTable: Array<SongInfo> = new Array<SongInfo>();
    private readonly maxSongUnitSize: number = 8;
    private unitHight: number = 255;
    private unitBoxHight: number = 255;   //方块列表的大小
    private endSongIdx: number = -1;    //歌曲列表内最后变化的下标
    private songlist: Array<cc.Node> = new Array<cc.Node>();
    private songMedlist: Array<SongUnitMediator> = new Array<SongUnitMediator>();
    private musicPxy: MusicPxy;
    private gamePxy: GamePxy;
    private ELPPxy: EndlessPlayingPxy;
    private v1_1_4Pxy: V1_1_4Pxy;
    private quickStartSong: SongInfo;             //快速开始的歌曲
    private curContentY: number = 0;
    private lastContentY: number = 0;
    private scrollListClipId: number = null;
    private isFirstOpenGun: boolean = false;
    private isFirstOpenBox: boolean = false;
    private isAssignedELPGunSkin: boolean = false;     //是否设置过elp枪
    private isRollNext: boolean = false;
    private tempMoonCake: number = 0;
    private ELPGunSkin: Array<any> = new Array<any>();
    private ELPTempEventState: any = null;


    public get QuickStartSong(): SongInfo {
        return this.quickStartSong
    }

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
        this.musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy
        this.ELPPxy = Facade.getInstance().retrieveProxy(ProxyDefine.EndlessPlayingPxy) as EndlessPlayingPxy;
        this.v1_1_4Pxy = Facade.getInstance().retrieveProxy(ProxyDefine.V1_1_4Pxy) as V1_1_4Pxy;
        this.homePartView = viewNode.getComponent(HomePartView);
        this.gamePxy.getGunConfig(this.assignGunSkinvUnit.bind(this));

        this.ELPPxy.getELPEventState((state) => {
            if (state == ELPEventState.ING) {
                // console.log("无尽模式活动页  ELPEventState.ING");
                // this.homePartView.ELP_showActStyle();
            }
            else if (state == ELPEventState.SETTE) {
                console.log("无尽模式活动页  ELPEventState.SETTE");
                this.homePartView.SignBtn.node.active = false;
                this.homePartView.BackupeELPBtn.node.active = true;
            }
            else {
                console.log("无尽模式活动页  ELPEventState.END");
                this.homePartView.ELP_showNormalStyle();
            }
        })
        if (this.v1_1_4Pxy.V1_1_4EventState != ActivityEventState.END) {
            // if(this.v1_1_4Pxy.V1_1_4EventState==ActivityEventState.SETTE&&config.platform!=Platform.douYin)
            // {
            //     this.homePartView.showNormalStyle();
            // }else{
            //     this.homePartView.showActStyle();
            // }
            this.homePartView.showActStyle();
        }
        else {
            this.homePartView.showNormalStyle();
        }
        this.tempMoonCake = this.gamePxy.ZQA_getMoonCakeNum();
        this.bindListener();
    }

    private bindListener(): void {
        this.homePartView.setRecBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (RecController.getInstance().recState == RecState.WaitRecing) {
                this.sendNotification(CommandDefine.StartRec);
                ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MainUI_ScreenBtn_Click", 1);
            }
            else if (RecController.getInstance().recState == RecState.InRecing) {
                this.sendNotification(CommandDefine.EndRec);
            }
        })
        this.homePartView.setSignBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            CONSTANTS.isAutoPop = false;
            this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.SignPanel));
        });
        this.homePartView.setAchiBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.AchiPanel));
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MainUI_achievementBtn_Click", 1);
        });
        this.homePartView.setSongListScrollViewScrolling(this.onSongListScrolling.bind(this));
        this.homePartView.setSongToggleEvent(this.homePartView.openSongListPart)
        this.homePartView.setSkinToggleEvent(this.requsetSkinSys, this)
        this.homePartView.setSongListLiftMove((event) => {
            if (event.getDeltaX() > 20 && Math.abs(event.getDeltaY()) < 20) {
                this.homePartView.playToggleContainerClipEft();
                this.homePartView.mainToggleContainer.toggleItems[0].isChecked = false;
                this.homePartView.mainToggleContainer.toggleItems[1].isChecked = true;
                console.log("打开皮肤界面");
                this.ELPPxy.getEventTime((type: ELPEventState) => {
                    if (type == ELPEventState.END) return;
                    if (!this.isAssignedELPGunSkin) {
                        UserData.getInstance().getuserID((isLogin: boolean) => {
                            this.sendNotification(CommandDefine.UserLoginResponce, isLogin)
                        })
                    }
                });
                ReportAnalytics.getInstance().reportAnalytics("View_Show", "SkinUI_Show", 1);
                this.homePartView.openSkinShopPart(this.homePartView.mainToggleContainer.toggleItems[1])
                if (!this.isFirstOpenGun) {
                    this.gamePxy.getGunConfig(this.assignGunSkinvUnit.bind(this));
                }
            }
        });

        this.homePartView.setGunListRightMove((event) => {
            if (event.getDeltaX() < -20 && Math.abs(event.getDeltaY()) < 20) {
                this.homePartView.playToggleContainerClipEft();
                this.homePartView.mainToggleContainer.toggleItems[0].isChecked = true;
                this.homePartView.mainToggleContainer.toggleItems[1].isChecked = false;
                this.homePartView.openSongListPart(this.homePartView.mainToggleContainer.toggleItems[0]);
            }
        });
        this.homePartView.setQuickStartBtnClickEvent(() => {
            console.log("快速开始歌曲：" + this.quickStartSong.musicName);
            GameManager.getInstance().openBlockInput();
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.quickStart(this.homePartView.getQuickStartBtnWorldPos());

        })

        this.homePartView.setZQVGunRewardGetBtn(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            let reward = this.gamePxy.ZQA_getGunRewardInfo();
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "ZQGunGet_Click", 1);
            this.sendNotification(CommandDefine.UnluckGunRequest, reward);
            this.homePartView.showZQVGunRewardGetedTip();
        })
        this.homePartView.setELPStartButton(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MWPKactivity_Details_Click", 1);
            Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.EndlessPlayingHomePanel));
        })
        this.homePartView.setActivityStartButton(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.V1_1_4HomePanel));
        })
        this.homePartView.setSongListScrollViewTouchup(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.songListScroll);
        });
        this.homePartView.onEnterCall = () => {

            if ( AdController.instance.AdSDK.getBlockFlag(1,100,2100)) {
                AdController.instance.AdSDK.showBlock(1,100,2100);
            }

            if ( AdController.instance.AdSDK.getBlockFlag(2,800,2100)) {
                AdController.instance.AdSDK.showBlock(2,800,2100);
            }


            let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
            med && med.partSwitch(true);
            let V1_1_4Powermed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HasPowerPartMediator) as V1_1_4HasPowerPartMediator;
            V1_1_4Powermed && V1_1_4Powermed.partSwitch(false);
            if (this.gamePxy.getIsSigned()) {
                this.homePartView.closeSignBtnClickTip();
            }
            else {
                this.homePartView.openSignBtnClickTip();
            }

            if (!this.gamePxy.getGameNew()) {
                ReportAnalytics.getInstance().reportAnalytics("View_Show", "MainUI_Show", 1);
            }
            this.gamePxy.saveCurGameSongInfo(null);
            if (!this.checkIsWillOpenSongRecommedPanel()) {
                this.ZQA_updateMoonTimeNum();
            }
        };
        this.homePartView.onResumeCall =  () => {


            if ( AdController.instance.AdSDK.getBlockFlag(1,100,2100)) {
                AdController.instance.AdSDK.showBlock(1,100,2100);
            }

            if ( AdController.instance.AdSDK.getBlockFlag(2,800,2100)) {
                AdController.instance.AdSDK.showBlock(2,800,2100);
            }

            // if (AdController.instance.AdSDK.getBlockFlag(3,0,800)) {
            //     AdController.instance.AdSDK.showBlock(3,0,800);
            // }


            if (this.gamePxy.getIsSigned()) {
                this.homePartView.closeSignBtnClickTip();
            }
            else {
                this.homePartView.openSignBtnClickTip();
            }
            this.ZQA_updateMoonTimeNum();
            let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
            med && med.partSwitch(true);
            let V1_1_4Powermed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HasPowerPartMediator) as V1_1_4HasPowerPartMediator;
            V1_1_4Powermed && V1_1_4Powermed.partSwitch(false);
        }

        this.homePartView.onPauseCall=()=>{
            // AdController.instance.AdSDK.hideBlock(1);
            // AdController.instance.AdSDK.hideBlock(2);

        }

        this.homePartView.onExitCall=()=>{
            // AdController.instance.AdSDK.hideBlock(1);
            // AdController.instance.AdSDK.hideBlock(2);
        }

        setTimeout(() => {
            this.gamePxy.getIsCanGetAchivReward();
            if (this.gamePxy.getIsSigned()) {
                this.homePartView.closeSignBtnClickTip();
            }
            else {
                this.homePartView.openSignBtnClickTip();
            }
        }, 4000);
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.ADInitResponce,
            CommandDefine.UserLoginResponce,
            CommandDefine.UserAuthorizationResponce,
            CommandDefine.UserGenderResponce,
            CommandDefine.tabelResponce,
            CommandDefine.ClickTipResponce,
            CommandDefine.PlaySongResponce,
            CommandDefine.StartRecResponce,
            CommandDefine.EndRecResponce,
            CommandDefine.WinSongRollNext,

        ];
    }

    public handleNotification(notification: INotification): void {
        let info = notification.getBody()
        switch (notification.getName()) {
            case CommandDefine.ADInitResponce:
                this.ELPPxy.getEventTime((type: ELPEventState) => {
                    if (type == ELPEventState.END) {
                        return;
                    }
                    if (!UIPanelCtr.getInstance().checkIsTopPanel(PanelType.HomePartView)) return;
                    if (info) {
                        console.log("广告已经初始化完成,home页现在可以请求用户的登陆信息情况了");
                        UserData.getInstance().getuserID((isLogin: boolean) => {
                            this.sendNotification(CommandDefine.UserLoginResponce, isLogin)
                        })
                    }
                });
                break;
            case CommandDefine.UserLoginResponce:
                //if (!UIPanelCtr.getInstance().checkIsTopPanel(PanelType.HomePartView)) return;
                if (info) {
                    console.log("home页  用户已经登陆, 请求用户授权情况");
                    UserData.getInstance().getuserInfo((res) => {
                        this.sendNotification(CommandDefine.UserAuthorizationResponce, res)
                    })
                }
                else {
                    console.log("home页   用户未登陆!!");
                    this.assignELPGunSkinUnit(false);
                }

                break;
            case CommandDefine.UserAuthorizationResponce:
                // if (!UIPanelCtr.getInstance().checkIsTopPanel(PanelType.HomePartView)) return;

                if (info.power) {
                    console.log("home页   用户授权成功");
                    UserData.getInstance().getUserGender((res) => {
                        this.sendNotification(CommandDefine.UserGenderResponce, res)
                    })
                }
                else {
                    console.log("home页   用户未授权");
                    this.assignELPGunSkinUnit(false);
                }
                break;
            case CommandDefine.UserGenderResponce:
                if (info != false) {
                    console.log("home页   用户的性别   " + info);
                    this.assignELPGunSkinUnit(info);
                }
                break;
            case CommandDefine.tabelResponce:
                let table = notification.getBody() as Array<SongInfo>;
                table.forEach((item) => {
                    this.songTable.push(item);
                })
                if (config.platform == Platform.oppo) {  //||config.platform==Platform.web
                    let ADInfo = this.musicPxy.addADInfo("AD");
                    this.songTable.splice(3, 0, ADInfo);
                    this.songTable.splice(11, 0, ADInfo);
                }
                this.homePartView.setSongListScrollViewContentSizeY(this.unitHight * this.songTable.length + 500);  // 
                this.initCreateSongUnits(this.maxSongUnitSize);
                break;

            case CommandDefine.ClickTipResponce:
                if (info.type == TipType.AchivChip) {
                    if (info.isCan) {
                        this.homePartView.openAchiBtnClickTip();
                    }
                    else {
                        this.homePartView.closeAchiBtnClickTip();
                    }
                }

                break;
            case CommandDefine.PlaySongResponce:
                let playSongInfo = notification.getBody() as PlaySongInfo;
                let songInfo = this.musicPxy.getSongInfo(playSongInfo.songName) as SongInfo;
                console.log("homeview正在播放的歌 曲");
                console.log(songInfo.musicName);
                this.quickStartSong = songInfo
                this.homePartView.setSongNameLabel(this.quickStartSong.musicName);
                this.homePartView.setSongNameState(this.gamePxy.getSongIdUnlockState(this.quickStartSong.musicId), this.quickStartSong.unlockType);
                // if (UIPanelCtr.getInstance().checkIsTopPanel(PanelType.HomePartView)) {
                //     if (this.isRollNext) {
                //         let id = this.musicPxy.getSongListId(this.quickStartSong.musicName);
                //         this.homePartView.SongListScrollView.scrollToOffset(cc.v2(0, id * this.unitHight), id * 0.15);


                //     }
                //     this.isRollNext = false;
                // }
                break;
            case CommandDefine.StartRecResponce:
                if (UIPanelCtr.getInstance().checkIsTopPanel(PanelType.HomePartView)) {
                    this.homePartView.switchToRecingState();
                }
                break;
            case CommandDefine.EndRecResponce:
                this.homePartView.switchToWaitState();
                if (UIPanelCtr.getInstance().checkIsTopPanel(PanelType.HomePartView)) {
                    this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.ShareRecPanel));
                }
            case CommandDefine.WinSongRollNext:
                this.isRollNext = true;
                break;


            default:
                break;
        }
    }

    private initCreateSongUnits(size: number) {
        for (let i = 0; i < size; i++) {
            setTimeout(() => {
                this.endSongIdx++;
                this.homePartView.createSongUnit(i, (unit) => {
                    unit.setPosition(cc.v2(unit.x, -i * this.unitHight - this.unitHight / 2));
                    this.songlist.push(unit);
                    Facade.getInstance().registerMediator(new SongUnitMediator(MediatorDefine.SongUnitMediator + i, unit));
                    let med = Facade.getInstance().retrieveMediator(MediatorDefine.SongUnitMediator + i) as SongUnitMediator;
                    this.songMedlist.push(med);
                    med.initSongInfo(this.songTable[i], i);
                });
            }, 100 * i);
        }

        //----------------------------------------test--------------------------------------------
        //  setTimeout(() => {
        //     this.assignELPGunSkinUnit(); 
        //  }, 3000);
    };

    private onSongListScrolling(scrollView: cc.ScrollView) {
        if (this.isRollNext) { this.isRollNext = false; }
        this.curContentY = scrollView.content.y;
        let offset = this.curContentY - this.lastContentY;
        this.lastContentY = this.curContentY;
        if (offset > 5) {
            //上滑操作时
            let firstNode = this.songlist[0];  //数组内第一个节点
            //  let firstNodeBBox = firstNode.getBoundingBoxToWorld();
            let tempEnd = this.endSongIdx;       //未改变前的最大下标
            //  if (!firstNodeBBox.intersects(svBBoxRect)) {        //  上滑操作时数组内第一个节点没有在可视范围内
            if (firstNode.convertToWorldSpaceAR(cc.v2()).y > cc.view.getVisibleSize().height - 600) {
                this.endSongIdx++;
                if (!this.songTable[this.endSongIdx]) {
                    this.endSongIdx--;
                    return;
                }
                let temp = this.songlist.shift();
                this.songlist.push(temp);
                temp.y -= this.unitHight * this.maxSongUnitSize;

                let tempMed = this.songMedlist.shift();
                this.songMedlist.push(tempMed);
                tempMed.initSongInfo(this.songTable[this.endSongIdx], this.endSongIdx);

            }
        }
        else if (offset < -5) {
            //  console.log("下滑")
            let endNode = this.songlist[this.songlist.length - 1];  //数组内最后一个节点
            // let endNodeBBox = endNode.getBoundingBoxToWorld();
            let tempEnd = this.endSongIdx;       //未改变前的最大下标
            // if (!endNodeBBox.intersects(svBBoxRect)) {       //下滑操作时数组内最后一个节点没有在可视范围内
            if (endNode.convertToWorldSpaceAR(cc.v2()).y < -200) {
                this.endSongIdx--;
                let showId = tempEnd - this.maxSongUnitSize;
                if (showId < 0) {
                    this.endSongIdx++
                    return;
                }
                let temp = this.songlist.pop();
                this.songlist.unshift(temp);
                temp.y += this.unitHight * this.maxSongUnitSize;

                let tempMed = this.songMedlist.pop();
                this.songMedlist.unshift(tempMed);
                tempMed.initSongInfo(this.songTable[showId], showId);
            }
        }

    }

    /**
    * 配置枪的皮肤单元
    */
    private assignGunSkinvUnit(configs: Array<GunSkinInfo>) {
        this.isFirstOpenGun = true;
        this.homePartView.setGunSkinListScrollViewContentSizeY(configs.length * this.unitHight + 1000);
        let isVaild = false;
        for (let i = 0; i < configs.length; i++) {   //
            this.homePartView.createGunSkinUnit((gunSkinUnit) => {
                gunSkinUnit.setPosition(cc.v2(gunSkinUnit.x, -i * this.unitHight - this.unitHight / 2));
                let med = new GunSkinUnitMediator(MediatorDefine.GunSkinUnitMediator + configs[i].id, gunSkinUnit);
                med.setGunSkinBg(configs[i].unlockType);
                if (configs[i].unlockType == "limit") {
                    isVaild = this.gamePxy.ZQA_checkValidTime();    //活动是否有效
                    med.initGunSkiniInfo(configs[i], isVaild);
                }
                else if (configs[i].unlockType == "v1_1_3Vlimit" || configs[i].unlockType == "v1_1_3Flimit") {
                    this.ELPGunSkin.push({
                        gunSkinMed: med,
                        gunSkinInfo: configs[i]
                    });
                    this.ELPPxy.getEventTime((type: ELPEventState) => {
                        if (type == ELPEventState.END) {
                            med.initGunSkiniInfo(configs[i], false);
                        }
                    });
                }
                else {
                    med.initGunSkiniInfo(configs[i], isVaild);
                }
                if (this.gamePxy.getGunIdUnlockState(configs[i].id)) {
                    med.setGunSkinUnlockState();
                }
                if (this.gamePxy.getEquipGunSkin() == configs[i].id) {
                    med.setGunSkinEquipState();
                }
                Facade.instance.registerMediator(med);
            });
        }
        this.ELPPxy.getEventTime((type: ELPEventState) => {
            if (type == ELPEventState.END) {
                return;
            }
            if (AdController.instance.ADOK) {
                console.log("广告SDK初始化完成,在枪械皮肤配置完后请求用户登陆情况!!!");
                if (!this.isAssignedELPGunSkin) {
                    UserData.getInstance().getuserID((isLogin: boolean) => {
                        this.sendNotification(CommandDefine.UserLoginResponce, isLogin)
                    })
                }
            }
        });

    }

    /**
     * 配置ELP活动的枪的单位
     */
    private assignELPGunSkinUnit(gender) {
        this.isAssignedELPGunSkin = true;
        this.ELPPxy.getEventTime((type: ELPEventState) => {
            for (let i = 0; i < this.ELPGunSkin.length; i++) {
                const ELPInfo = this.ELPGunSkin[i];
                if (!ELPInfo) return;
                let med = ELPInfo.gunSkinMed;
                let skinInfo = ELPInfo.gunSkinInfo as GunSkinInfo;
                if (type == ELPEventState.ING) {
                    med.setForeshowState(skinInfo);
                }
                else if (type == ELPEventState.END) {
                    med.initGunSkiniInfo(skinInfo, false);
                }
                else {
                    let tempInfo = new GunSkinInfo();;
                    tempInfo.gunName = skinInfo.gunName;
                    tempInfo.id = skinInfo.id;
                    tempInfo.ironPath = skinInfo.ironPath;
                    tempInfo.unlockType = skinInfo.unlockType;
                    tempInfo.unlockVal = skinInfo.unlockVal;
                    if (skinInfo.unlockType == "v1_1_3Vlimit") {
                        tempInfo.unlockType = gender == "M" ? skinInfo.unlockType : "ad"
                    } else if (skinInfo.unlockType == "v1_1_3Flimit") {
                        tempInfo.unlockType = gender == "F" ? skinInfo.unlockType : "ad"
                    }
                    else if (!gender) {
                        tempInfo.unlockType = "ad"
                    }
                    med.initGunSkiniInfo(tempInfo, true);
                }

                if (this.gamePxy.getGunIdUnlockState(skinInfo.id)) {
                    med.setGunSkinUnlockState();
                }
                if (this.gamePxy.getEquipGunSkin() == skinInfo.id) {
                    med.setGunSkinEquipState();
                }
            }
        });    //活动是否有效
    }
    /**
   * 配置方块的皮肤单元
   */
    private assignBoxSkinvUnit(configs: Array<BoxSkinInfo>) {
        this.homePartView.setBoxSkinListScrollViewContentSizeY(configs.length * this.unitBoxHight + 800);
        for (let i = 0; i < configs.length; i++) {
            setTimeout(() => {
                this.homePartView.createBoxSkinUnit((boxSkinUnit) => {
                    boxSkinUnit.setPosition(cc.v2(boxSkinUnit.x, -i * this.unitBoxHight - this.unitBoxHight / 2));
                    let med = new BoxSkinUnitMediator(MediatorDefine.BoxSkinUnitMediator + configs[i].id, boxSkinUnit);
                    med.initBoxSkiniInfo(configs[i]);
                    if (this.gamePxy.getBoxIdUnlockState(configs[i].id)) {
                        med.setBoxSkinUnlockState();
                    }
                    if (this.gamePxy.getEquipBoxSkin() == configs[i].id) {
                        med.setBoxSkinEquipState();
                    }
                    Facade.instance.registerMediator(med);
                });
            }, 100 * i)

        }
    }

    /**
     *  打开皮肤页面
     */
    private requsetSkinSys(toggle: cc.Toggle) {
        console.log("打开皮肤界面");
        ReportAnalytics.getInstance().reportAnalytics("View_Show", "SkinUI_Show", 1);
        if (toggle) {
            this.ELPPxy.getEventTime((type: ELPEventState) => {
                if (type == ELPEventState.END) return;
                if (!this.isAssignedELPGunSkin) {
                    UserData.getInstance().getuserID((isLogin: boolean) => {
                        this.sendNotification(CommandDefine.UserLoginResponce, isLogin)
                    })
                }
            });
            this.homePartView.playToggleContainerClipEft();
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MainUI_SkinBtn_Click", 1);
            this.homePartView.openSkinShopPart(toggle)
            // if (!this.isFirstOpenGun) {
            //     this.isFirstOpenGun = true;

            // }
        }

    }

    /**
    *  打开方块皮肤页面
    */
    private requsetBoxSkinSys(toggle: cc.Toggle) {
        console.log("打开方块皮肤界面");
        ReportAnalytics.getInstance().reportAnalytics("View_Show", "SkinUI_Show", 1);
        if (toggle) {
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MainUI_SkinBtn_Click", 1);
            this.homePartView.openBoxSkinShopPart(toggle)
            if (!this.isFirstOpenBox) {
                this.isFirstOpenBox = true;
                this.gamePxy.getBoxConfig(this.assignBoxSkinvUnit.bind(this));
            }
        }

    }
    // /**
    //  * 打开地图皮肤页面
    //  */
    // private requsetMapSys(toggle: cc.Toggle) {
    //     console.log("打开地图皮肤界面");
    //     if (toggle) {
    //         let view = this.homePartView.openMapSkinPart(toggle)
    //         let msMed = Facade.getInstance().retrieveMediator(MediatorDefine.MapSkinMediator) as MapSkinMediator;

    //         if (!msMed) {
    //             Facade.getInstance().registerMediator(new MapSkinMediator(MediatorDefine.MapSkinMediator, view));
    //             this.gamePxy.getMapConfig();
    //         }
    //         else {
    //             msMed.onOpen();
    //         }
    //     }

    // }

    /**
     * 快速开始游戏
     */
    public quickStart(_target, isV1_1_4Act = false) {
        let succeCallback = () => {
            this.homePartView.scheduleOnce(() => {
                Facade.getInstance().sendNotification(CommandDefine.StartSongRequest, this.quickStartSong);
                GameManager.getInstance().closeBlockInput();
            }, 0.5)
        };
        if (this.gamePxy.getSongIdUnlockState(this.quickStartSong.musicId)) {
            if (isV1_1_4Act) {
                ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "V1_1_4Home_NoAdStart_Click", 1);
            }
            else {
                ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "NewQuickStartNoAd_Click", 1);
            }

            Facade.getInstance().sendNotification(CommandDefine.Consumables,
                {
                    info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                    callback: succeCallback,
                    targetPos: _target
                }
            );
        }
        else {
            console.log("解锁游戏提供的待解锁的歌曲：" + this.quickStartSong.musicName);
            GameManager.getInstance().closeBlockInput();
            // GameManager.getInstance().showMsgTip("歌曲还未解锁!");
            // let id = this.musicPxy.getSongListId(this.quickStartSong.musicName);
            // this.homePartView.SongListScrollView.scrollToOffset(cc.v2(0, id * this.unitHight), id * 0.08);

            let tempSongInfo = this.gamePxy.copySongInfo(this.quickStartSong);
            tempSongInfo.unlockType = "video";
            let self = this;
            let onUnlockCallback = function (isSucces) {
                self.sendNotification(CommandDefine.PlaySongRequest, new PlaySongInfo(tempSongInfo.musicName, SongPlayType.Immediately));
                if (isSucces) {
                    Facade.getInstance().sendNotification(CommandDefine.Consumables,
                        {
                            info: new ConsumablesAlterInfo(ConsumablesType.power, -CONSTANTS.oneConsumePowerValue),
                            callback: succeCallback,
                            targetPos: _target
                        }
                    );
                }

            }
            if (isV1_1_4Act) {
                ReportAnalytics.getInstance().reportAnalytics("AdBtn_Vclick", "V1_1_4HomeQuickStart_AdClick", 1);
            }
            else {
                ReportAnalytics.getInstance().reportAnalytics("AdBtn_Vclick", "NewQuickStart_AdClick", 1);
            }

            Facade.getInstance().sendNotification(CommandDefine.UnluckSongRequest, ({
                song: tempSongInfo,
                cal: onUnlockCallback
            }))

        }
    }

    /**
     * 录屏显示
     */
    public updateRecTime(str) {
        this.homePartView.updateRecTime(str);
    }

    /**
     * 判断是否会弹专属推荐
     */
    private checkIsWillOpenSongRecommedPanel() {
        if (this.gamePxy.affordLockSongInfoList(this.musicPxy.getData())) {
            if (CONSTANTS.MaxShowRecomdSongNum > 0 && CONSTANTS.IsUnlockRecomdSong == false) {
                return true;
            }
        }
        return false;
    }

    /**
     * 玩家月饼数更新
     */
    public ZQA_updateMoonTimeNum() {
        if (this.tempMoonCake == this.gamePxy.ZQA_getMoonCakeNum()) return;
        let localcur = this.gamePxy.ZQA_getMoonCakeNum() >= CONSTANTS.ZQA_MinConvertMoonCakeNum ? CONSTANTS.ZQA_MinConvertMoonCakeNum : this.gamePxy.ZQA_getMoonCakeNum()
        let addMoonCake = localcur - this.tempMoonCake;
        console.log("玩家增加了   " + addMoonCake + "  月饼数");
        //let Numstr=this.gamePxy.ZQA_getMoonCakeNum()+"/"+CONSTANTS.ZQA_MinConvertMoonCakeNum;
        Utility.addScoreAnim(this.tempMoonCake, addMoonCake, 0.05, (val) => { this.homePartView.updateMoonTimeNum(val) }, this.homePartView);
        this.homePartView.updateMoonTimeProBar(localcur / CONSTANTS.ZQA_MinConvertMoonCakeNum, () => {
            if (this.gamePxy.ZQA_MoonCakeNumIsEnough() && !this.gamePxy.ZQA_gunRewardIsGet()) {
                //  cc.audioEngine.play(this.homePartView.ZQGunRewardClip, false, 1);
                GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.ZQGunReward);
                this.homePartView.showZQVGunRewardGetBtn();
            }
            else if (this.gamePxy.ZQA_gunRewardIsGet()) {
                this.homePartView.showZQVGunRewardGetedTip();
            }
        })
        this.tempMoonCake = this.gamePxy.ZQA_getMoonCakeNum();
    }


    /**
     * 切换到皮肤页面
     */
    switchOverSkin() {
        this.homePartView.playToggleContainerClipEft();
        this.homePartView.mainToggleContainer.toggleItems[0].isChecked = false;
        this.homePartView.mainToggleContainer.toggleItems[1].isChecked = true;
        console.log("打开皮肤界面");
        ReportAnalytics.getInstance().reportAnalytics("View_Show", "SkinUI_Show", 1);
        //  ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MainUI_SkinBtn_Click", 1);
        this.homePartView.openSkinShopPart(this.homePartView.mainToggleContainer.toggleItems[1])
        if (!this.isFirstOpenGun) {
            this.gamePxy.getGunConfig(this.assignGunSkinvUnit.bind(this));
        }
    }
}