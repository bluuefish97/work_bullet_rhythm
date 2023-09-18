export class CONSTANTS {

    static readonly Key_new: string = "zdjz_Key_new";
    static GAMEVersion = "v1_1_3";          //版本更新时才能改动
    static readonly Key_signNumber: string = "zdjz_signNumber";
    static readonly Key_diaNumber: string = "zdjz_diaNumber";
    static readonly Key_powerNumber: string = "zdjz_powerNumber";
    static readonly Key_lastCloseGameDate: string = "zdjz_lastCloseGameDate";        //上一次关闭游戏的时间 key
    static readonly Key_lastSignDate: string = "zdjz_lastSignDate";        //上一次签到的时间 key

    static readonly Key_gunSkinId: string = "zdjz_gunSkinId";             //解锁的枪的皮肤id key
    static readonly Key_lockgunSkinIds: string = "zdjz_lockgunSkinIds";             //锁住的枪的皮肤id列表 key
    static readonly Key_equipGunSkinId: string = "zdjz_equipGunSkinId";        //装备的枪的皮肤id key

    static readonly Key_starNumSongId: string = "zdjz_starNumSongId";          //该id歌曲的星星数量 key
    static readonly Key_bestScoreSongId: string = "zdjz_bestScoreSongId";        //该id歌曲的最高分 key
    static readonly Key_unlockSongId: string = "zdjz_unlockSongId";             //解锁的歌的id key
    static readonly Key_firstWinSongId: string = "zdjz_firstWinSongId";        //是否首次通关的歌的id key
    static readonly Key_newStateSongId: string = "zdjz_newStateSongId";        //是否全新的歌的id key
    static readonly Key_lastPlaySongName: string = "zdjz_lastPlaySongName";        //最后一次播放的歌曲名 key

    static readonly Key_achivGradeId: string = "zdjz_achivId";             //id成就的等级 key
    static readonly Key_achivProId: string = "zdjz_achivProId";             //id成就的进度 key

    static readonly Key_mapSkinChipId: string = "zdjz_mapSkinChipId";             //id地图的碎片数 key
    static readonly Key_mapSkinUsingId: string = "zdjz_mapSkinUsingId";             //正在使用的地图的id key
    static readonly Key_mapChipVoucher: string = "zdjz_mapChipVoucher";             //玩家的地图碎片抵用券的数量 key

    static readonly Key_boxSkinId: string = "zdjz_boxSkinId";             //解锁的方块的皮肤id key
    static readonly Key_lockBoxSkinIds: string = "zdjz_lockBoxSkinIds";             //锁住的方块的皮肤id列表 key
    static readonly Key_equipBoxSkinId: string = "zdjz_equipBoxSkinId";        //装备的枪的皮肤id key

    static readonly PATH_DetailDiasPanel: string = "panels/DetailDiasPanel";
    static readonly PATH_DetailPowersPanel: string = "panels/DetailPowersPanel";
    static readonly PATH_coinPart: string = "panels/CoinPart";
    static readonly PATH_homePart: string = "panels/HomePart";
    static readonly PATH_achievementPanel: string = "panels/AchievementPanel";
    static readonly PATH_SettlePanel: string = "panels/SettlePanel";
    static readonly PATH_RevivePanel: string = "panels/RevivePanel";
    static readonly PATH_SignPanel: string = "panels/SignPanel";
    static readonly PATH_WelcomeNewPanel: string = "panels/WelcomeNewPanel";
    static readonly PATH_ShareRecPanel: string = "panels/ShareRecPanel";
    static readonly PATH_SongRecommendPanel: string = "panels/SongRecommendPanel";
    static readonly PATH_GunModelShowPart: string = "panels/GunModelShowPart";
    static readonly PATH_GameConfig: string = "configs";
    static readonly MusicTableUrl: string = "https://tencentcnd.minigame.xplaymobile.com/MusicGames/Gamelist/TikTok/zidanjiezou_2.json"  //
    static readonly MusicTableUrl_Android: string = "https://tencentcnd.minigame.xplaymobile.com/MusicGames/Gamelist/Android/zidanjiezou_2Android.json"

    static readonly RomeNumbers: Array<string> = new Array<string>(
        "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ", "Ⅹ"
    );            //最大生成的钻石数

    static MaxShowRecomdSongNum: number = 2;    //弹的最大专属页面数
    static IsUnlockRecomdSong: boolean = false;    //是否解锁了专属歌曲
    static isAutoPop: boolean = false;          //是否是自动弹出签到页面

    static readonly PowerRecoverTime: number = 120;          //恢复体力的时间
    static MaxPowerValue: number = 10;          //最大获得的体力数
    static readonly oneConsumePowerValue: number = 3;          //单次消耗的体力数

    static readonly MAXOfferChip: number = 3;            //一局游戏可以提供的最大的碎片奖励数

    static readonly MAXAchivGrade: number = 5;            //可以达到的最大的成就等级

    static readonly MAXCoinNum: number = 12;            //最大生成的钻石数
    static readonly MINCoinNum: number = 8;            //最小生成的钻石数

    static readonly downTime: number = 10;            //倒计时时长
    static readonly IdieSpeed: number = 700;             //背景缓慢前进的速度
    static readonly fastSpeed: number = 900;             //背景快速前进的速度
    static readonly fleetingSpeed: number = 1600;             //背景奖励时快速前进的速度
    static readonly ForwardSpeed: number = 14;         //节奏点前进的速度   //11
    static readonly rotateSpeed: number = 0.0007;         //枪转动的速度   //0.0009
    static readonly MaxDistance: number = 25;         //节奏点出现的位置到开枪距离的间隔    //25

    static readonly MaxHorVal: number = 0.23;         //节奏点最大的左右间隔
    static readonly MinHorVal: number = 0.12;   //0.12        //节奏点最小的左右间隔  //0.6;
    static readonly PointRatioHorVal: number = 0.05;         //节奏点间每间隔1秒钟水平之间的距离  //0.01
    static readonly PointRatioHorValMultiple: number = 1;         //水平点间的难度倍数


    static readonly UnitScore: number = 8;            //单次得分
    static readonly minContiunePointsTime: number = 2;    //游戏节奏点打完到生成奖励的间隔
    static readonly IntervalFinishToReward: number = 0.5;    //游戏节奏点打完到生成奖励的间隔
    static readonly IntervalReward: number = 0.08;    //奖励点之间的间隔

    static readonly MaxRecoverLifeNUM: number = 3;    //最多提供的恢复生命节奏点 

    //----------------------------------中秋版本----------------------------
    static readonly PATH_ZQVAnnouncementPanel: string = "panels/ZQVAnnouncementPanel";
    static readonly ZQA_Key_OpenZQA: string = "zdjz_Key_OpenZQA";             //玩家是否开启了活动 key
    static readonly ZQA_Key_MoonCakeNum: string = "zdjz_MoonCakeNum";             //玩家获得的月饼数 key
    static readonly ZQA_MinConvertMoonCakeNum: number = 666;

    static readonly ElPUnitScore: number = 1;            //无尽模式单次基础得分
    static readonly ELPMinHorVal: number = 0.12;         //节奏点最小的基础左右间隔
    static readonly ElPMinHorBasemult: number = 0.01;         //节奏点最小的左右间隔叠加的倍数系数
    static readonly ELPWaitHealthPointNumBasemult: number = 5;         //节奏点等待复活的叠加的倍数系数
    static readonly ELPPointRatioHorValBasemult: number = 0.02;         //节奏点间每间隔1秒钟水平之间的距离叠加的倍数系数
    static readonly ELPPointRatioHorValMultipleBasemult: number = 0.5;         //水平点间的难度倍数叠加的倍数系数
    static readonly ELPForwardSpeedBasemult: number = 0.2;         //节奏点前进的速度倍数叠加的倍数系数
    static readonly ELPMAXForwardSpeed: number = 40;         //节奏点前进的速度倍数叠加的倍数系数

    static readonly Key_PrivacyAgreement: string = "zdjz_PrivacyAgreement";        //最后一次播放的歌曲名 key

    static readonly Key_romateGamePath: string = "https://tencentcnd.minigame.xplaymobile.com/MusicGames/RemoteConfigs/zdjz/huawei/zdjzGameConfig.json";
}