import { Proxy } from "../../core/puremvc/patterns/proxy/Proxy";
import MusicManager from "../../plugin/musicLoader/MusicManager";
import { CONSTANTS } from "../../Constants";
import { CommandDefine } from "../command/commandDefine";
import { SongInfo } from "../repositories/Rep";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "./proxyDefine";
import { GamePxy } from "./GamePxy";
import config, { Platform } from "../../../config/config";

export class MusicPxy extends Proxy {
    public TempSongInfo: SongInfo;
    private isGetTable: boolean = false;
    public constructor(proxyName: string = null, data: any = null) {
        super(proxyName, data);
        this.getTable();
    }

    /**
     * 获取歌单
     */
    public postTable() {
        if (this.data) {
            console.log(this.data);
            this.sendNotification(CommandDefine.tabelResponce, this.data);
        }
        else {
            this.isGetTable = true;
        }
    }


    /**
     * 加载歌单
     */
    public getTable() {
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
            this.data = this.filterBag(res);
            for (let i = 0; i < 5; i++) {
                this.data[i].unlockCost = "0"
                this.data[i].unlockType == "coin"
            }
            this.filterDefaultUnlockSong(res);
            if (this.isGetTable) {
                this.sendNotification(CommandDefine.tabelResponce, this.data);
            }
        });

    }

    /**
     * 检测歌单是否存在
     */

    public checkTable() {
        if (this.data) {
            this.sendNotification(CommandDefine.tabelResponce, this.data);
            return true;
        }
        else {
            this.getTable();
            return false;
        }
    }

    /**
     * 过滤曲包
     */
    private filterBag(arr) {
        let self = this;
        function checkAdult(songInfo: SongInfo) {
            return songInfo.ex_bag == null;
        }
        let normalArr = arr.filter(checkAdult);
        if (normalArr.length > 0) {
            return normalArr;
        }
    }

    /**
     * 过滤默认解锁的歌曲   setDefaultUnlockSong
     */
    private filterDefaultUnlockSong(arr: Array<SongInfo>) {

        let gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        let self = this;
        function checkAdult(songInfo: SongInfo) {
            return songInfo.unlockCost == "0" && songInfo.unlockType == "coin";
        }
        let unlockArr = arr.filter(checkAdult);
        for (let i = 0; i < unlockArr.length; i++) {
            gamePxy.setDefaultUnlockSong(unlockArr[i].musicId);
        }
    }


    public postSongInfoById(idx: number) {

        let self = this;
        let getSongInfobyId = function (data) {
        }
        if (!this.data) {
            console.warn("歌单列表未下载完成");
        }
        else {
            getSongInfobyId(this.data);
        }
    }

    /**
     * 设置上一次游戏最后播放的歌曲
     */
    public setLastPlaySongName(musicName: string) {

        cc.sys.localStorage.setItem(CONSTANTS.Key_lastPlaySongName, JSON.stringify(musicName));
    }

    /**
     * 获得上一次游戏最后播放的歌曲
     */
    public getLastPlaySongName() {
        if (cc.sys.localStorage.getItem(CONSTANTS.Key_lastPlaySongName)) {
            return JSON.parse(cc.sys.localStorage.getItem(CONSTANTS.Key_lastPlaySongName));
        } else {
            return null;
        }

    }


    /**
     * 获得歌曲的信息
     */
    public getSongInfo(name: string) {
        let checkAdult = function (info) {
            return info.musicName == name;
        }
        let info = this.data.find(checkAdult);
        return info;
    }



    /**
     * 获得歌曲在列表内的id
     */
    public getSongListId(name: string) {
        if (!this.data) return 0;
        let checkAdult = function (info) {
            return info.musicName == name;
        }
        let info = this.data.find(checkAdult);
        let id = this.data.indexOf(info);
        return id;
    }

    /**
     * 获得一首歌曲在列表内的下一首歌
     */
    public getSongListNext(name: string) {
        let curId = this.getSongListId(name);
        let nextId = curId >= this.data.length - 1 ? curId : curId + 1;
        let info = this.data[nextId];
        return info;
    }


    /**
     * 获得歌曲的信息
     */
    public getSongInfoById(id: string) {
        let checkAdult = function (info) {
            return info.musicId == id;
        }
        return this.data.find(checkAdult);
    }

    /**
        * 新增一个广告的歌曲信息
        */
    addADInfo(_style: string) {
        let info = new SongInfo();
        info.style = _style;
        return info;
    }
}
