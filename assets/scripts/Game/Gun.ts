import { Utility } from "../util/Utility";
import PointGenerator from "./PointGenerator";
import PlayStage, { PlayState } from "./PlayStage";
import { CONSTANTS } from "../Constants";
import { PoolManager } from "../util/PoolManager";
import GameManager from "../GameManager";
import { Facade } from "../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../purmvc_app/proxy/proxyDefine";
import { GamePxy } from "../purmvc_app/proxy/GamePxy";
import config, { Platform } from "../../config/config";
import AdController from "../plugin/ADSdk/AdController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Gun extends cc.Component {

    @property({
        type: cc.AudioClip
    })
    diaClip: cc.AudioClip = null;
    @property(cc.Prefab)
    private smokeGunPre: cc.Prefab = null;
    private firePoint: cc.Node = null;          //枪口
    private crosshair: cc.Node = null;          //准星
    private targetFirePos: cc.Node = null;     //最佳发射目标点
    private smokeSpin: cc.Node = null;     //最佳发射目标点
    private eviCamera: cc.Camera = null;
    frameTime = 0;         //游戏开始后时间
    cutTimes: number = 0;  //切枪的次数
    fireTimes: number = 0;  //开枪的次数
    rewardFireTimes: number = 0;  //奖励开枪的次数
    tempFireTimes: number = 0; //暂时保存的开启次数
    doubleHitTimes: number = 1;  //连击的次数
    isCompeteFire: boolean = false;   //是否发射完节奏点的弹药
    gunObjPrefs: Array<cc.Prefab> = new Array<cc.Prefab>();    //枪的模型
    lastGunSkinID: number = null;
    canvas: cc.Node;
    stage: cc.Node;
    gamePxy: GamePxy;
    isGuideState: boolean = false;

    onLoad() {
        this.canvas = cc.director.getScene().getChildByName('Canvas')
        this.stage = cc.director.getScene().getChildByName('3D Stage')
        this.smokeSpin = this.stage.getChildByName("SmokeSpin");
        this.crosshair = this.stage.getChildByName("Crosshair");
        this.targetFirePos = cc.director.getScene().getChildByName('3D Stage').getChildByName("targetFirePos");
        this.eviCamera = cc.director.getScene().getChildByName('3D Stage').getChildByName("3D Camera").getComponent(cc.Camera);
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
    }

    start() {
    }

    /**
     *注册监听
     */
    registerTouchEvent() {
        this.canvas.on(cc.Node.EventType.TOUCH_START, this._OnTouchStart, this);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, this._OnTouchMove, this);
        this.canvas.on(cc.Node.EventType.TOUCH_END, this._OnTouchEnd, this);
        this.canvas.on(cc.Node.EventType.TOUCH_CANCEL, this._OnTouchEnd, this);
    }

    /**
     * 取消监听
     */
    removeTouchEvent() {
        this.canvas.off(cc.Node.EventType.TOUCH_START, this._OnTouchStart, this);
        this.canvas.off(cc.Node.EventType.TOUCH_MOVE, this._OnTouchMove, this);
        this.canvas.off(cc.Node.EventType.TOUCH_END, this._OnTouchEnd, this);
        this.canvas.off(cc.Node.EventType.TOUCH_CANCEL, this._OnTouchEnd, this);
    }

    _OnTouchStart(event: cc.Event.EventTouch) {
        let touchs = event.getTouches();
        console.log("PlayStage.getIntance().playState   " + PlayStage.getIntance().playState);
        if (PlayStage.getIntance().playState == PlayState.Ready) {
            PlayStage.getIntance().startPlay();
        }
        else if (PlayStage.getIntance().playState == PlayState.Resume) {
            PlayStage.getIntance().resumePlay();
        }
    }
    _OnTouchMove(event) {
        this.horRotateTo(event.getDeltaX());
    }
    _OnTouchEnd(event: cc.Event.EventTouch) {
        let touchNums = event.getTouches().length;
        //  console.log('touchNums    ' + touchNums)
        if (touchNums > 1) return;
        //   console.log('手指离开')
    }

    update(dt) {
        if (PlayStage.getIntance().playState == PlayState.Underway) {
            if (this.fireTimes <= (PlayStage.getIntance().entityPointArray.length - 1)
                && PlayStage.getIntance().entityPointArray[this.fireTimes].time <= (PlayStage.getIntance().proceedTime)) {
                //到达开枪时机
                this.doubleHitTimes = 1;
                this.isGuideState = false;
                this.fire(null, 0);
                this.checkHit(false);
                this.tempFireTimes = this.fireTimes;
                if (PlayStage.getIntance().entityPointArray[this.fireTimes].pressKey == "startLong") {
                    this.fireTimes += 2;
                }
                else {
                    this.fireTimes++;
                }
            }
            else if (this.fireTimes > (PlayStage.getIntance().entityPointArray.length - 1)
                && PlayStage.getIntance().entityPointArray[PlayStage.getIntance().entityPointArray.length - 2].pressKey != "startLong") {
                this.isCompeteFire = true;
            }
            if (PlayStage.getIntance().entityPointArray[this.tempFireTimes].pressKey == "startLong"
                && this.doubleHitTimes < Math.floor(PlayStage.getIntance().pointOffsetArray[this.tempFireTimes + 1] / 0.08)
            ) {
                if (PlayStage.getIntance().entityPointArray[this.tempFireTimes].time + 0.08 * this.doubleHitTimes <= PlayStage.getIntance().proceedTime) {
                    //到达连发时机
                    this.fire(null, 0, 0.6);
                    this.checkHit(false);
                    this.doubleHitTimes++;
                }
            }
            else if (PlayStage.getIntance().entityPointArray[this.tempFireTimes].pressKey == "startLong"
                && (this.tempFireTimes >= (PlayStage.getIntance().entityPointArray.length - 2))
                && this.doubleHitTimes >= Math.floor(PlayStage.getIntance().pointOffsetArray[this.tempFireTimes + 1] / 0.08)) {
                this.isCompeteFire = true;
            }

        }
        else if (PlayStage.getIntance().playState == PlayState.Reward) {
            let durTime = CONSTANTS.MaxDistance / CONSTANTS.ForwardSpeed;
            if (this.rewardFireTimes < PlayStage.getIntance().idealityRewardDiaVal && CONSTANTS.IntervalFinishToReward + durTime + CONSTANTS.IntervalReward * this.rewardFireTimes <= PlayStage.getIntance().rewardProceedTime) {
                //到达奖励收集时机
                this.fire(this.diaClip, 0.4);
                this.checkHit(true);
                this.rewardFireTimes++;
                this.tempFireTimes = 0;
            } else if (this.rewardFireTimes >= PlayStage.getIntance().idealityRewardDiaVal) {
                PlayStage.getIntance().stageIdie();
                this.scheduleOnce(() => {
                    PlayStage.getIntance().win();
                }, 0.3);


            }
        }
    }



    /**
     * 换枪
     */
    replaceGun(cal) {
        if (this.gamePxy.getGameNew()) {
            var self = this;
            cc.assetManager.loadBundle('remoteSkins', (err, bundle) => {
                bundle.load("gunModel/1", cc.Prefab, function (err, pref) {
                    let newGun = PoolManager.instance.getNode(pref, self.node.getChildByName("gunVer"));
                    self.firePoint = newGun.getChildByName("firePos");
                    cal();
                })
            })

            // setTimeout(() => {
            //     let newGun = this.node.getChildByName("gunVer").children[0];
            //     this.firePoint = newGun.getChildByName("firePos");
            //     cal(); 
            // }, 500);
        }
        else {
            if (this.lastGunSkinID != this.gamePxy.getEquipGunSkin()) {
                let id = this.gamePxy.getEquipGunSkin();
                let newGun;
                if (this.node.getChildByName("gunVer").childrenCount > 0) {
                    let oldGun = this.node.getChildByName("gunVer").children[0];
                    PoolManager.instance.putNode(oldGun);
                }
                if (this.gunObjPrefs[id]) {
                    newGun = PoolManager.instance.getNode(this.gunObjPrefs[id], this.node.getChildByName("gunVer"));
                    this.firePoint = newGun.getChildByName("firePos");
                    cal();
                }
                else {
                    var self = this;
                    cc.assetManager.loadBundle('remoteSkins', (err, bundle) => {
                        bundle.load("gunModel/" + id, cc.Prefab, function (err, pref) {
                            self.gunObjPrefs[id] = pref as cc.Prefab;
                            newGun = PoolManager.instance.getNode(self.gunObjPrefs[id], self.node.getChildByName("gunVer"));
                            self.firePoint = newGun.getChildByName("firePos");
                            cal();
                        })
                    })
                }

                this.lastGunSkinID = this.gamePxy.getEquipGunSkin();
            } else {
                cal();
            }
        }
    }


    /**
     * 隐藏状态
     */
    hide() {
        this.node.x = 1;
        this.targetFirePos.active = false
        this.crosshair.active = false;
        this.gunReset();
        this.removeTouchEvent();
    }

    /**
     * 暂停状态
     */
    pauseGun() {
        this.removeTouchEvent();
    }
    /**
     *恢复状态
     */
    reumeGun() {
        this.fireTimes = this.tempFireTimes;
        this.doubleHitTimes = 1;
        this.gunEulerReset();
        this.registerTouchEvent();
    }
    /**
    *显示状态
    */
    show() {
        this.node.x = 0;
        this.crosshair.active = true;
        this.targetFirePos.active = true
        this.gunReset();
        this.registerTouchEvent();
    }


    /**
     * 枪重置
     */
    gunReset() {
        this.fireTimes = 0;
        this.tempFireTimes = 0;
        this.cutTimes = 0;
        this.rewardFireTimes = 0;
        this.doubleHitTimes = 1;
        this.isCompeteFire = false;
        this.gunEulerReset()
    }

    /**
     * 重置枪的位置
     */
    gunEulerReset() {
        this.setCrosshairVer();
        this.node.eulerAngles = cc.v3(0, 0, 0)
        this.gunEulerToCrosshairX(0);
    }
    /**
     * 设置准星位置
     */
    setCrosshairVer() {
        let sceenTargetFirePos: cc.Vec2 = cc.v2(0, 0);
        this.eviCamera.getWorldToScreenPoint(this.targetFirePos.getPosition(), sceenTargetFirePos);
        this.crosshair.y = sceenTargetFirePos.y + 20;
    }

    /**
     * 开火
     */
    fire(clip = null, vol = 1, contineFrag = 1) {
        if (clip != null) {

            cc.audioEngine.play(clip, false, vol);
        }
        if (config.platform != Platform.web) {
            AdController.instance.AdSDK.vibrate()
        }

        this.firePoint.children[0].getComponent(cc.Animation).play();
        cc.tween(this.node.getChildByName("gunVer")).sequence(
            cc.tween().by(0.04 * contineFrag, { eulerAngles: cc.v3(8, 0, 0) }, { easing: "elasticOut" }),
            cc.tween().by(0.03 * contineFrag, { eulerAngles: cc.v3(-2, 0, 0) }),
            cc.tween().to(0.02 * contineFrag, { eulerAngles: cc.v3(0, 0, 0) })
        ).start();
        this.CrosshairRecoil();
    }

    /**
     * 检测是否击中
     */
    checkHit(isReward: boolean) {

        this.unschedule(() => PlayStage.getIntance().checkHit(this.crosshair.position))
        this.scheduleOnce(() => {
            if (!isReward) {
                PlayStage.getIntance().checkHit(this.crosshair.position);
            }
            else {
                PlayStage.getIntance().checkHit(this.crosshair.position, PlayStage.getIntance().onHitRewardPoint.bind(PlayStage.getIntance()));
            }

        }, 0.02);
    }

    /**
     * 手枪旋转
     */
    horRotateTo(horizontalDirX: number) {
        const axis = cc.Vec3.UP;
        const angle = -Math.PI * CONSTANTS.rotateSpeed * horizontalDirX;
        let tempQuat: cc.Quat = cc.quat(0, 0, 0, 0);
        let quat: cc.Quat = cc.quat(0, 0, 0, 0);
        cc.Quat.rotateAround(tempQuat, quat.fromEuler(this.node.eulerAngles), axis, angle);
        cc.Quat.normalize(tempQuat, tempQuat);
        this.node.setRotation(tempQuat);
        if (this.node.eulerAngles.y < -23) {
            this.node.eulerAngles = cc.v3(0, -23, 0)
        } else if (this.node.eulerAngles.y > 23) {
            this.node.eulerAngles = cc.v3(0, 23, 0)
        }
        this.gunEulerToCrosshairX(-this.node.eulerAngles.y);
    }

    /**
     * 手枪旋转角度转换成准星x轴
     */
    private gunEulerToCrosshairX(eulerY: number) {
        let rate = 300 / 23;
        let targetPos = cc.v2(eulerY * rate + cc.view.getVisibleSize().width / 2, this.crosshair.y);
        //  console.log("targetPos.x前 " + this.crosshair.getPosition().x);
        let temp: cc.Vec2 = cc.v2(0, 0);
        cc.Vec2.lerp(temp, this.crosshair.getPosition(), targetPos, 0.8);
        // console.log("targetPos.x后 " + temp);
        this.crosshair.setPosition(temp);
    }

    /**
     * 准星因为后座力跳动
     */
    private CrosshairRecoil() {
        let recoilAct = cc.jumpTo(0.08, this.crosshair.getPosition(), 20, 1);
        this.crosshair.runAction(recoilAct);
        cc.tween(this.crosshair).sequence(
            cc.tween().to(0.05, { scale: 0.7 }),
            cc.tween().to(0.08, { scale: 1.3 }, { easing: "cubicOut" }),

            cc.tween().to(0.08, { scale: 1 })
        ).start();
    }

    /**
     * 产生硝烟
     */
    public createSmoke() {
        let smoke = PoolManager.instance.getNode(this.smokeGunPre, this.smokeSpin);
        smoke.setPosition(this.crosshair.getPosition());
        this.scheduleOnce(() => {
            PoolManager.instance.putNode(smoke);
        }, 1);
        let fireEft = smoke.getChildByName("FireEft")
        fireEft.opacity = 175;
        cc.tween(fireEft).sequence(
            cc.tween().to(0.15, { opacity: 255 }),
            cc.tween().hide()
        ).start();

        let boom = smoke.getChildByName("Boom")
        boom.scale = 1;
        boom.opacity = 255;
        let durTime = 0.1;
        let scaleTween = cc.tween().to(durTime, { scale: 1.6 }, { easing: "cubicOut" });
        let hideTween = cc.tween().sequence(
            cc.tween().delay(durTime * 0.2),
            cc.tween().to(durTime * 0.8, { opacity: 0 })
        );
        cc.tween(boom).parallel(
            scaleTween,
            hideTween
        ).start();
        smoke.getComponentsInChildren(cc.ParticleSystem).forEach((par) => {
            par.resetSystem();
        })
    }

}

enum BulletType {
    snipe = "snipe",     //狙击弹
    rifle = " rifle"     //步枪
}