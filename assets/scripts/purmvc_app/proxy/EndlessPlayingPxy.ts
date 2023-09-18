import { Proxy } from "../../core/puremvc/patterns/proxy/Proxy";
import MusicManager from "../../plugin/musicLoader/MusicManager";
import { CONSTANTS } from "../../Constants";
import { CommandDefine } from "../command/commandDefine";
import { SongInfo } from "../repositories/Rep";
import UserData from "../../Rank/UserData";
import RankManager from "../../Rank/RankManager";
import GameManager from "../../GameManager";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import config, { Platform } from "../../../config/config";
const Key_localMaxScore: string = "zdjz_localMaxScore";
const Key_localMaxTime: string = "zdjz_localMaxTime";
const Key_localShowWinnerSet: string = "zdjz_localShowWinnerSet";
export class EndlessPlayingPxy extends Proxy {


    public USERINFO: UserInfo = new UserInfo();
    private normalPhaseSongInfos: Array<SongInfo> = new Array<SongInfo>();    //正常难度阶段的歌曲集合
    private hardPhaseSongInfos: Array<SongInfo> = new Array<SongInfo>();    //困难难度阶段的歌曲集合
    private superHardPhaseSongInfos: Array<SongInfo> = new Array<SongInfo>();    //地狱难度阶段的歌曲集合
    private tempNormalPhaseSongInfos: Array<SongInfo> = new Array<SongInfo>();    //正常难度阶段的歌曲集合
    private tempHardPhaseSongInfos: Array<SongInfo> = new Array<SongInfo>();    //困难难度阶段的歌曲集合
    private tempSuperHardPhaseSongInfos: Array<SongInfo> = new Array<SongInfo>();    //地狱难度阶段的歌曲集合
    public waitPlaySongInfo: SongInfo = null;    //下一关等待开始的节奏点
    public waitPlayPointRes: any = null;    //下一关等待开始的节奏点
    public waitPlayClipRes: any = null;    //下一关等待开始的音频文件
    public stagerSKinIdx: any = null;    //当前关卡的皮肤
    private EventState = null;
    private tempScore: number = 0;
    private isOpenSet: boolean = false;
    public constructor(proxyName: string = null, data: any = null) {
        super(proxyName, data);
        this.getTable();
    }

    /**
     * 获取难度集合配置
     */
    public postPhaseSongInfos(cal: Function) {
        if (this.normalPhaseSongInfos && this.hardPhaseSongInfos && this.superHardPhaseSongInfos) {
            cal();
        }
        else {
            this.getTable(cal);
        }
    }


    /**
     * 加载歌单
     */
    public getTable(cal = null) {
        let path = "";
        switch (config.platform) {
            case Platform.android:
                path = CONSTANTS.MusicTableUrl_Android;
                break;

            default:
                path = CONSTANTS.MusicTableUrl;
                break;
        }
        MusicManager.GetInstance(MusicManager).Loader.LoadMusicTable(path, (res) => {

            this.normalPhaseSongInfos = this.fetchPhaseSongInfos(res, null);
            this.hardPhaseSongInfos = this.fetchPhaseSongInfos(res, "hard");
            this.superHardPhaseSongInfos = this.fetchPhaseSongInfos(res, "superhard");
            cal && cal()
        });

    }



    /**
     * 提取不同的阶段列表
     */
    private fetchPhaseSongInfos(arr, phaseTag: string) {
        let self = this;
        function checkAdult(songInfo: SongInfo) {
            return songInfo.ex_lv == phaseTag;
        }
        let tempArr = arr.filter(checkAdult);
        if (tempArr.length > 0) {
            return tempArr;
        }
        else {
            return null;
        }
    }


    /**
     * 
     */
    private initTempPhaseArray() {
        this.normalPhaseSongInfos.forEach((item) => {
            this.tempNormalPhaseSongInfos.push(item);
        })
        this.hardPhaseSongInfos.forEach((item) => {
            this.tempHardPhaseSongInfos.push(item);
        })
        this.superHardPhaseSongInfos.forEach((item) => {
            this.tempSuperHardPhaseSongInfos.push(item);
        })
    }

    /**
     * 提供无尽模式的第一关
     */
    public provideFirstChallenge() {
        this.initTempPhaseArray();
        if (this.tempNormalPhaseSongInfos.length != 0) {
            let randomIdx = Math.floor(Math.random() * this.tempNormalPhaseSongInfos.length);
            let songInfo = this.tempNormalPhaseSongInfos[randomIdx];
            this.tempNormalPhaseSongInfos.splice(randomIdx, 1);
            return songInfo;
        }
        else {
            console.log("this.normalPhaseSongInfos.length===0");

        }

    }

    /**
     * 提供无尽模式中正常难度的下一关
     */
    public provideNormalNextChalleng() {
        if (this.tempNormalPhaseSongInfos.length != 0) {
            console.log("正常模式的歌曲还出存在!!");
            let randomIdx = Math.floor(Math.random() * this.tempNormalPhaseSongInfos.length);
            let songInfo = this.tempNormalPhaseSongInfos[randomIdx];
            this.tempNormalPhaseSongInfos.splice(randomIdx, 1);
            return songInfo;
        }
        else {
            console.log("正常模式的歌曲闯关完成");
            return this.provideHardNextChalleng();
        }
    }

    /**
     * 提供无尽模式中困难难度的下一关
     */
    public provideHardNextChalleng() {
        if (this.tempHardPhaseSongInfos.length != 0) {
            console.log("困难模式的歌曲还没有闯关完!!");
            let randomIdx = Math.floor(Math.random() * this.tempHardPhaseSongInfos.length);
            let songInfo = this.tempHardPhaseSongInfos[randomIdx];
            this.tempHardPhaseSongInfos.splice(randomIdx, 1);
            return songInfo;
        }
        else {
            console.log("困难模式的歌曲闯关完成");
            return this.provideSurperHardNextChalleng();
        }
    }

    /**
     * 提供无尽模式中地狱难度的下一关
     */
    public provideSurperHardNextChalleng() {
        if (this.tempSuperHardPhaseSongInfos.length != 0) {
            console.log("地狱模式的歌曲还没有闯关完!!");
            let randomIdx = Math.floor(Math.random() * this.tempSuperHardPhaseSongInfos.length);
            let songInfo = this.tempSuperHardPhaseSongInfos[randomIdx];
            this.tempSuperHardPhaseSongInfos.splice(randomIdx, 1);
            return songInfo;
        }
        else {
            console.log("地狱模式的歌曲闯关完!!");
            return this.provideFirstChallenge();
        }
    }

    /**
     * 读取本地最高分
     */
    public getLocalMaxScore() {
        if (cc.sys.localStorage.getItem(Key_localMaxScore)) {
            let max = JSON.parse(cc.sys.localStorage.getItem(Key_localMaxScore))
            return max;
        } else {
            return this.tempScore;
        }

    }


    /**
     * 保存本地最高分
     */
    public setLocalMaxScore(num: number) {

        if (cc.sys.localStorage.getItem(Key_localMaxScore)) {
            let max = JSON.parse(cc.sys.localStorage.getItem(Key_localMaxScore))
            if (num > max) {
                cc.sys.localStorage.setItem(Key_localMaxScore, JSON.stringify(num));
            }
        }
        else {
            cc.sys.localStorage.setItem(Key_localMaxScore, JSON.stringify(num));

        }
    }


    /**
     * 读取本地最高存活时间
     */
    public getLocalMaxSurvivalTime() {
        if (cc.sys.localStorage.getItem(Key_localMaxTime)) {
            let max = JSON.parse(cc.sys.localStorage.getItem(Key_localMaxTime))
            return max;
        }
        return 0;
    }

    /**
     * 保存本地最高存活时间
     */
    public setLocalMaxSurvivalTime(num: number) {

        if (cc.sys.localStorage.getItem(Key_localMaxTime)) {
            let max = JSON.parse(cc.sys.localStorage.getItem(Key_localMaxTime))
            if (num > max) {
                cc.sys.localStorage.setItem(Key_localMaxTime, JSON.stringify(num));
            }
        }
        else {
            cc.sys.localStorage.setItem(Key_localMaxTime, JSON.stringify(num));
        }
    }


    /**
   * 读取是否显示过获奖信息填写页面
   */
    public getIsShowWinnerSet() {
        if (cc.sys.localStorage.getItem(Key_localShowWinnerSet)) {
            return true;
        }
        return false;
    }
    /**
    * 设置显示过获奖信息填写页面
    */
    public setShowWinnerSet() {
        cc.sys.localStorage.setItem(Key_localShowWinnerSet, JSON.stringify(true));
    }




    /**
     * 获取用户信息
     */
    public getuserInfo() {
        UserData.getInstance().getuserInfo((res) => {
            if (res) {
                console.log("local 授权成功");
                console.log(res);
                this.USERINFO.head = res.head;
                this.USERINFO.nickName = res.name;
                this.USERINFO.gender = res.sex == "0" ? "M" : "F";
                this.sendNotification(CommandDefine.UserAuthorizationResponce, this.USERINFO)
            }
            else {
                // UserData.getInstance().showAuthorize();
                this.USERINFO.gender = null;
                this.USERINFO.nickName = "游客";
                console.log("授权失败");
                ReportAnalytics.getInstance().reportAnalytics("View_Show", "MWPKAuthorizationFailure_Show", 1);
                this.sendNotification(CommandDefine.UserAuthorizationResponce, this.USERINFO)
            }
        });
    }


    /**
   * 获取用户性别
   */
    public getusergender() {
        UserData.getInstance().getuserInfo((res) => {
            if (res) {
                console.log("local 授权成功");
                this.USERINFO.head = res.head;
                this.USERINFO.nickName = res.name;
                RankManager.getInstance().getUserRank((res) => {
                    if (res != false) {
                        console.log("用户排名信息---------");
                        console.log(res);
                        this.sendNotification(CommandDefine.ELP_UserRankInfoResponce, res)
                        if (res) {
                            this.USERINFO.gender = res.rankScore.gender;
                            this.USERINFO.nickName = res.rankScore.nickName;
                            this.sendNotification(CommandDefine.UserAuthorizationResponce, this.USERINFO)
                        } else if (res == undefined) {
                            this.USERINFO.gender = null;
                            this.sendNotification(CommandDefine.UserAuthorizationResponce, this.USERINFO)
                        }
                    }
                });
            }
            else {
                // UserData.getInstance().showAuthorize();
                this.USERINFO.gender = null;
                this.USERINFO.nickName = "游客";
                console.log("授权失败");
                ReportAnalytics.getInstance().reportAnalytics("View_Show", "MWPKAuthorizationFailure_Show", 1);
                this.sendNotification(CommandDefine.UserAuthorizationResponce, this.USERINFO)
            }
        });
    }
    /**获取分数集合 */
    getScoreCollection() {
        RankManager.getInstance().getScoreCollection((res) => {
            if (res != false) {
                this.sendNotification(CommandDefine.ELP_AllScoreCollectionResponce, res)
            }

        })
    }


    /**
     * 获取整个排行榜
     */
    public getAllUserRank() {
        RankManager.getInstance().getAllUserRank(100, (res) => {
            if (res != false) {
                this.sendNotification(CommandDefine.ELP_AllRankInfoResponce, res)
            }

        })
    }
    /**获取用户排行榜 */
    public getUserRank() {
        RankManager.getInstance().getUserRank((res) => {
            if (res != false) {
                this.sendNotification(CommandDefine.ELP_UserRankInfoResponce, res)
                if (res && res.rankScore.rankScore) {
                    console.log("用户排行榜   ");
                    console.log(res);
                    this.USERINFO.gender = res.rankScore.gender;
                    this.USERINFO.nickName = res.rankScore.nickName;
                    this.USERINFO.userId = res.rankScore.userId;
                    this.tempScore = res.rankScore.rankScore;
                    this.setLocalMaxScore(this.tempScore);
                    RankManager.getInstance().setUserRank(this.getLocalMaxScore(), this.getLocalMaxSurvivalTime(), () => {
                    });
                }
            }
        });
    }

    /*获取活动时间 */

    getEventTime(cal = null) {
        let nowDate = new Date()
        // let nowDate = new Date(2020, 10, 18, 24, 0, 0, 0)
        let targetDate = new Date(2020, 10, 8, 24, 0, 0, 0)
        this.checkIsOverTime(nowDate, targetDate, cal);

        // RankManager.getInstance().getEventTime((res) => {
        //     console.log("活动时间为----------");
        //     console.log(res);
        //     if (res != false) {
        //         this.checkIsOverTime(res.sysDateTime, res.activityDeadlineTime, cal);
        //     }
        // })
    }

    /**
   * 判断活动是否过期
   */
    private checkIsOverTime(nowDate: Date, targetDate: Date, cal: Function) {
        let sysDateTime = nowDate.getTime();
        let activityDeadlineTime = targetDate.getTime();
        // console.log("sysDateTime " + sysDateTimeStr);
        // console.log(sysDateTime);
        // console.log("activityDeadlineTime " + activityDeadlineTimeStr);
        // console.log(activityDeadlineTime);
        //七天后活动入口关闭
        if (sysDateTime > (activityDeadlineTime + 604800000)) {
            console.log("截止后达七天，活动入口关闭");
            this.EventState = ELPEventState.END;
            cal && cal(this.EventState)
        }
        else if (sysDateTime > activityDeadlineTime) {
            console.log("活动已经截止");
            this.EventState = ELPEventState.SETTE;
            cal && cal(this.EventState)

        }
        else {
            console.log("活动正在进行中！！！");
            this.EventState = ELPEventState.ING;
            cal && cal(this.EventState)
        }
    }

    /**
     * 获得活动的状态
     */
    public getELPEventState(cal: Function) {
        if (this.EventState != null) {
            cal(this.EventState);
        }
        else {
            this.getEventTime(cal);
        }
    }
}

export enum ELPEventState {
    ING = 0,
    SETTE = 1,
    END = 2
}

export class UserInfo {
    head: string = "";
    gender: string = "M";
    nickName: string = "";
    userId: string = "";
    constructor(_h = "", _g = "", _name = "", _userId = "") {
        this.head = _h;
        this.gender = _g;
        this.nickName = _name;
        this.userId = _userId;
    }
}