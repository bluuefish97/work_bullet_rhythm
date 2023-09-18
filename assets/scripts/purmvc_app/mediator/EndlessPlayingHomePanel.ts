import BasePanel from "../../util/BasePanel";
import AdController from "../../plugin/ADSdk/AdController";
import config, { Platform } from "../../../config/config";
import { Utility } from "../../util/Utility";



const { ccclass, property } = cc._decorator;

@ccclass 
export default class EndlessPlayingHomePanel extends BasePanel {

    @property(cc.Node)
    private ExpainContent: cc.Node = null;
    @property(cc.SpriteFrame)
    private oppoSpr: cc.SpriteFrame = null;


    @property(cc.SpriteFrame)
    private MSpr: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    private WSpr: cc.SpriteFrame = null;

    @property(cc.Prefab)
    private RankitemPref: cc.Prefab = null;
    @property(cc.Node)
    private ExpainPanel: cc.Node = null;
    private setSexNode: cc.Node = null;
    private MSextoggle: cc.Toggle = null;
    private WSextoggle: cc.Toggle = null;
    private sexSetSureBtn: cc.Button = null;

    private box: cc.Node = null;
    private closeButton: cc.Button = null;
    private startPlayButton: cc.Button = null;
    private LookWinnerListButton: cc.Button = null;

    private userNode: cc.Node = null;
    private userHeadIron: cc.Sprite = null;
    private userSexIron: cc.Sprite = null;
    private userNameLabel: cc.Label = null;
    private userRankingLabel: cc.Label = null;
    private userMaxLabel: cc.Label = null;

    private SumPK: cc.Node = null;
    private mSumScoreProgressBar: cc.ProgressBar = null;
    private wSumScoreProgressBar: cc.ProgressBar = null;
    private mSumScoreLabel: cc.Label = null;
    private wSumScoreLabel: cc.Label = null;
    private mSumTimeProgressBar: cc.ProgressBar = null;
    private wSumTimeProgressBar: cc.ProgressBar = null;
    private mSumTimeLabel: cc.Label = null;
    private wSumTimeLabel: cc.Label = null;

    private Rank: cc.Node = null;
    private scoreRanktoggle: cc.Toggle = null;
    private timeRanktoggle: cc.Toggle = null;
    public rankScrollView: cc.ScrollView = null;
    private TouchTip: cc.Node = null;
    private loginTip: cc.Node = null;
    private AuthorizedTip: cc.Node = null;
    public authorizedEnsurePanel: cc.Node = null;


    private SetWinnderInfoNode: cc.Node = null;
    private SetWinnderBox: cc.Node = null;
    private trueNameEditBox: cc.EditBox = null;
    private phoneEditBox: cc.EditBox = null;
    private addressEditBox: cc.EditBox = null;
    public winnderAwardToggleContainer: cc.ToggleContainer = null;
    private winnderInfoSureBtn: cc.Button = null;
    private winnderInfoCloseBtn: cc.Button = null;
    private OpenWinnerSetButton: cc.Button = null;

    private WinnerListNode: cc.Node = null;
    private WinnerListNodeBox: cc.Node = null;
    private MWinnerListNode: cc.Node = null;
    private WWinnerListNode: cc.Node = null;
    private NameListInfoNodeCloseButton: cc.Button = null;


    public get LookWinnerNode(): cc.Node {
        return this.LookWinnerListButton.node;
    }

    onExit() {
        super.onExit()
        console.log("ZQVAnnouncementPanel  退出");
    }

    onLoad() {
        super.onLoad();
        this.setSexNode = this.node.getChildByName("SetSexNode");
        this.MSextoggle = this.setSexNode.getChildByName("SexToggleContainer").getChildByName("Mtoggle").getComponent(cc.Toggle);
        this.WSextoggle = this.setSexNode.getChildByName("SexToggleContainer").getChildByName("Wtoggle").getComponent(cc.Toggle);
        this.sexSetSureBtn = this.setSexNode.getChildByName("SureButton").getComponent(cc.Button);
        this.box = this.node.getChildByName("Box");
        this.closeButton = this.box.getChildByName("CloseButton").getComponent(cc.Button);
        this.startPlayButton = this.box.getChildByName("StartPlayButton").getComponent(cc.Button);
        this.LookWinnerListButton = this.box.getChildByName("LookWinnerListButton").getComponent(cc.Button);
        this.OpenWinnerSetButton = this.box.getChildByName("OpenWinnerSetButton").getComponent(cc.Button);


        this.userNode = this.box.getChildByName("UserNode");
        this.userHeadIron = this.userNode.getChildByName("UserHeadIron").getComponentInChildren(cc.Sprite);
        this.userSexIron = this.userNode.getChildByName("UserSexIron").getComponent(cc.Sprite);
        this.userNameLabel = this.userNode.getChildByName("UserNameLabel").getComponent(cc.Label);
        this.userRankingLabel = this.userNode.getChildByName("UserRankingLabel").getComponent(cc.Label);
        this.userMaxLabel = this.userNode.getChildByName("UserMaxLabel").getComponent(cc.Label);
        this.SumPK = this.box.getChildByName("SumPK");
        this.mSumScoreProgressBar = this.SumPK.getChildByName("MSumScoreProgressBar").getComponent(cc.ProgressBar);
        this.wSumScoreProgressBar = this.SumPK.getChildByName("WSumScoreProgressBar").getComponent(cc.ProgressBar);
        this.mSumScoreLabel = this.SumPK.getChildByName("MSumScoreLabel").getComponent(cc.Label);
        this.wSumScoreLabel = this.SumPK.getChildByName("WSumScoreLabel").getComponent(cc.Label);
        this.mSumTimeProgressBar = this.SumPK.getChildByName("MSumTimeProgressBar").getComponent(cc.ProgressBar);
        this.wSumTimeProgressBar = this.SumPK.getChildByName("WSumTimeProgressBar").getComponent(cc.ProgressBar);
        this.mSumTimeLabel = this.SumPK.getChildByName("MSumTimeLabel").getComponent(cc.Label);
        this.wSumTimeLabel = this.SumPK.getChildByName("WSumTimeLabel").getComponent(cc.Label);

        this.Rank = this.box.getChildByName("Rank");
        this.scoreRanktoggle = this.Rank.getChildByName("RankToggleContainer").getChildByName("ScoreRanktoggle").getComponent(cc.Toggle);
        this.timeRanktoggle = this.Rank.getChildByName("RankToggleContainer").getChildByName("TimeRanktoggle").getComponent(cc.Toggle);
        this.rankScrollView = this.Rank.getChildByName("RankScrollView").getComponent(cc.ScrollView);
        this.TouchTip = this.Rank.getChildByName("Tip");
        this.loginTip = this.TouchTip.getChildByName("LoginTip");
        this.AuthorizedTip = this.TouchTip.getChildByName("AuthorizedTip");
        this.authorizedEnsurePanel=this.box.getChildByName("authorizedEnsurePanel");
        
        this.SetWinnderInfoNode = this.node.getChildByName("SetWinnderInfoNode");
        this.SetWinnderBox = this.SetWinnderInfoNode.getChildByName("box");
        this.trueNameEditBox = this.SetWinnderBox.getChildByName("trueNameEditBox").getComponent(cc.EditBox);
        this.phoneEditBox = this.SetWinnderBox.getChildByName("phoneEditBox").getComponent(cc.EditBox);
        this.addressEditBox = this.SetWinnderBox.getChildByName("addressEditBox").getComponent(cc.EditBox);
        this.winnderInfoSureBtn = this.SetWinnderBox.getChildByName("SureButton").getComponent(cc.Button);
        this.winnderAwardToggleContainer = this.SetWinnderBox.getChildByName("RewardItemToggleContainer").getComponent(cc.ToggleContainer);
        this.winnderInfoCloseBtn = this.SetWinnderBox.getChildByName("closeButton").getComponent(cc.Button);


        this.WinnerListNode = this.node.getChildByName("NameListInfoNode");
        this.WinnerListNodeBox = this.WinnerListNode.getChildByName("box");
        this.MWinnerListNode = this.WinnerListNodeBox.getChildByName("MWinnerList");
        this.WWinnerListNode = this.WinnerListNodeBox.getChildByName("WWinnerList");
        this.NameListInfoNodeCloseButton = this.WinnerListNode.getChildByName("SureButton").getComponent(cc.Button);
    }

    onEnter() {
        super.onEnter();
        AdController.instance.AdSDK.hideBanner();
        this.authorizedEnsurePanel.active=false;
    }

    start() {
        this.localCloseExpainPanel();
        // this.LoginTip.active = false;
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
    * 设置性别设置确定按钮点击事件监听
    */
    public setSexSetSureBtnClickEvent(callback: Function) {
        this.sexSetSureBtn.node.on("click", callback, this);
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
* 设置性别设置男单选事件监听
*/
    public setMSexToggleEvent(callback: Function) {
        this.MSextoggle.node.on("toggle", callback, this);
    }
    /**
   * 设置性别设置女单选事件监听
   */
    public setWSexToggleEvent(callback: Function) {
        this.WSextoggle.node.on("toggle", callback, this);
    }
    /**
* 设置高分榜单选事件监听
*/
    public setScoreRankToggleEvent(callback: Function) {
        this.scoreRanktoggle.node.on("toggle", callback, this);
    }

    /**
     * 设置幸存榜单选事件监听
     */
    public setTimeRankToggleEvent(callback: Function) {
        this.timeRanktoggle.node.on("toggle", callback, this);
    }

    /**
     * 设置榜单滑动事件监听
     */
    public setRankScrollViewScrollEvent(callback: Function, target) {
        this.rankScrollView.node.on("scrolling", callback, target);
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
  * 设置用户最高分显示
  */
    public setUserMaxLabel(str: string) {
        if (!isNaN(parseFloat(str))) {
            str = Utility.formatNumber(str);
        }
        this.userMaxLabel.string = str;
    }

    /**
  * 
  * 设置用户排名显示
  */
    public setUserRankingLabel(str: string) {
        this.userRankingLabel.string = str;
    }
    /**
     * 
     * 设置用户性别显示
     */
    public setUserSexIron(str: string) {
        this.userSexIron.spriteFrame = str == "M" ? this.MSpr : this.WSpr
    }

    /**
   * 
   * 设置男生总分显示
   */
    public setMSumScoreLabel(str: string) {
        if (!isNaN(parseFloat(str))) {
            str = Utility.formatNumber(str);
        }
        this.mSumScoreLabel.string = "男生总分:" + str;
    }
    /**
     * 
     * 设置女生总分显示
     */
    public setWSumScoreLabel(str: string) {
        if (!isNaN(parseFloat(str))) {
            str = Utility.formatNumber(str);
        }
        this.wSumScoreLabel.string = "女生总分:" + str;
    }
    /**
    * 
    * 设置男生总分进度
    */
    public setMSumScoreProgressBar(pro: number) {
        this.mSumScoreProgressBar.progress = pro;
    }
    /**
   * 
   * 设置女生总分进度
   */
    public setWSumScoreProgressBar(pro: number) {
        this.wSumScoreProgressBar.progress = pro;
    }

    /**
   * 
   * 设置男生总存活显示
   */
    public setMSumTimeLabel(str: string) {
        if (!isNaN(parseFloat(str))) {
            str = Utility.formatNumber(str);
        }
        this.mSumTimeLabel.string = "男生总存活:" + str;
    }
    /**
     * 
     * 设置女生总存活显示
     */
    public setWSumTimeLabel(str: string) {
        if (!isNaN(parseFloat(str))) {
            str = Utility.formatNumber(str);
        }
        this.wSumTimeLabel.string = "女生总存活:" + str;
    }
    /**
    * 
    * 设置男生总存活进度
    */
    public setMSumTimeProgressBar(pro: number) {
        this.mSumTimeProgressBar.progress = pro;
    }
    /**
   * 
   * 设置女生总存活进度
   */
    public setWSumTimeProgressBar(pro: number) {
        this.wSumTimeProgressBar.progress = pro;
    }

    /**
     * 默认选中高分榜
     */
    public defaultRankToggle() {
        this.scoreRanktoggle.check();
    }

    /**
     * 打开性别设置页面
     */
    public openSetSexNode() {
        this.setSexNode.active = true;
        this.MSextoggle.check();
    }

    /**
     * 关闭性别设置页面
     */
    public closeSetSexNode() {
        this.setSexNode.active = false;
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
        cc.tween(this.WinnerListNodeBox).to(0.2, { scale: 1.1 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut }).start();
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
        console.log("男生获奖名单为:" + Marr);
        Marr.forEach((item, index) => {
            let temp = Utility.cutOffStr(item.name);
            this.MWinnerListNode.children[index].getComponent(cc.Label).string = temp;
        })
        console.log("女生获奖名单为:" + Warr);
        Warr.forEach((item, index) => {
            let temp = Utility.cutOffStr(item.name);
            this.WWinnerListNode.children[index].getComponent(cc.Label).string = temp;
        })
    }

    /**
     * 创造若干个排名信息
     */
    public createRankItem(cal: Function) {
        let content = this.rankScrollView.content;
        let node = cc.instantiate(this.RankitemPref);
        node.setParent(content);
        cal(node);
    }

    /**
     * 显示正常用户的排行榜信息
     */
    public showLoginUserRank() {
        this.rankScrollView.content.active = true;
        this.TouchTip.active = false;
        // this.loginTip.stopAllActions();
        // this.AuthorizedTip.stopAllActions();
    }

    /**
     * 显示游客的排行榜信息
     */
    public showTouristRank() {
        this.rankScrollView.content.active = false;
        this.TouchTip.active = true;
        this.AuthorizedTip.active = false;
        this.loginTip.active = true;
        this.loginTip.stopAllActions();
        cc.tween(this.loginTip).repeatForever(
            cc.tween().sequence(
                cc.tween().to(0.4, { scale: 1.02 }, { easing: cc.easing.sineIn }).to(0.4, { scale: 1 }, { easing: cc.easing.sineOut }),
                cc.tween().delay(1.5)
            )
        ).start();
    }


    /**
   * 显示未授权的排行榜信息
   */
    public showunauthorizedRank() {
        this.rankScrollView.content.active = false;
        this.TouchTip.active = true;
        this.AuthorizedTip.active = true;
        this.loginTip.active = false;
        this.AuthorizedTip.stopAllActions();
        cc.tween(this.AuthorizedTip).repeatForever(
            cc.tween().sequence(
                cc.tween().to(0.4, { scale: 1.02 }, { easing: cc.easing.sineIn }).to(0.4, { scale: 1}, { easing: cc.easing.sineOut }),
                cc.tween().delay(1.5)
            )
        ).start();
    }




    public setContentHeight(num: number) {
        let content = this.rankScrollView.content;
        content.height = num;
    }

    public localShowExpainPanel() {
        if (config.platform == Platform.oppo) {
            this.ExpainContent.getComponent(cc.Sprite).spriteFrame = this.oppoSpr;
        }
        this.ExpainPanel.active = true;
        cc.tween(this.ExpainPanel).to(0.2, { scale: 1.02 }).to(0.6, { scale: 1 }, { easing: cc.easing.elasticOut }).start();
    }
    public localCloseExpainPanel() {
        this.ExpainPanel.active = false;
    }
}
