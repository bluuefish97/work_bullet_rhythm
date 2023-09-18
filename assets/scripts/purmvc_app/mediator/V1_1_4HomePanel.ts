import BasePanel from "../../util/BasePanel";
import AdController from "../../plugin/ADSdk/AdController";
import config, { Platform } from "../../../config/config";
import { Utility } from "../../util/Utility";
import { MediatorDefine } from "./mediatorDefine";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { CoinPartMediator } from "./CoinPartMediator";
import { V1_1_4HasPowerPartMediator } from "./V1_1_4HasPowerPartMediator";
import { ClipEffectType } from "../../AudioEffectCtrl";
import GameManager from "../../GameManager";
import { ReportAnalytics } from "../../plugin/reportAnalytics";

const remoteExpainImgUrl: string = "https://tencentcnd.minigame.xplaymobile.com/Zhangqiang/zdjz/V1_1_4ActivityRemotes/explainImg.png"
const remoteOPPOExpainImgUrl: string = "https://tencentcnd.minigame.xplaymobile.com/Zhangqiang/zdjz/V1_1_4ActivityRemotes/explainImg_oppo.png"

const rewardExpainStr: Array<string> = ["小米play音响", "小米智能手环", "精美手办"];
//["智能蓝牙音响", "小米智能手环", "精美手办", "超强充电宝", "卡哇伊玩偶"];
const { ccclass, property } = cc._decorator;
 
@ccclass
export default class V1_1_4HomePanel extends BasePanel {

    @property(cc.Node)
    private ExpainContent: cc.Node = null;
    // @property(cc.SpriteFrame)
    // private oppoSpr: cc.SpriteFrame = null;


    @property(cc.Prefab)
    private PlayerRankPref: cc.Prefab = null;             //玩家排名对象

    @property(cc.Prefab)
    private ConstellationRankPref: cc.Prefab = null;       //星座对象
    @property(cc.Node)
    private ExpainPanel: cc.Node = null;

    @property(cc.Node)
    private explainButton: cc.Node = null;


    @property(cc.Node)
    public FirstRank: cc.Node = null;
    @property(cc.Node)
    public SecondRank: cc.Node = null;
    @property(cc.Node)
    public thirdlyRank: cc.Node = null;

    @property(cc.SpriteFrame)
    quickStartSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    quickStartADSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    quickStartdiaSF: cc.SpriteFrame = null;

    @property(cc.Node)
    public firstNameLabels: cc.Node = null;
    @property(cc.Node)
    public secondNameLabels: cc.Node = null;
    @property(cc.Node)
    public thirdlyNameLabels: cc.Node = null;
    @property(cc.Node)
    public fourthlyNameLabels: cc.Node = null;
    @property(cc.Node)
    public fifthNameLabels: cc.Node = null;


    private box: cc.Node = null;
    private closeButton: cc.Button = null;
    private startPlayButton: cc.Button = null;
    private LookWinnerListButton: cc.Button = null;

    private userNode: cc.Node = null;
    private userHeadIron: cc.Sprite = null;
    private userNameLabel: cc.Label = null;
    private userRankingLabel: cc.Label = null;
    private userFilledPowerLabel: cc.Label = null;        //玩家总的充能数显示
    private userFillOnePowersLabel: cc.Label = null;           //玩家单个星座的充能数显示
    private PlaySongNameLabel: cc.Label = null;            //玩家快速歌曲的歌曲名


    // private userHaveSumPowersLabel: cc.Label = null;     //玩家本地拥有的能量数显示

    private RankToggleContainer: cc.ToggleContainer = null;
    private ConstellationRankToggle: cc.Toggle = null;
    private PlayerRankToggle: cc.Toggle = null;
    public PlayerRankScrollView: cc.ScrollView = null;
    public PlayerRankTopContent: cc.Node = null;
    public PlayerRankSubContent: cc.Node = null;
    public ConstellationRank: cc.Node = null;

    private touchGuidance: cc.Node = null;

    private titleConstellation: cc.Node = null;
    private titlePlayerRank: cc.Node = null;


    private SetWinnderInfoNode: cc.Node = null;
    private SetWinnderBox: cc.Node = null;
    private trueNameEditBox: cc.EditBox = null;
    private phoneEditBox: cc.EditBox = null;
    private addressEditBox: cc.EditBox = null;
    private winnderInfoSureBtn: cc.Button = null;
    private winnderInfoCloseBtn: cc.Button = null;
    private OpenWinnerSetButton: cc.Button = null;
    private RewardIron: cc.Sprite = null;
    private RewardLabel: cc.Label = null;
    private BestConstellationTip: cc.Node = null;
    private BestConstellationexplainLabel: cc.Label = null;     //最强星座的说明
    private BestConstellationSubExplainLabel: cc.Label = null;     //最强星座的次说明
    private BestConstellationSureBtn: cc.Button = null;            //最强星座确定按钮

    private WinnerListNode: cc.Node = null;
    private WinnerListNodeBox: cc.Node = null;
    private NameListInfoNodeCloseButton: cc.Button = null;

    private TouchTip: cc.Node = null;
    private loginTip: cc.Node = null;
    private AuthorizedTip: cc.Node = null;
    public authorizedEnsurePanel: cc.Node = null;



    public get LookWinnerNode(): cc.Node {
        return this.LookWinnerListButton.node;
    }

    public get OpenWinnerSetButtonNode(): cc.Node {
        return this.OpenWinnerSetButton.node;
    }


    onExit() {
        super.onExit()
        console.log("V1_1_4HomePanel  退出");
    }

    onLoad() {
        super.onLoad();
        this.box = this.node.getChildByName("Box")
        this.closeButton = this.box.getChildByName("CloseButton").getComponent(cc.Button);
        this.startPlayButton = this.box.getChildByName("StartPlayButton").getComponent(cc.Button);
        this.LookWinnerListButton = this.box.getChildByName("LookWinnerListButton").getComponent(cc.Button);
        this.OpenWinnerSetButton = this.box.getChildByName("OpenWinnerSetButton").getComponent(cc.Button);

        this.userNode = this.box.getChildByName("UserNode");
        this.userHeadIron = this.userNode.getChildByName("UserHeadIron").getComponent(cc.Sprite);
        this.userNameLabel = this.userNode.getChildByName("UserNameLabel").getComponent(cc.Label);
        this.userRankingLabel = this.userNode.getChildByName("UserRankingLabel").getComponent(cc.Label);
        this.userFilledPowerLabel = this.userNode.getChildByName("UserFilledPowerLabel").getComponent(cc.Label);
        this.userFillOnePowersLabel = this.userNode.getChildByName("UserOnePowerNumLabel").getComponent(cc.Label);
        this.PlaySongNameLabel = this.box.getChildByName("PlaySongName").getComponentInChildren(cc.Label);
        this.TouchTip = this.box.getChildByName("Tip");
        this.loginTip = this.TouchTip.getChildByName("LoginTip");
        this.AuthorizedTip = this.TouchTip.getChildByName("AuthorizedTip");
        this.authorizedEnsurePanel = this.box.getChildByName("authorizedEnsurePanel");


        this.RankToggleContainer = this.box.getChildByName("RankToggleContainer").getComponent(cc.ToggleContainer);
        this.ConstellationRankToggle = this.RankToggleContainer.node.getChildByName("ConstellationRankToggle").getComponent(cc.Toggle);
        this.PlayerRankToggle = this.RankToggleContainer.node.getChildByName("PlayerRankToggle").getComponent(cc.Toggle);
        this.PlayerRankScrollView = this.box.getChildByName("PlayerRankScrollView").getComponent(cc.ScrollView)
        this.PlayerRankTopContent = this.PlayerRankScrollView.content.getChildByName("TopContent")
        this.PlayerRankSubContent = this.PlayerRankScrollView.content.getChildByName("SubContent")

        this.titleConstellation = this.RankToggleContainer.node.getChildByName("titleConstellation")
        this.titlePlayerRank = this.RankToggleContainer.node.getChildByName("titlePlayerRank")


        this.SetWinnderInfoNode = this.node.getChildByName("SetWinnderInfoNode");
        this.SetWinnderBox = this.SetWinnderInfoNode.getChildByName("box");
        this.trueNameEditBox = this.SetWinnderBox.getChildByName("trueNameEditBox").getComponent(cc.EditBox);
        this.phoneEditBox = this.SetWinnderBox.getChildByName("phoneEditBox").getComponent(cc.EditBox);
        this.addressEditBox = this.SetWinnderBox.getChildByName("addressEditBox").getComponent(cc.EditBox);
        this.winnderInfoSureBtn = this.SetWinnderBox.getChildByName("SureButton").getComponent(cc.Button);
        this.winnderInfoCloseBtn = this.SetWinnderBox.getChildByName("closeButton").getComponent(cc.Button);
        this.RewardIron = this.SetWinnderBox.getChildByName("RewardIron").getComponent(cc.Sprite);
        this.RewardLabel = this.SetWinnderBox.getChildByName("RewardLabel").getComponent(cc.Label);


        this.ConstellationRank = this.box.getChildByName("ConstellationRankScrollView").getComponent(cc.ScrollView).content;
        this.touchGuidance = this.node.getChildByName("touchGuidance");
        this.touchGuidance.active = false

        this.BestConstellationTip = this.node.getChildByName("BestConstellationTip");
        this.BestConstellationexplainLabel = this.BestConstellationTip.getChildByName("box").getChildByName("BestConstellationexplainLabel").getComponent(cc.Label);
        this.BestConstellationSubExplainLabel = this.BestConstellationTip.getChildByName("box").getChildByName("BestConstellationSubExplainLabel").getComponent(cc.Label);
        this.BestConstellationSureBtn = this.BestConstellationTip.getChildByName("box").getChildByName("SureButton").getComponent(cc.Button);

        this.WinnerListNode = this.node.getChildByName("NameListInfoNode");
        this.WinnerListNodeBox = this.WinnerListNode.getChildByName("box");
        this.NameListInfoNodeCloseButton = this.WinnerListNode.getChildByName("SureButton").getComponent(cc.Button);
    }

    onEnter() {
        super.onEnter();
        AdController.instance.AdSDK.hideBanner();
    }

    onPause() {
        this.node.pauseSystemEvents(true);
        this.node.zIndex = 0;
        this.onPauseCall && this.onPauseCall();
        console.log(this.node.name + ': onPause')
    }

    start() {
        // if (config.platform != Platform.douYin) {
        //     this.explainButton.active = false;
        // }
    }



    /**
     * 设置关闭按钮点击事件监听
     */
    public setCloseBtnClickEvent(callback: Function) {
        this.closeButton.node.on("click", callback, this);
    }
    /**
    * 设置开始挑战按钮点击事件监听
    */
    public setStartPlayButtonClickEvent(callback: Function) {
        this.startPlayButton.node.on("click", callback, this);
    }

    /**
   * 设置最强星座星座界面关闭按钮点击事件监听
   */
    public setConstellationSureBtnClickEvent(callback: Function) {
        this.BestConstellationSureBtn.node.on("click", callback, this);
    }

    /**
     * 设置最强星座的说明
     */
    setBestConstellationexplainLabel(text: string) {
        let str = "恭喜" + text + "获得女神的嘉奖!";
        this.BestConstellationexplainLabel.string = str;
        let substr = "(" + text + "定制皮肤正精心制作中, 敬请期待吧! )";
        this.BestConstellationSubExplainLabel.string = substr;
    }
    /**
     * 设置快速开始歌曲名
     */
    setSongNameLabel(text: string) {
        this.PlaySongNameLabel.string = text;
    }
    /**
     * 快速开始按钮的世界坐标
     */
    getQuickStartBtnWorldPos() {
        let worldPos = this.startPlayButton.node.convertToWorldSpaceAR(cc.v2(0, 0));
        return worldPos
    }
    /*
    *
    */
    public set ClickEvent(callback: Function) {
        this.startPlayButton.node.on("click", callback, this);
    }



    /**
* 设置查看获奖名单按钮点击事件监听
*/
    public setLookWinnerListButtonClickEvent(callback: Function) {
        this.LookWinnerListButton.node.on("click", callback);
    }

    /**
     * 设置获奖名单确定按钮点击事件监听
     */
    public setNameListCloseBtnClickEvent(callback: Function) {
        this.NameListInfoNodeCloseButton.node.on("click", callback, this);
    }


    /**
    * 设置登陆按钮点击事件监听
    */
    public setloginTipClickEvent(callback: Function) {
        this.loginTip.on("click", callback, this);
    }
    /**
    * 设置授权按钮点击事件监听
    */
    public setAuthorizedTipClickEvent(callback: Function) {
        this.AuthorizedTip.on("click", callback, this);
    }
    /**
* 设置授权刷新按钮点击事件监听
*/
    public setRefreshAuthorizeClickEvent(callback: Function) {
        this.authorizedEnsurePanel.getComponentInChildren(cc.Button).node.on("click", callback, this);
    }


    /**
     * 设置星座榜 单选事件监听
     */
    public setConstellationRankToggleEvent(callback: Function, target) {
        let localCallback = (tog) => {
            this.titlePlayerRank.color = new cc.color("#2F97FF");
            this.titleConstellation.color = new cc.color("#FFFFFF");
            callback(tog);
        }
        this.ConstellationRankToggle.node.on("toggle", localCallback, target);
    }

    /**
     * 设置玩家充能榜  单选事件监听
     */
    public setPlayerRankToggleEvent(callback: Function, target) {
        let localCallback = (tog) => {
            this.titlePlayerRank.color = new cc.color("#FFFFFF")
            this.titleConstellation.color = new cc.color("#2F97FF")
            callback(tog);
        }
        this.PlayerRankToggle.node.on("toggle", localCallback, target);
    }

    /**
     * 设置榜单滑动事件监听
     */
    public setRankScrollViewScrollEvent(callback: Function, target) {
        this.PlayerRankScrollView.node.on("scrolling", callback, target);
    }

    /**
     * 设置获奖信息确定按钮点击事件监听
     */
    public setWinnderInfoSureBtnClickEvent(callback: Function) {
        this.winnderInfoSureBtn.node.on("click", callback, this);
    }

    /**
     * 是否打开获奖信息填写按钮
     */
    public isShowOpenWinnerSetBtn(isShow: boolean) {
        this.OpenWinnerSetButton.node.active = isShow;
    }

    /**
     * 设置获奖信息面板打开按钮点击事件监听
     */
    public setOpenWinnerSetBtnClickEvent(callback: Function) {
        this.OpenWinnerSetButton.node.on("click", callback, this);
    }
    /**
    * 设置获奖信息关闭按钮点击事件监听
    */
    public setWinnderInfoCloseBtnClickEvent(callback: Function) {
        this.winnderInfoCloseBtn.node.on("click", callback, this);
    }
    /**
     * 设置用户名显示
     */
    public setUserNameLabel(str: string) {
        let tempStr = str;
        if (str && str.length > 5) {
            let n = str.slice(0, 5);
            tempStr = n + "..."
        }
        else {
            tempStr = str
        }
        this.userNameLabel.string = tempStr;
    }

    /**
   * 设置快速开始歌曲的解锁状态名
   */
    setSongNameState(isUnlock: boolean, unlockType: string) {
        if (isUnlock) {
            this.startPlayButton.getComponentInChildren(cc.Sprite).spriteFrame = this.quickStartSF;
        }
        else {
            //this.startPlayButton.getComponentInChildren(cc.Sprite).spriteFrame = this.quickStartADSF;
            if (unlockType == "video") {
                this.startPlayButton.getComponentInChildren(cc.Sprite).spriteFrame = this.quickStartADSF;
            }
            else if (unlockType == "coin") {
                this.startPlayButton.getComponentInChildren(cc.Sprite).spriteFrame = this.quickStartdiaSF;
            }
        }

    }

    /**
     * 设置用户头像显示
     */
    public setUserHeadIron(str: string) {
        let remoteUrl = str;
        let image = new Image();
        image.onload = () => {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            this.userHeadIron.spriteFrame = new cc.SpriteFrame(texture);
        }
        image.onerror = error => {
        };
        image.src = remoteUrl;
    }

    /**
  * 设置玩家总的充能数显示
  */
    public setUserFilledPowerLabel(str: string) {
        if (!isNaN(parseFloat(str))) {
            str = Utility.formatNumber(str);
        }
        this.userFilledPowerLabel.string = str;
    }

    /**
  * 
  * 设置用户排名显示
  */
    public setUserRankingLabel(str: string) {

        if (!isNaN(parseFloat(str))) {
            str = Utility.formatNumber(str);
        }
        this.userRankingLabel.string = str;
    }

    /**
    * 
    * 设置用户为某个星座所充能的全部能量
    */
    public setUserFillOnePowersLabel(namestr: string, num: number) {
        let ChineseName = "";
        switch (namestr) {
            case "aries":
                ChineseName = "白羊座"
                break;
            case "taurus":
                ChineseName = "金牛座"
                break;
            case "gemini":
                ChineseName = "双子座"
                break;
            case "cancer":
                ChineseName = "巨蟹座"
                break;
            case "leo":
                ChineseName = "狮子座"
                break;
            case "virgo":
                ChineseName = "处女座"
                break;
            case "libra":
                ChineseName = "天秤座"
                break;
            case "scorpio":
                ChineseName = "天蝎座"
                break;
            case "sagittarius":
                ChineseName = "射手座"
                break;
            case "capricorn":
                ChineseName = "摩羯座"
                break;
            case "aquarius":
                ChineseName = "水瓶座"
                break;
            case "pisces":
                ChineseName = "双鱼座"
                break;
            default:
                break;
        }
        this.userFillOnePowersLabel.string = "我已为" + ChineseName + "充能" + num;
    }

    /**
     * 默认选中星座榜
     */
    public defaultRankToggle() {
        this.ConstellationRankToggle.check();
    }




    /**
     * 打开获奖信息填写页面
     */
    public openSetWinnderInfoNode() {
        this.SetWinnderInfoNode.active = true;
        cc.tween(this.SetWinnderBox).to(0.2, { scale: 1.1 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut }).start();
    }

    /**
     * 监听用户真实姓名填写
     */
    public editTrueNameEditBox(cal) {
        this.trueNameEditBox.node.on("editing-did-ended", () => {
            cal(this.trueNameEditBox.string)
        })
    }
    /**
    * 监听用户电话号码填写
    */
    public editPhoneEditBox(cal) {
        this.phoneEditBox.node.on("editing-did-ended", () => {
            cal(this.phoneEditBox.string)
        })
    }
    /**
    * 监听用户地址填写
    */
    public editAddressEditBox(cal) {
        this.addressEditBox.node.on("editing-did-ended", () => {
            cal(this.addressEditBox.string)
        })
    }

    /**
     * 关闭获奖信息填写页面
     */
    public closeSetWinnderInfoNode() {
        this.SetWinnderInfoNode.active = false;
    }

    /**
     * 显示星座能量模块
     */
    public ShowConstellationRank() {
        // this.LookWinnerListButton.node.active = false;
        this.PlayerRankScrollView.node.active = false;
        this.ConstellationRank.active = true;
    }



    /**
     * 显示玩家排行模块
     */
    public ShowPlayerRank() {
        // this.LookWinnerListButton.node.active = false;
        this.PlayerRankScrollView.node.active = true;
        this.ConstellationRank.active = false;
    }


    /**
     * 显示活动进行时的UI
     */
    public ShowPlayingState() {
        this.LookWinnerListButton.node.active = false;

        this.startPlayButton.node.active = true;
    }

    /**
     * 显示活动结算时的UI
     */
    public ShowPlaySettleState() {
        this.LookWinnerListButton.node.active = true;
        this.startPlayButton.node.active = false;
    }

    /**
    * 打开获奖名单显示页面
    */
    public openNameListInfoNode() {
        this.WinnerListNode.active = true;
        cc.tween(this.WinnerListNodeBox).to(0.2, { scale: 1.02 }).to(0.2, { scale: 1 }, { easing: cc.easing.sineOut }).start();
    }

    /**
     * 关闭获奖名单显示页面
     */
    public closeNameListInfoNode() {
        this.WinnerListNode.active = false;
    }
    /**
     * 设置男生获奖名单Label显示
     */
    public setNameListLabel(Marr: Array<any>, Warr: Array<any>) {
        // console.log("男生获奖名单为:" + Marr);
        // Marr.forEach((item, index) => {
        //     let temp = Utility.cutOffStr(item.name);
        //     this.MWinnerListNode.children[index].getComponent(cc.Label).string = temp;
        // })
        // console.log("女生获奖名单为:" + Warr);
        // Warr.forEach((item, index) => {
        //     let temp = Utility.cutOffStr(item.name);
        //     this.WWinnerListNode.children[index].getComponent(cc.Label).string = temp;
        // })
    }

    /**
     * 创造若干个玩家排名信息
     */
    public createSubPlayerRankItem(cal: Function) {
        let node = cc.instantiate(this.PlayerRankPref);
        node.setParent(this.PlayerRankSubContent);
        cal(node);
    }

    /**
    * 创造星座模块
    */
    public createConstellationItem(cal: Function) {
        let node = cc.instantiate(this.ConstellationRankPref);
        node.setParent(this.ConstellationRank);
        cal(node);
    }

    /**
     * 显示正常用户的排行榜信息
     */
    public showLoginUserRank() {
        //this.rankScrollView.content.active = true;
        this.TouchTip.active = false;
        // this.loginTip.stopAllActions();
        // this.AuthorizedTip.stopAllActions();
    }

    /**
     * 显示游客的排行榜信息
     */
    public showTouristRank() {
        //this.rankScrollView.content.active = false;
        this.TouchTip.active = true;
        this.AuthorizedTip.active = false;
        this.loginTip.active = true;
        // this.loginTip.stopAllActions();
        // cc.tween(this.loginTip).repeatForever(
        //     cc.tween().sequence(
        //         cc.tween().to(0.4, { scale: 1.02 }, { easing: cc.easing.sineIn }).to(0.4, { scale: 1 }, { easing: cc.easing.sineOut }),
        //         cc.tween().delay(1.5)
        //     )
        // ).start();
    }


    /**
   * 显示未授权的排行榜信息
   */
    public showunauthorizedRank() {
        // this.rankScrollView.content.active = false;
        this.TouchTip.active = true;
        this.AuthorizedTip.active = true;
        this.loginTip.active = false;
        // this.AuthorizedTip.stopAllActions();
        // cc.tween(this.AuthorizedTip).repeatForever(
        //     cc.tween().sequence(
        //         cc.tween().to(0.4, { scale: 1.02 }, { easing: cc.easing.sineIn }).to(0.4, { scale: 1 }, { easing: cc.easing.sineOut }),
        //         cc.tween().delay(1.5)
        //     )
        // ).start();
    }




    public setPlayerRankContentHeight(num: number) {
        let content = this.PlayerRankScrollView.content;
        content.height = num;
    }

    public localShowExpainPanel() {
        // if (config.platform == Platform.oppo) {
        //     this.ExpainContent.getComponent(cc.Sprite).spriteFrame = this.oppoSpr;
        // }
        this.readRemoteExpainPanel();
        ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "V1_1_4HomeExplain_Click", 1);
        GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
        this.ExpainPanel.active = true;
        cc.tween(this.ExpainPanel).to(0.2, { scale: 1.02 }).to(0.6, { scale: 1 }, { easing: cc.easing.elasticOut }).start();
        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        med && med.partSwitch(false);
        let V1_1_4Powermed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HasPowerPartMediator) as V1_1_4HasPowerPartMediator;
        V1_1_4Powermed && V1_1_4Powermed.partSwitch(false);
    }
    public localCloseExpainPanel() {
        this.ExpainPanel.active = false;
        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        med && med.partSwitch(true);
        let V1_1_4Powermed = Facade.getInstance().retrieveMediator(MediatorDefine.V1_1_4HasPowerPartMediator) as V1_1_4HasPowerPartMediator;
        V1_1_4Powermed && V1_1_4Powermed.partSwitch(true);
    }

    private readRemoteExpainPanel() {
        let remoteUrl = remoteExpainImgUrl;
        if (config.platform == Platform.oppo) {
            remoteUrl = remoteOPPOExpainImgUrl;
        }

        let image = new Image();
        image.onload = () => {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            this.ExpainContent.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        }
        image.onerror = error => {
        };
        image.src = remoteUrl;
        image.crossOrigin = "anonymous";
    }

    /**
     * 显示touchGuidance
     */
    showTouchGuidance(worldpos, touchEvent) {
        this.touchGuidance.active = true
        let maskbtn = this.touchGuidance.getChildByName("mask_btn");
        let btn = this.touchGuidance.getChildByName("btn");
        //   maskbtn.on(cc.Node.EventType.TOUCH_START, touchEvent, this);
        btn.on("click", touchEvent, this);
        console.log("worldpos  ");
        console.log(worldpos);


        let localPos = this.touchGuidance.convertToNodeSpaceAR(worldpos);
        console.log("localPos  ");
        console.log(localPos);
        maskbtn.setPosition(localPos);
        btn.setPosition(localPos);
        let rightTip = this.touchGuidance.getChildByName("tip_right");
        let liftTip = this.touchGuidance.getChildByName("tip_lift");
        rightTip.setPosition(localPos);
        liftTip.setPosition(localPos);
        rightTip.active = (cc.winSize.width - worldpos.x) > 400;
        liftTip.active = !rightTip.active;

    }
    /**
     * 关闭touchGuidance
     */
    closeTouchGuidance(touchEvent) {
        let maskbtn = this.touchGuidance.getChildByName("mask_btn");
        // maskbtn.off(cc.Node.EventType.TOUCH_START, touchEvent, this);
        this.touchGuidance.active = false
    }

    /**
     * 显示最强的星座的显示
     */
    showBestConstellationTip(id, nameStr: string) {
        this.BestConstellationTip.active = true;
        this.setBestConstellationexplainLabel(nameStr);
        // cc.assetManager.loadBundle("v1.1.4res", (err, bundle) => {
        //     this.setBgSpr(id, bundle);
        //     this.setFillSpr(id, bundle);
        // });


        let box = this.BestConstellationTip.getChildByName("box");
        box.scale = 0;
        cc.tween(box).to(0.4, { scale: 1.3 }).to(0.6, { scale: 1 }, { easing: cc.easing.backOut }).start();
    }

    /**
     * 设置最强星座的背景图
     */
    public setBgSpr(idx, bundle) {
        let self = this;
        let path = "bg" + idx
        let bg = this.BestConstellationTip.getChildByName("box").getChildByName("iron").getComponent(cc.Sprite);

        bundle.load(path, cc.SpriteFrame, function (err, SpriteFrame) {
            bg.spriteFrame = SpriteFrame;
        })
    }
    /**
     * 设置最强星座的填充图
     */
    public setFillSpr(idx, bundle) {
        let fill = this.BestConstellationTip.getChildByName("box").getChildByName("fill").getComponent(cc.Sprite);
        bundle.load("fill" + idx, cc.SpriteFrame, function (err, SpriteFrame) {
            fill.spriteFrame = SpriteFrame;
        })
    }

    /**
     * 关闭最强星座的显示
     */
    closeBestConstellationTip(cal) {
        this.BestConstellationTip.active = false;
        cal && cal();
    }


    public setRewardgrade(grade: number) {
        // let self = this;
        // this.RewardLabel.string = "恭喜获得" + rewardExpainStr[grade] + "!";
        // cc.assetManager.loadBundle("v1.1.4res", (err, bundle) => {
        //     // 加载 textures 目录下的所有 Texture 资源
        //     bundle.loadDir("RewardIrons", function (err, assets) {
        //         self.RewardIron.spriteFrame = assets.find((data) => { return data.name == grade.toString() });
        //     });
        // });
    }

    public setWinnerLabelShow(parents: cc.Node, index: number, str: string) {
        let tempStr = str;
        if (str && str.length > 5) {
            let n = str.slice(0, 5);
            tempStr = n + "..."
        }
        else {
            tempStr = str
        }
        parents.children[index].getComponent(cc.Label).string = tempStr;
    }
}
