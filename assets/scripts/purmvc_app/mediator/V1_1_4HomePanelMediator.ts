
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "../command/commandDefine";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { SongInfo, PlaySongInfo } from "../repositories/Rep";
import UIPanelCtr from "../../util/UIPanelCtr";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import UserData from "../../Rank/UserData";
import { PanelType } from "../../util/PanelType";
import AdController from "../../plugin/ADSdk/AdController";
import config, { Platform } from "../../../config/config";
import V1_1_4HomePanel from "./V1_1_4HomePanel";
import { V1_1_4Pxy } from "../proxy/V1_1_4Pxy";
import { ActivityEventState, Activity } from "../proxy/ActivityPxy";
import V1_1_4PlayerRankItem from "./V1_1_4PlayerRankItem";
import { MediatorDefine } from "./mediatorDefine";
import { V1_1_4ConstellationItemMediator } from "./V1_1_4ConstellationItemMediator";
import { HomePartMediator } from "./HomePartMediator";
import { V1_1_4HasPowerPartMediator } from "./V1_1_4HasPowerPartMediator";
import { CoinPartMediator } from "./CoinPartMediator";
import { GamePxy } from "../proxy/GamePxy";
import { MusicPxy } from "../proxy/MusicPxy";

const MaxRankItemNum: number = 20;
const Constellation: Array<string> = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]
const ConstellationChinese: Array<string> = ["白羊座", "金牛座", "双子座", "巨蟹座", "狮子座", "处女座", "天枰座", "天蝎座", "射手座", "摩羯座", "水瓶座", "双鱼座"]
const rewardExpainStr: Array<string> =["小米play音响", "小米智能手环", "精美手办"];
//["小米play音响", "小米智能手环", "精美手办", "超强充电宝", "卡哇伊玩偶"];
export class V1_1_4HomePanelMediator extends Mediator {
    private v1_1_4HomePanel: V1_1_4HomePanel = null;
    private v1_1_4Pxy: V1_1_4Pxy;
    private gamePxy: GamePxy;
    private musicPxy: MusicPxy;
    private activityEventState: ActivityEventState;
    // private isScoreRankToggle: boolean = true;
    private nickName: string = null;
    // private tempSex: string = null;
    private endItemIdx: number = -1;    //歌曲列表内最后变化的下标
    private PlayerRankItemList: Array<V1_1_4PlayerRankItem> = new Array<V1_1_4PlayerRankItem>();
    private curContentY: number = 0;
    private lastContentY: number = 0;
    private ItemHight: number = 160;
    private winnerRewardName: string = "";
    private playerRandInfolist = new Array<any>();;
    private playerTopRandInfolist = new Array<any>();
    private playerSubRandInfolist = new Array<any>();
    private constellationTotalListobj;                        //服务器传递的星座的充能对象
    private constellationTotalNumlist = new Array<number>();      //星座的充能数组
    private userFillConstellationNumList = new Array<number>();     //玩家的个人对每个星座充能的值
    private constellationItemMedlist = new Array<V1_1_4ConstellationItemMediator>();      //星座的充能数组
    private MAXConstellationTotalNum: number = 0;
    private MAXConstellationIdx: number = 0;
    private PhoneStr = null;
    private AddressStr = null;
    private TrueNameStr = null;
    private isSetWinnerInfo: boolean = false;
    private firstInfolist = new Array<any>();
    private secondInfolist = new Array<any>();
    private thirdlyInfolist = new Array<any>();
    private fourthlyInfolist = new Array<any>();
    private fifthInfolist = new Array<any>();

    private isGetReward: boolean = false;     //用户是否获奖
    private isStartShowRewardInfo: boolean = false;     //是否开始自动弹出收货信息的填写

    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);
        if (viewComponent == null) {
            return;
        }
        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.v1_1_4Pxy = Facade.getInstance().retrieveProxy(ProxyDefine.V1_1_4Pxy) as V1_1_4Pxy;
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        this.musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy
        this.v1_1_4HomePanel = viewNode.getComponent(V1_1_4HomePanel);
        this.v1_1_4HomePanel.PlayerRankSubContent.height = this.ItemHight * 100    //暂时
        this.initCreateSubPlayerRankItems(MaxRankItemNum)
        this.initCreateConstellationItems();
        this.v1_1_4HomePanel.closeSetWinnderInfoNode();
        // this.v1_1_4HomePanel.closeNameListInfoNode();
        this.v1_1_4HomePanel.isShowOpenWinnerSetBtn(false)
        this.openConstellationRank();
        this.bindListener();
    }

    private bindListener(): void {
        let med = Facade.getInstance().retrieveMediator(MediatorDefine.HomePartMediator) as HomePartMediator;
        this.v1_1_4HomePanel.onEnterCall = () => {
            ReportAnalytics.getInstance().reportAnalytics("View_Show", "V1_1_4Home_Show", 1);
            this.v1_1_4Pxy.getEventState();
            let V1_1_4Powermed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HasPowerPartMediator) as V1_1_4HasPowerPartMediator;
            V1_1_4Powermed && V1_1_4Powermed.partSwitch(true);
            this.v1_1_4HomePanel.setSongNameLabel(med.QuickStartSong.musicName);
            this.v1_1_4HomePanel.setSongNameState(this.gamePxy.getSongIdUnlockState(med.QuickStartSong.musicId), med.QuickStartSong.unlockType);
            this.resetRankItems();
        }
        this.v1_1_4HomePanel.setRankScrollViewScrollEvent(this.onListScrolling, this)
        //     // this.endlessPlayingPxy.getuserInfo();

        // }
        this.v1_1_4HomePanel.setCloseBtnClickEvent(() => {
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "V1_1_4Home_back_Click", 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();
            AdController.instance.AdSDK.showBanner();
            AdController.instance.bannnerShowIng=true;
        });
        this.v1_1_4HomePanel.setStartPlayButtonClickEvent(() => {
            GameManager.getInstance().openBlockInput();
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            med.quickStart(this.v1_1_4HomePanel.getQuickStartBtnWorldPos(), true);
        });
        this.v1_1_4HomePanel.setConstellationSureBtnClickEvent(() => {
            this.v1_1_4HomePanel.closeBestConstellationTip(
                () => {
                    if (config.platform == Platform.web) {
                        this.isGetReward = true;
                        this.v1_1_4HomePanel.setRewardgrade(4);
                    }
                    // console.log("该用户是否为获奖用户? "+this.isGetReward);
                    if (this.isGetReward) {     //在最强星座页面就获得了玩家的获奖信息后
                        this.v1_1_4Pxy.getWinnerInfo();
                    } else {
                        this.isStartShowRewardInfo = true;
                    }

                }
            );
        });
        this.v1_1_4HomePanel.setLookWinnerListButtonClickEvent(() => {
            if (this.nickName == "游客") {
                GameManager.getInstance().showMsgTip("需要您登陆以及用户信息的权限哦！", 3);
            } else {
                this.v1_1_4HomePanel.openNameListInfoNode();
            }
        })
        this.v1_1_4HomePanel.setNameListCloseBtnClickEvent(() => {
            this.v1_1_4HomePanel.closeNameListInfoNode();
        })


        this.v1_1_4HomePanel.setPlayerRankToggleEvent((_toggle: cc.Toggle) => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (_toggle.isChecked) {
                this.openPlayerRank();
                this.resetRankItems();
            }
        }, this);
        this.v1_1_4HomePanel.setConstellationRankToggleEvent((_toggle: cc.Toggle) => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (_toggle.isChecked) {
                this.openConstellationRank();
            }
        }, this);
        this.v1_1_4HomePanel.setOpenWinnerSetBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.v1_1_4HomePanel.openSetWinnderInfoNode();
        })
        this.v1_1_4HomePanel.setloginTipClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "V1_1_4HomeLogin_Click", 1);
            if (config.platform == Platform.web) {
                this.v1_1_4Pxy.userData.userType = 1;
                this.v1_1_4Pxy.getuserInfo();
            } else {
                UserData.getInstance().showLogin(() => {
                    this.v1_1_4Pxy.getuserID();
                })
            }

        })
        this.v1_1_4HomePanel.setAuthorizedTipClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UserData.getInstance().showAuthorize();
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "V1_1_4HomeAuthorized_Click", 1);
            this.v1_1_4HomePanel.showLoginUserRank();
            setTimeout(() => {
                this.v1_1_4HomePanel.authorizedEnsurePanel.active = true;
            }, 800);

        })
        this.v1_1_4HomePanel.setRefreshAuthorizeClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.v1_1_4Pxy.getuserInfo();
            this.v1_1_4HomePanel.authorizedEnsurePanel.active = false;
        })

        this.v1_1_4HomePanel.defaultRankToggle();
        this.fillInRelation();
        this.v1_1_4HomePanel.setWinnderInfoSureBtnClickEvent(() => {
            if (this.AddressStr && this.PhoneStr && this.TrueNameStr) {
                this.v1_1_4Pxy.sentWinnerInfo(this.AddressStr, this.PhoneStr, this.TrueNameStr, this.winnerRewardName);
                this.v1_1_4HomePanel.closeSetWinnderInfoNode();
                GameManager.getInstance().showMsgTip("您的奖品正在快马加鞭准备中....", 3);
            }
            else {
                GameManager.getInstance().showMsgTip("信息填写不完整或格式有误")
            }
        });
        this.v1_1_4HomePanel.setWinnderInfoCloseBtnClickEvent(() => {
            this.v1_1_4HomePanel.closeSetWinnderInfoNode();
            this.v1_1_4HomePanel.isShowOpenWinnerSetBtn(true);
        })
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.ActivityEventStateResponce,
            CommandDefine.ADInitResponce,
            CommandDefine.ActivityUserLoginResponce,
            CommandDefine.ActivityUserAuthorizationResponce,
            CommandDefine.V1_1_4UserRankInfoResponce,
            CommandDefine.V1_1_4ConstellationRankResponce,
            CommandDefine.V1_1_4AllRankInfoResponce,

            CommandDefine.V1_1_4UserSumFPForUnitCRequest,


            CommandDefine.PlaySongResponce,

            CommandDefine.v1_1_4GetWinnerInfo,                                         //星座模式获取获奖信息是否填写
            CommandDefine.v1_1_4SentWinnerInfo

        ];
    }

    public handleNotification(notification: INotification): void {
        let info = notification.getBody()
        switch (notification.getName()) {
            case CommandDefine.ActivityEventStateResponce:
                this.activityEventState = info;
                if (this.activityEventState != ActivityEventState.END) {
                    if (AdController.instance.ADOK) {
                        console.log("广告已经初始化完成在星座活动页弹出前-------");
                        this.v1_1_4Pxy.getuserID();
                        if (config.platform == Platform.web) {
                            if (this.v1_1_4Pxy.V1_1_4EventState == ActivityEventState.SETTE) {
                                let bestConstellationName = ConstellationChinese[this.MAXConstellationIdx]
                                cc.log("this.MAXConstellationIdx  " + this.MAXConstellationIdx + " bestConstellationName " + bestConstellationName)
                                this.v1_1_4HomePanel.showBestConstellationTip(this.MAXConstellationIdx, bestConstellationName)
                            }
                        }

                    }
                    if (this.activityEventState == ActivityEventState.SETTE) {
                        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
                        med.partSwitch(false);
                        this.v1_1_4HomePanel.ShowPlaySettleState();
                    } else {
                        this.v1_1_4HomePanel.ShowPlayingState();
                    }
                }

                break;
            case CommandDefine.ADInitResponce:
                if (info) {
                    console.log("星座活动页  广告已经初始化完成,现在可以请求用户的登陆信息情况了");
                    // UserData.getInstance().getuserID((isLogin: boolean) => {
                    //     this.sendNotification(CommandDefine.UserLoginResponce, isLogin)
                    // })
                    this.v1_1_4Pxy.getuserID();
                }

                break;
            case CommandDefine.ActivityUserLoginResponce:
                // GameManager.getInstance().closeReadingTip();
                if (!UIPanelCtr.getInstance().checkIsTopPanel(PanelType.V1_1_4HomePanel)) return;
                console.log(JSON.stringify(info) );
                if (info && info.token != "") {
                    if (info.userType === 0) {
                        console.log("游客");
                        this.nickName = "游客"
                        this.v1_1_4HomePanel.showTouristRank();
                    }
                    else if (info.userType === 1) {
                        console.log("正常用户");
                        this.v1_1_4HomePanel.showLoginUserRank();
                        this.v1_1_4Pxy.getuserInfo();
                    }
                } else {
                    console.log("用户ID获取失败!");
                }
                break;
            case CommandDefine.ActivityUserAuthorizationResponce:
                if (!UIPanelCtr.getInstance().checkIsTopPanel(PanelType.V1_1_4HomePanel)) return;
                console.log(info);
                if (info && info.power) {
                    console.log("用户授权成功");
                    this.nickName = info.name;
                    this.v1_1_4HomePanel.setUserHeadIron(info.head)
                    this.v1_1_4HomePanel.setUserNameLabel(info.name)
                    this.v1_1_4Pxy.getUserRank();
                    this.v1_1_4Pxy.getAllUserRank();
                    this.v1_1_4Pxy.getConstellationRank();
                    console.log("this.v1_1_4Pxy.getUserRewardPut()   " + this.v1_1_4Pxy.getUserRewardPut());
                    if (!this.v1_1_4Pxy.getUserRewardPut() && config.platform == Platform.douYin && this.v1_1_4Pxy.V1_1_4EventState == ActivityEventState.ING) {
                        this.v1_1_4Pxy.setUserRewardPut();
                        this.v1_1_4HomePanel.localShowExpainPanel();
                    }
                } else {
                    console.log("用户授权失败!");
                    this.nickName = "游客"
                    this.v1_1_4HomePanel.showunauthorizedRank();
                    this.v1_1_4HomePanel.setUserNameLabel("未授权")
                    // this.v1_1_4Pxy. showAuthorize();
                }

                break;
            case CommandDefine.V1_1_4UserRankInfoResponce:
                console.log("个人排行信息接收成功  ");
                 console.log(info);
                if (info) {
                    let rankNum = info.rankScore.rank && info.rankScore.rank != -1 ? info.rankScore.rank : ""
                    this.v1_1_4HomePanel.setUserRankingLabel(rankNum);
                    this.v1_1_4HomePanel.setUserFilledPowerLabel(info.rankScore.rankScore);
                    //对玩家每个星座所贡献值进行保存
                    for (let index = 0; index < Constellation.length; index++) {
                        let num = this.readUserFillConstellationNum(info.rankScore, index);
                        this.userFillConstellationNumList[index] = num;
                    }
                    console.log("this.userFillConstellationNumList  ");
                    console.log(this.userFillConstellationNumList);
                   // if(this.v1_1_4Pxy.V1_1_4EventState==ActivityEventState.SETTE&&config.platform==Platform.douYin){
                    if(this.v1_1_4Pxy.V1_1_4EventState==ActivityEventState.SETTE&&config.platform==Platform.douYin){
                        let grade = this.setWinnergrade(rankNum);
                        if (grade == null) {
                            console.log("该用户在活动期间未贡献能量");
                            GameManager.getInstance().showMsgTip("活动已经结束了")
                        } else if (grade >= 3) {
                            console.log("很遗憾,未上榜");
                            GameManager.getInstance().showMsgTip("很遗憾,未上榜")

                            // let grade = this.setWinnergrade(4);
                            // console.log("test 该用户为获奖用户");             //TEST
                            // this.winnerRewardName=rewardExpainStr[grade];
                            // this.v1_1_4HomePanel.setRewardgrade(grade);
                            // this.isGetReward = true;
                            // if (this.isStartShowRewardInfo) {
                            //     this.v1_1_4Pxy.getWinnerInfo();
                            // }
                        } else {
                            console.log("该用户为获奖用户");
                            this.v1_1_4HomePanel.setRewardgrade(grade);
                            this.winnerRewardName=rewardExpainStr[grade];
                            this.isGetReward = true;
                            if (this.isStartShowRewardInfo) {
                                this.v1_1_4Pxy.getWinnerInfo();
                            }
    
                        }
                    }
                    
                }
                break;
            case CommandDefine.V1_1_4ConstellationRankResponce:
                console.log("星座排行信息  ");
                console.log(JSON.stringify(info) );
                if (!info) {
                    console.log("星座数据不存在");
                    for (let index = 0; index < Constellation.length; index++) {
                        this.constellationTotalNumlist.push(0);
                        if (this.constellationItemMedlist.length != 0) {
                            this.constellationItemMedlist[index].setFillPowers(0);
                        }
                    }
                    return;
                } else {
                    this.constellationTotalListobj = info.constellationTotal;
                    for (let index = 0; index < Constellation.length; index++) {
                        let num = this.readConstellationTotalNum(this.constellationTotalListobj, index);
                        console.log("星座" + Constellation[index] + "所获得的总数据  " + num);
                        this.getMAXConstellationTotalNum(num, index);
                        this.constellationTotalNumlist[index] = num;
                        if (this.constellationItemMedlist.length != 0) {
                            this.constellationItemMedlist[index].setFillPowers(num);
                        }
                    }
                    this.MAXConstellationIdx = this.MAXConstellationTotalNum == 0 ? 0 : this.MAXConstellationIdx;
                    this.MAXConstellationTotalNum = this.MAXConstellationTotalNum == 0 ? 1 : this.MAXConstellationTotalNum;
                    console.log("星座内最大的能量数为 " + this.MAXConstellationTotalNum);
                    this.constellationItemMedlist.forEach((element, index) => {
                        console.log("星座 " + Constellation[index] + " 的比例为 " + this.constellationTotalNumlist[index] / (this.MAXConstellationTotalNum * (5 / 4)) + "   " + this.constellationTotalNumlist[index]);
                        let targetNum = this.setTargetNum(this.MAXConstellationTotalNum);
                        element.setFillPowersPro(this.constellationTotalNumlist[index], targetNum, index == this.MAXConstellationIdx);
                    });
                    console.log("this.constellationItemMedlist");
                    console.log(this.constellationTotalNumlist);
                    if (this.v1_1_4Pxy.V1_1_4EventState == ActivityEventState.SETTE) {
                        let bestConstellationName = ConstellationChinese[this.MAXConstellationIdx]
                        this.v1_1_4HomePanel.showBestConstellationTip(this.MAXConstellationIdx, bestConstellationName)
                    }
                }

                break;
            case CommandDefine.V1_1_4AllRankInfoResponce:
                console.log("全部排行信息  ");
                console.log(JSON.stringify(info) );
                if (!info) {
                    this.configTopPlayerRankTitems();
                    console.log("排行榜数据不存在"); return;
                }
                this.playerRandInfolist = info;
                this.playerSubRandInfolist = this.playerRandInfolist.slice(3);
                this.playerTopRandInfolist = this.playerRandInfolist.slice(0, 3);
                this.v1_1_4HomePanel.PlayerRankSubContent.height = this.ItemHight * this.playerSubRandInfolist.length;
                this.configTopPlayerRankTitems();
                this.configSubPlayerRankTitems();
                this.firstInfolist = this.playerRandInfolist.slice(0, 1)
                this.secondInfolist = this.playerRandInfolist.slice(1, 2)
                this.thirdlyInfolist = this.playerRandInfolist.slice(2, 3)
                // this.fourthlyInfolist = this.playerRandInfolist.slice(3, 10)
                // this.fifthInfolist = this.playerRandInfolist.slice(10, 20)
                this.firstInfolist.forEach((item, index) => {
                    this.v1_1_4HomePanel.setWinnerLabelShow(this.v1_1_4HomePanel.firstNameLabels, index, item.nickName)
                })
                this.secondInfolist.forEach((item, index) => {
                    this.v1_1_4HomePanel.setWinnerLabelShow(this.v1_1_4HomePanel.secondNameLabels, index, item.nickName)
                })
                this.thirdlyInfolist.forEach((item, index) => {
                    this.v1_1_4HomePanel.setWinnerLabelShow(this.v1_1_4HomePanel.thirdlyNameLabels, index, item.nickName)
                })
                // this.fourthlyInfolist.forEach((item, index) => {
                //     this.v1_1_4HomePanel.setWinnerLabelShow(this.v1_1_4HomePanel.fourthlyNameLabels, index, item.nickName)
                // })
                // this.fifthInfolist.forEach((item, index) => {
                //     this.v1_1_4HomePanel.setWinnerLabelShow(this.v1_1_4HomePanel.fifthNameLabels, index, item.nickName)
                // })
                break;
            case CommandDefine.V1_1_4UserSumFPForUnitCRequest:
                {
                    // console.log(info);
                    let id = Constellation.findIndex((item) => {
                        return item == info;
                    })
                    //   console.log("Constellation.findIndex((item)    " + id);

                    this.v1_1_4HomePanel.setUserFillOnePowersLabel(info, this.userFillConstellationNumList[id])
                }
                break;
            case CommandDefine.PlaySongResponce:
                let playSongInfo = notification.getBody() as PlaySongInfo;
                let songInfo = this.musicPxy.getSongInfo(playSongInfo.songName) as SongInfo;
                // console.log("V1_1_4homeview正在播放的歌 曲");
                // console.log(songInfo.musicName);
                this.v1_1_4HomePanel.setSongNameLabel(songInfo.musicName);
                this.v1_1_4HomePanel.setSongNameState(this.gamePxy.getSongIdUnlockState(songInfo.musicId), songInfo.unlockType);
                break;
            case CommandDefine.v1_1_4GetWinnerInfo:
                {
                    console.log("LOCAL  获奖信息获取响应");
                    console.log(info);
                    if (info) {
                        if (info.msg == "改用户没有获奖信息") {
                            this.isWinnerUser();

                        } else {
                            console.log("该玩家的获奖信息已经填写完成");
                         //   this.isWinnerUser();                //TEST
                            return;
                        }

                    } else if (info == false) {
                        GameManager.getInstance().showMsgTip("服务器似乎开小差了!", 3)
                    }
                }
                break;
            case CommandDefine.v1_1_4SentWinnerInfo:
                {
                    if(info==false){
                        GameManager.getInstance().showMsgTip("似乎出了点小意外,保存失败!再试试", 3);
                    }else{
                        GameManager.getInstance().showMsgTip("您的奖品正在快马加鞭准备中....", 3);
                        this.v1_1_4HomePanel.isShowOpenWinnerSetBtn(false);
                    }
                 
                }
                break;

        }
    }



    // /**
    //  * 设置用户的基本信息
    //  */
    // private setUserInfo(info: UserInfo) {
    //     let nameStr = info.nickName;
    //     this.nickName = nameStr;
    //     if (nameStr == "游客") {
    //         this.endlessPlayingHomePanel.setUserRankingLabel("--");
    //         this.endlessPlayingHomePanel.setUserMaxLabel(this.endlessPlayingPxy.getLocalMaxScore());
    //     }
    //     let headPathStr = info.head;
    //     this.endlessPlayingHomePanel.setUserNameLabel(nameStr);
    //     this.endlessPlayingHomePanel.setUserHeadIron(headPathStr);

    // }

    // private setUserRankInfo(rankID: string, maxScore: string, maxSurvivalTime: string) {
    //     this.endlessPlayingHomePanel.setUserRankingLabel(rankID);
    //     this.endlessPlayingHomePanel.setUserMaxLabel(maxScore);
    // }

    /**
    *生成星座模块
    */
    private initCreateConstellationItems() {
        for (let i = 0; i < Constellation.length; i++) {
            this.v1_1_4HomePanel.createConstellationItem((item: cc.Node) => {
                let med = new V1_1_4ConstellationItemMediator(MediatorDefine.V1_1_4ConstellationItemMediator + i, item);
                Facade.getInstance().registerMediator(med);
                med.ConstellatioName = Constellation[i];
                console.log(" med.ConstellatioName  " + med.ConstellatioName);
                med.setSpr(i);
                this.constellationItemMedlist.push(med);
                if (this.constellationTotalNumlist.length != 0) {
                    med.setFillPowers(this.constellationTotalNumlist[i]);
                }
            })
        }
    }

    /**
     * 设置星座充能的目标值
     */
    private setTargetNum(maxNum: number) {
        let targetNum
        if (maxNum * (5 / 4) < 1000000) {
            targetNum = maxNum * (5 / 4);
        } else if (maxNum * (5 / 4) > 1000000 && maxNum < 10000000) {
            let n = Math.floor(maxNum / 1000000);
            let temp = (maxNum % 1000000) / 100000;
            targetNum = (Math.floor(temp) + 1) * 100000 + n * 1000000;
        } else {
            targetNum = maxNum;
        }
        cc.log("targetNum   " + targetNum)
        return targetNum
    }

    /**
     *读取每个星座的所获得的总数据
     */
    private readConstellationTotalNum(constellationTotalList, id) {
        let num = 0;
        if (!constellationTotalList) {
            return 0
        } else {
            switch (id) {
                case 0:
                    num = constellationTotalList.ariesTotalNum
                    break;
                case 1:
                    num = constellationTotalList.taurusTotalNum
                    break;
                case 2:
                    num = constellationTotalList.geminiTotalNum
                    break;
                case 3:
                    num = constellationTotalList.cancerTotalNum
                    break;
                case 4:
                    num = constellationTotalList.leoTotalNum
                    break;
                case 5:
                    num = constellationTotalList.virgoTotalNum
                    break;
                case 6:
                    num = constellationTotalList.libraTotalNum
                    break;
                case 7:
                    num = constellationTotalList.scorpioTotalNum
                    break;
                case 8:
                    num = constellationTotalList.sagittariusTotalNum
                    break;
                case 9:
                    num = constellationTotalList.capricornTotalNum
                    break;
                case 10:
                    num = constellationTotalList.aquariusTotalNum
                    break;
                case 11:
                    num = constellationTotalList.piscesTotalNum
                    break
                default:
                    console.log("  default    ");
                    
                    num = 0;
                    break;
            }
        }
        return num;
    }

    /**
     *计算获得星座的所获得能量里的最大数据以及所对应的下标
     */
    private getMAXConstellationTotalNum(num, index) {
        if (num >= this.MAXConstellationTotalNum) {
            this.MAXConstellationTotalNum = num;
            this.MAXConstellationIdx = index
        }
    }

    /**
    *读取玩家对每个星座所从充能的数据
    */
    private readUserFillConstellationNum(FillConstellationList, id) {
        // ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]
        console.log("constellationTotalList               ");
        // console.log(FillConstellationList);
        let num = 0;
        switch (id) {
            case 0:
                num = FillConstellationList.aries
                break;
            case 1:
                num = FillConstellationList.taurus
                break;
            case 2:
                num = FillConstellationList.gemini
                break;
            case 3:
                num = FillConstellationList.cancer
                break;
            case 4:
                num = FillConstellationList.leo
                break;
            case 5:
                num = FillConstellationList.virgo
                break;
            case 6:
                num = FillConstellationList.libra
                break;
            case 7:
                num = FillConstellationList.scorpio
                break;
            case 8:
                num = FillConstellationList.sagittarius
                break;
            case 9:
                num = FillConstellationList.capricorn
                break;
            case 10:
                num = FillConstellationList.aquarius
                break;
            case 11:
                num = FillConstellationList.pisces
                break
            default:
                num = 0;
                break;
        }
        return num;
    }


    /**
     *生成次级玩家排名
     */
    private initCreateSubPlayerRankItems(size: number) {
        for (let i = 0; i < size; i++) {
            this.endItemIdx++;
            this.v1_1_4HomePanel.createSubPlayerRankItem((item: cc.Node) => {
                item.setPosition(cc.v2(item.x, -i * this.ItemHight));
                let rankItem = item.getComponent(V1_1_4PlayerRankItem);
                rankItem.init();
                this.PlayerRankItemList.push(rankItem);
            });
        }
    }

    /**
 * 配置前三名的排名信息
 */
    private configTopPlayerRankTitems() {

        for (let index = 0; index < 3; index++) {
            let tempInfo = this.playerTopRandInfolist && this.playerTopRandInfolist[index] ? this.playerTopRandInfolist[index] : null;
            let TempRank;
            if (index == 0) {
                TempRank = this.v1_1_4HomePanel.FirstRank.getComponent(V1_1_4PlayerRankItem);
            } else if (index == 1) {
                TempRank = this.v1_1_4HomePanel.SecondRank.getComponent(V1_1_4PlayerRankItem);
            } else {
                TempRank = this.v1_1_4HomePanel.thirdlyRank.getComponent(V1_1_4PlayerRankItem);
            }
            TempRank.setInfo(tempInfo, index)
        }
    }


    /**
     * 配置在前三名下面的排名信息
     */
    private configSubPlayerRankTitems() {
        this.PlayerRankItemList.forEach((rankItem: V1_1_4PlayerRankItem, index) => {
            if (rankItem.IDX != null) {
                let id = rankItem.IDX
                let tempInfo = this.playerSubRandInfolist && this.playerSubRandInfolist[id] ? this.playerSubRandInfolist[id] : null;
                rankItem.setInfo(tempInfo, id);
            }
            else {
                let tempInfo = this.playerSubRandInfolist && this.playerSubRandInfolist[index] ? this.playerSubRandInfolist[index] : null;
                rankItem.setInfo(tempInfo, index);

            }
        })
    }

    /**
     * 排行榜复用
     */
    private onListScrolling(scrollView: cc.ScrollView) {
        this.curContentY = scrollView.content.y;
        let offset = this.curContentY - this.lastContentY;
        this.lastContentY = this.curContentY;
        if (offset > 5) {
            //上滑操作时
            let firstNode = this.PlayerRankItemList[0].node;  //数组内第一个节点
            if ((firstNode.convertToWorldSpaceAR(cc.v2()).y - scrollView.node.convertToWorldSpaceAR(cc.v2()).y) > this.ItemHight) {
                this.endItemIdx++;
                if (this.endItemIdx >= 100) {    //下标超过一百
                    this.endItemIdx--;
                    return;
                }
                let temp = this.PlayerRankItemList.shift();
                let tempInfo = this.playerSubRandInfolist && this.playerSubRandInfolist[this.endItemIdx] ? this.playerSubRandInfolist[this.endItemIdx] : null;
                temp.setInfo(tempInfo, this.endItemIdx);

                this.PlayerRankItemList.push(temp);
                temp.node.y -= this.ItemHight * MaxRankItemNum;
            }
        }
        else if (offset < -5) {
            //  console.log("下滑")
            let endNode = this.PlayerRankItemList[this.PlayerRankItemList.length - 1].node;  //数组内最后一个节点
            let tempEnd = this.endItemIdx;       //未改变前的最大下标
            if ((scrollView.node.convertToWorldSpaceAR(cc.v2()).y - endNode.convertToWorldSpaceAR(cc.v2()).y) > (scrollView.node.height)) {
                this.endItemIdx--;
                let showId = tempEnd - MaxRankItemNum;
                if (showId < 0) {
                    this.endItemIdx++
                    return;
                }
                let temp = this.PlayerRankItemList.pop();
                let tempInfo = this.playerSubRandInfolist && this.playerSubRandInfolist[showId] ? this.playerSubRandInfolist[showId] : null;
                temp.setInfo(tempInfo, showId);
                this.PlayerRankItemList.unshift(temp);
                temp.node.y += this.ItemHight * MaxRankItemNum;
            }
        }

    }

    /**
     * 排行榜重置
     */
    private resetRankItems() {
        if (this.v1_1_4HomePanel.PlayerRankScrollView.isAutoScrolling) {
            this.v1_1_4HomePanel.PlayerRankScrollView.stopAutoScroll();
        }
        this.v1_1_4HomePanel.PlayerRankScrollView.content.y = 0;
        this.endItemIdx = -1;
        for (let i = 0; i < this.PlayerRankItemList.length; i++) {
            this.endItemIdx++;
            let rankItem = this.PlayerRankItemList[i];
            rankItem.node.setPosition(cc.v2(rankItem.node.x, -i * this.ItemHight));
            let tempInfo = this.playerSubRandInfolist && this.playerSubRandInfolist[i] ? this.playerSubRandInfolist[i] : null;
            rankItem.setInfo(tempInfo, i);
        }
    }

    /**
     * 打开星座能量模块
     */
    openConstellationRank() {
        this.v1_1_4HomePanel.ShowConstellationRank();
    }

    /**
     * 打开玩家排行榜单
     */
    openPlayerRank() {
        this.v1_1_4HomePanel.ShowPlayerRank();
    }


    /**
     * 显示touchGuidance
     */
    showTouchGuidance(worldpos, touchEvent) {
        let localTouchEvent = () => {
            touchEvent();
            this.closeTouchGuidance(touchEvent);
        }
        this.v1_1_4HomePanel.showTouchGuidance(worldpos, localTouchEvent);


    }
    /**
     * 关闭touchGuidance
     */
    closeTouchGuidance(touchEvent) {
        this.v1_1_4HomePanel.closeTouchGuidance(touchEvent);
    }

    /**
     * 用户获奖了,且获奖信息未填写完成
     */
    private isWinnerUser() {
        if (this.v1_1_4Pxy.getWinnerInfoEditAutoPop()) {    //信息填写弹窗已经自动弹出过
            this.v1_1_4HomePanel.isShowOpenWinnerSetBtn(true);
        }
        else {
            this.v1_1_4HomePanel.openSetWinnderInfoNode();
            this.v1_1_4Pxy.setWinnerInfoEditAutoPop();
        }
    }

    /**
     * 设置获奖名次
     */
    private setWinnergrade(id: number) {
        let grade = null;
        if (id == 1) {
            grade = 0;
        } else if (id == 2) {
            grade = 1
        } else if (id == 3) {
            grade = 2
        } else if (id > 3 && id <= 10) {
            grade = 3
        } else if (id > 10 && id <= 20) {
            grade = 4
        } else if (id > 20) {
            grade = 5;
        }
        return grade;
    }




    // /**
    //  * 检测当前用户是否在获奖名单中
    //  */
    // private checkIsWinner() {
    //     let info = null
    //     if (this.rewardMInfoList.length > 0) {
    //         info = this.rewardMInfoList.find((item) => {
    //             console.log("item.userId  ",item.userId);
    //             console.log("item.name  ",item.name);
    //             console.log("this.endlessPlayingPxy.USERINFO.nickName  ",this.endlessPlayingPxy.USERINFO.nickName);
    //             console.log("this.endlessPlayingPxy.USERINFO.userId  ",this.endlessPlayingPxy.USERINFO.userId);
    //             return item.name == this.endlessPlayingPxy.USERINFO.nickName &&item.userId==this.endlessPlayingPxy.USERINFO.userId;
    //         });

    //     }
    //     if (!info && this.rewardWInfoList.length > 0) {
    //         info = this.rewardWInfoList.find((item) => {
    //             return item == this.endlessPlayingPxy.USERINFO.nickName&&item.userId==this.endlessPlayingPxy.USERINFO.userId;
    //         });
    //     }
    //     if (info) {
    //         console.log("恭喜你为获奖用户!");
    //         return true
    //     }
    //     else {
    //         console.log("没有获奖!");
    //         return false
    //     }
    // }

    /**
     * 填写用户收货信息
     */
    private fillInRelation() {
        this.v1_1_4HomePanel.editAddressEditBox((str) => {
            this.AddressStr = str;
        })
        this.v1_1_4HomePanel.editPhoneEditBox((str) => {
            var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
            if (reg.test(str)) {
                this.PhoneStr = str;
            } else {
                this.PhoneStr = null;
                GameManager.getInstance().showMsgTip("格式有误")
            }

        })
        this.v1_1_4HomePanel.editTrueNameEditBox((str) => {
            this.TrueNameStr = str;
        })
    }
}
