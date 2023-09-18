import { PoolManager } from "../../util/PoolManager";
import SineWave from "../../plugin/eazax-ccc/components/effects/SineWave";

const { ccclass, property } = cc._decorator;

@ccclass
export default class V1_1_4ConstellationItem extends cc.Component {
    IDX: number = null;
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Sprite)
    fill: cc.Sprite = null;
    @property(cc.Label)
    fillPowerNumLabel: cc.Label = null;
    @property(cc.Node)
    fillButton: cc.Node = null;
    @property(cc.Node)
    MaxTip: cc.Node = null;
    
    @property(cc.ParticleSystem)
    endPlist: cc.ParticleSystem = null;

    @property(cc.Prefab)
    fillButtonEftPref: cc.Prefab = null;
    @property({ type: cc.EffectAsset, tooltip: CC_DEV && 'Effect 资源', readonly: true })
    private effect: cc.EffectAsset = null;

    private wave: SineWave;

    private tempProNum:number=0;

    public _OnTouchStart = () => { };
    public _OnTouchMove = () => { };
    public _OnTouchEnd = () => { };
    public _OnDisable=()=>{}
    onLoad() {

    }
    start() {
        this.MaxTip.active=false;
    }
    onDestroy() {
        this.removeTouchEvent()
    }
    onDisable(){
        this._OnDisable();
    }

    /**
     *注册监听
     */
    registerTouchEvent() {
        this.fillButton.on(cc.Node.EventType.TOUCH_START, this._OnTouchStart, this);
        this.fillButton.on(cc.Node.EventType.TOUCH_MOVE, this._OnTouchMove, this);
        this.fillButton.on(cc.Node.EventType.TOUCH_END, this._OnTouchEnd, this);
        this.fillButton.on(cc.Node.EventType.TOUCH_CANCEL, this._OnTouchEnd, this);
    }

    /**
     * 取消监听
     */
    removeTouchEvent() {
        this.fillButton.off(cc.Node.EventType.TOUCH_START, this._OnTouchStart, this);
        this.fillButton.off(cc.Node.EventType.TOUCH_MOVE, this._OnTouchMove, this);
        this.fillButton.off(cc.Node.EventType.TOUCH_END, this._OnTouchEnd, this);
        this.fillButton.off(cc.Node.EventType.TOUCH_CANCEL, this._OnTouchEnd, this);
    }






    /**
       * 设置充能按钮点击事件监听
       */
    setFillButtonClickEvent(callback: Function) {
        // this.fillButton.node.on("click", callback, this)
    }


    /**
     * 设置星座的背景图
     */
    public setBgSpr(idx, bundle) {
        let self = this;
        let path = "bg" + idx
        bundle.load(path, cc.SpriteFrame, function (err, SpriteFrame) {

            self.bg.spriteFrame = SpriteFrame;
        })
    }
    /**
     * 设置星座的填充图
     */
    public setFillSpr(idx, bundle) {
        let self = this;
        bundle.load("fill" + idx, cc.SpriteFrame, function (err, SpriteFrame) {
            self.fill.spriteFrame = SpriteFrame;
            self.wave = self.fill.addComponent(SineWave);
            self.wave.effect = self.effect;
            self.wave.height =self.tempProNum;
            self.wave.amplitude = 0.02;
            self.wave.frequency = 10;
            self.wave.angularVelocity = 15;
        })
    }
    /**
     * 设置星座的充能数
     */
    public setFillPowers(num) {
        this.fillPowerNumLabel.string = num;
    }

    /**
 * 设置星座的充能进度
 */
    public setFillPowersPro(num, targetNum,ismax) {
        let proNun = num / targetNum
        console.log("proNun  " + proNun);
        this.tempProNum=proNun;
        let addVrlocityTween = cc.tween().sequence(
            cc.tween().to(0.2, { angularVelocity: 20,frequency:10 }, { easing: cc.easing.sineOut }),
            cc.tween().to(0.2, { angularVelocity: 15,frequency:10 }, { easing: cc.easing.sineIn })
        )
        let upTween = cc.tween().to(0.3, { height: proNun })
        cc.tween(this.wave).parallel(
            upTween,
            addVrlocityTween).call(()=>{
                if(ismax){
                   this.showMaxTip()
                }else{
                    this.MaxTip.active=false;  
                }
            })
            .start();
    }

    /**
     * 显示目前最高的星座图标
     */
    showMaxTip(){
        this.MaxTip.active=true;
    }

    /**
     * 获得充能图标的世界坐标
     */
    getButtonPos() {
        let worldPos = this.fillButton.convertToWorldSpaceAR(cc.v2(0, 0));
        // let worldPos = this.bg.node.convertToWorldSpaceAR(cc.v2(0, 0));
        return worldPos
    }

   /**
     * 获得充能按钮的世界坐标
     */
    getBodyPos() {
      //  let worldPos = this.fillButton.convertToWorldSpaceAR(cc.v2(0, 0));
         let worldPos = this.bg.node.convertToWorldSpaceAR(cc.v2(0, 0));
        return worldPos
    }

    /**
     *被充能动画
     */
    onBeFillPowerAct() {
        let fillButtonEft = PoolManager.instance.getNode(this.fillButtonEftPref, this.node);
        fillButtonEft.active = true
        fillButtonEft.stopAllActions();
        fillButtonEft.opacity = 0;
        fillButtonEft.scale = 0;
        cc.tween(fillButtonEft).to(0.4, { scale: 1.2, opacity: 180 }, { easing: cc.easing.sineIn })
            .to(0.1, { scale: 0.5, opacity: 100 }, { easing: cc.easing.sineOut }).
            call(() => {
                PoolManager.instance.putNode(fillButtonEft);
            }).start();

        // this.scheduleOnce(()=>{
        //     GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.equipGun);
        // },0.2);
    }
}
