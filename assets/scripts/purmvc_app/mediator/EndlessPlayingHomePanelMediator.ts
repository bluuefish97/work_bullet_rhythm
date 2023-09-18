
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "../command/commandDefine";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import UIPanelCtr from "../../util/UIPanelCtr";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import EndlessPlayingHomePanel from "./EndlessPlayingHomePanel";
import Rankitem from "./Rankitem";
import { EndlessPlayingPxy, ELPEventState, UserInfo } from "../proxy/EndlessPlayingPxy";
import UserData from "../../Rank/UserData";
import { PanelType } from "../../util/PanelType";
import { Utility } from "../../util/Utility";
import RankManager from "../../Rank/RankManager";
import AdController from "../../plugin/ADSdk/AdController";
import config, { Platform } from "../../../config/config";

export class EndlessPlayingHomePanelMediator extends Mediator {
    private endlessPlayingHomePanel: EndlessPlayingHomePanel = null;
    private endlessPlayingPxy: EndlessPlayingPxy;
    private isScoreRankToggle: boolean = true;
    private nickName: string = null;
    private tempSex: string = null;
    private endItemIdx: number = -1;    //歌曲列表内最后变化的下标
    private RankItemlist: Array<Rankitem> = new Array<Rankitem>();
    private curContentY: number = 0;
    private lastContentY: number = 0;
    private ItemHight: number = 160;
    private maxContentHight: number = 0;
    private surfaceRankItemNum: number = 100;
    private actualRankItemNum: number = 10;
    private winnerRewardID: number = 0;
    private rankScoreFList;
    private rankScoreMList;
    private rankSurvivalFList;
    private rankSurvivalMList;
    private rewardMInfoList;
    private rewardWInfoList;
    private Mlist;
    private Wlist;
    private PhoneStr = null;
    private AddressStr = null;
    private TrueNameStr = null;
    private isSetWinnerInfo: boolean = false;
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
        this.endlessPlayingHomePanel = viewNode.getComponent(EndlessPlayingHomePanel);
        this.endlessPlayingHomePanel.closeSetSexNode();
        this.endlessPlayingHomePanel.closeSetWinnderInfoNode();
        this.endlessPlayingHomePanel.closeNameListInfoNode();
        this.endlessPlayingHomePanel.isShowOpenWinnerSetBtn(false)
        this.isScoreRankToggle = true;
        this.maxContentHight = this.actualRankItemNum * this.ItemHight;
        this.endlessPlayingPxy.getELPEventState((state) => {
            if (state == ELPEventState.ING) {
                console.log("无尽模式活动页  ELPEventState.ING");
                this.endlessPlayingHomePanel.ShowPlayingState();
            }
            else if (state == ELPEventState.SETTE) {
                console.log("无尽模式活动页  ELPEventState.SETTE");
                this.endlessPlayingHomePanel.ShowPlaySettleState();
            }
            else {
                console.log("无尽模式活动页  ELPEventState.END");
            }
        })
        this.bindListener();
    }

    private bindListener(): void {
        this.endlessPlayingHomePanel.onEnterCall = () => {
            ReportAnalytics.getInstance().reportAnalytics("View_Show", "MWPKactivity_Show", 1);
            // GameManager.getInstance().showReadingTip();
            if (AdController.instance.ADOK) {
                console.log("广告SDK初始化完成,在活动页进入后请求用户登陆情况!!!");
                UserData.getInstance().getuserID((isLogin: boolean) => {
                    this.sendNotification(CommandDefine.UserLoginResponce, isLogin)
                })
            }
            // this.endlessPlayingPxy.getuserInfo();

        }
        this.endlessPlayingHomePanel.setCloseBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();
            AdController.instance.AdSDK.showBanner();
            AdController.instance.bannnerShowIng=true;
        });
        this.endlessPlayingHomePanel.setStartPlayButtonClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            Facade.getInstance().sendNotification(CommandDefine.StartEndlessPlayingRequest);
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "MWPKactivity_Start_Click", 1);
        });
        this.endlessPlayingHomePanel.setLookWinnerListButtonClickEvent(() => {
            if (this.nickName == "游客") {
                GameManager.getInstance().showMsgTip("需要您登陆以及用户信息的权限哦！", 4);
            } else {
                this.endlessPlayingHomePanel.openNameListInfoNode();
                this.endlessPlayingHomePanel.setNameListLabel(this.rewardMInfoList, this.rewardWInfoList);
            }
        })
        this.endlessPlayingHomePanel.setNameListCloseBtnClickEvent(() => {
            this.endlessPlayingHomePanel.closeNameListInfoNode();
        })
        this.endlessPlayingHomePanel.setSexSetSureBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.endlessPlayingHomePanel.closeSetSexNode();
            console.log("上传用户的性别信息 " + this.tempSex);
            this.endlessPlayingHomePanel.setUserSexIron(this.tempSex)
            RankManager.getInstance().setUserRank(null, null, () => {
                this.endlessPlayingPxy.getuserInfo();
            });
            //TODO 上传用户的性别信息
        });
        this.endlessPlayingHomePanel.setMSexToggleEvent((_toggle: cc.Toggle) => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            _toggle.node.zIndex = 10;
            if (_toggle.isChecked) {
                this.tempSex = "M";
                console.log("设置用户的性别信息为男 " + this.tempSex);
                UserData.getInstance().Data.Gender = "M"


            }
        });
        this.endlessPlayingHomePanel.setWSexToggleEvent((_toggle: cc.Toggle) => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            _toggle.node.zIndex = 10;
            if (_toggle.isChecked) {
                this.tempSex = "F";
                UserData.getInstance().Data.Gender = "F"
                console.log("设置用户的性别信息为女 " + this.tempSex);
            }
        });
        this.endlessPlayingHomePanel.setScoreRankToggleEvent((_toggle: cc.Toggle) => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (_toggle.isChecked) {
                this.isScoreRankToggle = _toggle.isChecked;
                this.Mlist = this.rankScoreMList;
                this.Wlist = this.rankScoreFList;
                this.resetRankItems(true);

            }
        });
        this.endlessPlayingHomePanel.setTimeRankToggleEvent((_toggle: cc.Toggle) => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (_toggle.isChecked) {
                this.isScoreRankToggle = !_toggle.isChecked;
                this.Mlist = this.rankSurvivalMList;
                this.Wlist = this.rankSurvivalFList;
                this.resetRankItems(true);
            }
        });
        this.endlessPlayingHomePanel.setRankScrollViewScrollEvent(this.onListScrolling, this);
        this.endlessPlayingHomePanel.winnderAwardToggleContainer.toggleItems.forEach((tog: cc.Toggle, index) => {
            tog.node.on("toggle", (_tog: cc.Toggle) => {
                if (_tog.isChecked) {
                    this.winnerRewardID = index;
                    console.log("选择了  " + index + "  号奖品!!");

                }
            });
        })
        this.endlessPlayingHomePanel.setOpenWinnerSetBtnClickEvent(() => {
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            if (this.isSetWinnerInfo) {
                GameManager.getInstance().showMsgTip("你的礼物正在赶来的路上!!", 3)
            } else {
                this.endlessPlayingHomePanel.openSetWinnderInfoNode();
            }
        })
        this.endlessPlayingHomePanel.setloginTipClickEvent(() => {
            UserData.getInstance().showLogin(() => {
                UserData.getInstance().getuserID((isLogin: boolean) => {
                    this.sendNotification(CommandDefine.UserLoginResponce, isLogin)
                })
            })
        })
        this.endlessPlayingHomePanel.setAuthorizedTipClickEvent(() => {
            UserData.getInstance().showAuthorize();
            setTimeout(() => {
                this.endlessPlayingHomePanel.authorizedEnsurePanel.active = true;
            }, 800);

        })
        this.endlessPlayingHomePanel.setRefreshAuthorizeClickEvent(() => {
            UserData.getInstance().getuserInfo((res) => {
                this.sendNotification(CommandDefine.UserAuthorizationResponce, res);
                this.endlessPlayingHomePanel.authorizedEnsurePanel.active = false;
            })
        })

        this.endlessPlayingHomePanel.defaultRankToggle();
        this.fillInRelation();
        this.endlessPlayingHomePanel.setWinnderInfoCloseBtnClickEvent(() => {
            this.endlessPlayingHomePanel.closeSetWinnderInfoNode();
        })
    }

    public listNotificationInterests(): string[] {
        return [
            CommandDefine.ADInitResponce,
            CommandDefine.UserLoginResponce,
            CommandDefine.UserAuthorizationResponce,

            CommandDefine.ELP_AllRankInfoResponce,
            CommandDefine.ELP_UserRankInfoResponce,
            CommandDefine.ELP_AllScoreCollectionResponce,

        ];
    }

    public handleNotification(notification: INotification): void {
        let info = notification.getBody()
        switch (notification.getName()) {
            case CommandDefine.ADInitResponce:
                if (info) {
                    console.log("无尽模式活动页  广告已经初始化完成,现在可以请求用户的登陆信息情况了");
                    UserData.getInstance().getuserID((isLogin: boolean) => {
                        this.sendNotification(CommandDefine.UserLoginResponce, isLogin)
                    })
                }

                break;
            case CommandDefine.UserLoginResponce:
                // GameManager.getInstance().closeReadingTip();
                if (!UIPanelCtr.getInstance().checkIsTopPanel(PanelType.EndlessPlayingHomePanel)) return;
                this.initCreateRankItems(this.actualRankItemNum);
                this.endlessPlayingHomePanel.setContentHeight(this.surfaceRankItemNum * this.ItemHight + 500);
                if (info) {
                    console.log("无尽模式活动页  用户已经登陆, 请求用户授权情况");
                    UserData.getInstance().getuserInfo((res) => {
                        this.sendNotification(CommandDefine.UserAuthorizationResponce, res)
                    })
                }
                else {
                    console.log("无尽模式活动页  用户未登陆!!");
                    this.endlessPlayingHomePanel.showTouristRank();
                    GameManager.getInstance().showMsgTip("请先登录!!!", 4);
                    this.setUserInfo(new UserInfo(null, null, "游客"));
                    let totalRankScoreF = "--";
                    let totalRankScoreM = "--";
                    let totalRankSurvivalF = "--";
                    let totalRankSurvivalM = "--";
                    let MSSP = 0.5;
                    let WSSP = 0.5;
                    let MSSvP = 0.5;
                    let WSSvP = 0.5;
                    this.endlessPlayingHomePanel.setMSumScoreLabel(totalRankScoreM);
                    this.endlessPlayingHomePanel.setWSumScoreLabel(totalRankScoreF);
                    this.endlessPlayingHomePanel.setMSumTimeLabel(totalRankSurvivalM);
                    this.endlessPlayingHomePanel.setWSumTimeLabel(totalRankSurvivalF);
                    this.endlessPlayingHomePanel.setMSumScoreProgressBar(MSSP)
                    this.endlessPlayingHomePanel.setWSumScoreProgressBar(WSSP)
                    this.endlessPlayingHomePanel.setMSumTimeProgressBar(MSSvP)
                    this.endlessPlayingHomePanel.setWSumTimeProgressBar(WSSvP)
                }

                break;
            case CommandDefine.UserAuthorizationResponce:
                if (!UIPanelCtr.getInstance().checkIsTopPanel(PanelType.EndlessPlayingHomePanel)) return;
                this.resetRankItems();

                if (info.power) {
                    console.log("无尽模式活动页  用户授权成功");
                    this.setUserInfo(new UserInfo(info.head, null, info.name));
                    this.resetRankItems();
                    this.serverSeek();
                    this.endlessPlayingHomePanel.showLoginUserRank();
                }
                else {
                    console.log("无尽模式活动页  用户未授权");
                    this.setUserRankInfo("--", this.endlessPlayingPxy.getLocalMaxScore(), "--")
                    this.endlessPlayingHomePanel.showunauthorizedRank();
                    this.setUserInfo(new UserInfo(null, null, "未授权玩家"));
                    let totalRankScoreF = "--";
                    let totalRankScoreM = "--";
                    let totalRankSurvivalF = "--";
                    let totalRankSurvivalM = "--";
                    let MSSP = 0.5;
                    let WSSP = 0.5;
                    let MSSvP = 0.5;
                    let WSSvP = 0.5;
                    this.endlessPlayingHomePanel.setMSumScoreLabel(totalRankScoreM);
                    this.endlessPlayingHomePanel.setWSumScoreLabel(totalRankScoreF);
                    this.endlessPlayingHomePanel.setMSumTimeLabel(totalRankSurvivalM);
                    this.endlessPlayingHomePanel.setWSumTimeLabel(totalRankSurvivalF);
                    this.endlessPlayingHomePanel.setMSumScoreProgressBar(MSSP)
                    this.endlessPlayingHomePanel.setWSumScoreProgressBar(WSSP)
                    this.endlessPlayingHomePanel.setMSumTimeProgressBar(MSSvP)
                    this.endlessPlayingHomePanel.setWSumTimeProgressBar(WSSvP)
                }
                break;
            case CommandDefine.ELP_AllRankInfoResponce:
                console.log("全部排行信息  ");
                if (info) {
                    this.rankScoreFList = info.rankScoreFList
                    this.rankScoreMList = info.rankScoreMList
                    this.rankSurvivalFList = info.rankSurvivalFList
                    this.rankSurvivalMList = info.rankSurvivalMList
                    this.configRankItems()
                    this.endlessPlayingPxy.getELPEventState((state) => {
                        if (state == ELPEventState.SETTE) {
                            this.rewardMInfoList = this.calculateAwardUserList(this.rankScoreMList, this.rankSurvivalMList)
                            this.rewardWInfoList = this.calculateAwardUserList(this.rankScoreFList, this.rankSurvivalFList)
                            if (this.checkIsWinner()) {
                                RankManager.getInstance().getWinnerInfo((res) => {
                                    console.log("获奖信息");
                                    console.log(res);
                                    if (res != false) {
                                        if (res.msg == "改用户没有获奖信息") {
                                            this.isSetWinnerInfo = false;
                                            if (!this.endlessPlayingPxy.getIsShowWinnerSet()) {
                                                this.endlessPlayingHomePanel.openSetWinnderInfoNode();
                                            }
                                            this.endlessPlayingHomePanel.isShowOpenWinnerSetBtn(true)
                                        } else if (res.msg == "success") {
                                            GameManager.getInstance().showMsgTip("你的礼物正在赶来的路上!!", 3)
                                            // if (!this.endlessPlayingPxy.getIsShowWinnerSet()) {
                                            //     this.endlessPlayingPxy.setShowWinnerSet();
                                            //     this.endlessPlayingHomePanel.openSetWinnderInfoNode();
                                            // }
                                        }
                                    }
                                })

                            }
                            else {
                                GameManager.getInstance().showMsgTip("很遗憾,您未上榜")
                                this.endlessPlayingHomePanel.isShowOpenWinnerSetBtn(false)
                            }

                            this.endlessPlayingHomePanel.LookWinnerNode.active = true
                        }
                    })
                }
                break;
            case CommandDefine.ELP_UserRankInfoResponce:
                console.log("------------------- 用户排行信息  ");
                if (!UIPanelCtr.getInstance().checkIsTopPanel(PanelType.EndlessPlayingHomePanel)) return;
                console.log(notification.getBody());
                if (notification.getBody()) {
                    let info = notification.getBody();
                    console.log("用户排行信息   info");
                    console.log(info);
                    let rankIDStr = info.rankScore.rank != null || info.rankScore.rank == -1 ? info.rankScore.rank : "--";
                    let rankScore = info.rankScore.rankScore != null || info.rankScore.rankScore == -1 ? info.rankScore.rankScore : "--";;
                    this.setUserRankInfo(rankIDStr, rankScore, "--");
                    this.endlessPlayingHomePanel.closeSetSexNode();
                    if (!this.tempSex) {
                        this.tempSex = info.rankScore.gender
                        this.endlessPlayingHomePanel.setUserSexIron(this.tempSex)
                    }
                    if (info.rankScore.rank == -1 || !info.rankScore.rank) {
                        this.setUserRankInfo("--", this.endlessPlayingPxy.getLocalMaxScore(), "--")
                        this.endlessPlayingPxy.getELPEventState((state) => {
                            if (state == ELPEventState.ING) {
                                this.endlessPlayingHomePanel.openSetSexNode();
                            }
                            else if (state == ELPEventState.SETTE) {
                                // GameManager.getInstance().showMsgTip("活动已经结束----------！！")
                            }
                        })
                        this.tempSex = "M";
                    }
                }
                else {
                    this.setUserRankInfo("--", this.endlessPlayingPxy.getLocalMaxScore(), "--")
                    this.endlessPlayingPxy.getELPEventState((state) => {
                        if (state == ELPEventState.ING) {
                            this.endlessPlayingHomePanel.openSetSexNode();
                        }
                        else if (state == ELPEventState.SETTE) {
                            //GameManager.getInstance().showMsgTip("活动已经结束！！")
                        }
                    })
                    this.tempSex = "M";
                }
                break;
            case CommandDefine.ELP_AllScoreCollectionResponce:
                console.log("分数合集  ");
                if (info) {
                    let totalRankScoreF = info.totalRankScoreF
                    let totalRankScoreM = info.totalRankScoreM
                    let totalRankSurvivalF = info.totalRankSurvivalF
                    let totalRankSurvivalM = info.totalRankSurvivalM
                    let MSSP = 0.5;
                    let WSSP = 0.5;
                    let MSSvP = 0.5;
                    let WSSvP = 0.5;
                    let sumScore = totalRankScoreF + totalRankScoreM;
                    let sumSurvival = totalRankSurvivalF + totalRankSurvivalM;
                    if (sumScore == 0) {
                        MSSP = 0.5;
                        WSSP = 0.5;
                    }
                    else {
                        MSSP = totalRankScoreM / sumScore
                        WSSP = totalRankScoreF / sumScore
                    }
                    if (sumSurvival == 0) {
                        MSSvP = 0.5;
                        WSSvP = 0.5;
                    }
                    else {
                        MSSvP = totalRankSurvivalM / sumSurvival
                        WSSvP = totalRankSurvivalF / sumSurvival
                    }
                    this.endlessPlayingHomePanel.setMSumScoreLabel(totalRankScoreM);
                    this.endlessPlayingHomePanel.setWSumScoreLabel(totalRankScoreF);
                    this.endlessPlayingHomePanel.setMSumTimeLabel(totalRankSurvivalM);
                    this.endlessPlayingHomePanel.setWSumTimeLabel(totalRankSurvivalF);
                    this.endlessPlayingHomePanel.setMSumScoreProgressBar(MSSP)
                    this.endlessPlayingHomePanel.setWSumScoreProgressBar(WSSP)
                    this.endlessPlayingHomePanel.setMSumTimeProgressBar(MSSvP)
                    this.endlessPlayingHomePanel.setWSumTimeProgressBar(WSSvP)
                }
                else {
                    GameManager.getInstance().showMsgTip("总分获取失败!!")
                }

                break;


        }
    }
    /**
      *服务器数据请求
      */
    private serverSeek() {
        this.endlessPlayingPxy.getAllUserRank();
        this.endlessPlayingPxy.getUserRank();
        this.endlessPlayingPxy.getScoreCollection();
    }


    /**
     * 设置用户的基本信息
     */
    private setUserInfo(info: UserInfo) {
        let nameStr = info.nickName;
        this.nickName = nameStr;
        if (nameStr == "游客") {
            this.endlessPlayingHomePanel.setUserRankingLabel("--");
            this.endlessPlayingHomePanel.setUserMaxLabel(this.endlessPlayingPxy.getLocalMaxScore());
        }
        let headPathStr = info.head;
        this.endlessPlayingHomePanel.setUserNameLabel(nameStr);
        this.endlessPlayingHomePanel.setUserHeadIron(headPathStr);

    }

    private setUserRankInfo(rankID: string, maxScore: string, maxSurvivalTime: string) {
        this.endlessPlayingHomePanel.setUserRankingLabel(rankID);
        this.endlessPlayingHomePanel.setUserMaxLabel(maxScore);
    }

    private initCreateRankItems(size: number) {
        if (this.endlessPlayingHomePanel.rankScrollView.content.childrenCount > 0) return;
        for (let i = 0; i < size; i++) {
            this.endItemIdx++;
            this.endlessPlayingHomePanel.createRankItem((item: cc.Node) => {
                item.setPosition(cc.v2(item.x, -i * this.ItemHight));
                let rankItem = item.getComponent(Rankitem);
                rankItem.setInfo(null, null, i);
                this.RankItemlist.push(rankItem);
            });
        }
    }

    /**
     * 配置排名信息
     */
    private configRankItems() {
        this.Mlist = this.isScoreRankToggle ? this.rankScoreMList : this.rankSurvivalMList;
        this.Wlist = this.isScoreRankToggle ? this.rankScoreFList : this.rankSurvivalFList
        this.RankItemlist.forEach((rankItem: Rankitem, index) => {
            if (rankItem.IDX != -1) {
                let id = rankItem.IDX
                let tempMinfo = this.Mlist && this.Mlist[id] ? this.Mlist[id] : null;
                let tempWInfo = this.Wlist && this.Wlist[id] ? this.Wlist[id] : null;
                rankItem.setInfo(tempMinfo, tempWInfo, id);
            }
            else {
                let tempMinfo = this.Mlist && this.Mlist[index] ? this.Mlist[index] : null;
                let tempWInfo = this.Wlist && this.Wlist[index] ? this.Wlist[index] : null;
                rankItem.setInfo(tempMinfo, tempWInfo, index);
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
            let firstNode = this.RankItemlist[0].node;  //数组内第一个节点
            if (scrollView.node.convertToNodeSpaceAR(firstNode.convertToWorldSpaceAR(cc.v2())).y > this.ItemHight) {
                this.endItemIdx++;
                if (this.endItemIdx >= 100) {    //下标超过一百
                    this.endItemIdx--;
                    return;
                }
                let temp = this.RankItemlist.shift();
                let tempMinfo = this.Mlist && this.Mlist[this.endItemIdx] ? this.Mlist[this.endItemIdx] : null;
                let tempWInfo = this.Wlist && this.Wlist[this.endItemIdx] ? this.Wlist[this.endItemIdx] : null;
                temp.setInfo(tempMinfo, tempWInfo, this.endItemIdx);
                this.RankItemlist.push(temp);
                temp.node.y -= this.ItemHight * this.actualRankItemNum;
            }
        }
        else if (offset < -5) {
            //  console.log("下滑")
            let endNode = this.RankItemlist[this.RankItemlist.length - 1].node;  //数组内最后一个节点
            let tempEnd = this.endItemIdx;       //未改变前的最大下标
            if (scrollView.node.convertToNodeSpaceAR(endNode.convertToWorldSpaceAR(cc.v2())).y < -scrollView.node.height - 200) {
                this.endItemIdx--;
                let showId = tempEnd - this.actualRankItemNum;
                if (showId < 0) {
                    this.endItemIdx++
                    return;
                }
                let temp = this.RankItemlist.pop();
                let tempMinfo = this.Mlist && this.Mlist[showId] ? this.Mlist[showId] : null;
                let tempWInfo = this.Wlist && this.Wlist[showId] ? this.Wlist[showId] : null;
                temp.setInfo(tempMinfo, tempWInfo, showId);
                // temp.setInfo(this.Mlist[showId], this.Wlist[showId], showId);
                this.RankItemlist.unshift(temp);
                temp.node.y += this.ItemHight * this.actualRankItemNum;
            }
        }

    }

    /**
     * 排行榜重置
     */
    private resetRankItems(isNeedAct = false) {
        if (this.endlessPlayingHomePanel.rankScrollView.isAutoScrolling) {
            this.endlessPlayingHomePanel.rankScrollView.stopAutoScroll();
        }
        this.endlessPlayingHomePanel.rankScrollView.content.y = 0;
        this.endItemIdx = -1;
        for (let i = 0; i < this.RankItemlist.length; i++) {
            this.endItemIdx++;
            let rankItem = this.RankItemlist[i];
            rankItem.node.setPosition(cc.v2(rankItem.node.x, -i * this.ItemHight));
            let tempMinfo = this.Mlist && this.Mlist[i] ? this.Mlist[i] : null;
            let tempWInfo = this.Wlist && this.Wlist[i] ? this.Wlist[i] : null;
            rankItem.setInfo(tempMinfo, tempWInfo, i);
            if (isNeedAct) rankItem.enterAct();
        }
    }

    /**
     * 计算获奖名单
     */
    private calculateAwardUserList(rankScoreList, rankSurvivalList) {
        let frontScoreList = new Array();
        let frontSurvivalList = new Array();
        let num=10;
        if (config.platform == Platform.oppo) {
            num=5
        }
        if (rankScoreList != null) {
            rankScoreList.forEach((element, index) => {
                if (index < num) {   
                    frontScoreList.push(element)
                }
            });
        }
        if (rankSurvivalList != null) {
            rankSurvivalList.forEach((element, index) => {
                if (index < num) {
                    frontSurvivalList.push(element)
                }
            });
        }
        var totalList = frontScoreList.concat(frontSurvivalList);
        let infoList = new Array();
        console.log("获奖名单======");
        console.log(totalList);
        if (totalList.length != 0) {
            totalList.forEach(element => {
                infoList.push(
                    {
                        name: element.nickName,
                        userId: element.userId
                    })
            });
        }
        infoList = Utility.unique(infoList);
        return infoList;
    }

    /**
     * 检测当前用户是否在获奖名单中
     */
    private checkIsWinner() {
        let info = null
        if (this.rewardMInfoList.length > 0) {
            info = this.rewardMInfoList.find((item) => {
                console.log("item.userId  ",item.userId);
                console.log("item.name  ",item.name);
                console.log("this.endlessPlayingPxy.USERINFO.nickName  ",this.endlessPlayingPxy.USERINFO.nickName);
                console.log("this.endlessPlayingPxy.USERINFO.userId  ",this.endlessPlayingPxy.USERINFO.userId);
                return item.name == this.endlessPlayingPxy.USERINFO.nickName &&item.userId==this.endlessPlayingPxy.USERINFO.userId;
            });

        }
        if (!info && this.rewardWInfoList.length > 0) {
            info = this.rewardWInfoList.find((item) => {
                return item == this.endlessPlayingPxy.USERINFO.nickName&&item.userId==this.endlessPlayingPxy.USERINFO.userId;
            });
        }
        if (info) {
            console.log("恭喜你为获奖用户!");
            return true
        }
        else {
            console.log("没有获奖!");
            return false
        }
    }

    /**
     * 填写用户收货信息
     */
    private fillInRelation() {
        this.endlessPlayingHomePanel.editAddressEditBox((str) => {
            this.AddressStr = str;
        })
        this.endlessPlayingHomePanel.editPhoneEditBox((str) => {
            var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
            if (reg.test(str)) {
                this.PhoneStr = str;
            } else {
                this.PhoneStr = null;
                GameManager.getInstance().showMsgTip("格式有误")
            }

        })
        this.endlessPlayingHomePanel.editTrueNameEditBox((str) => {
            this.TrueNameStr = str;
        })
        this.endlessPlayingHomePanel.setWinnderInfoSureBtnClickEvent(() => {
            console.log("PhoneStr   " + this.PhoneStr);
            if (this.AddressStr && this.PhoneStr && this.TrueNameStr) {
                RankManager.getInstance().sentWinnerInfo(this.AddressStr, this.PhoneStr, this.TrueNameStr, this.winnerRewardID.toString());
                this.endlessPlayingHomePanel.closeSetWinnderInfoNode();
                GameManager.getInstance().showMsgTip("你的礼物马上会送达", 5)
                this.isSetWinnerInfo = true;
                this.endlessPlayingPxy.setShowWinnerSet();
            }
            else {
                GameManager.getInstance().showMsgTip("信息填写不完整或格式有误")
                this.isSetWinnerInfo = false;
            }
        })

    }
}