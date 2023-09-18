export class SongInfo {
    coverFile: string;
    ex_lv:string;
    ex_bag: string;
    ex_new: string;
    json_normal: string;
    musicFile: string;
    musicId: string;
    musicName: string;
    orderNumbe: string;
    singerName: string;
    style: string;
    unlockCost: string;
    unlockType: string;
}

export class SignInfo {
    dayDes: string;
    id: number;
    ironPath: string;
    rewardDes: string;
    rewardType: string;
    rewardValue: number;
}

export class AchivInfo {
    id: number;
    title: string;
    des: string;
    titlePath: string;
    ironPath: string;
    baseAward: number;
    baseTarget: number;
    factorAward: number;
    factorTarget: number;
}


export class GunSkinInfo {
    id: string;
    gunName: string;
    ironPath: string;
    unlockType: string;
    unlockVal: number;
}


export class BoxSkinInfo {
    id: number;
    boxName: string;
    ironPath: string;
    unlockType: string;
    unlockVal: number;
}
export class MapSkinInfo {
    id: number;
    mapName: string;
    ironPath: string;
    unlockType: string;
    targetCost: number;
}

export class PowerInfo {
    id: number;
    obtainType: string;
    consumeVal: number;
    awardVal: number;
}

export enum ConsumablesType {
    dia = "dia",
    power = "power",
    voucher="voucher" //地图抵用券
}

/**
 * 消耗品改变传递的字段
 */
export class ConsumablesAlterInfo {
    consumablesType: ConsumablesType;
    alterVal: number;
    constructor(type: ConsumablesType, val: number) {
        this.consumablesType = type;
        this.alterVal = val;
    }
}


/**
 * 歌曲播放时机
 */
export enum SongPlayType{
    Immediately="Immediately",
    Wait="Wait"
}

/**
 * 播放歌曲字段
 */
export class PlaySongInfo{
    songName:string;
    playState:SongPlayType;
    constructor(name: string, state: SongPlayType) {
        this.songName = name;
        this.playState = state;
    }
}