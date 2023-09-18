import config, { Platform } from "../../config/config";

const { ccclass, property } = cc._decorator;

export class ReportAnalytics {
    private static instance: ReportAnalytics
    public static getInstance(): ReportAnalytics {
        if (!ReportAnalytics.instance) {
            ReportAnalytics.instance = new ReportAnalytics()
            ReportAnalytics.instance.startTime=new Date().getTime();
            ReportAnalytics.instance.LocalADCount=0;
        }
        return ReportAnalytics.instance
    }
    public startTime:number=0
    public LocalADCount:number=0;
    public LiftTime:number=0


    //数据打点
    reportAnalytics(name: string, name2: string, data) {
        var DATA = {}
        switch (name) {
            case "View_Show":
                DATA = {
                    SignUI_Show: 0,
                    MainUI_Show: 0,
                    ReviveUI_Show: 0,
                    FailureUI_Show: 0,
                    WinUI_Show: 0,
                    ShareUI_Show: 0,
                    SkinUI_Show: 0,
                    AchievementUI_Show: 0,
                    LifeUI_Show: 0,
                    getCoinUI_Show: 0,
                    GameStart_Show: 0,
                    MusicRecUI_Show: 0,
                    GameStartLoading_Show: 0,
                    GameGuid_Show: 0,
                    GameFrist_Fps: 0,
                    ZQnoticeView_Show: 0,

                    MWPKView_Show: 0,
                    Infinite_Games_Show: 0,
                    Infinite_Revive_Show: 0,
                    Infinite_Finsh_Show: 0,
                    MWPKAuthorizationFailure_Show: 0,
                    MWPKAuthorizationSucceed_Show: 0,

                    V1_1_4Announcement_Show: 0,
                    V1_1_4Home_Show: 0,
                }
                break;
            case "NoAdBtn_Click":
                DATA = {
                    SignUI_ReceiveClick: 0,
                    MainUI_SkinBtn_Click: 0,
                    MainUI_DouYinBtn_Click: 0,
                    MainUI_ScreenBtn_Click: 0,
                    MainUI_achievementBtn_Click: 0,
                    MainUI_GetCoinBtn_Click: 0,
                    MainUI_GetLifeBtn_Click: 0,
                    MainUI_CoinUnlockBtn_Click: 0,
                    ReviveUI_CoinClick: 0,
                    FailureUI_ReturnMainBtn_Click: 0,
                    FailureUI_ShareBtn_Click: 0,
                    FailureUI_AgainGameBtn_Click: 0,
                    WinUI_ReturnMainBtn_Click: 0,
                    WinUI_StartNewMus_Click: 0,
                    WinUI_ShareBtn_Click: 0,
                    ShareUI_ShareBtn_Click: 0,
                    SkinUI_CoinUnlock_Click: 0,
                    AchievementUI_GetBtn_Click: 0,
                    LifeUI_CoinLife_Vclick: 0,
                    GunSkinUnlockRec_Click: 0,
                    ZQGunGet_Click: 0,

                    MWPKView_Start_Click: 0,
                    MWPKactivity_Details_Click: 0,
                    MWPKactivity_Start_Click: 0,
                    MWPKfinish_Colse_Click: 0,
                    MWPKfinish_Again_Click: 0,

                    V1_1_4Announcement_Start_Click: 0,
                    V1_1_4Home_NoAdStart_Click: 0,
                    V1_1_4Home_back_Click: 0,
                    V1_1_4HomeExplain_Click: 0,
                    NewQuickStartNoAd_Click: 0,

                    V1_1_4HomeLogin_Click: 0,
                    V1_1_4HomeAuthorized_Click:0,
                }
                break;
            case "AdBtn_Vclick":
                DATA = {
                    SignUI_Vclick: 0,
                    MainUI_UnlockMusic_Vclick: 0,
                    ReviveUI_Vclick: 0,
                    FailureUI_UnlockMusic_Vclick: 0,
                    FailureUI_getCoin_Vclick: 0,
                    WinUI_getCoin_Vclick: 0,
                    WinUI_UnlockMusic_Vclick: 0,
                    SkinUI_Unlock_Vclick: 0,
                    LifeUI_getLife_Vclick: 0,
                    getCoinUI_getCoin_Vclick: 0,
                    MusicRec_Vlick: 0,

                    Infinite_Revive_ADClick: 0,

                    NewQuickStart_AdClick: 0,
                    V1_1_4HomeQuickStart_AdClick:0,
                }

                break;
            case "Song_Message":
                DATA = {
                    Song_Click: '',
                    ReviveUI_Show: '',
                    WinUI_Show: '',
                    ReviveUI_Vclick: '',
                    ReviveUI_CoinClick: '',
                }
                break;
        }
        DATA[name2] = data
        console.log("事件分析     " + name, name2)
        //@ts-ignore
        if (config.platform == Platform.douYin && typeof tt != "undefined") {
            //@ts-ignore
            tt.reportAnalytics(name, DATA);
        }
    }
    /**
     * 单次生命周期分析
     */
    SingleLifeCycleAnalytics() {
        this.LiftTime=Math.round((new Date().getTime()-this.startTime)/1000);
        if(this.LiftTime<200){
            this.LiftTime=200
        }else if(this.LiftTime<250){this.LiftTime=250}
        else if(this.LiftTime<300){this.LiftTime=300}
        else if(this.LiftTime<350){this.LiftTime=350}
        else if(this.LiftTime<400){this.LiftTime=400}
        else if(this.LiftTime<450){this.LiftTime=450}
        else {this.LiftTime=500}
     //   console.log("单次生命周期分析:     " + "广告次数: "+ this.LocalADCount+ "  生命周期:   "+  this.LiftTime)
        //@ts-ignore
        if (config.platform == Platform.douYin && typeof tt != "undefined") {
            //@ts-ignore
            tt.reportAnalytics('SingleLifeCycle', {
                ADCount: this.LocalADCount,
                LiftTime: this.LiftTime,
            });
        }
    }
}
