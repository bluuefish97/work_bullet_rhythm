import { Proxy } from "../../core/puremvc/patterns/proxy/Proxy";
import { CommandDefine } from "../command/commandDefine";
import config, { Platform } from "../../../config/config";


export class ActivityPxy extends Proxy {
    protected EventState = null;
    public userData: UserData = null;
    public constructor(proxyName: string = null, data: any = null) {
        super(proxyName, data);
        this.userData = new UserData();
    }

    /**获取用户ID */
    getuserID() {
        if (config.platform == Platform.web) {
            this.userData.userType = 1
            this.sendNotification(CommandDefine.ActivityUserLoginResponce, this.userData)

        } else {
            // ASCAd.getInstance().getUserData((res) => {
            //     this.userData.userType = res.userType;
            //     this.userData.token = res.token;
            //     this.userData.userId = res.userId;
            //     this.sendNotification(CommandDefine.ActivityUserLoginResponce, res)
            // });

        }

    };
    /**获取用户信息  需授权 */
    getuserInfo() {
        if (config.platform == Platform.web) {
            this.userData.power = true;
            this.userData.name = "用户";
            this.sendNotification(CommandDefine.ActivityUserAuthorizationResponce, this.userData)

        } else {
            // ASCAd.getInstance().getUserInfo((res) => {
            //     if (res.power) {
            //         this.userData.head = res.head;
            //         this.userData.name = res.name;
            //     }
            //     console.log("获取用户信息  需授权  ------------");
            //     console.log(res);
            //     this.sendNotification(CommandDefine.ActivityUserAuthorizationResponce, res)
            // });
        }
    };

    /**
    * 获得活动的状态
    */ 
    public getEventState(activity: Activity) {
        if (this.EventState != null) {
            this.sendNotification(CommandDefine.ActivityEventStateResponce, this.EventState);
        }
        else {
            let targetDate = new Date();
            switch (activity) {
                case Activity.constellationActivities:
                    if(config.platform==Platform.oppo){
                        targetDate = new Date(2020,11, 30, 24, 0, 0, 0)      //22
                    }else{
                        targetDate = new Date(2020, 10, 22, 24, 0, 0, 0)      //22
                    }
                  
                    break;

                default:
                    break;
            }
            console.log("targetDate ",targetDate);
            
            this.getEventTime(targetDate);
        }
    }


    /*获取活动时间 */

    getEventTime(targetDate) {
        let nowDate = new Date()
        this.checkIsOverTime(nowDate, targetDate);
    }

    /**
     * 判断活动是否过期
     */
    private checkIsOverTime(nowDate: Date, targetDate: Date) {
        let sysDateTime = nowDate.getTime();
        let activityDeadlineTime = targetDate.getTime();
        //七天后活动入口关闭
        if (sysDateTime > (activityDeadlineTime + 604800000)) {
            console.log("星座活动 截止后达七天，活动入口关闭");
            this.EventState = ActivityEventState.END;
        }
        else if (sysDateTime > activityDeadlineTime) {
            console.log("星座活动已经截止");
            this.EventState = ActivityEventState.SETTE;
        }
        else {
            console.log("星座活动正在进行中！！！");
            this.EventState = ActivityEventState.ING;
        }

        this.sendNotification(CommandDefine.ActivityEventStateResponce, this.EventState);
    }
    /**弹出授权界面  */
    showAuthorize() {
        //@ts-ignore
        if (typeof tt != "undefined") {
            //@ts-ignore
            tt.openSetting();
        }
    };
}

export enum ActivityEventState {
    ING = 0,
    SETTE = 1,
    END = 2
}

export class UserData {
    power:boolean
    userType: number//用户类型  0:游客  1:正常用户
    userId: number//用户ID
    name: string//用户名称
    head: string   //用户头像地址
    token: string //用户token  有效期2小时
}

export enum Activity {
    constellationActivities = 0,
}


