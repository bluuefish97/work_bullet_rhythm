import BasePanel from "../../util/BasePanel";
import { PoolManager } from "../../util/PoolManager";
import BaseClickTip from "../../util/PleaseClickSys/BaseClickTip";
import PleaseClickSys, { TipType } from "../../util/PleaseClickSys/PleaseClickSys";
import config, { Platform } from "../../../config/config";
import GameManager from "../../GameManager";
import { CONSTANTS } from "../../Constants";
import { ClipEffectType } from "../../AudioEffectCtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HomePartView extends BasePanel {

    @property(cc.SpriteFrame)
    waitRecSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    RecingSF: cc.SpriteFrame = null;
    @property(cc.Button)
    contactBtn: cc.Button = null;
    @property(cc.Node)
    contactNode: cc.Node = null;

    public mainToggleContainer: cc.ToggleContainer = null;
    private signBtn: cc.Button = null;
    private TikTokBtn: cc.Button = null;
    private backupeELPBtn: cc.Button = null;
    private achiBtn: cc.Button = null;
    private recBtn: cc.Button = null;
    private Android_MoreGameBtn: cc.Button = null;
    private Douyin_AddDesktopBtn: cc.Button = null;
    private QQ_MoreGameBtn: cc.Button = null;
    private skinPart: cc.Node = null;
    private mapSkinPart: cc.Node = null;
    private gunSkinPart: cc.Node = null;
    private boxSkinPart: cc.Node = null;
    private songListScrollView: cc.ScrollView;
    private gunskinListScrollView: cc.ScrollView = null;
    private boxskinListScrollView: cc.ScrollView = null;
    private transitionToggleNode: cc.Node = null;
    private quickStartSongLabel: cc.Label = null;
    private quickStartBtn: cc.Button = null;
    @property(cc.Prefab)
    songUnitPre: cc.Prefab = null;
    gunSkinUnitPre: cc.Prefab = null;
    boxSkinUnitPre: cc.Prefab = null;

    private ELPShowBar: cc.Node = null;



    private ActivityShowBar: cc.Node = null;
    private ActivityStartButton: cc.Button = null;

    public get SongListScrollView(): cc.ScrollView {
        return this.songListScrollView;
    }
    public get BackupeELPBtn(): cc.Button {
        return this.backupeELPBtn
    }

    public get SignBtn(): cc.Button {
        return this.signBtn;
    }


    onLoad() {
        super.onLoad();
        this.signBtn = this.node.getChildByName("TopPart").getChildByName("SignBtn").getComponent(cc.Button);
        this.TikTokBtn = this.node.getChildByName("TopPart").getChildByName("TikTokBtn").getComponent(cc.Button);
        this.backupeELPBtn = this.node.getChildByName("TopPart").getChildByName("backupeELPBtn").getComponent(cc.Button);
        this.achiBtn = this.node.getChildByName("TopPart").getChildByName("AchivBtn").getComponent(cc.Button);
        this.recBtn = this.node.getChildByName("TopPart").getChildByName("RecBtn").getComponent(cc.Button);
        this.Android_MoreGameBtn = this.node.getChildByName("TopPart").getChildByName("MoreGameBtn").getComponent(cc.Button);
        this.Douyin_AddDesktopBtn = this.node.getChildByName("TopPart").getChildByName("desktopBtn").getComponent(cc.Button);
        this.QQ_MoreGameBtn = this.node.getChildByName("TopPart").getChildByName("QQMoreGameBoxBtn").getComponent(cc.Button);
        this.quickStartBtn = this.node.getChildByName("TopPart").getChildByName("quickStartBtn").getComponent(cc.Button);
        this.quickStartSongLabel = this.node.getChildByName("TopPart").getChildByName("quickStartSongLabelMask").getComponentInChildren(cc.Label);
        this.skinPart = this.node.getChildByName("SkinPart");
        this.gunSkinPart = this.skinPart.getChildByName("GunSkinPart");
        this.boxSkinPart = this.node.getChildByName("BoxSkinPart");
        this.songListScrollView = this.node.getChildByName("SongListScrollView").getComponent(cc.ScrollView);
        this.gunskinListScrollView = this.gunSkinPart.getChildByName("GunskinListScrollView").getComponent(cc.ScrollView);
        this.boxskinListScrollView = this.boxSkinPart.getChildByName("BoxskinListScrollView").getComponent(cc.ScrollView);
        this.mainToggleContainer = this.node.getChildByName("ToggleContainer").getComponent(cc.ToggleContainer);
        this.transitionToggleNode = this.mainToggleContainer.node.getChildByName("TransitionSpr");
        this.ELPShowBar = this.node.getChildByName("ELPShowBar");
        this.ActivityShowBar = this.node.getChildByName("ActivityShowBar");
        this.ActivityStartButton = this.ActivityShowBar.getChildByName("StartButton").getComponent(cc.Button);
    }

    start() {
        this.skinPart.active = false;
        this.boxSkinPart.active = false;
        this.contactNode.active = false;
        this.switchToWaitState();

        switch (config.platform) {
            case Platform.douYin:
                // this.Android_MoreGameBtn.node.active = false;
                // this.QQ_MoreGameBtn.node.active = false;
                // this.contactBtn.node.active = false;
                // let appName = tt.getSystemInfoSync().appName;
                // if (appName == "Douyin") {
                //     this.Douyin_AddDesktopBtn.node.active = true;
                //     this.signBtn.node.active = false;
                //     this.TikTokBtn.node.active = false;
                //     if (SdkTools.getInstance().isversionNewThanEngineVersion("1.68.0")) {
                //         this.signBtn.node.active = false;
                //         this.TikTokBtn.node.active = true;
                //         this.TikTokBtn.node.on("click", () => {
                //             console.log("点击关注抖音");
                //             tt.openAwemeUserProfile({
                //                 success: function (res) {
                //                     console.log('---- open success, res: ', res)
                //                     let { hasFollowed } = res;
                //                     tt.showToast({
                //                         title: `hasFollowed: ${hasFollowed}`,
                //                     });
                //                 },
                //                 fail: function (err) {
                //                     console.log('---- open fail, err: ', err)
                //                 },
                //                 complete: function (res) {
                //                     console.log('---- open complete, res: ', res)
                //                 }
                //             })
                //         });
                //     }
                //     else {
                //         console.log("抖音版本低于 1.68.0");
                //         this.signBtn.node.active = true;
                //         this.TikTokBtn.node.active = false;
                //     }

                // } else {
                //     console.log("LOCAL", "非抖音平台 不展示添加桌面按钮");
                //     this.Douyin_AddDesktopBtn.node.active = false;
                //     this.signBtn.node.active = true;
                //     this.TikTokBtn.node.active = false;
                //     this.achiBtn.node.setPosition(cc.v2(380, 400));
                //     this.achiBtn.node.getComponent(cc.Widget).top = 470;

                //     return;
                // }
                break;
            case Platform.android:
                // this.recBtn.node.active = false;
                // this.Android_MoreGameBtn.node.active = true;
                // this.Douyin_AddDesktopBtn.node.active = false;
                // this.QQ_MoreGameBtn.node.active = false;
                // this.signBtn.node.active = true;
                // this.TikTokBtn.node.active = false;
                // this.contactBtn.node.active = true;
                // this.achiBtn.node.setPosition(cc.v2(380, 400));
                // this.achiBtn.node.getComponent(cc.Widget).top = 470;
                // this.Android_MoreGameBtn.node.on("click", () => {
                //     ASCAd.getInstance().showOPPOMoreGame();
                // }, this)
                break;
            case Platform.oppo:
                this.recBtn.node.active = false;
                this.Android_MoreGameBtn.node.active = false;
                this.Douyin_AddDesktopBtn.node.active = false;
                this.signBtn.node.active = true;
                this.TikTokBtn.node.active = false;
                this.contactBtn.node.active = false;
                this.achiBtn.node.setPosition(cc.v2(380, 400));
                this.achiBtn.node.getComponent(cc.Widget).top = 470;
                this.QQ_MoreGameBtn.node.active = false;
                break;
            case Platform.vivo:
                this.recBtn.node.active = false;
                this.Android_MoreGameBtn.node.active = false;
                this.Douyin_AddDesktopBtn.node.active = false;
                this.signBtn.node.active = true;
                this.TikTokBtn.node.active = false;
                this.contactBtn.node.active = false;
                this.achiBtn.node.setPosition(cc.v2(380, 400));
                this.achiBtn.node.getComponent(cc.Widget).top = 470;
                this.QQ_MoreGameBtn.node.active = false;
                break;
            case Platform.ios:
                this.recBtn.node.active = false;
                this.Android_MoreGameBtn.node.active = false;
                this.Douyin_AddDesktopBtn.node.active = false;
                this.signBtn.node.active = true;
                this.TikTokBtn.node.active = false;
                this.contactBtn.node.active = false;
                this.achiBtn.node.setPosition(cc.v2(380, 400));
                this.achiBtn.node.getComponent(cc.Widget).top = 470;
                this.QQ_MoreGameBtn.node.active = false;
                break;
            case Platform.qq:
                // this.recBtn.node.active = false;
                // this.contactBtn.node.active = false;
                // this.Android_MoreGameBtn.node.active = false;
                // this.Douyin_AddDesktopBtn.node.active = false;
                // this.signBtn.node.active = true;
                // this.TikTokBtn.node.active = false;
                // this.QQ_MoreGameBtn.node.active = true;
                // this.QQ_MoreGameBtn.node.on("click", () => {
                //     if (ASCAd.getInstance().getBoxFlag()) {
                //         ASCAd.getInstance().showAppBox()
                //     } else {
                //         GameManager.getInstance().showMsgTip("盒子正在打包来的路上。。。")
                //     }
                // })
                break;
            default:
                this.recBtn.node.active = false;
                this.contactBtn.node.active = false;
                this.Android_MoreGameBtn.node.active = false;
                this.Douyin_AddDesktopBtn.node.active = false;
                this.QQ_MoreGameBtn.node.active = false;
                this.signBtn.node.active = true;
                this.TikTokBtn.node.active = false;
                this.achiBtn.node.setPosition(cc.v2(380, 400));
                this.achiBtn.node.getComponent(cc.Widget).top = 470;
                break;
        }

    }

    /**
     * 安卓 打开联系客服
     */
    onShowContact() {
        this.contactNode.active = true;
        if (cc.sys.platform === cc.sys.ANDROID) jsb.reflection.callStaticMethod("com/asc/sdk/SecActivity", "showContacts", "()V");
    }

    /**
     * 安卓 关闭联系客服
     */
    onCloseContact() {
        this.contactNode.active = false;
    }


    onAddDeskTop() {

        // ASCAd.getInstance().addDesktop((succes) => {
        //     if (succes) {
        //         GameManager.getInstance().showMsgTip("恭喜你， 添加桌面成功啦！")
        //     }
        //     else {
        //         GameManager.getInstance().showMsgTip("哎呀， 好像出现了一点小问题！")
        //     }
        // })
        cc.tween(this.Douyin_AddDesktopBtn.node.getChildByName("eft")).by(0.1, { angle: -35 }, { easing: cc.easing.sineOut })
            .to(0.1, { angle: -25 }).start()


    }
    onEnter() {
        super.onEnter();
        // ASCAd.getInstance().hideNavigateGroup();
        // ASCAd.getInstance().showNativeIcon(200, 200, cc.winSize.width * 0.083, cc.winSize.height * 1750 / 1920);
        // ASCAd.getInstance().getNavigateIconFlag() && ASCAd.getInstance()
        //     .showNavigateIcon(200, 200, cc.winSize.width * 900 / 1080, cc.winSize.height * 1650 / 1920);
    }
    onPause() {
        // ASCAd.getInstance().hideNavigateIcon();
        // ASCAd.getInstance().hideNativeIcon();
        // ASCAd.getInstance().hideNavigateGroup();
        this.node.pauseSystemEvents(true);
        this.node.zIndex = 0;
        this.onPauseCall && this.onPauseCall();
        console.log(this.node.name + ': onPause')
    }
    onResume() {
        super.onResume();
        // ASCAd.getInstance().showNativeIcon(200, 200, cc.winSize.width * 0.083, cc.winSize.height * 1750 / 1920);
        // ASCAd.getInstance().getNavigateIconFlag() && ASCAd.getInstance()
        //     .showNavigateIcon(200, 200, cc.winSize.width * 900 / 1080, cc.winSize.height * 1650 / 1920);
    }
    onExit() {
        super.onExit();
        // ASCAd.getInstance().hideNavigateIcon();
        // ASCAd.getInstance().hideNativeIcon();
    }
    /**
     * 创建歌曲单元
     * @param idx 
     */
    public createSongUnit(idx: number, callback: Function) {
        // 加载 Prefab
        if (this.songUnitPre) {
            let songUnit = PoolManager.instance.getNode(this.songUnitPre, this.songListScrollView.content);
            callback(songUnit);
        }
        else {
            let self = this;
            cc.resources.load("prefabs/Songunit", function (err, prefab: cc.Prefab) {
                self.songUnitPre = prefab;
                let songUnit = PoolManager.instance.getNode(self.songUnitPre, self.songListScrollView.content);
                callback(songUnit);
            });
        }

    }

    /**
     * 设置快速开始按钮的点击事件监听
     * @param callback 
    */
    setQuickStartBtnClickEvent(callback: Function) {
        this.quickStartBtn.node.on("click", callback, this);
    }

    /**
     * 快速开始按钮的世界坐标
     */
    getQuickStartBtnWorldPos() {
        let worldPos = this.quickStartBtn.node.convertToWorldSpaceAR(cc.v2(0, 0));
        return worldPos
    }

    /**
     * 设置快速开始歌曲名
     */
    setSongNameLabel(text: string) {
        // this.quickStartSongLabel.node.getComponent(LabelRoll).reset()
        this.quickStartSongLabel.string = text;
        this.scheduleOnce(() => {
            //  this.quickStartSongLabel.node.getComponent(LabelRoll).roll();
        }, 0.5)

    }

    /**
    * 设置快速开始歌曲的解锁状态名
    */
    setSongNameState(isUnlock: boolean, unlockType: string) {
        let diaBox = this.quickStartBtn.node.getChildByName("diaBox");
        let startBox = this.quickStartBtn.node.getChildByName("startBox");
        let defaultADBox = this.quickStartBtn.node.getChildByName("defaultADBox");
        let douyinADBox = this.quickStartBtn.node.getChildByName("douyinADBox");
        diaBox.active = false;
        startBox.active = false;
        defaultADBox.active = false;
        douyinADBox.active = false;
        if (isUnlock) {
            // this.quickStartBtn.getComponent(cc.Sprite).spriteFrame = this.quickStartSF;
            startBox.active = true;
        }
        else {
            if (unlockType == "video") {
                defaultADBox.active = config.platform != Platform.douYin;
                douyinADBox.active = config.platform == Platform.douYin;
            }
            else if (unlockType == "coin") {
                diaBox.active = true;
            }
        }

    }

    /**
    * 设置领取奖励枪时的事件监听
    * @param callback 
    */
    setZQVGunRewardGetBtn(callback: Function) {
        //this.ZQVGunRewardGetBtn.node.on("click", callback, this);
    }

    /**
     * 设置点击进入无尽模式活动页面的事件监听
     * @param callback 
     */
    setELPStartButton(callback: Function) {
        this.backupeELPBtn.node.on("click", callback, this);
    }

    /**
   * 设置点击进入活动页面的事件监听
   * @param callback 
   */
    setActivityStartButton(callback: Function) {
        this.ActivityStartButton.node.on("click", callback, this);
    }
    /**
     * 设置歌曲列表的左划动
     * @param callback 
     */
    setSongListLiftMove(callback: Function) {
        this.songListScrollView.node.on(cc.Node.EventType.TOUCH_MOVE, callback, this);
    }

    /**
     * 设置枪列表的右划动
     * @param callback 
     */
    setGunListRightMove(callback: Function) {
        this.gunskinListScrollView.node.on(cc.Node.EventType.TOUCH_MOVE, callback, this);
    }

    /**
     * 设置签到按钮的点击事件监听
     * @param callback 
     */
    setSignBtnClickEvent(callback: Function) {
        this.signBtn.node.on("click", () => {
            this.node.pauseSystemEvents(true);
            cc.tween(this.signBtn.node.getChildByName("eft")).by(0.1, { angle: -35 }, { easing: cc.easing.sineOut })
                .to(0.1, { angle: -25 })
                .call(() => {
                    this.node.resumeSystemEvents(true);
                    callback();
                }).start()
        }, this);
    }

    /**
   * 设置成就按钮的点击事件监听
   * @param callback 
   */
    setAchiBtnClickEvent(callback: Function) {
        this.achiBtn.node.on("click", () => {
            this.node.pauseSystemEvents(true);
            cc.tween(this.achiBtn.node.getChildByName("eft")).by(0.1, { angle: -35 }, { easing: cc.easing.sineOut })
                .to(0.1, { angle: -25 })
                .call(() => {
                    this.node.resumeSystemEvents(true);
                    callback();
                }).start()
        }, this);
    }

    /**
   * 设置录屏按钮的点击事件监听
   * @param callback 
   */
    setRecBtnClickEvent(callback: Function) {
        this.recBtn.node.on("click", () => {
            this.node.pauseSystemEvents(true);
            cc.tween(this.recBtn.node.getChildByName("eft")).by(0.1, { angle: -35 }, { easing: cc.easing.sineOut })
                .to(0.1, { angle: -25 })
                .call(() => {
                    this.node.resumeSystemEvents(true);
                    callback();
                }).start()
        }, this);
    }

    /**
     *切换到录制状态
     */
    switchToRecingState() {
        let spr = this.recBtn.node.getChildByName("Rec").getComponent(cc.Sprite);
        spr.spriteFrame = this.RecingSF;
        this.recBtn.node.getChildByName("eft").color = cc.color("#EC2F61")
    }

    /**
      *切换到等待录制状态
      */
    switchToWaitState() {

        let spr = this.recBtn.node.getChildByName("Rec").getComponent(cc.Sprite);
        let recTime = this.recBtn.node.getChildByName("RecTime").getComponent(cc.Label);
        spr.spriteFrame = this.waitRecSF;
        recTime.string = "";
        this.recBtn.node.getChildByName("eft").color = cc.color("#56D900")
    }

    /**
     * 更新录屏的时间
     */
    updateRecTime(timeStr: string) {
        let recTime = this.recBtn.node.getChildByName("RecTime").getComponent(cc.Label);
        recTime.string = timeStr;
    }

    /**
     *设置单选歌曲列表时的事件监听 
     * @param callback 
     */
    setSongToggleEvent(callback: Function) {
        this.mainToggleContainer.toggleItems[0].node.on("toggle", callback, this)
    }

    /**
       *设置单选皮肤商城时的事件监听 
       * @param callback 
       */
    setSkinToggleEvent(callback: Function, target?) {
        this.mainToggleContainer.toggleItems[1].node.on("toggle", callback, target)
    }

    /**
    *设置单选枪械皮肤时的事件监听 
    * @param callback 
    */
    setBoxSkinToggleEvent(callback: Function, target?) {
        this.mainToggleContainer.toggleItems[2].node.on("toggle", callback, target)
    }

    // /**
    //    *设置单选枪械皮肤时的事件监听 
    //    * @param callback 
    //    */
    // setGunSkinToggleEvent(callback: Function) {
    //     this.subToggleContainer.toggleItems[0].node.on("toggle", callback, this)
    // }

    // /**
    //  *设置单选地图皮肤列表时的事件监听 
    //  * @param callback 
    //  */
    // setMapSkinToggleEvent(callback: Function, target?) {
    //     this.subToggleContainer.toggleItems[1].node.on("toggle", callback, target)
    // }

    /**
     * 设置歌曲列表滚动时的事件监听
     * @param callback 
     */
    setSongListScrollViewScrolling(callback: Function) {
        this.songListScrollView.node.on("scrolling", callback, this);
    }

    /**
 * 设置歌曲列表滚动时的事件监听
 * @param callback 
 */
    setSongListScrollViewTouchup(callback: Function) {
        this.songListScrollView.node.on("touch-up", callback, this);
    }


    /**
     * 设置歌曲列表content的高度
     * @param callback 
     */
    setSongListScrollViewContentSizeY(value: number) {
        this.songListScrollView.content.height = value;
    }

    /**
     * 设置枪的皮肤列表content的高度
     */
    setGunSkinListScrollViewContentSizeY(value: number) {
        this.gunskinListScrollView.content.height = value;
    }

    /**
  * 设置方块的皮肤列表content的高度
  */
    setBoxSkinListScrollViewContentSizeY(value: number) {
        this.boxskinListScrollView.content.height = value;
    }

    /**
     * 创建枪皮肤单元
     */
    public createGunSkinUnit(callback) {
        // 加载 Prefab
        if (this.gunSkinUnitPre) {
            let gunSkinUnit = cc.instantiate(this.gunSkinUnitPre)
            this.gunskinListScrollView.content.addChild(gunSkinUnit)
            callback(gunSkinUnit);
        }
        else {
            let self = this;
            cc.resources.load("prefabs/GunSkinUnit", function (err, prefab: cc.Prefab) {
                self.gunSkinUnitPre = prefab
                let gunSkinUnit = cc.instantiate(self.gunSkinUnitPre)
                self.gunskinListScrollView.content.addChild(gunSkinUnit)
                callback(gunSkinUnit);
            });
        }
    }

    /**
    * 创建方块皮肤单元
    */
    public createBoxSkinUnit(callback) {
        // 加载 Prefab
        if (this.boxSkinUnitPre) {
            let boxSkinUnit = cc.instantiate(this.boxSkinUnitPre)
            this.boxskinListScrollView.content.addChild(boxSkinUnit)
            callback(boxSkinUnit);
        }
        else {
            let self = this;
            cc.resources.load("prefabs/BoxSkinUnit", function (err, prefab: cc.Prefab) {
                self.boxSkinUnitPre = prefab
                let boxSkinUnit = cc.instantiate(self.boxSkinUnitPre)
                self.boxskinListScrollView.content.addChild(boxSkinUnit)
                callback(boxSkinUnit);
            });
        }
    }
    /**
     * 打开歌曲列表
     */
    openSongListPart(toggle: cc.Toggle) {
        this.playToggleContainerClipEft();
        this.songListScrollView.node.active = toggle.isChecked;
        this.skinPart.active = !toggle.isChecked;
        this.boxSkinPart.active = !toggle.isChecked;
        let self = this;
        let ironDur = 0.2;
        let iron = this.mainToggleContainer.node.getChildByName("songVal").getChildByName("iron");
        let rotateTween = cc.tween().sequence(
            cc.tween().to(ironDur / 4, { angle: -20 }),
            cc.tween().to(ironDur / 2, { angle: 20 }),
            cc.tween().to(ironDur / 4, { angle: 0 }),
        )
        let calAct = function () {
            cc.tween(iron).sequence(
                cc.tween().parallel(
                    cc.tween().to(ironDur, { scale: 1.5 }, { easing: "cubicOut" }),
                    rotateTween
                ),
                cc.tween().parallel(
                    cc.tween().to(ironDur, { scale: 1 }, { easing: "cubicIn" }),
                    rotateTween
                ) ,
            ).start();
        }

        cc.tween(this.transitionToggleNode).sequence(
            cc.tween().to(toggle.duration * 4, { x: toggle.node.x }, { easing: "backInOut" }),
            cc.tween().call(calAct),
        ).start();
    }

    /**
    * 打开皮肤列表
    */
    openSkinShopPart(toggle: cc.Toggle) {
        this.songListScrollView.node.active = !toggle.isChecked;
        this.boxSkinPart.active = !toggle.isChecked;
        this.skinPart.active = toggle.isChecked;
        let ironDur = 0.2;
        let iron = this.mainToggleContainer.node.getChildByName("skinVal").getChildByName("iron");
        let rotateTween = cc.tween().sequence(
            cc.tween().to(ironDur / 4, { angle: -20 }),
            cc.tween().to(ironDur / 2, { angle: 20 }),
            cc.tween().to(ironDur / 4, { angle: 0 }),
        )
        let calAct = function () {
            cc.tween(iron).sequence(
                cc.tween().parallel(
                    cc.tween().to(ironDur, { scale: 1.5 }, { easing: "cubicOut" }),
                    rotateTween
                ),
                cc.tween().parallel(
                    cc.tween().to(ironDur, { scale: 1 }, { easing: "cubicIn" }),
                    rotateTween
                ) ,
            ).start();
        }

        cc.tween(this.transitionToggleNode).sequence(
            cc.tween().to(toggle.duration * 4, { x: toggle.node.x }, { easing: "backInOut" }),
            cc.tween().call(calAct),
        ).start();
    }

    /**
  * 打开方块皮肤列表
  */
    openBoxSkinShopPart(toggle: cc.Toggle) {
        this.songListScrollView.node.active = !toggle.isChecked;
        this.skinPart.active = !toggle.isChecked;
        this.boxSkinPart.active = toggle.isChecked;
        let self = this;
        let ironDur = 0.2;
        let iron = this.mainToggleContainer.node.getChildByName("boxSkinVal").getChildByName("iron");
        let rotateTween = cc.tween().sequence(
            cc.tween().to(ironDur / 4, { angle: -20 }),
            cc.tween().to(ironDur / 2, { angle: 20 }),
            cc.tween().to(ironDur / 4, { angle: 0 }),
        )
        let calAct = function () {
            cc.tween(iron).sequence(
                cc.tween().parallel(
                    cc.tween().to(ironDur, { scale: 1.5 }, { easing: "cubicOut" }),
                    rotateTween
                ),
                cc.tween().parallel(
                    cc.tween().to(ironDur, { scale: 1 }, { easing: "cubicIn" }),
                    rotateTween
                ) ,
            ).start();
        }

        cc.tween(this.transitionToggleNode).sequence(
            cc.tween().to(toggle.duration * 4, { x: toggle.node.x }, { easing: "backInOut" }),
            cc.tween().call(calAct),
        ).start();
    }
    /**
     * 打开枪械皮肤列表
     */
    openGunSkinPart(toggle: cc.Toggle) {
        this.gunSkinPart.active = toggle.isChecked;
        this.mapSkinPart.active = !toggle.isChecked;
    }

    /**
    * 打开地图皮肤列表
    */
    openMapSkinPart(toggle: cc.Toggle): cc.Node {

        this.mapSkinPart.active = toggle.isChecked;
        this.gunSkinPart.active = !toggle.isChecked;
        return this.mapSkinPart;
    }

    /**
     * 播放切换列表音效
     */
    playToggleContainerClipEft() {
        //  cc.audioEngine.play(this.switchClip, false, 0.7);
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.toggle);
    }


    /**
     * 打开签到按钮 “红点”
     */
    openSignBtnClickTip() {
        let ClickTip = this.signBtn.node.getComponent(BaseClickTip);
        PleaseClickSys.getInstance().pushClickTip(ClickTip, TipType.SignChip);
    }

    /**
     * 关闭签到按钮 “红点”
     */
    closeSignBtnClickTip() {
        let ClickTip = this.signBtn.node.getComponent(BaseClickTip);
        PleaseClickSys.getInstance().closeClickTip(ClickTip, TipType.SignChip);
    }

    /**
     * 打开成就按钮 “红点”
     */
    openAchiBtnClickTip() {
        let ClickTip = this.achiBtn.node.getComponent(BaseClickTip);
        PleaseClickSys.getInstance().pushClickTip(ClickTip, TipType.AchivChip);
    }

    /**
     * 关闭成就按钮 “红点”
     */
    closeAchiBtnClickTip() {
        let ClickTip = this.achiBtn.node.getComponent(BaseClickTip);
        PleaseClickSys.getInstance().closeClickTip(ClickTip, TipType.AchivChip);
    }


    // /**
    //  * 打开地图按钮 “红点”
    //  */
    // openMapToggleClickTip() {
    //     let ClickTip = this.mainToggleContainer.node.getComponent(BaseClickTip);
    //     // let subClickTip = this.subToggleContainer.node.getComponent(BaseClickTip);
    //     PleaseClickSys.getInstance().pushClickTip(ClickTip, TipType.MapChip);
    //     //  PleaseClickSys.getInstance().pushClickTip(subClickTip, TipType.MapChip);
    // }

    // /**
    //  * 关闭地图按钮 “红点”
    //  */
    // closeMapToggleClickTip() {
    //     // let ClickTip = this.mainToggleContainer.node.getComponent(BaseClickTip);
    //     // let subClickTip = this.subToggleContainer.node.getComponent(BaseClickTip);
    //     // PleaseClickSys.getInstance().closeClickTip(ClickTip, TipType.MapChip);
    //     // PleaseClickSys.getInstance().closeClickTip(subClickTip, TipType.MapChip);
    // }

    rollDown() {
        this.songListScrollView.scrollToBottom(4);
    }

    /**
     * 更新玩家收集到的月饼数
     */
    updateMoonTimeNum(val: string) {
        // let Numstr = "收集进度  " + val + "/" + CONSTANTS.ZQA_MinConvertMoonCakeNum;
        // this.ZQShowBar.getComponentInChildren(cc.Label).string = Numstr;
    }

    /**
     * 更新玩家收集到的月饼数
     */
    updateMoonTimeProBar(val: number, cal: Function) {
        // this.ZQVGetProgressBar.progress
        // cc.tween(this.ZQVGetProgressBar).to(val, { progress: val }, { easing: cc.easing.quadIn }).call(cal).start();

    }

    /**
     * 初始化中秋展示栏的状态
     * @param isEnough 月饼是否足够
     * @param isGet 奖励是否领取
     */
    initZQShowBar(isEnough: boolean, isGet: boolean) {
        // this.ZQVGunRewardGetBtn.node.active = false;
        // this.ZQVGunRewardGetedTip.active = false;
        // if (isGet) {
        //     console.log("枪械奖励已经领取！！");

        // }
        // else if (isEnough) {
        //     console.log("枪械奖励等待被领取！！");
        //   //  this.ZQVGunRewardGetBtn.node.active = true;
        // }
        // else {
        //     this.ZQVGunRewardGetBtn.node.active = false;
        // }
    }

    /**
     * 打开中秋奖励领取按钮
     */
    showZQVGunRewardGetBtn() {
        // this.ZQVGunRewardGetedTip.active = false;
        // this.ZQVGunRewardGetBtn.node.active = true;
    }

    /**
     * 打开中秋奖励领取成功提示
     */
    showZQVGunRewardGetedTip() {
        // this.ZQVGunRewardGetBtn.node.active = false;
        // this.ZQVGunRewardGetedTip.active = true;
    }

    /**
     * 展示中秋样式
     */
    ZQV_showActStyle() {
        // this.ZQShowBar.active = true;
        // this.songListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 430;
        // this.gunskinListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 430;
    }

    /**
     * 展示活动过后的样式
     */
    ZQV_showNormalStyle() {
        // this.ZQShowBar.active = false;
        // this.songListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 0;
        // this.gunskinListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 0;
    }

    /**
      * 展示无尽模式样式
      */
    ELP_showActStyle() {
        // this.ZQShowBar.active = false;
        this.ELPShowBar.active = true;
        this.songListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 370.00;
        this.gunskinListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 350.00;
    }

    /**
     * 展示活动过后的样式
     */
    ELP_showNormalStyle() {
        //  this.ZQShowBar.active = false;
        this.BackupeELPBtn.node.active = false;
        this.ELPShowBar.active = false;
        this.songListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 0;
        this.gunskinListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 0;
    }

    /**
      * 展示活动样式
      */
    showActStyle() {
        // this.ZQShowBar.active = false;
        this.ActivityShowBar.active = true;
        this.songListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 310.00;
        this.gunskinListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 300.00;
    }

    /**
     * 展示活动过后的样式
     */
    showNormalStyle() {
        //  this.ZQShowBar.active = false;
        this.ActivityShowBar.active = false;
        this.songListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 0;
        this.gunskinListScrollView.node.getChildByName("view").getComponent(cc.Widget).top = 0;
    }


}
