
const host = "https://cloud.xminigame.com/api"
//const host = "http://centos.6263game.com:10010"
const { ccclass, property } = cc._decorator;

@ccclass
export default class UserData {
    private static instance: UserData;
    public static getInstance(): UserData {
        if (!UserData.instance) UserData.instance = new UserData();
        return UserData.instance
    }; 

    Data = {
        Type: null,//用户类型  0:游客  1:正常用户
        ID: null,//用户ID
        Name: null, //用户名称
        HeadUrl: null,   //用户头像地址
        Gender: null,    //用户性别  M:男  F 女
        Token: null, //用户token  有效期2小时
    }



    /**输出用户信息 */
    showInfo() {
        console.log(this.Data);
    };
    /**获取用户ID */
    getuserID(callback) {
        // ASCAd.getInstance().getUserData((res) => {
        //     console.log("获取用户ID------------- ");
        //     console.log(res);
        //     this.Data.Type = Number(res.userType)
        //     if (res.userType === 1) {
        //         console.log("正常用户");
        //         this.Data.ID = res.userId;
        //         this.Data.Token = res.token;
        //         this.showInfo();
        //         callback(true)
        //     }
        //     else {
        //         console.log("游客");
        //         callback(false)
        //     }
        // });
    };
    /**获取用户信息  需授权 */
    getuserInfo(callback?) {
        var self = this;
        // ASCAd.getInstance().getUserInfo((res) => {
        //     console.log(" 获取用户信息  需授权---------------- ")
        //     console.log(JSON.stringify(res));
        //     self.Data.HeadUrl = res.head;
        //     self.Data.Name = res.name;
        //     callback&&callback(res);
        // });
    };


    /**获取用户性别 */
    getUserGender(callback) {
        console.log("开始获取用户性别!")
        var self = this;
        let url = `${host}/xmini-game-server/mobile/gameUserRank/getUserRank?channelId=${0}&userId=${UserData.getInstance().Data.ID}`;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = xhr.responseText;
                if(JSON.parse(response).data)
                {
                    callback(JSON.parse(response).data.rankScore.gender);
                }else{
                    callback(null);
                }
                
            }
            else {
                callback(false);
            }

        }
        xhr.onerror = function (e) {
            callback(false);
        }
        xhr.open("GET", url, true);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Authorization", UserData.getInstance().Data.Token);
        xhr.send();
    };

    /**弹出授权界面  */
    showAuthorize() {
        //@ts-ignore
        if (typeof tt != "undefined") {
            //@ts-ignore
            tt.openSetting();
        }
    };


    /**弹出登陆界面  */
    showLogin(cal) {
        // ASCAd.getInstance().mustLogin(cal);
    };

}
