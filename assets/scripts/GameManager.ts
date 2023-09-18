import { ApplicationFacade } from "./purmvc_app/applicationFacade";
import { Facade } from "./core/puremvc/patterns/facade/Facade";
import { MediatorDefine } from "./purmvc_app/mediator/mediatorDefine";
import UIPanelCtr from "./util/UIPanelCtr";
import { PanelType } from "./util/PanelType";
import { CommandDefine } from "./purmvc_app/command/commandDefine";
import { ConsumablesAlterInfo, ConsumablesType } from "./purmvc_app/repositories/Rep";
import PlayStage from "./Game/PlayStage";
import { CoinPartMediator } from "./purmvc_app/mediator/CoinPartMediator";
import { OpenPanelBody } from "./purmvc_app/command/OpenPanelCmd";
import { FinishType } from "./purmvc_app/command/FinishCmd";
import ActUtil from "./ActUtil";
import { PoolManager } from "./util/PoolManager";
import Coin from "./Game/coin";
import { ProxyDefine } from "./purmvc_app/proxy/proxyDefine";
import { GamePxy } from "./purmvc_app/proxy/GamePxy";
import config, { Platform } from "../config/config";
import GameLoad from "./GameLoad";
import AudioEffectCtrl from "./AudioEffectCtrl";
import { EndlessPlayingPxy } from "./purmvc_app/proxy/EndlessPlayingPxy";
import { ReportAnalytics } from "./plugin/reportAnalytics";
import { CONSTANTS } from "./Constants";
import { V1_1_4Pxy } from "./purmvc_app/proxy/V1_1_4Pxy";
import PowerUnitFly from "./Game/PowerUnitFly";

/**
 * 游戏管理类,负责游戏的启动等
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(AudioEffectCtrl)
    audioEffectCtrl: AudioEffectCtrl = null;
    @property(cc.Node)
    msgTip: cc.Node = null;
    @property(cc.Node)
    readingTip: cc.Node = null;
    @property
    public develop: boolean = false;


    // @property(cc.Prefab)
    // public V1_1_4powerPre: cc.Prefab = null;

    private coinPre: cc.Prefab = null;
    private powerPre: cc.Prefab = null;
    public purdahPanel: cc.Node = null;
    private gunModelShowPart: cc.Node = null;
    private GunShowStage: cc.Node = null;

    public isStartSongReadyState: boolean = false;     //玩家是否处在开始游戏前的静音时期

    private mask: cc.Node;

    public horChange: boolean = true;

    private static _instance: GameManager;
    public applicationFacade: ApplicationFacade;
    gamePxy: any;
    private copyRightPanel: cc.Node;
    private isStartCheck: boolean = false;   //是否开始检测
    private checkCRPTime: number = 0;
    public TEST_ADTag: boolean = true;

    public static getInstance(): GameManager {
        return GameManager._instance
    }

    onLoad() {
        if (!GameManager._instance) {
            GameManager._instance = this;
        } else if (GameManager._instance != this) {
            this.destroy();
        }
        this.mask = this.node.getChildByName("mask");
        this.copyRightPanel = this.node.getChildByName("CopyRightPanel");
        this.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
        this.node.setPosition(cc.view.getVisibleSize().width / 2, cc.view.getVisibleSize().height / 2);
        cc.game.addPersistRootNode(this.node);
        this.applicationFacade = new ApplicationFacade();
        //  RankManager.getInstance().getEventTime(()=>{})
    }

    start() {

        switch (config.platform) {
            case Platform.android:
                CONSTANTS.MaxPowerValue = 30;          //最大获得的体力数
                break;
            case Platform.oppo:
                CONSTANTS.MaxPowerValue = 30;          //最大获得的体力数
                break;
            default:
                CONSTANTS.MaxPowerValue = 10;
                break;
        }

        this.node.zIndex = 51;
        this.mask.zIndex = 9999;
        this.gameCallBack();
        this.closeBlockInput();
        this.closeReadingTip();
        this.TEST_ADTag = true;
        this.copyRightPanel.active = false;

    }

    onDestroy() {
        console.log("GameManager DESTROY");

    }

    public OnAgreeProtocol() {
        GameManager.getInstance().applicationFacade.startup();
    }

    //游戏的事件回调
    gameCallBack() {
        let pxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("游戏进入后台");
            pxy.setCloseGameDate();
            ReportAnalytics.getInstance().SingleLifeCycleAnalytics();
            ReportAnalytics.getInstance().startTime = 0;
        }, this);
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("重新返回游戏");
            ReportAnalytics.getInstance().startTime = new Date().getTime();
            pxy.getOfffLinePowerNum();
            pxy.setCloseGameDate();
        }, this);
    }

    /**
   * 根据平台不同调用不同的处理程序
   * @param judgment 平台控制接口
   */
    PlatformDeal(judgment: IPVJudgment) {
        switch (config.platform) {
            case Platform.web:
                judgment.MiniGameDeal();
                break;
            case Platform.vivo:
                judgment.MiniGameDeal();
                break;
            case Platform.oppo:
                judgment.MiniGameDeal();
                break;
            case Platform.douYin:
                judgment.DouYinGameDeal();
                break;
            case Platform.qq:
                judgment.QQMiniGameDeal();
                break;
            case Platform.android:
                judgment.MiniGameDeal();
                break;
            case Platform.ios:
                judgment.IOSOPPOGameDeal();
                break;
            case Platform.huawei:
                judgment.MiniGameDeal();
                break;
            case Platform.wechat:
                judgment.MiniGameDeal();
                break;
            default:

        }
    }


    /**
     * 显示提示信息
     */
    showMsgTip(msg: string, time = 0.2) {
        this.msgTip.zIndex = 999;
        this.msgTip.active = true
        this.msgTip.getComponentInChildren(cc.Label).string = msg;
        ActUtil.msgTipAct(this.msgTip, time);
    }

    /**
    * 显示读取中提示
    */
    showReadingTip() {
        this.readingTip.active = true;
    }
    /**
      * 关闭读取中提示
      */
    closeReadingTip() {
        this.readingTip.active = false;
    }


    //金币获得动画
    showCoinAni(num: number, targetWorldPos: cc.Vec2) {
        let localpos = this.node.convertToNodeSpaceAR(targetWorldPos);
        this.openBlockInput();
        if (!this.coinPre) {
            let self = this;
            cc.resources.load("prefabs/DiaPre", function (err, prefab: cc.Prefab) {
                self.coinPre = prefab;
                for (let i = 0; i < num; i++) {
                    let coin = PoolManager.instance.getNode(self.coinPre, self.node);
                    let compont = coin.getComponent(Coin);
                    compont.TargetPos = localpos;
                    compont.getActShow();
                }
                self.scheduleOnce(() => {
                    GameManager.getInstance().closeBlockInput();
                }, 1);
            });
        }
        else {

            for (let i = 0; i < num; i++) {
                let coin = PoolManager.instance.getNode(this.coinPre, this.node);
                let compont = coin.getComponent(Coin);
                compont.TargetPos = localpos;
                compont.getActShow();
            }
            this.scheduleOnce(() => {
                GameManager.getInstance().closeBlockInput();
            }, 1);
        }

    }

    //体力券获得动画
    showPowerAni(num: number, targetWorldPos: cc.Vec2) {
        let localpos = this.node.convertToNodeSpaceAR(targetWorldPos);
        if (!this.powerPre) {
            let self = this;
            cc.resources.load("prefabs/PowerPre", function (err, prefab: cc.Prefab) {
                self.powerPre = prefab;
                for (let i = 0; i < num; i++) {
                    let coin = PoolManager.instance.getNode(self.powerPre, self.node);
                    let compont = coin.getComponent(Coin);
                    compont.TargetPos = localpos;
                    compont.getActShow();
                }
            });
        }
        else {

            for (let i = 0; i < num; i++) {
                let coin = PoolManager.instance.getNode(this.powerPre, this.node);
                let compont = coin.getComponent(Coin);
                compont.TargetPos = localpos;
                compont.getActShow();
            }
        }
    }


    //体力券消耗动画
    showPowerConsumeAni(num: number, originWorldPos: cc.Vec2, targetWorldPos: cc.Vec2, cal) {
        let originLocalPos = this.node.convertToNodeSpaceAR(originWorldPos);
        let targetLocalpos = this.node.convertToNodeSpaceAR(targetWorldPos);

        if (!this.powerPre) {
            let self = this;
            cc.resources.load("prefabs/PowerPre", function (err, prefab: cc.Prefab) {
                self.powerPre = prefab;
                for (let i = 0; i < num; i++) {
                    self.scheduleOnce(
                        () => {
                            let powerUnit = PoolManager.instance.getNode(self.powerPre, self.node);
                            let compont = powerUnit.getComponent(PowerUnitFly);
                            compont.consumeActShow(0.6, originLocalPos, cc.v3(targetLocalpos.x, targetLocalpos.y, 0), compont.numberShow.bind(compont));
                        }, 0.1 * i
                    )
                }
            });
        }
        else {

            for (let i = 0; i < num; i++) {
                this.scheduleOnce(
                    () => {
                        let powerUnit = PoolManager.instance.getNode(this.powerPre, this.node);
                        let compont = powerUnit.getComponent(PowerUnitFly);
                        compont.consumeActShow(0.6, originLocalPos, cc.v3(targetLocalpos.x, targetLocalpos.y, 0), compont.numberShow.bind(compont));
                    }, 0.1 * i
                )
            }
        }

    }


    // //星座能量消耗动画
    // V1_1_4showFillPowerAni(num: number, originWorldPos: cc.Vec2, targetWorldPos: cc.Vec2, cal) {
    //     let originLocalPos = this.node.convertToNodeSpaceAR(originWorldPos);
    //     let targetLocalpos = this.node.convertToNodeSpaceAR(targetWorldPos);
    //     for (let i = 0; i < num; i++) {
    //         let powerUnit = PoolManager.instance.getNode(this.V1_1_4powerPre, this.node);
    //         let compont = powerUnit.getComponent(V1_1_4powerUnitFly);
    //         if (i == 0) {
    //             compont.consumeActShow(1, originLocalPos, cc.v3(targetLocalpos.x, targetLocalpos.y, 0),
    //                 () => {
    //                     cal();
    //                     compont.endCall()
    //                 }
    //                 , 300, -100, -100, 300);
    //         } else if (i == 1) {
    //             compont.consumeActShow(1.2, originLocalPos, cc.v3(targetLocalpos.x, targetLocalpos.y, 0), () => {
    //                 compont.endCall()
    //             }, 0, 0, 0, 0);

    //         } else {
    //             setTimeout(() => {
    //                 compont.consumeActShow(1.4, originLocalPos, cc.v3(targetLocalpos.x, targetLocalpos.y, 0), () => {
    //                     compont.endCall()
    //                 }, 100, -300, -300, 100);
    //             }, 1000);

    //         }

    //     }

    // }
    /**
     * 显示枪皮肤解锁成功页面
     */
    openGunSkinUnlockSucceCelebrateView(_id: number, _skinID) {
        // console.log(_id);
        Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.GunModelShowPart, () => {
            this.scheduleOnce(() => {
                Facade.getInstance().sendNotification(CommandDefine.showGunIDResponce,
                    {
                        id: _id,
                        skinID: _skinID
                    }
                );
            }, 2);

        }));

    }

    /**
     * 打开帷幕
     */
    public openPurdah(callback) {
        if (this.purdahPanel) {
            this.purdahPanel.active = true;
            let gameLoad = this.purdahPanel.getComponent(GameLoad);
            gameLoad.bar.getComponentInChildren(cc.ParticleSystem).resetSystem();
            callback(gameLoad)
        }
        else {
            let self = this;
            cc.resources.load("prefabs/GameLoad", function (err, prefab: cc.Prefab) {
                self.purdahPanel = cc.instantiate(prefab);
                self.node.addChild(self.purdahPanel);
                self.purdahPanel.active = true;
                self.purdahPanel.zIndex = 0
                let gameLoad = self.purdahPanel.getComponent(GameLoad);
                gameLoad.bar.getComponentInChildren(cc.ParticleSystem).resetSystem();
                callback(gameLoad)
            });

        }
    }

    /**
     * 关闭帷幕
    */
    public closePurdah() {
        if (this.purdahPanel) {
            let gameLoad = this.purdahPanel.getComponent(GameLoad);
            gameLoad.bar.getComponentInChildren(cc.ParticleSystem).resetSystem();
            this.purdahPanel.active = false;
        }
    }

    /**
    * 打开事件点击拦截
    */
    openBlockInput() {
        console.log("打开事件点击拦截");
        this.mask.active = true;
        this.mask.getComponent(cc.BlockInputEvents).enabled = true;
    }
    /**
     * 关闭事件点击拦截
     */
    closeBlockInput() {
        console.log("关闭事件点击拦截");
        this.mask.active = false;
        this.mask.getComponent(cc.BlockInputEvents).enabled = false;
    }
    //----------------------test-------------------------------
    /**
* 打开成功页面
*/
    public openWinPanel() {
        PlayStage.getIntance().proStarGrade = 3;
        Facade.getInstance().sendNotification(CommandDefine.Finish, FinishType.WIN);
    }
    /**
    * 打开失败页面
    */
    public openFailPanel() {
        Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.FinishPanel));
    }
    /**
     * 打开复活页面
     */
    public openRevivePanel() {
        Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.RevivePanel));

    }

    /**
    * 打开签到页面
    */
    public openSignPanel() {
        Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.SignPanel));
    }

    /**
    * 打开成就页面
    */
    public openAchiPanel() {
        Facade.getInstance().sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.AchiPanel));
    }

    /**
    * 打开水平变化
    */
    public openHorChange(toggle: cc.Toggle) {
        this.horChange = toggle.isChecked;
        this.showMsgTip(" this.horChange  " + this.horChange);

    }

    public testClosePanelTask() {

        UIPanelCtr.getInstance().clearPanelStack();
        let med = Facade.getInstance().retrieveMediator(MediatorDefine.CoinPartMediator) as CoinPartMediator;
        med.partSwitch(false);
        PlayStage.getIntance().startPlay();
    }

    //钻石改变
    public testDiaChange(event, data) {
        Facade.getInstance().sendNotification(CommandDefine.Consumables,
            {
                info: new ConsumablesAlterInfo(ConsumablesType.dia, Number(data)),
                callback: null
            }
        );
    }
    //体力改变
    public testPowerChange(event, data) {
        Facade.getInstance().sendNotification(CommandDefine.Consumables,
            {
                info: new ConsumablesAlterInfo(ConsumablesType.power, Number(data)),
                callback: null
            }
        );
    }


    /**
     * 检测查看copyRight面板
     */
    testCheckCRP() {
        this.checkCRPTime++;
        console.log("点击次数:  " + this.checkCRPTime);

        if (!this.isStartCheck) {
            this.isStartCheck = true;
            this.scheduleOnce(() => {
                if (this.checkCRPTime >= 10) {
                    console.log("开启copyRight面板成功!");
                    this.openCopyRightPanel();
                }
                else {
                    this.isStartCheck = false;
                    this.checkCRPTime = 0
                    console.log("开启copyRight面板失败!");
                }
            }, 2)
        }

    }

    /**
     * 是否开启看视频开关
     */
    public testADToggle(toggle: cc.Toggle) {
        this.TEST_ADTag = toggle.isChecked;
    }

    /**
     * 清理数据
     */
    public testClearData() {
        cc.sys.localStorage.clear();
    }

    /**
     * 打开copyRightPanel
     */
    public openCopyRightPanel() {
        this.copyRightPanel.active = true;
    }

    /**
     * 关闭copyRightPanel
     */
    public closeCopyRightPanel() {
        this.copyRightPanel.active = false;
        this.isStartCheck = false;
        this.checkCRPTime = 0
    }

    public testStartEndlessPlaying() {
        Facade.getInstance().sendNotification(CommandDefine.StartEndlessPlayingRequest);
    }

    public testStartEndlessOpen() {
        let ELPPxy = Facade.getInstance().retrieveProxy(ProxyDefine.EndlessPlayingPxy) as EndlessPlayingPxy;
        ELPPxy.getuserInfo();
    }

    public testAddaddUserHasPowers() {
        let v1_1_4Pxy = Facade.getInstance().retrieveProxy(ProxyDefine.V1_1_4Pxy) as V1_1_4Pxy;
        v1_1_4Pxy.addUserHasPowers(10);
    }

}
