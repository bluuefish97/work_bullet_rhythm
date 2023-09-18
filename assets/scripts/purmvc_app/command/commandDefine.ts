export enum CommandDefine { 
    LoadRequest="LoadCmd",   //登录游戏请求
    tabelResponce="tabelResponce",   //歌曲列表信息响应
    OpenPanel="OpenPanel",           //打开面板
    Consumables="Consumables",           //消耗品数量变化
    ConsumablesResponce="ConsumablesResponce",   //消耗品数量变化响应
    RPowerNumResponce="RPowerNumResponce",   //体力值返回响应

    SignRequest="SignRequest",        //签到请求

    UnluckGunRequest="UnluckGunRequest",        //解锁一个枪的皮肤
    EquipGunRequest="EquipGunRequest",        //装备一个枪的皮肤
    UnluckGunSucceedResponce="UnluckGunSucceedResponce",        //成功解锁一个枪皮肤回调
    EquipGunSucceedResponce="EquipGunSucceedResponce",        //成功装备一个枪皮肤回调
    showGunIDResponce="showGunIDResponce",        //显示解锁一个枪的id皮肤回调


    UnluckSongRequest="UnluckSongRequest",        //解锁一首歌
    StartSongRequest="StartSongRequest",        //开始一首歌
    UnluckSongSucceedResponce="UnluckSongSucceedResponce",        //成功解锁一首歌回调
    SongStarResponce="SongStarResponce",        //一首歌的游戏星星回调
    SongScoreResponce="SongScoreResponce",        //一首歌的游戏分数回调
    StartSongSucceedResponce="StartSongSucceedResponce",        //成功开始一首歌响应
    PlaySongRequest="PlaySongRequest",                         //播放歌曲请求
    PlaySongResponce="PlaySongResponce",                         //播放歌曲响应
    WinSongRollNext="WinSongRollNext",                         //胜利后歌曲向下滚动

    Finish="Finish",                                         //游戏结束
    Settle="Settle",                                         //游戏的结算信息
    ReviveRequest="ReviveRequest",                    //复活请求
    ReviveResponce="ReviveResponce",                    //复活请求

    UpdateAchiPro="UpdateAchiPro",                   //成就进度更新
    GetAchiRewardRequest="GetAchiRewardRequest",        //成就奖励领取请求
    GetAchiRewardResponce="GetAchiRewardResponce",        //成就奖励领取响应
    achivGradeResponce="achivGradeResponce",        //成就等级更新响应
    achivProResponce="achivProResponce",        //成就进度更新响应

    MapConfigResponce="MapConfigResponce",       //地图皮肤配置响应
    MapSkinChipNumIdResponce="MapSkinChipNumIdResponce",     //地图碎片值
    GetMapSkinChip="GetMapSkinChip",                   //获得碎片值
    UseMapSkin="UseMapSkin",                           //装备一个皮肤


    openDiaDetailRequest="openDiaDetailRequest",              //打开钻石获取详情页
    openPowerDetailRequest="openPowerDetailRequest",              //打开体力获取详情页

    ClickTipResponce="ClickTipResponce",       //某个入口希望点击响应

    StartRec="StartRec",                                          //开始录屏命令
    StartRecResponce="StartRecResponce",                                          //开始录屏命令
    EndRec="EndRec",                                           //结束录屏命令
    EndRecResponce="EndRecResponce",                                           //结束录屏命令
    ShareRec="ShareRec",                                           //分享录屏

    //方块皮肤
    
    UnluckBoxRequest="UnluckBoxRequest",        //解锁一个方块的皮肤
    EquipBoxRequest="EquipBoxRequest",        //装备一个方块的皮肤
    UnluckBoxSucceedResponce="UnluckBoxSucceedResponce",        //成功解锁一个方块皮肤回调
    EquipBoxSucceedResponce="EquipBoxSucceedResponce",        //成功装备一个方块皮肤回调
    
    //活动相关
    ActivityEventStateResponce="ActivityEventStateResponce",       //活动状态响应
    ActivityUserLoginResponce="ActivityUserLoginResponce",          //活动用户登陆响应                //暂时
    ActivityUserAuthorizationResponce="ActivityUserAuthorizationResponce",    //用户授权响应           //暂时
 
    //星座模式
    V1_1_4ConstellationRankResponce="ConstellationRankResponce",               //星座排行信息响应
    V1_1_4AllRankInfoResponce="V1_1_4AllRankInfoResponce",                    //星座模式总榜单信息响应
    V1_1_4UserRankInfoResponce="V1_1_4UserRankInfoResponce",                    //星座模式个人信息响应
    V1_1_4UserHasPowerResponce="V1_1_4UserHasPowerResponce",                    //星座模式个人所拥有的能量响应
    V1_1_4UserUploadFillPowerResponce="V1_1_4UserUploadFillPowerResponce",                    //星座模式个人填充能量回调
    V1_1_4UserSumFPForUnitCRequest="V1_1_4UserSumFPForUnitCRequest",                    //星座模式个人为某个星座所填充的所有能量请求
    v1_1_4GetPowerSettle="v1_1_4GetPowerSettle",                                         //星座模式游戏的的长按引导
    v1_1_4GetWinnerInfo="v1_1_4GetWinnerInfo",                                         //星座模式获取获奖信息是否填写
    v1_1_4SentWinnerInfo="v1_1_4SentWinnerInfo",                                         //星座模式上传获奖信息


    //无尽模式
    StartEndlessPlayingRequest="StartEndlessPlayingRequest",     //开始无尽模式闯关
    ELP_PreLoadSongAsset="ELP_PreLoadSongAsset",                    //预先加载下一关的歌曲信息
    ELP_EnterNextChanllenge="ELP_EnterNextChanllenge",              //开始进入下一关
    ELP_UploadingScoreAndTime="ELP_UploadingScoreAndTime",          //上传用户分数和存活时间
    ELP_UserRankInfoResponce="ELP_UserRankInfoResponce",            //用户个人排名信息响应
    ELP_AllRankInfoResponce="ELP_AllRankInfoResponce",              //总榜单信息响应
    ELP_AllScoreCollectionResponce="ELP_AllScoreCollectionResponce",              //总分数信息响应

    ADInitResponce="ADInitResponce",          //初始化完成响应
    UserLoginResponce="UserLoginResponce",          //用户登陆响应
    UserAuthorizationResponce="UserAuthorizationResponce",          //用户授权响应
    UserGenderResponce="UserGenderResponce",          //用户性别响应


}   