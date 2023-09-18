
import { CommandDefine } from "../command/commandDefine";
import { ActivityPxy, Activity, ActivityEventState } from "./ActivityPxy";
import config, { Platform } from "../../../config/config";


const zdjz_V1_1_1_4LocalPower: string = "zdjz_V1_1_1_4LocalPower";
const zdjz_V1_1_1_4LongTouch: string = "zdjz_V1_1_1_4LongTouch";
const zdjz_V1_1_1_4RewardPut: string = "zdjz_V1_1_1_4RewardPut";
const zdjz_V1_1_1_4SettleAnnoucePanelPut: string = "zdjz_V1_1_1_4SettleAnnoucePanelPut";
const zdjz_V1_1_1_4WinnerInfoEditPop: string = "zdjz_V1_1_1_4WinnerInfoEditPop";
const host = "https://cloud.xminigame.com/api"
//const host = "http://centos.6263game.com:20000"
export class V1_1_4Pxy extends ActivityPxy { 

    public get V1_1_4EventState(): ActivityEventState {
        return this.EventState
    }

    public constructor(proxyName: string = null, data: any = null) {
        super(proxyName, data);
        this.getEventState();
        console.log("V1_1_4Pxy   " + this.EventState);

    }

    /**
     * 获得玩家是否长按过
     */
    public getUserLongTouch() {
        let key = zdjz_V1_1_1_4LongTouch;
        if (cc.sys.localStorage.getItem(key)) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     *设置玩家长按
     */
    public setUserLongTouch() {
        let key = zdjz_V1_1_1_4LongTouch;
        cc.sys.localStorage.setItem(key, true);

    }

    /**
  * 获得结算阶段公告页面是否弹出
  */
    public getSettleAnnoucePanelPut() {
        let key = zdjz_V1_1_1_4SettleAnnoucePanelPut;
        if (cc.sys.localStorage.getItem(key)) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     *设置结算阶段公告页面是否弹出
     */
    public setSettleAnnoucePanelPut() {
        let key = zdjz_V1_1_1_4SettleAnnoucePanelPut;
        cc.sys.localStorage.setItem(key, true);

    }


    /**
     * 获得奖励说明是否弹出
     */
    public getUserRewardPut() {
        let key = zdjz_V1_1_1_4RewardPut;
        if (cc.sys.localStorage.getItem(key)) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     *设置奖励说明玩家弹出
     */
    public setUserRewardPut() {
        let key = zdjz_V1_1_1_4RewardPut;
        cc.sys.localStorage.setItem(key, true);

    }

    /**
   * 获得获奖用户信息填写面板是否自动弹出过
   */
    public getWinnerInfoEditAutoPop() {
        let key = zdjz_V1_1_1_4WinnerInfoEditPop;
        if (cc.sys.localStorage.getItem(key)) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     *设置获奖用户信息填写面板奖励自动弹出
     */
    public setWinnerInfoEditAutoPop() {
        let key = zdjz_V1_1_1_4WinnerInfoEditPop;
        cc.sys.localStorage.setItem(key, "首次弹出");

    }

    /**
     * 获得玩家拥有的可贡献的能量值
     */
    public getUserHasPowers() {
        let key = zdjz_V1_1_1_4LocalPower;
        if (cc.sys.localStorage.getItem(key)) {
            return JSON.parse(cc.sys.localStorage.getItem(key));
        }
        else {
            return 0;
        }
    }

    /**
     * 设置玩家拥有的可贡献的能量值
     */
    private setUserHasPowers(num) {
        let key = zdjz_V1_1_1_4LocalPower;
        cc.sys.localStorage.setItem(key, JSON.stringify(num));
        this.sendNotification(CommandDefine.V1_1_4UserHasPowerResponce, num);
    }

    /**
    *增加玩家拥有的可贡献的能量值
    */
    public addUserHasPowers(num) {
        let orignNum = this.getUserHasPowers();
        let newNum = orignNum + num;
        this.setUserHasPowers(newNum);
    }
    /**
        *减少玩家拥有的可贡献的能量值
        */
    public decreaseUserHasPowers(num) {
        let orignNum = this.getUserHasPowers();
        if (num > orignNum) {
            console.log("充能值不足！！");

            return;
        } else {
            let newNum = orignNum - num;
            console.log("newNum   " + newNum);

            this.setUserHasPowers(newNum);
        }

    }

    getEventState() {
        super.getEventState(Activity.constellationActivities);
    }

    /**上传用户分数 */
    setUserRank(Constellation: string, num: number, ismore) {
        // console.log("为星座  " + Constellation + "   贡献:  " + num);
        // var self = this;
        // if (config.platform == Platform.web) {
        //     self.sendNotification(CommandDefine.V1_1_4UserUploadFillPowerResponce, {
        //         name: Constellation,
        //         more: ismore
        //     });
        //     return;
        // }
        // var Data = {
        //     "aquarius": 0,
        //     "aries": 0,
        //     "cancer": 0,
        //     "capricorn": 0,
        //     "gemini": 0,
        //     "leo": 0,
        //     "libra": 0,
        //     "pisces": 0,
        //     "sagittarius": 0,
        //     "scorpio": 0,
        //     "taurus": 0,
        //     "virgo": 0,
        //     "nickName": this.userData.name,
        //     "channelId": Number(sdkConfig.getInstance().channelId),
        //     "avatar": this.userData.head,
        //     "userId": this.userData.userId,
        // }
        // if (Data[Constellation] == undefined) {
        //     console.log("星座名称错误!");
        //     return;
        // }
        // Data[Constellation] = num
        // console.log(JSON.stringify(Data));
        // var url = host + `/xmini-game-server/mobile/userConstellationRank/updateUserRank`;
        // var xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function () {
        //     console.log("xhr.readyState ", xhr.readyState,"xhr.status", xhr.status);
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         var response = JSON.parse(xhr.responseText);
        //         console.log(response)

        //         if (cc.sys.platform === cc.sys.OPPO_GAME) console.log(JSON.stringify(response));
        //         if (response.msg === "success") {
        //             console.log("上传成功");
        //             self.sendNotification(CommandDefine.V1_1_4UserUploadFillPowerResponce, {
        //                 name: Constellation,
        //                 more: ismore
        //             });
        //         }
        //         else {
        //             console.log("上传失败");
        //             self.sendNotification(CommandDefine.V1_1_4UserUploadFillPowerResponce, false);
        //         }
        //     }
        //     else if (xhr.readyState == 4 && xhr.status == 400) {
        //         console.log("活动一结束!");
        //     }
        // };
        // xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-type", "application/json");
        // xhr.setRequestHeader("Authorization", this.userData.token);
        // xhr.send(JSON.stringify(Data));
        // console.log(Data);
    };

    /**获取用户排行榜 */
    getUserRank() {
        console.log("开始获取排行榜!")
        if (config.platform == Platform.web) {
            return;
        }
        var self = this;
        let url = `${host}/xmini-game-server/mobile/userConstellationRank/getUserRank?channelId=${sdkConfig.getInstance().channelId}&userId=${this.userData.userId}`;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                // callback(JSON.parse(response))
                self.sendNotification(CommandDefine.V1_1_4UserRankInfoResponce, JSON.parse(response).data)
                console.log("个人排行榜获取成功", JSON.parse(response));
                if (cc.sys.platform === cc.sys.OPPO_GAME) console.log("个人排行榜获取成功", JSON.stringify(response));
            }
        }
        xhr.open("GET", url, true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", this.userData.token);
        xhr.send();
    };
    /**获取整个排行榜 */
    getAllUserRank(num = 100) {
      
        console.log("开始获取前" + num + "名排行榜!")
        if (config.platform == Platform.web) {
            return;
        }
        var self = this;
        let url = `${host}/xmini-game-server/mobile/userConstellationRank/getConstellationTopList?channelId=${sdkConfig.getInstance().channelId}&isShowConstellation=${false}&topn=${num}`;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log("xhr.readyState  ",xhr.readyState);
            console.log("xhr.status   ",xhr.status);
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                //callback(JSON.parse(response))
                self.sendNotification(CommandDefine.V1_1_4AllRankInfoResponce, JSON.parse(response).data)
                console.log("前" + num + "名排行榜获取成功", JSON.parse(response));
                if (cc.sys.platform === cc.sys.OPPO_GAME) console.log(JSON.stringify(response));
            }
        }
        xhr.open("GET", url, true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", this.userData.token);
        xhr.send();
    };

    /**获取星座排行 */
    getConstellationRank() {
        console.log("开始获取星座排行榜!")
        if (config.platform == Platform.web) {
            return;
        }
        var self = this;
        let url = `${host}/xmini-game-server/mobile/userConstellationRank/getConstellationEnergy?channelId=${sdkConfig.getInstance().channelId}`;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                console.log("星座排行榜获取成功", JSON.parse(response));
                self.sendNotification(CommandDefine.V1_1_4ConstellationRankResponce, JSON.parse(response).data)
                if (cc.sys.platform === cc.sys.OPPO_GAME) console.log("星座排行榜获取成功", JSON.stringify(response));
            }
        }
        xhr.open("GET", url, true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", this.userData.token);
        xhr.send();
    };
    /**获取获奖信息 */
    getWinnerInfo() {
        console.log("开始获奖信息!")
        if (config.platform == Platform.web) {
            this.sendNotification(CommandDefine.v1_1_4GetWinnerInfo, { msg: "改用户没有获奖信息" });
            return;
        }
        var self = this;
        let url = `${host}/xmini-game-server/mobile/userwinner/getUserWinner?channelId=${sdkConfig.getInstance().channelId}&userId=${this.userData.userId}`;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                if (cc.sys.platform === cc.sys.OPPO_GAME) console.log(JSON.stringify(response));
                console.log(JSON.parse(response));
                self.sendNotification(CommandDefine.v1_1_4GetWinnerInfo, JSON.parse(response))
            }
            else {
                // self.sendNotification(CommandDefine.V1_1_4ConstellationRankResponce, null)
            }
        }
        xhr.onerror = function (e) {
            console.log("获奖信息获取失败", + JSON.stringify(e));
            self.sendNotification(CommandDefine.v1_1_4GetWinnerInfo, false)
            // callback(false);
        }
        xhr.open("GET", url, true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", this.userData.token);
        xhr.send();
    };

    /**保存获奖信息 */
    sentWinnerInfo(address: string, phone: string, trueName: string, giftNumber: string) {
        console.log("开始保存获奖信息");
        var self = this;
        var Data = {
            "address": address,
            "channelId": Number(sdkConfig.getInstance().channelId),
            "phone": phone,
            "trueName": trueName,
            "giftNumber": giftNumber,
            "userId": this.userData.userId
        };
        console.log(JSON.stringify(Data));
        var url = host + `/xmini-game-server/mobile/userwinner/saveUserWinner`;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                if (cc.sys.platform === cc.sys.OPPO_GAME) console.log(JSON.stringify(response));
                console.log(response)
                if (response.msg === "success") {
                    console.log("获奖信息保存成功");
                    self.sendNotification(CommandDefine.v1_1_4SentWinnerInfo, JSON.parse(response))
                }

                else {
                    console.log("获奖信息保存失败");
                    self.sendNotification(CommandDefine.v1_1_4SentWinnerInfo, false);
                }
            }

        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", this.userData.token);
        xhr.send(JSON.stringify(Data));
        console.log(Data, this.userData.token);
    };

}
