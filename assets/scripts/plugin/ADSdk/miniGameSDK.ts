


import AdController from "./AdController";
import AudioManager from "../audioPlayer/AudioManager";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { CommandDefine } from "../../purmvc_app/command/commandDefine";
import { AchiUpdateInfo } from "../../purmvc_app/command/UpdateAchiProCmd";
import GameManager from "../../GameManager";
import { ReportAnalytics } from "../reportAnalytics";
import XGame from "sdk/src/XGame";

const { ccclass, property } = cc._decorator;
@ccclass
export default class miniGameSDK implements SDKInterface {

    IDsette: number;
    IDgroup: number;
    IDIron: number;

    //new sdk
    channelId: number;
    ad;
    banner;
    inters;
    video;
    IsOnLine() {
        //throw new Error("Method not implemented.");
        if (!navigator.onLine) {
            console.log('小游戏平台:当前无网络，请联网后重新尝试')
            // ASCAd.getInstance().showToast('当前无网络，请联网后重新尝试');
            return false;
        }
        else {
            return true;
        }
    }

    InitAD() {
        this.channelId = 46;  //40 子弹节奏  46 炫彩枪神
        let user
        console.log('开始初始化SDK');
        XGameGlobal["xgame.sdk.init"]((sdk: XGame) => {
            sdk.init(this.channelId, (ret) => {    //channelId为游戏渠道的Id
                //广告模块
                user = sdk.User();
                user.login((ret, res)=>{
                  console.log("login:", ret, res);
                  this.ad = sdk.Ad();
                  console.log('SDK成功');
                });
              
            });
        })
    }

    //展示banner
    showBanner() {
        // ASCAd.getInstance().hideBanner();
        // ASCAd.getInstance().showBanner();
        console.log(this.ad)
        this.ad.showBanner(this.ad.newResult());    //展示默认Banner广告
    }


    hideBanner() {
        //  ASCAd.getInstance().hideBanner();
        this.ad.hideBanner();
    }

    // 判断是否有插屏
    public async getInsertFlag(): Promise<boolean> {
        return await new Promise((resolve) => {
            this.ad.getIntersFlag((flag: boolean) => {
                resolve(flag)
            })
        })
    }

    //展示插屏广告
    showInters(callback) {
        // //console.log('local-----------------showInters')
        // if (this.hasInsert()) {
        //     ASCAd.getInstance().showInters();
        // }
        // else if (ASCAd.getInstance().getVideoIntersFlag()) {
        //     let cal = () => {
        //         console.log('local-----------------视频播放成功')
        //         if (AdController.instance.isImmediatelyReuse && !AdController.instance.isPlayGameVideo) {
        //             console.log('立刻恢复音乐');
        //             AudioManager.GetInstance(AudioManager).player.resumeMusic();
        //         }

        //     }
        //     if (!AudioManager.GetInstance(AudioManager).player.IsPausePlaying) {
        //         AdController.instance.isImmediatelyReuse = true;
        //         AudioManager.GetInstance(AudioManager).player.pauseMusic();
        //     }
        //     else {
        //         AdController.instance.isImmediatelyReuse = false;
        //     }
        //     ASCAd.getInstance().showVideoInters(cal);
        // }
        let res = this.ad.newResult();
            res.onResult = (e) => {
                console.log("onResult", e.isReward)    //设置回调是否下发奖励
                if (e.isReward) {
                    console.log('local-----------------视频播放成功')
                    if (AdController.instance.isImmediatelyReuse && !AdController.instance.isPlayGameVideo) {
                        console.log('立刻恢复音乐');
                        AudioManager.GetInstance(AudioManager).player.resumeMusic();
                    }
                    Facade.getInstance().sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(2, 1))
                    callback(true);
                } else {
                    if (AdController.instance.isImmediatelyReuse) {
                        console.log('立刻恢复音乐');
                        AudioManager.GetInstance(AudioManager).player.resumeMusic();
                    }
                    console.log('local-----------------视频播放失败')
                    GameManager.getInstance().showMsgTip("暂无视频！")
                    callback(false);
                }
            }
        this.ad.showInters(res);


    }

    // // 判断是否有视频
    // getVideoFlag() {
    //     console.log('是否加载到视频:' + ASCAd.getInstance().getVideoFlag())
    //     if (!GameManager.getInstance().TEST_ADTag) {
    //         return true;
    //     }
    //     else {
    //         if (!ASCAd.getInstance().getVideoFlag()) {
    //             GameManager.getInstance().showMsgTip("暂无视频！");
    //         }
    //         return ASCAd.getInstance().getVideoFlag();
    //     }
    // }

    // 判断是否有视频
    public async getVideoFlag(): Promise<boolean> {
        return await new Promise((resolve) => {
            this.ad.getVideoFlag((flag: boolean) => {
                resolve(flag)
            })
        })
    }


    //展示视频广告
    showVideo(callback) {
        if (!GameManager.getInstance().TEST_ADTag) {
            Facade.getInstance().sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(2, 1))
            callback(true);
        }
        else {
            if (!AudioManager.GetInstance(AudioManager).player.IsPausePlaying) {
                AdController.instance.isImmediatelyReuse = true;
                AudioManager.GetInstance(AudioManager).player.pauseMusic();
            }
            else {
                AdController.instance.isImmediatelyReuse = false;
            }
            ReportAnalytics.getInstance().LocalADCount++;
            // ASCAd.getInstance().showVideo((suc) => {
            //     if (suc) {
            //         console.log('local-----------------视频播放成功')
            //         if (AdController.instance.isImmediatelyReuse && !AdController.instance.isPlayGameVideo) {
            //             console.log('立刻恢复音乐');
            //             AudioManager.GetInstance(AudioManager).player.resumeMusic();
            //         }
            //         Facade.getInstance().sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(2, 1))
            //         callback(true);
            //     }
            //     else {
            //         if (AdController.instance.isImmediatelyReuse) {
            //             console.log('立刻恢复音乐');
            //             AudioManager.GetInstance(AudioManager).player.resumeMusic();
            //         }
            //         console.log('local-----------------视频播放失败')
            //         GameManager.getInstance().showMsgTip("暂无视频！")
            //         callback(false);

            //     }
            // })


            let res = this.ad.newResult();
            res.onResult = (e) => {
                console.log("onResult", e.isReward)    //设置回调是否下发奖励
                if (e.isReward) {
                    console.log('local-----------------视频播放成功')
                    if (AdController.instance.isImmediatelyReuse && !AdController.instance.isPlayGameVideo) {
                        console.log('立刻恢复音乐');
                        AudioManager.GetInstance(AudioManager).player.resumeMusic();
                    }
                    Facade.getInstance().sendNotification(CommandDefine.UpdateAchiPro, new AchiUpdateInfo(2, 1))
                    callback(true);
                } else {
                    if (AdController.instance.isImmediatelyReuse) {
                        console.log('立刻恢复音乐');
                        AudioManager.GetInstance(AudioManager).player.resumeMusic();
                    }
                    console.log('local-----------------视频播放失败')
                    GameManager.getInstance().showMsgTip("暂无视频！")
                    callback(false);
                }
            }
            this.ad.showVideo(res);
        }
    }
    /**
     * 展示互推Icon
     * @param width
     * @param height
     * @param x
     * @param y
     */
    showNavigateIcon(width, height, x, y) {
        // console.log('是否加载到互推iron:' + ASCAd.getInstance().getNavigateIconFlag())
        // if (ASCAd.getInstance().getNavigateIconFlag()) {
        //     ASCAd.getInstance().showNavigateIcon(width, height, x, y);
        //     clearTimeout(this.IDIron);
        // }
        // else {
        //     let self = this;
        //     this.IDIron = setTimeout(() => {
        //         self.showNavigateIcon(width, height, x, y);
        //     }, 10000);
        // }
    }

    /**
     * 隐藏互推Icon
     */
    hideNavigateIcon() {
        // ASCAd.getInstance().hideNavigateIcon();
        // clearTimeout(this.IDIron);
    }

    /**
     * 显示互推列表
     */
    showNavigateGroup(type, side) {
        // if (ASCAd.getInstance().getNavigateGroupFlag()) {
        //     //  ASCAd.getInstance().showNavigateGroup(type, side);
        //     clearTimeout(this.IDgroup)
        // }
        // else {
        //     let self = this;
        //     this.IDgroup = setTimeout(() => {
        //         self.showNavigateGroup(type, side);
        //     }, 10000);
        //     // this.scheduleOnce(() => { this.showNavigateGroup(type, side); }, 10);
        // }
    }
    /**
     * 隐藏互推列表
     */
    hideNavigateGroup() {
        // ASCAd.getInstance().hideNavigateGroup();
        // clearTimeout(this.IDgroup)
    }

    /**
    * 显示结算页互推列表
    */
    showNavigateSettle(type, x, y) {
        // console.log('是否加载到结算页:' + ASCAd.getInstance().getNavigateSettleFlag())
        // if (ASCAd.getInstance().getNavigateSettleFlag()) {
        //     ASCAd.getInstance().showNavigateSettle(1, x, y);
        //     clearTimeout(this.IDsette)
        // }
        // else {
        //     let self = this;
        //     this.IDsette = setTimeout(() => {
        //         self.showNavigateSettle(type, x, y)
        //     }, 10000);
        //     //this.scheduleOnce(() => { this.showNavigateSettle(type, x, y) }, 10);
        // }

    }


    /**
     * 隐藏互推结算
     */
    hideNavigateSettle() {
        // ASCAd.getInstance().hideNavigateSettle();

        // clearTimeout(this.IDsette)
    }

    //添加桌面图标
    addDeskTop() {
        // var callback = function (success) {
        //     if (success) {
        //         console.log('添加桌面成功，可以发放奖励')
        //     }
        // };
        // var callbackFlag = function (success) {
        //     console.log('getDeskTopFlag', success);
        //     // ASCAd.getInstance().addDeskTop(callback);
        // };
        //ASCAd.getInstance().getDeskTopFlag(callbackFlag);
    }


    //震动
    vibrate() {
       // this.ad.phoneVibrate('short');
    }

    //长震动
    longVibrate() {
      //  this.ad.phoneVibrate('long');
    }

    StartScreenRecording(dur: any) {
        console.log('录屏功能目前仅抖音渠道可用')
        //throw new Error("Method not implemented.");t
    }
    PauseScreenRecording() {
        console.log('录屏功能目前仅抖音渠道可用')
        //throw new Error("Method not implemented.");t
    }
    ResumeScreenRecording() {
        console.log('录屏功能目前仅抖音渠道可用')
        //throw new Error("Method not implemented.");t
    }
    StopScreenRecording(cal: any) {
        console.log('录屏功能目前仅抖音渠道可用')
        //throw new Error("Method not implemented.");t
    }

    ShareScreenRecording(str: string, videoPath: any) {
        console.log('录屏功能目前仅抖音渠道可用')
    }

    exitTheGame() {
        //  throw new Error("Method not implemented.");'
        console.log('当前渠道为小游戏')
    }

    CreateMoreGamesButton(morgamePosNode: cc.Node, screenWidth: number, screenHight: number) {
        // throw new Error("Method not implemented.");
    }
    CleanMoreGamesButton(btn) {
        // throw new Error("Method not implemented.");
    }

    showGameCenter() {
        // throw new Error("Method not implemented.");
    }

    CheckVersionSupport(): boolean {
        //throw new Error("Method not implemented.");
        return true
    }

    QQShowAppBox() {
        throw new Error("Method not implemented.");
    }


    blockAdMap = new Map<number, any>();

    async getBlockFlag(index: number, x: number, y: number) {
        return await new Promise(resolve => {
            let ad = this.getBlock(index, x, y);
            if (ad) {
                console.log("getBlockFlag  true")
                ad.getFlag(resolve);
            } else {
                console.log("getBlockFlag false")
                resolve(false);
            }
        })
    }

    private getBlock(index: number, x: number, y: number) {
        if (this.blockAdMap.has(index)) {
            return this.blockAdMap.get(index);
        }
        if (this.ad && this.ad.createCustomAd) {
            let ad = this.ad.createCustomAd(index);
            if (ad) {
                let size = cc.view.getVisibleSize();
                x = x / size.width;
                y = 1 - y / size.height;
                ad.setPosition(x, y);
                this.blockAdMap.set(index, ad);
                ad.create();
            }
            return ad;
        }
        return null;
    }

    hideBlock(index: number) {
        if (this.blockAdMap.has(index)) {
            let ad = this.blockAdMap.get(index);
            if (ad) {
                ad.hide();
            }
        }
    }

    showBlock(index: number, x: number, y: number) {
        let ad = this.getBlock(index, x, y);
        if (ad) {
            let res = this.ad.newResult();
            console.log("showBlock  show")
            ad.show(res);
        }
    }

    reportAnalytics(data: any) {
    }



}


