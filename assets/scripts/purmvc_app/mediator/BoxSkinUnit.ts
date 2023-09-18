import GunSkinSuccesEquipEft from "../../effect/GunSkinSuccesEquipEft";



const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxSkinUnit extends cc.Component {
    @property(cc.SpriteFrame)
    nomalStateSF: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    equipStateSF: cc.SpriteFrame = null;

    private ironBgSprite: cc.Sprite = null;
    private ironSprite: cc.Sprite = null;
    private desSprite: cc.Sprite = null;
    private equipBtn: cc.Button = null;
    private adUnlockBtn: cc.Button = null;
    private diaUnlockBtn: cc.Button = null;
    private equipIng: cc.Node = null;
    curShowBtn;
    onLoad() {


    }

    //给定义的组件赋值
    public InitAssign() {
        this.ironBgSprite = this.node.getChildByName("IronBg").getComponent(cc.Sprite);
        this.ironSprite = this.node.getChildByName("Iron").getComponent(cc.Sprite);
        this.desSprite = this.node.getChildByName("Des").getComponent(cc.Sprite);
        
        this.equipBtn = this.node.getChildByName("EquipBtn").getComponent(cc.Button);
        this.adUnlockBtn = this.node.getChildByName("AdUnlockBtn").getComponent(cc.Button);
        this.diaUnlockBtn = this.node.getChildByName("DiaUnlockBtn").getComponent(cc.Button);
        this.equipIng = this.node.getChildByName("EquipIng");
        this.equipBtn.node.active = false;
        this.equipIng.active = false;
        this.ironBgSprite.spriteFrame=this.nomalStateSF;
    }

    onEnable()
    {
        this.node.x=cc.view.getVisibleSize().width;
        let worldy=this.node.convertToWorldSpaceAR(cc.v2(0,0)).y
        let topy=cc.view.getVisibleSize().height-1000;
        let delayTime=(Math.abs(worldy-topy))/4800;
        this.setEntranceAct(delayTime);
        if(this.curShowBtn)
        {
            this.flashLight(this.curShowBtn.node);
        }
    }
    /**
     * 设置枪皮肤图标
     */
    setIronSprite(path: string) {
        let self = this;
        cc.resources.load(path, cc.SpriteFrame, function (err, frame:cc.SpriteFrame) {
            if (err) {
                console.error(err);
                return;
            }
            self.ironSprite.spriteFrame = frame
        })
    }
 /**
     * 设置枪皮肤描述图标
     */
    setDesSprite(path: string) {
        let self = this;
        cc.resources.load(path, cc.SpriteFrame, function (err, frame:cc.SpriteFrame) {
            if (err) {
                console.error(err);
                return;
            }
            self.desSprite.spriteFrame = frame
        })
    }

    /**
    * 设置广告按钮点击事件监听
    */
    setAdBtnClickEvent(callback: Function) {
        this.adUnlockBtn.node.on("click", callback, this)
    }

    /**
    * 设置钻石按钮点击事件监听
    */
    setDiasBtnClickEvent(callback: Function) {
        this.diaUnlockBtn.node.on("click", callback, this)
    }

    /**
    * 设置装备按钮点击事件监听
    */
    setEquipBtnClickEvent(callback: Function) {
        this.equipBtn.node.on("click", callback, this)
    }



    /**
     * 设置枪的解锁类型
     */
    setlockType(type: string, val: number = null) {
        if (type == "dia") {
            this.adUnlockBtn.node.active = false;
            this.diaUnlockBtn.node.active = true;
            this.diaUnlockBtn.node.getComponentInChildren(cc.Label).string = val.toString();
            this.curShowBtn=this.diaUnlockBtn;
        }
        else if (type == "ad") {
            this.diaUnlockBtn.node.active = false;
            this.adUnlockBtn.node.active = true;
            this.curShowBtn=this.adUnlockBtn;
        }
        this.node.getComponentInChildren(GunSkinSuccesEquipEft).hide();       
    }

    /**
   * 设置枪为解锁状态
   */
    setUnlockState() {
        this.diaUnlockBtn.node.active = false;
        this.adUnlockBtn.node.active = false;
        this.equipIng.active = false;
        this.equipBtn.node.active = true;
        this.ironBgSprite.spriteFrame=this.nomalStateSF
        this.curShowBtn=this.ironBgSprite;
        this.node.getComponentInChildren(GunSkinSuccesEquipEft).hide();       
    }


    /**
   * 设置枪为装备状态
   */
    setEquipState() {
        this.diaUnlockBtn.node.active = false;
        this.adUnlockBtn.node.active = false;
        this.equipIng.active = true;
        this.equipBtn.node.active = false;
        this.ironBgSprite.spriteFrame=this.equipStateSF
        this.curShowBtn=null;
    }

    /**
     * 设置皮肤条的入场动画
     */
    setEntranceAct(delayTime:number)
    {
        this.node.stopAllActions();
        cc.tween(this.node).sequence(
            cc.tween().delay(delayTime),
            cc.tween().to(0.2,{x:0},{easing:"cubicOut"})
        ).start();
    }

    /**
     * 扫光
     */
    flashLight(node:cc.Node)
    {

       
    }

    /**
     * 枪成功装备动画
     */
    gunSkinSuccesEquipAnim()
    {
       this.node.getComponentInChildren(GunSkinSuccesEquipEft).anim();       
    }

    /**
     * normalShow
     */
    showEquipIron()
    {
        this.node.getComponentInChildren(GunSkinSuccesEquipEft).show();       
    }
}
