
import { Proxy } from "../../core/puremvc/patterns/proxy/Proxy";

import { CONSTANTS } from "../../Constants";
import { CommandDefine } from "../command/commandDefine";
import { SignInfo, AchivInfo, GunSkinInfo, PowerInfo, SongInfo, MapSkinInfo, BoxSkinInfo } from "../repositories/Rep";
import { Utility, CustomDate } from "../../util/Utility";
import { AchiUpdateInfo } from "../command/UpdateAchiProCmd";
import { AchiGradeUpdateInfo } from "../command/GetAchiRewardCmd";
import { GetMapSkinChipInfo } from "../command/GetMapSkinChipCmd";
import { TipType } from "../../util/PleaseClickSys/PleaseClickSys";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "./proxyDefine";
import { MusicPxy } from "./MusicPxy";

export class GamePxy extends Proxy {
    private signConfig: Array<SignInfo> = new Array<SignInfo>();
    private achivConfig: Array<AchivInfo> = new Array<AchivInfo>();
    private gunConfig: Array<GunSkinInfo> = new Array<GunSkinInfo>();
    private boxConfig: Array<BoxSkinInfo> = new Array<BoxSkinInfo>();
    private mapConfig: Array<MapSkinInfo> = new Array<MapSkinInfo>();
    private powerConfig: Array<PowerInfo> = new Array<PowerInfo>();
    private lockGunIds: Array<string> = new Array<string>();
    private lockBoxIds: Array<number> = new Array<number>();
    private curPlaySongInfo: SongInfo = null;      //目前播放的歌曲信息
    private curGameSongInfo: SongInfo = null;      //目前游戏的歌曲信息
    private signNum: number = 0;
    private diaNum: number = 0;         //玩家钻石数
    private powerNum: number = 0;       //玩家体力数
    public moonCakeNum: number = 0;         //玩家月饼数
    private voucherNum: number = 0;         //玩家地图皮肤抵用券数
    private signed: boolean = false;    //玩家是否签到
    private lastSignDate: CustomDate = null;
    private curPlayBgSongName: string;
    private curPuaseBgSongName: string;


    public lastStageSkinID: number = null;

    public constructor(proxyName: string = null, data: any = null) {
        super(proxyName, data);
    }
    /**
     * 加载游戏配置
     */
    public parseGameAsync(cal) {
        let self = this;
        cc.resources.loadDir(CONSTANTS.PATH_GameConfig, function (err, assets) {
            self.signConfig = assets.find((data) => { return data.name == "signConfig" }).json;
            self.achivConfig = assets.find((data) => { return data.name == "achivConfig" }).json;
            self.gunConfig = assets.find((data) => { return data.name == "gunConfig" }).json;
            self.powerConfig = assets.find((data) => { return data.name == "powerConfig" }).json;
            self.mapConfig = assets.find((data) => { return data.name == "mapConfig" }).json;
            cal();
        })
    }

    /**
     * 获得签到配置
     * @param callback 
     */
    public getSignConfig(callback) {
        if (this.signConfig.length <= 0) {
            let self = this;
            cc.resources.loadDir(CONSTANTS.PATH_GameConfig, function (err, assets) {
                self.signConfig = assets.find((data) => { return data.name == "signConfig" }).json;
                callback(self.signConfig)
            });
        }
        else {
            callback(this.signConfig)
        }

    }

    /**
     * 获得成就配置
     * @param callback 
     */
    public getAchivConfig(callback) {
        if (this.achivConfig.length <= 0) {
            let self = this;
            cc.resources.loadDir(CONSTANTS.PATH_GameConfig, function (err, assets) {
                self.achivConfig = assets.find((data) => { return data.name == "achivConfig" }).json;
                callback(self.achivConfig)
            });
        }
        else {
            callback(this.achivConfig)
        }

    }

    /**
    * 获得枪皮肤配置
    * @param callback 
    */
    public getGunConfig(callback) {
        if (this.gunConfig.length <= 0) {
            let self = this;
            cc.resources.loadDir(CONSTANTS.PATH_GameConfig, function (err, assets) {
                self.gunConfig = assets.find((data) => { return data.name == "gunConfig" }).json;
                self.getLockGunIds();
                callback(self.gunConfig)
            });
        }
        else {
            this.getLockGunIds();
            callback(this.gunConfig)
        }

    }

    /**
   * 获得方块皮肤配置
   * @param callback 
   */
    public getBoxConfig(callback) {
        if (this.boxConfig.length <= 0) {
            let self = this;
            cc.resources.loadDir(CONSTANTS.PATH_GameConfig, function (err, assets) {
                self.boxConfig = assets.find((data) => { return data.name == "boxConfig" }).json;
                self.getLockBoxIds();
                callback(self.boxConfig)
            });
        }
        else {
            this.getLockBoxIds();
            callback(this.boxConfig)
        }

    }

    /**
    * 获得地图皮肤配置
    * @param callback 
    */
    public getMapConfig() {
        if (this.mapConfig.length <= 0) {
            let self = this;
            cc.resources.loadDir(CONSTANTS.PATH_GameConfig, function (err, assets) {
                self.mapConfig = assets.find((data) => { return data.name == "mapConfig" }).json;
                self.sendNotification(CommandDefine.MapConfigResponce, self.mapConfig)
            });
        }
        else {
            this.sendNotification(CommandDefine.MapConfigResponce, this.mapConfig)
        }

    }

    /**
    * 获得体力获取配置
    * @param callback 
    */
    public getPowerConfig(callback) {
        if (this.powerConfig.length <= 0) {
            let self = this;
            cc.resources.loadDir(CONSTANTS.PATH_GameConfig, function (err, assets) {
                self.powerConfig = assets.find((data) => { return data.name == "powerConfig" }).json;
                callback(self.powerConfig)
            });
        }
        else {
            callback(this.powerConfig)
        }
    }

    /**
    * 获得一个玩家是不是新玩家
    */
    public getGameNew() {
        if (cc.sys.localStorage.getItem(CONSTANTS.Key_new)) {
            return false;
        }
        else {
            return true;
        }

    }

    /**
     * 设置一个新玩家的数据
     */
    public setGameNew() {
        cc.sys.localStorage.setItem(CONSTANTS.Key_new, JSON.stringify("已存在用户"));
    }



    /**
     * 获得玩家上次签到的日期
     */
    public getLastSignDate() {
        if (cc.sys.localStorage.getItem(CONSTANTS.Key_lastSignDate)) {
            this.lastSignDate = JSON.parse(cc.sys.localStorage.getItem(CONSTANTS.Key_lastSignDate));
        }
        else               //新玩家
        {
            this.lastSignDate = Utility.DateFormat_Custom(new Date(1000, 1, 1, 1, 1, 1, 1));
        }
        return this.lastSignDate;
    }



    /**
     * 设置签到的日期
     */
    public setLastSignDate() {
        this.lastSignDate = Utility.DateFormat_Custom(new Date());
        cc.sys.localStorage.setItem(CONSTANTS.Key_lastSignDate, JSON.stringify(this.lastSignDate));
        this.signNum++;
        cc.sys.localStorage.setItem(CONSTANTS.Key_signNumber, JSON.stringify(this.signNum));
    }
    /**
     * 获得玩家是否签到
     */
    public getIsSigned() {

        let nowDate = Utility.DateFormat_Custom(new Date());
        if (Utility.checkIsNewDay(nowDate, this.getLastSignDate()))  //新的一天
        {
            this.signed = false;
        }
        else {
            this.signed = true;
        }
        return this.signed;
    }

    /**
     * 获得签到的天数
     */
    public getSignNum() {
        ;
        if (cc.sys.localStorage.getItem(CONSTANTS.Key_signNumber))    //非新玩家
        {
            this.signNum = JSON.parse(cc.sys.localStorage.getItem(CONSTANTS.Key_signNumber));
        }
        else {
            this.signNum = 0;
        }
        return this.signNum;
    }

    /**
     * 签到天数增加
     */
    public addSignNum() {
        this.signNum++;
        cc.sys.localStorage.setItem(CONSTANTS.Key_signNumber, JSON.stringify(this.signNum));
    }

    /**
     * 获得玩家的钻石数量
     */
    public getDiaNum() {
        if (cc.sys.localStorage.getItem(CONSTANTS.Key_diaNumber)) {
            this.diaNum = JSON.parse(cc.sys.localStorage.getItem(CONSTANTS.Key_diaNumber));
        }
        else {
            this.diaNum = 0;
        }
        return this.diaNum;
    }

    /**
     * 增加玩家的钻石数量
     */
    public addDiaNum(val: number) {
        this.sendNotification(CommandDefine.ConsumablesResponce, { type: "dia", originValue: this.diaNum, value: val })
        this.diaNum += val;
        cc.sys.localStorage.setItem(CONSTANTS.Key_diaNumber, JSON.stringify(this.diaNum))
    }

    /**
     * 减少玩家的钻石数量
     */
    public decreaseDiaNum(val: number) {
        this.sendNotification(CommandDefine.ConsumablesResponce, { type: "dia", originValue: this.diaNum, value: -val })
        this.diaNum -= val;
        cc.sys.localStorage.setItem(CONSTANTS.Key_diaNumber, JSON.stringify(this.diaNum))
    }
    /**
     * 获得玩家的体力数量
     */
    public getPowerNum() {
        if (cc.sys.localStorage.getItem(CONSTANTS.Key_powerNumber)) {
            this.powerNum = JSON.parse(cc.sys.localStorage.getItem(CONSTANTS.Key_powerNumber));
        }
        else {
            this.powerNum = CONSTANTS.MaxPowerValue;
        }
        return this.powerNum;
    }
    /**
     * 获得玩家离线恢复的体力数量
     */
    public getOfffLinePowerNum() {
        if (this.getPowerNum() >= CONSTANTS.MaxPowerValue) {
            console.log("体力值已满");

        }
        else {
            let times = Utility.DateFormat_Custom(new Date()).time - this.getLastCloseGameDate().time;
            console.log("离线时间为: " + times);

            let val = Math.floor(times / (60000));  //60 *
            val = val > CONSTANTS.MaxPowerValue ? CONSTANTS.MaxPowerValue : val;
            console.log("离线奖励的体力为: " + val);
            this.getPowerNum();
            this.addPowerNum(val, true);
        }

    }
    /**
     * 增加玩家的体力数量
     */
    public addPowerNum(val: number, isOffLine = false) {
        if (isOffLine) {
            val = CONSTANTS.MaxPowerValue - this.powerNum > val ? val : CONSTANTS.MaxPowerValue - this.powerNum
        }
        this.sendNotification(CommandDefine.ConsumablesResponce, { type: "power", originValue: this.powerNum, value: val })
        this.powerNum += val;
        cc.sys.localStorage.setItem(CONSTANTS.Key_powerNumber, JSON.stringify(this.powerNum))

    }

    /**
     * 减少玩家的体力数量
     */
    public decreasePowerNum(val: number) {
        this.sendNotification(CommandDefine.ConsumablesResponce, { type: "power", originValue: this.powerNum, value: -val })
        this.powerNum -= val;
        cc.sys.localStorage.setItem(CONSTANTS.Key_powerNumber, JSON.stringify(this.powerNum))

    }

    /**
     * 返还玩家的体力数量
     */
    public restitutionPowerNum(val: number) {
        this.powerNum += val;
        cc.sys.localStorage.setItem(CONSTANTS.Key_powerNumber, JSON.stringify(this.powerNum));
        this.sendNotification(CommandDefine.RPowerNumResponce, this.powerNum);
    }

    /**
     * 获得一把枪的解锁状态
     * @param gunId 
     */
    public getGunIdUnlockState(gunId) {
        let key = CONSTANTS.Key_gunSkinId + gunId;
        if (cc.sys.localStorage.getItem(key)) {
            return true;
        }
        else {
            if (gunId == 1) {
                this.UnlockGunSkin(gunId);
                return true;
            }
            else {
                return false;
            }

        }
    }

    /**
     * 解锁一把枪
     */
    public UnlockGunSkin(gunId) {
        let key = CONSTANTS.Key_gunSkinId + gunId;
        cc.sys.localStorage.setItem(key, JSON.stringify(true));
        this.spliceLockGunIds(gunId);
        console.log("解锁序号为：" + gunId + "  枪的皮肤成功！！！")
        this.sendNotification(CommandDefine.UnluckGunSucceedResponce, gunId);
        this.sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(5, 1))
    }

    /**
 * 从未解锁的列表内随机解锁一把枪
 */
    public UnlockGunSkinRandom() {
        let gunId = this.lockGunIds[Math.floor(Math.random() * this.lockGunIds.length)]
        let key = CONSTANTS.Key_gunSkinId + gunId;
        cc.sys.localStorage.setItem(key, JSON.stringify(true));
        this.spliceLockGunIds(gunId);
        console.log("解锁序号为：" + gunId + "  枪的皮肤成功！！！")
        this.sendNotification(CommandDefine.UnluckGunSucceedResponce, gunId);
        this.sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(5, 1))
    }
    /**
  * 获得装备枪的id
  */
    public getEquipGunSkin() {
        let id;
        if (cc.sys.localStorage.getItem(CONSTANTS.Key_equipGunSkinId)) {
            id = JSON.parse(cc.sys.localStorage.getItem(CONSTANTS.Key_equipGunSkinId));
        }
        else {
            id = 1;
        }
        return id;
    }

    /**
     * 装备一把枪
     */
    public EquipGunSkin(gunId) {
        cc.sys.localStorage.setItem(CONSTANTS.Key_equipGunSkinId, JSON.stringify(gunId));
        console.log("装备序号为：" + gunId + "  枪的皮肤成功！！！")
        this.sendNotification(CommandDefine.EquipGunSucceedResponce, gunId);
    }

    /**
     * 获得的枪的下标
     */
    public getGunSkinIdx(info: GunSkinInfo) {
        // console.log(this.gunConfig);
        // console.log(info);
        let id = this.gunConfig.findIndex((item: GunSkinInfo) => { return item.id == info.id });
        console.log("枪的下标为  " + id);
        return id
        //return this.gunConfig.indexOf(info);
    }

    /**
     * 锁住的枪的id列表中删除一个id
     */
    private spliceLockGunIds(gunId) {
        if (this.lockGunIds.indexOf(gunId) > -1) {
            console.log("gunID:" + gunId + "  被解锁");
            this.lockGunIds.splice(this.lockGunIds.indexOf(gunId), 1);
        }
    }
    /**
     * 获得锁住的枪的id列表
     */
    public getLockGunIds() {
        if (this.lockGunIds.length <= 0) {
            this.gunConfig.forEach((info: GunSkinInfo) => {
                let key = CONSTANTS.Key_gunSkinId + info.id;
                if (!cc.sys.localStorage.getItem(key) && info.id != "2020ZQ") {
                    this.lockGunIds.push(info.id);
                }
            })
        }
        return this.lockGunIds;
    }
    /**
     * 获得一首歌的星星数量
     * @param songId 
     */
    public getSongStarNum(songId) {
        let key = CONSTANTS.Key_starNumSongId + songId;
        if (cc.sys.localStorage.getItem(key)) {
            return JSON.parse(cc.sys.localStorage.getItem(key));
        }
        else {
            return 0;
        }

    }
    /**
     * 保存一首歌的星星数量
     */
    public setSongStarNum(songId, data) {
        let key = CONSTANTS.Key_starNumSongId + songId;
        cc.sys.localStorage.setItem(key, JSON.stringify(data));
        this.sendNotification(CommandDefine.SongStarResponce,
            {
                id: songId,
                val: data
            });
    }

    /**
     * 获得一首歌的最高分
     * @param songId 
     */
    public getSongBestScore(songId) {
        let key = CONSTANTS.Key_bestScoreSongId + songId;
        if (cc.sys.localStorage.getItem(key)) {
            return JSON.parse(cc.sys.localStorage.getItem(key));
        }
        else {
            return 0;
        }
    }

    /**
     * 设置一首歌的最高分
     */
    public setSongBestScore(songId, data) {
        let key = CONSTANTS.Key_bestScoreSongId + songId;
        cc.sys.localStorage.setItem(key, JSON.stringify(data));
        console.log(songId + "  歌的分数为  " + data)
        this.sendNotification(CommandDefine.SongScoreResponce, {
            id: songId,
            val: data
        });
    }

    /**
     * 获得一首歌的解锁状态
     * @param songId 
     */
    public getSongIdUnlockState(songId) {
        let key = CONSTANTS.Key_unlockSongId + songId;
        if (cc.sys.localStorage.getItem(key)) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * 获得一首歌是否是首次通关状态
     * @param songId 
     */
    public getSongIdIsFirstWinState(songId) {
        let key = CONSTANTS.Key_firstWinSongId + songId;
        if (cc.sys.localStorage.getItem(key)) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * copy一首歌的信息
     */
    public copySongInfo(info: SongInfo) {
        let temp = new SongInfo();
        temp.coverFile = info.coverFile;
        temp.ex_lv = info.ex_lv;
        temp.ex_bag = info.ex_bag;
        temp.ex_new = info.ex_new;
        temp.json_normal = info.json_normal;
        temp.musicFile = info.musicFile;
        temp.musicId = info.musicId;
        temp.musicName = info.musicName;
        temp.orderNumbe = info.orderNumbe;
        temp.singerName = info.singerName;
        temp.style = info.style;
        temp.unlockCost = info.unlockCost;
        temp.unlockType = info.unlockType;
        return temp;
    }

    /**
     * 设置一首歌首次通关状态
     * @param songId 
     */
    public setSongIdIsFirstWinState(songId) {
        let key = CONSTANTS.Key_firstWinSongId + songId;
        cc.sys.localStorage.setItem(key, JSON.stringify(true));
    }

    /**
 * 获得一首歌是否是全新状态
 * @param songId 
 */
    public getSongIdNewState(songId) {
        let key = CONSTANTS.Key_newStateSongId + songId;
        if (cc.sys.localStorage.getItem(key)) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * 设置一首歌全新状态
     * @param songId 
     */
    public setSongIdIsNewState(songId) {
        if (!this.getSongIdNewState(songId)) return;
        let key = CONSTANTS.Key_newStateSongId + songId;
        cc.sys.localStorage.setItem(key, JSON.stringify(true));
    }



    /**
     * 解锁一首歌
     */
    public UnlockSong(songId) {
        let key = CONSTANTS.Key_unlockSongId + songId;
        cc.sys.localStorage.setItem(key, JSON.stringify(true));
        this.sendNotification(CommandDefine.UnluckSongSucceedResponce, songId);
        let musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        let info = musicPxy.getSongInfoById(songId) as SongInfo;
        if (info.unlockCost != "0") {
            //console.log("解锁序号为：" + songId + "  歌成功！！！")
            this.sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(0, 1))
        }
        else {
            // console.log("解锁序号为：" + songId + "  默认歌成功！！！")
        }
    }

    /**
  * 设置默认解锁的歌
  */
    public setDefaultUnlockSong(songId) {

        let key = CONSTANTS.Key_unlockSongId + songId;
        if (cc.sys.localStorage.getItem(key)) return;      //已经存入本地数据
        cc.sys.localStorage.setItem(key, JSON.stringify(true));
    }

    /**
     * 提供没有解锁的歌曲列表
     */
    public affordLockSongInfoList(arr) {
        let self = this;
        function checkAdult(songInfo: SongInfo) {
            return self.getSongIdUnlockState(songInfo.musicId) == false;
        }
        let lockArr = arr.filter(checkAdult);
        //  console.log("  -----------------  ");
        // console.log(lockArr);

        if (lockArr.length > 0) {
            return lockArr;
        } else {
            return false;
        }
    }

    /**
     * 提供一个没有解锁的歌曲
     */
    public affordAdInfo(arr): SongInfo {

        let lockArr = this.affordLockSongInfoList(arr);
        if (lockArr && lockArr.length > 0) {
            let randomID = Math.floor(Math.random() * lockArr.length)
            return lockArr[randomID];
        }
    }

    /**
     * 保存当前播放的游戏的歌曲信息
     */
    public saveCurPlaySongInfo(info: SongInfo) {
        this.curPlaySongInfo = info;

    }

    /**
     * 获得当前播放的歌曲信息
     */
    public getCurPlaySongInfo() {
        return this.curPlaySongInfo;
    }
    /**
     * 保存当前播放的游戏的歌曲信息
     */
    public saveCurGameSongInfo(info: SongInfo) {
        this.curGameSongInfo = info;

    }

    /**
     * 获得当前游戏的歌曲信息
     */
    public getCurGameSongInfo() {
        return this.curGameSongInfo;
    }


    /**
     * 设置歌曲是否播放
     * @param name 
     */
    setPlayState(name: string) {
        this.curPlayBgSongName = name;
    }

    /**
     * 设置歌曲是否播放
     * @param name 
     */
    setIsPause(name: string) {
        this.curPuaseBgSongName = name;
    }

    /**
     * 获取歌曲是否播放
     * @param name 
     */
    getIsPlayState(name: string) {
        return this.curPlayBgSongName == name;
    }

    /**
     * 获取歌曲是否播放
     * @param name 
     */
    getIsPause(name: string) {
        return this.curPuaseBgSongName == name;
    }

    /**
     * 设置成就的等级
     */
    setAchivGradeById(id: number, data: number) {
        let key = CONSTANTS.Key_achivGradeId + id;
        cc.sys.localStorage.setItem(key, JSON.stringify(data));
        console.log(id + "  的成就等级更新为  " + data)
        this.sendNotification(CommandDefine.achivGradeResponce, new AchiGradeUpdateInfo(id, data));
        if (data > CONSTANTS.MAXAchivGrade) {
            return;
        }
        this.setAchivProById(id, this.getAchivProById(id));
    }
    /**
     * 获取成就的等级
     */
    getAchivGradeById(id: number) {
        let key = CONSTANTS.Key_achivGradeId + id;
        if (cc.sys.localStorage.getItem(key)) {
            return JSON.parse(cc.sys.localStorage.getItem(key));
        }
        else {
            return 0;
        }
    }


    /**
     * 设置成就的进度值
     */
    setAchivProById(id: number, data: number) {
        let key = CONSTANTS.Key_achivProId + id;
        cc.sys.localStorage.setItem(key, JSON.stringify(data));
        console.log(id + "  的成就进度更新为  " + data)
        this.sendNotification(CommandDefine.achivProResponce, new AchiUpdateInfo(id, data));
        this.getIsCanGetAchivReward();
    }

    /**
     * 清空成就的进度值
     */
    cleanAchivProById(id: number) {
        this.setAchivProById(id, 0);
    }

    /**
     * 获得成就的进度值
     */
    getAchivProById(id: number) {
        let key = CONSTANTS.Key_achivProId + id;
        if (cc.sys.localStorage.getItem(key)) {
            return JSON.parse(cc.sys.localStorage.getItem(key));
        }
        else {
            return 0;
        }
    }

    /**
     * 获得成就中是否有可以领取奖励的
     */
    getIsCanGetAchivReward() {
        this.getAchivConfig((achivConfig) => {
            for (let i = 0; i < achivConfig.length; i++) {
                let target = achivConfig[i].baseTarget + this.getAchivGradeById(achivConfig[i].id) * achivConfig[i].factorTarget;
                if (this.getAchivProById(achivConfig[i].id) >= target &&
                    this.getAchivGradeById(achivConfig[i].id) <= CONSTANTS.MAXAchivGrade
                ) {
                    this.sendNotification(CommandDefine.ClickTipResponce, {
                        type: TipType.AchivChip,
                        isCan: true
                    })
                    return;
                }
            }
            this.sendNotification(CommandDefine.ClickTipResponce, {
                type: TipType.AchivChip,
                isCan: false
            })
        })

    }


    /**
     * 设置地图碎片的值
     */
    setMapSkinChipNumId(id: number, data: number) {
        let key = CONSTANTS.Key_mapSkinChipId + id;
        let sumData = this.getMapSkinChipNumId(id) + data;
        cc.sys.localStorage.setItem(key, JSON.stringify(sumData));
        console.log(id + "  的成地图碎片更新为  " + sumData)
        this.sendNotification(CommandDefine.MapSkinChipNumIdResponce, new GetMapSkinChipInfo(id, data));
        this.getIsCanCompoundMap();

    }


    /**
     * 获得地图碎片的值
     */
    getMapSkinChipNumId(id: number) {
        let key = CONSTANTS.Key_mapSkinChipId + id;
        if (cc.sys.localStorage.getItem(key)) {
            return JSON.parse(cc.sys.localStorage.getItem(key));
        }
        else {
            return 0;
        }
    }

    /**
 * 设置正在使用的地图皮肤的id
 */
    setMapSkinOfUsingId(id: number) {
        let key = CONSTANTS.Key_mapSkinUsingId;
        cc.sys.localStorage.setItem(key, JSON.stringify(id));
        console.log(id + "  的地图正在被使用  ")
    }


    /**
     * 获得正在使用的地图皮肤的id
     */
    getMapSkinOfUsingId() {
        let key = CONSTANTS.Key_mapSkinUsingId;
        if (cc.sys.localStorage.getItem(key)) {
            return JSON.parse(cc.sys.localStorage.getItem(key));
        }
        else {
            return 0;
        }
    }

    /**
     * 获得玩家的地图皮肤抵用券数量
     */
    public getMapChipVoucher() {
        if (cc.sys.localStorage.getItem(CONSTANTS.Key_mapChipVoucher)) {
            this.voucherNum = JSON.parse(cc.sys.localStorage.getItem(CONSTANTS.Key_mapChipVoucher));
        }
        else {
            this.voucherNum = 0;
        }
        return this.voucherNum;
    }

    /**
     * 增加玩家的地图皮肤抵用券数量
     */
    public addMapChipVoucher(val: number) {
        this.voucherNum += val;
        cc.sys.localStorage.setItem(CONSTANTS.Key_mapChipVoucher, JSON.stringify(this.voucherNum))
        this.getIsCanCompoundMap();
    }

    /**
     * 减少玩家的地图皮肤抵用券数量
     */
    public decMapChipVoucher(val: number) {
        this.voucherNum -= val;
        cc.sys.localStorage.setItem(CONSTANTS.Key_mapChipVoucher, JSON.stringify(this.voucherNum))
    }


    /**
     * 获得玩家所有的地图中是否有可以用碎片合成的地图
     */
    getIsCanCompoundMap() {
        for (let i = 0; i < this.mapConfig.length; i++) {
            let SkinChip = this.getMapSkinChipNumId(this.mapConfig[i].id);
            if (SkinChip < this.mapConfig[i].targetCost && SkinChip + this.getMapChipVoucher() >= this.mapConfig[i].targetCost) {
                this.sendNotification(CommandDefine.ClickTipResponce, {
                    type: TipType.MapChip,
                    isCan: true
                })
                return true;
            }
        }
        this.sendNotification(CommandDefine.ClickTipResponce, {
            type: TipType.MapChip,
            isCan: false
        })
        return false;
    }

    /**
    * 设置上一次游戏关闭的时间
    */
    public setCloseGameDate() {
        let key = CONSTANTS.Key_lastCloseGameDate;
        cc.sys.localStorage.setItem(key, JSON.stringify(Utility.DateFormat_Custom(new Date())));
    }

    /**
     * 获得上一次游戏关闭的时间
     */
    public getLastCloseGameDate() {
        let key = CONSTANTS.Key_lastCloseGameDate;
        if (cc.sys.localStorage.getItem(key)) {
            return JSON.parse(cc.sys.localStorage.getItem(key)) as CustomDate;
        }
        else {
            return Utility.DateFormat_Custom(new Date(1000, 1, 1, 1, 1, 1, 1));
        }

    }



    /**
   * 锁住的枪的id列表中删除一个id
   */
    private spliceLockBoxIds(boxId) {
        if (this.lockBoxIds.indexOf(boxId) > -1) {
            console.log("boxID:" + boxId + "  被解锁");
            this.lockBoxIds.splice(this.lockBoxIds.indexOf(boxId), 1);
        }
    }

    /*
    * 获得装备方块的id
    */
    public getEquipBoxSkin() {
        let id;
        if (cc.sys.localStorage.getItem(CONSTANTS.Key_equipBoxSkinId)) {
            id = JSON.parse(cc.sys.localStorage.getItem(CONSTANTS.Key_equipBoxSkinId));
        }
        else {
            id = 0;
        }
        return id;
    }

    /**
   * 获得一个方块的解锁状态
   * @param boxId 
   */
    public getBoxIdUnlockState(boxId) {
        let key = CONSTANTS.Key_boxSkinId + boxId;
        if (cc.sys.localStorage.getItem(key)) {
            return true;
        }
        else {
            if (boxId == 0) {
                this.UnlockBoxSkin(boxId);
                return true;
            }
            else {
                return false;
            }

        }
    }


    /**
    * 获得锁住的方块的id列表
    */
    public getLockBoxIds() {
        if (this.lockBoxIds.length <= 0) {
            this.boxConfig.forEach((info: BoxSkinInfo) => {
                let key = CONSTANTS.Key_boxSkinId + info.id;
                if (!cc.sys.localStorage.getItem(key)) {
                    this.lockBoxIds.push(info.id);
                }
            })
        }
        console.log(this.lockBoxIds);

        return this.lockBoxIds;
    }

    /**
    * 解锁一个方块
    */
    public UnlockBoxSkin(boxId) {
        let key = CONSTANTS.Key_boxSkinId + boxId;
        cc.sys.localStorage.setItem(key, JSON.stringify(true));
        this.spliceLockBoxIds(boxId);
        console.log("解锁序号为：" + boxId + "  方块的皮肤成功！！！")
        this.sendNotification(CommandDefine.UnluckBoxSucceedResponce, boxId);
        //  this.sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(5, 1))
    }

    /**
    * 装备一个方块
    */
    public EquipBoxSkin(boxId) {
        cc.sys.localStorage.setItem(CONSTANTS.Key_equipBoxSkinId, JSON.stringify(boxId));
        console.log("装备序号为：" + boxId + "  方块的皮肤成功！！！")
        this.sendNotification(CommandDefine.EquipBoxSucceedResponce, boxId);
    }



    /**
   * 2020中秋版本，判断是否开启了活动
   */
    public ZQA_getIsOpenActivity() {
        let key = CONSTANTS.ZQA_Key_OpenZQA;
        if (cc.sys.localStorage.getItem(key))

            return cc.sys.localStorage.getItem(key) ? true : false;
    }

    /**
     * 2020中秋版本，开启了活动
     */
    public ZQA_openActivity() {
        let key = CONSTANTS.ZQA_Key_OpenZQA;
        cc.sys.localStorage.setItem(key, JSON.stringify("2020中秋版本正式开启！！"))
    }

    /**
     * 2020中秋版本，判断是否在活动时期内
     */
    public ZQA_checkValidTime() {
        let nowDate = new Date();
        let targetDate = new Date(2020, 9, 8, 24, 0, 0, 0)
        return (nowDate.getTime() - targetDate.getTime()) < 0;
    }

    /**
     * 2020中秋版本，获得月饼获得数
     */
    public ZQA_getMoonCakeNum() {
        let key = CONSTANTS.ZQA_Key_MoonCakeNum;
        if (cc.sys.localStorage.getItem(key) && this.moonCakeNum == 0) {
            this.moonCakeNum = JSON.parse(cc.sys.localStorage.getItem(key));
        }
        return this.moonCakeNum
    }

    /**
     * 2020中秋版本，判断月饼是否足够了
     */
    public ZQA_MoonCakeNumIsEnough() {
        return this.moonCakeNum >= CONSTANTS.ZQA_MinConvertMoonCakeNum;
    }

    /**
     * 2020中秋版本，增加月饼获得数
     */
    public ZQA_addMoonCakeNum(val) {
        //  this.sendNotification(CommandDefine.ConsumablesResponce, { type: "dia", originValue: this.diaNum, value: val })

        this.moonCakeNum += val;
        cc.sys.localStorage.setItem(CONSTANTS.ZQA_Key_MoonCakeNum, JSON.stringify(this.moonCakeNum))
    }

    /**
        * 2020中秋版本，判断枪的奖励是否领取了
        */
    public ZQA_gunRewardIsGet() {
        return this.getGunIdUnlockState("2020ZQ");
    }

    /**
    * 2020中秋版本，提供奖励枪的信息
    */
    public ZQA_getGunRewardInfo() {
        let info = this.gunConfig.find((info: GunSkinInfo) => { return info.id == "2020ZQ" })
        return info;

    }

    /**
     * 检测是否需要弹枪的通知
     */
    public V1_1_2CheckIsNeedOpenNofPanl() {
        if (CONSTANTS.GAMEVersion != "v1_1_2") {
            return false;
        }
        else {
            let nowDate = Utility.DateFormat_Custom(new Date());
            if (Utility.checkIsNewDay(nowDate, this.getLastCloseGameDate()))  //新的一天
            {
                console.log("新的一天!!");
                if (this.getGunIdUnlockState("v1_1_2_98k") || this.getGunIdUnlockState("v1_1_2_95")) {
                    console.log("解锁了新提供的枪");
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                console.log("当天已经玩过!!");
                return false;
            }
        }

    }

    /**
    * 检测是否需要v1_1_3的通知
    */
    public V1_1_3CheckIsNeedOpenNofPanl() {
        let nowDate = new Date();
        let targetDate = new Date(2020, 10, 8, 24, 0, 0, 0)
        return (nowDate.getTime() - targetDate.getTime()) < 0;
        return true;
        if (CONSTANTS.GAMEVersion != "v1_1_3") {
            return false;
        }
        else {
            let nowDate = Utility.DateFormat_Custom(new Date());
            if (Utility.checkIsNewDay(nowDate, this.getLastCloseGameDate()))  //新的一天
            {
                console.log("新的一天!!");
                return true;
            }
            else {
                console.log("当天已经玩过!!");
                return false;
            }
        }

    }

    /**
     * 检测是否需要v1_1_4的通知
     */
    public V1_1_4CheckIsNeedOpenNofPanl() {
        let nowDate = new Date();
        let targetDate = new Date(2020, 10, 22, 24, 0, 0, 0)
        return (nowDate.getTime() - targetDate.getTime()) < 0;
        return true;
        if (CONSTANTS.GAMEVersion != "v1_1_3") {
            return false;
        }
        else {
            let nowDate = Utility.DateFormat_Custom(new Date());
            if (Utility.checkIsNewDay(nowDate, this.getLastCloseGameDate()))  //新的一天
            {
                console.log("新的一天!!");
                return true;
            }
            else {
                console.log("当天已经玩过!!");
                return false;
            }
        }

    }

}
