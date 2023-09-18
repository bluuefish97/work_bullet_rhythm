import BasePanel from "../../util/BasePanel";
import SongUnit from "./SongUnit";
import GameManager from "../../GameManager";
import config, { Platform } from "../../../config/config";
import { ClipEffectType } from "../../AudioEffectCtrl";
import { Utility } from "../../util/Utility";
import OppoNativePasterStyle from "../../util/OppoNativePasterStyle";
import AdController from "../../plugin/ADSdk/AdController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FinishPanel extends BasePanel {

    @property(cc.ParticleSystem)
    failPartice: cc.ParticleSystem = null;
    @property(cc.ParticleSystem)
    winPartice: cc.ParticleSystem = null;

    @property(cc.Button)
    showOppoNativeBtn: cc.Button = null;

    private box: cc.Node = null;
    private NormalSettle: cc.Node = null;
    private ELPSettle: cc.Node = null;
    private stars: cc.Node = null;
    private chipGetActEf: cc.Node = null;
    private scoreLabel: cc.Label = null;
    private mapChipLabel: cc.Label = null;
    private diaLabel: cc.Label = null;
    private homeBtn: cc.Button = null;
    private againBtn: cc.Button = null;
    private chipGetActEfsureBtn: cc.Button = null;
    private new_Btn: cc.Button = null;
    private old_Btn: cc.Button = null;
    private overNew_Btn: cc.Button = null;
    private shareRecBtn: cc.Button = null;
    public ADsongUnit: SongUnit = null;
    private QQ_MoreGameBtn: cc.Button = null;
    public ZQV_moonCakeSetteBox: cc.Node = null;
    private ZQV_moonCakeNumLabel: cc.Label = null;
    private ZQV_moonCakeProNumLabel: cc.Label = null;
    private ZQVGetProgressBar: cc.ProgressBar = null;
    private ZQVSure_Btn: cc.Button = null;

    private ELPTitle: cc.Node = null;
    private ELPNewRecordTip: cc.Node = null;
    private ELPScoreBox: cc.Node = null;
    private ELPPassBox: cc.Node = null;
    private ELPTimeBox: cc.Node = null;
    private ELPBeseComboBox: cc.Node = null;
    private ELPAgainButton: cc.Node = null;
    private ELPEft1: cc.Node = null;
    private ELPEft2: cc.Node = null;

    public Now_sure_node: cc.Node = null;   //当前亮的按钮 
    private nativeInfo: any = null;

    public isWin: boolean = false;

    public get AgainBtn(): cc.Button {
        return this.againBtn
    }
    public get NewBtn(): cc.Button {
        return this.new_Btn
    }
    public get OldBtn(): cc.Button {
        return this.old_Btn
    }
    public get OverNewBtn(): cc.Button {
        return this.overNew_Btn
    }

    /**
     * 进入结算页的次数
     */
    private enterTimer: number = 0;
    onLoad() {
        super.onLoad();
        this.box = this.node.getChildByName("box");
        this.homeBtn = this.box.getChildByName("Home_Btn").getComponent(cc.Button);

        this.NormalSettle = this.box.getChildByName("NormalSettle");
        this.againBtn = this.NormalSettle.getChildByName("Again_Btn").getComponent(cc.Button);
        this.new_Btn = this.NormalSettle.getChildByName("New_Btn").getComponent(cc.Button);
        this.old_Btn = this.NormalSettle.getChildByName("Old_Btn").getComponent(cc.Button);
        this.overNew_Btn = this.NormalSettle.getChildByName("OverNew_Btn").getComponent(cc.Button);
        this.stars = this.NormalSettle.getChildByName("Stars");
        this.ADsongUnit = this.NormalSettle.getChildByName("Songunit").getComponent(SongUnit);
        this.scoreLabel = this.NormalSettle.getChildByName("ScoreLabel").getComponent(cc.Label);
        this.diaLabel = this.NormalSettle.getChildByName("DiasLabel").getComponent(cc.Label);
        this.ZQV_moonCakeSetteBox = this.NormalSettle.getChildByName("MoonCakeSetteBox");
        this.ZQV_moonCakeNumLabel = this.ZQV_moonCakeSetteBox.getChildByName("SettleLabel").getComponent(cc.Label);
        this.ZQV_moonCakeProNumLabel = this.ZQV_moonCakeSetteBox.getChildByName("ProLabel").getComponent(cc.Label);
        this.ZQVGetProgressBar = this.ZQV_moonCakeSetteBox.getChildByName("GetProgressBar").getComponent(cc.ProgressBar);
        this.ZQVSure_Btn = this.ZQV_moonCakeSetteBox.getChildByName("SureBtn").getComponent(cc.Button);
        this.shareRecBtn = this.NormalSettle.getChildByName("ShareRecBtn").getComponent(cc.Button);
        this.QQ_MoreGameBtn = this.NormalSettle.getChildByName("QQMoreGameBoxBtn").getComponent(cc.Button);

        this.ELPSettle = this.node.getChildByName("ELPSettle");
        this.ELPEft1 = this.ELPSettle.getChildByName("eft1");
        this.ELPEft2 = this.ELPSettle.getChildByName("eft2");
        this.ELPTitle = this.ELPSettle.getChildByName("Title");
        this.ELPNewRecordTip = this.ELPSettle.getChildByName("NewRecordTip");
        this.ELPScoreBox = this.ELPSettle.getChildByName("ScoreBox");
        this.ELPPassBox = this.ELPSettle.getChildByName("PassBox");
        this.ELPTimeBox = this.ELPSettle.getChildByName("TimeBox");
        this.ELPBeseComboBox = this.ELPSettle.getChildByName("BeseComboBox");
        this.ELPAgainButton = this.ELPSettle.getChildByName("AgainButton");
    }

    start() {

        this.setcloseMoonSettleBoxClickEvent();
        this.QQ_MoreGameBtn.node.active = false;
    }

    onEnter() {
        super.onEnter();
        if ((cc.winSize.height / cc.winSize.width) > 1.78) {
            this.box.y = 0
        }
        else {
            this.box.y = -150
        }
        AdController.instance.AdSDK.showInters();

        this.checkIsHasNativeAD(false);
    }

    /**
     * 检测是否有原生广告
     */
    checkIsHasNativeAD(info) {
        console.log("info========================", info);
        // this.showOppoNativeBtn.node.active = info;
        // if (info) {
        //     this.Now_sure_node.setPosition(cc.v2(250, -150));
        //     this.againBtn.node.active = false;
        //     this.showOppoNativeBtn.node.active = true;
        // } else {
        //     this.Now_sure_node.setPosition(cc.v2(0, -150));
        //     this.againBtn.node.active = true;
        //     this.showOppoNativeBtn.node.active = false;
        // }
        this.Now_sure_node.setPosition(cc.v2(0, -20));
        this.againBtn.node.active = true;
        this.showOppoNativeBtn.node.active = false;
    }

    onShowOppoNative() {
      
    }

    onPause() {
        this.node.zIndex = 0;
        this.onPauseCall && this.onPauseCall();
        console.log(this.node.name + ': onPause')
    }
    onExit() {
        super.onExit();
        this.failPartice.stopSystem();
        this.winPartice.stopSystem();
        this.showShareRecBtn(false);
    }

    onDestroy() {
    }
    /**
     * 设置关闭按钮点击事件监听
     */
    setHomeBtnClickEvent(callback: Function, targert?) {
        this.homeBtn.node.on("click", callback, targert);
    }
    /**
    * 设置再次挑战按钮点击事件监听
    */
    setAgainBtnClickEvent(callback: Function, targert?) {
        this.againBtn.node.on("click", callback, targert);
    }
    /**
    * 设置解锁新音乐点击事件监听
    */
    setNewBtnClickEvent(callback: Function, targert?) {
        this.new_Btn.node.on("click", callback, targert);
    }

    /**
    * 设置开始旧音乐点击事件监听
    */
    setOldBtnClickEvent(callback: Function, targert?) {
        this.old_Btn.node.on("click", callback, targert);
    }

    /**
    * 设置全部音乐都解锁后点击事件监听
    */
    setOverNewBtnClickEvent(callback: Function, targert?) {
        this.overNew_Btn.node.on("click", callback, targert);
    }

    /**
     * 设置分享录屏按钮点击事件监听
     */
    setShareRecBtnClickEvent(callback: Function, targert?) {
        this.shareRecBtn.node.on("click", callback, targert);
    }

    /**
     * 设置关闭月饼结束页面按钮点击事件监听
     */
    setcloseMoonSettleBoxClickEvent() {
        this.ZQVSure_Btn.node.on("click", () => {
            this.ZQV_moonCakeSetteBox.active = false;
        }, this);
    }

    /**
     * 设置星星的显示
     */
    setStarsLight(val: number) {
        console.log("点亮的星星数     " + val);
        for (let i = 1; i <= this.stars.childrenCount / 2; i++) {
            let temp = i * 2;
            if (i <= val) {
                this.stars.children[temp - 1].opacity = 255;
                this.starLightShow(this.stars.children[temp - 1], (i - 1) * 0.2);
            }
            else {
                this.stars.children[temp - 1].opacity = 0;
            }

        }
    }

    /**
    * 星星点亮动画
    */
    private starLightShow(node: cc.Node, delayTime: number) {
        let iron = node.getChildByName("iron")
        node.opacity = 255;
        iron.stopAllActions();
        iron.scale = 0;
        iron.angle = 0;
        iron.opacity = 0
        let dur = 0.5;
        let scaleAct = cc.tween(iron).to(dur / 2, { scale: 1.3 })
            .to(dur / 2, { scale: 1 })
        let rotateAct = cc.tween(iron).to(dur, { angle: 90, opacity: 255 });
        this.scheduleOnce(() => {
            console.log("播放星星音频！");
            //  cc.audioEngine.play(this.finishStarClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.finishStar);
            node.getComponentInChildren(cc.ParticleSystem).resetSystem()
            cc.tween(iron).parallel(scaleAct, rotateAct).start();
        }, delayTime);
    }

    /**
     * 设置分数的显示
     */
    setScoreLabelShow(val: number) {
        this.scoreLabel.string = val.toString();
    }

    /**
    * 设置地图碎片数的显示
    */
    setMapChipLabelShow(val: number) {
        this.mapChipLabel.string = "+ " + val.toString();
    }


    /**
    * 设置钻石数的显示
    */
    setDiaLabelShow(val: number) {
        this.diaLabel.string = "+ " + val.toString();
    }

    /**
     * ADsongUnit设置是否显示
     */
    switchADsongUnitShow(ison: boolean) {
        this.ADsongUnit.node.active = ison;
    }


    /**
    *显示挑战新音乐
    */
    showNextBtn() {
        this.againBtn.node.active = false;
    }

    /**
 * 失败粒子显示
 */
    public failPartShow() {
        this.failPartice.resetSystem();
    }
    /**
     * 胜利粒子显示
     */
    public winPartShow() {
        this.winPartice.resetSystem();
    }

    /**
     * 更新玩家收集到的月饼数
     */
    updateMoonTimeNum(timeStr: string) {
        this.ZQV_moonCakeNumLabel.string = timeStr;
    }

    /**
    * 更新玩家收集到的月饼数总进度
    */
    updateMoonCakeNumProLabel(prostr: string) {
        this.ZQV_moonCakeProNumLabel.string = prostr;
    }

    /**
    * 更新玩家收集到的月饼数
    */
    updateMoonTimeProBar(val: number, cal: Function) {
        cc.tween(this.ZQVGetProgressBar).stop();
        this.ZQVGetProgressBar.progress = 0;
        cc.tween(this.ZQVGetProgressBar).to(val, { progress: val }, { easing: cc.easing.quadIn }).call(cal).start();
    }


    /**
     * 打开月饼数收集页面
     */
    openMoonCakeCollectBox(cb: Function) {
        this.ZQV_moonCakeSetteBox.active = true;
        this.ZQVSure_Btn.node.active = false;
        cb();
    }

    /**
    * 关闭月饼数收集页面
    */
    closeMoonCakeCollectBox() {
        this.ZQV_moonCakeSetteBox.active = false;
    }

    /**
     * 是否显示分享录屏按钮
     */
    showShareRecBtn(isShow: boolean) {
        this.shareRecBtn.node.active = isShow;
    }

    /**
   * 显示关闭月饼结算按钮
   */
    shareZQVSure_BtnShowAct() {
        let node = this.ZQVSure_Btn.node;
        node.active = true;
        node.stopAllActions();
        node.opacity = 0
        node.y = -550;
        cc.tween(node).to(0.5, { y: -250, opacity: 255 }).call(() => {
            node.active = true;
        }).start();
    }

    /**
     * 显示正常模式的结算界面
     */
    public showNormalSettle() {
        this.NormalSettle.active = true;
        this.ELPSettle.active = false;
    }
    /**
  * 显示无尽模式的结算界面
  */
    public showELPSettle(isNewRec: boolean) {
        this.NormalSettle.active = false;
        this.ELPSettle.active = true;
        this.ELPNewRecordTip.active = false;
        this.ELPSettleShowAct(isNewRec);
    }

    /**
     * 无尽模式结算页动画
     */
    private ELPSettleShowAct(isNewRec) {
        this.ELPAgainButton.scale = 0;
        this.ELPNewRecordTip.active = isNewRec;
        this.ELPTitle.active = !isNewRec;
        let title = isNewRec ? this.ELPNewRecordTip : this.ELPTitle;
        title.scale = 0;

        this.homeBtn.node.active = false;
        this.ELPEft1.scaleX = 0;
        this.ELPEft2.scaleX = 0;
        this.ELPPassBox.x = cc.winSize.width;
        this.ELPTimeBox.x = cc.winSize.width;
        this.ELPBeseComboBox.x = cc.winSize.width;


        let tween0 = () => {
            cc.tween(title).to(0.2, { scale: 1.3 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut }).start();

        }
        let tween1 = () => {
            cc.tween(this.ELPEft1).to(0.2, { scaleX: 1 }).call(tween2).start();
            cc.tween(this.ELPEft2).to(0.2, { scaleX: 1 }).call(tween2).start();
        }
        let tween2 = () => {
            cc.tween(this.ELPPassBox).to(0.2, { x: -17.686 }).delay(0.1).call(tween3).start();
        }
        let tween3 = () => {
            cc.tween(this.ELPTimeBox).to(0.2, { x: 36.611 }).delay(0.1).call(tween4).start();
        }
        let tween4 = () => {
            cc.tween(this.ELPBeseComboBox).to(0.2, { x: 90 }).delay(0.1).call(tween5).start();
        }
        let tween5 = () => {
            cc.tween(this.ELPAgainButton).to(0.2, { scale: 1.3 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut }).call(() => { this.homeBtn.node.active = true }).start();
        }
        tween0();
        tween1();


    }


    // /**
    //  * ELP显示新记录标识
    //  */
    // public showNewRecordTip() {
    //     this.ELPNewRecordTip.active = true;
    //     this.ELPTitle.active = false;
    //     cc.tween(this.ELPNewRecordTip).to(0.2, { scale: 1.3 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut }).start();
    // }

    /**
     * ELP设置分数的显示
     */
    setELPScoreBoxLabelShow(val: number) {
        Utility.addScoreAnim(0, val, 0.01, (val) => { this.ELPScoreBox.getComponentInChildren(cc.Label).string = val.toString(); }, this);

    }
    /**
 * ELP设置关卡数的显示
 */
    setELPPassBoxLabelShow(val: number) {
        this.ELPPassBox.getComponentInChildren(cc.Label).string = "轻松闯过" + val.toString() + "关";
    }


    /**
     * ELP设置存活时间的显示
     */
    setELPTimeBoxLabelShow(val: number) {
        this.ELPTimeBox.getComponentInChildren(cc.Label).string = "生存时间 " + val.toString() + "秒";
    }
    /**
     * ELP设置最高连击的显示
     */
    setELPBeseComboBoxLabelShow(val: number) {
        this.ELPBeseComboBox.getComponentInChildren(cc.Label).string = "最高连击 " + val.toString();
    }
    /**
     * ELP设置无尽模式再次挑战按钮点击事件监听
     */
    setELPAgainButtonClickEvent(callback: Function, targert?) {
        this.ELPAgainButton.on("click", callback, targert);
    }
}
