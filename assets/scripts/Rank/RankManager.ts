import UserData from "./UserData";


const { ccclass, property } = cc._decorator;
const host = "https://cloud.xminigame.com/api"
//const host = "http://centos.6263game.com:10010"

@ccclass 
export default class RankManager {
    private static instance: RankManager;
    public static getInstance(): RankManager {
        if (!RankManager.instance) RankManager.instance = new RankManager();
        return RankManager.instance
    };


    /**上传用户分数 */
    setUserRank(Score: number, Time: number,callback?) {
        // console.log("开始上传数据!")
        // var self = this;
        // var Data = {
        //     "avatar": UserData.getInstance().Data.HeadUrl,
        //     "channelId": Number(sdkConfig.getInstance().channelId),
        //     "userId": UserData.getInstance().Data.ID,
        //     "nickName": UserData.getInstance().Data.Name,
            
        //     "cumulativeScore": Math.floor(Score),
        //     "gender": UserData.getInstance().Data.Gender,
        //     "survivalTime": Math.floor(Time),
            
        // };
        // var url = host + `/xmini-game-server/mobile/gameUserRank/updateUserRank`;
        // var xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function () {
        //     console.log(xhr.readyState, xhr.status);

        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         var response = JSON.parse(xhr.responseText);
        //         console.log(response)
        //         if (response.msg === "success") 
        //         {
        //             console.log("上传成功");
        //             callback&&callback();
        //         }
        //         else console.log("上传失败");
        //     }
        //     else if (xhr.readyState == 4 && xhr.status == 400) {
        //         console.log("活动一结束!");
        //     }
        // };
        // xhr.open("POST", url, true);
        // xhr.setRequestHeader("Content-type", "application/json");
        // xhr.setRequestHeader("Authorization", UserData.getInstance().Data.Token);
        // xhr.send(JSON.stringify(Data));
        // console.log(Data, UserData.getInstance().Data.Token);
    };

    /**获取用户排行榜 */
    getUserRank(callback) {
        // console.log("开始获取用户排行榜!")
        // var self = this;
        // let url = `${host}/xmini-game-server/mobile/gameUserRank/getUserRank?channelId=${sdkConfig.getInstance().channelId}&userId=${UserData.getInstance().Data.ID}`;
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function () {       
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         var response = xhr.responseText;
        //         callback(JSON.parse(response).data)
        //     }
        //     else 
        //     {
        //        // console.log("开始获取用户排行榜失败")
        //         callback(false);
        //     }
            
        // }
        // xhr.onerror = function (e) {
        //     console.log("排行榜获取失败", + JSON.stringify(e));
        //     callback(false);
        // }
        // xhr.open("GET", url, true);
        // xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        // xhr.setRequestHeader("Authorization", UserData.getInstance().Data.Token);
        // xhr.send();
    };

    /**获取整个排行榜 */
    getAllUserRank(num: number, callback) {
        // console.log("开始获取前" + num + "名排行榜!")
        // var self = this;
        // let url = `${host}/xmini-game-server/mobile/gameUserRank/getShowRankTopNList?channelId=${sdkConfig.getInstance().channelId}&topn=${num}`;
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         var response = xhr.responseText;
        //         callback(JSON.parse(response).data)
        //     }

        //     else callback(false);
        // }
        // xhr.onerror = function (e) {
        //     console.log("排行榜获取失败", + JSON.stringify(e));
        //     callback(false);
        // }
        // xhr.open("GET", url, true);
        // xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        // xhr.setRequestHeader("Authorization", UserData.getInstance().Data.Token);
        // xhr.send();
    };

    /**获取分数集合 */

    getScoreCollection(callback) {
        // console.log("开始获取分数合集!")
        // var self = this;
        // let url = `${host}/xmini-game-server/mobile/gameUserRank/getAllSumScore?channelId=${sdkConfig.getInstance().channelId}`;
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         var response = xhr.responseText;
        //         callback(JSON.parse(response).data)
        //     }

        //     else callback(false);
        // }
        // xhr.onerror = function (e) {
        //     console.log("排行榜获取失败", + JSON.stringify(e));
        //     callback(false);
        // }
        // xhr.open("GET", url, true);
        // xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        // xhr.setRequestHeader("Authorization", UserData.getInstance().Data.Token);
        // xhr.send();
    };

    /**获取获奖信息 */
    getWinnerInfo(callback) {
        // console.log("开始获奖信息!")
        // var self = this;
        // let url = `${host}/xmini-game-server/mobile/userwinner/getUserWinner?channelId=${sdkConfig.getInstance().channelId}&userId=${UserData.getInstance().Data.ID}`;
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //         var response = xhr.responseText;
        //         callback(JSON.parse(response))
        //     }

        //     else if(xhr.status == 400){
        //         var response = xhr.responseText;
        //         callback(JSON.parse(response))
        //     } 
        // }
        // xhr.onerror = function (e) {
        //     console.log("获奖信息获取失败", + JSON.stringify(e));
        //     callback(false);
        // }
        // xhr.open("GET", url, true);
        // xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        // xhr.setRequestHeader("Authorization", UserData.getInstance().Data.Token);
        // xhr.send();
    };

    /**保存获奖信息 */
    sentWinnerInfo(address: string, phone: string, trueName: string,giftNumber:string) {
        console.log("开始保存获奖信息");

        var self = this;
        var Data = {
            "address": address,
            "channelId": 0,
            "phone": phone,
            "trueName": trueName,
            "giftNumber":giftNumber,
            "userId": UserData.getInstance().Data.ID
        };
        var url = host + `/xmini-game-server/mobile/userwinner/saveUserWinner`;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(response)
                if (response.msg === "success") console.log("获奖信息保存成功");
                else console.log("获奖信息保存失败");
            }

        };
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", UserData.getInstance().Data.Token);
        xhr.send(JSON.stringify(Data));
        console.log(Data, UserData.getInstance().Data.Token);
    };

    /**获取活动时间 */
    getEventTime(callback) {
        console.log("开始获取活动时间");
        var self = this;
      //  let url = `${host}/xmini-game-server/mobile/gameUserRank?channelId=${sdkConfig.getInstance().channelId}`;
        let url = "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp";
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log(xhr);
            
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                //callback(JSON.parse(response).data)
                console.log(JSON.parse(response));
                console.log(JSON.parse(response).data);
                console.log("时间戳"+JSON.parse(response).data.t);
                console.log("时间:  "+new Date(Number(JSON.parse(response).data.t)));
                let nowDate=new Date(Number(JSON.parse(response).data.t));
                const stamp1 = new Date(nowDate.setHours(0, 0, 0, 0)); //获取当天零点的时间
                var nowTime = stamp1.getTime() ; 
                var day = stamp1.getDay() || 7;
                var oneDayLong = 24*60*60*1000;
                let targetDate=nowTime + (7-day)*oneDayLong ; 
                console.log("本周目标时间:  "+new Date(targetDate));
                

            }
            else callback(false);
        }
        xhr.onerror = function (e) {
            console.log("活动时间获取失败", + JSON.stringify(e));
            //callback(false);
        }
        xhr.open("GET", url, true);
        // xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        // xhr.setRequestHeader("Authorization", UserData.getInstance().Data.Token);
        xhr.send();
    };










}

