import { Facade } from "../../core/puremvc/patterns/facade/Facade";


const { ccclass, property } = cc._decorator;

@ccclass
export default class AchiUnit extends cc.Component {
    @property(cc.SpriteFrame)
    private enableGetbgSf:cc.SpriteFrame=null;
    @property(cc.SpriteFrame)
    private disenableGetbgSf:cc.SpriteFrame=null;
    private bgSpr:cc.Sprite=null;
    private enableGetEftNode: cc.Node;      //可以领取状态下的高亮
    private enableGetButton: cc.Button;      //领取的按钮
    private disableGetButton: cc.Button;     //不可以领取的按钮   
    private overButton: cc.Button;           //全部等级成就都完成按钮
    private titleLabel: cc.Label = null;    //成就标题
    private gradeLabel: cc.Label = null;    //成就等级文本
    private desLabel: cc.RichText = null;    //成就表述文本
    private progressLabel: cc.Label = null;    //成就进度文本
    private rewardLabel: cc.Label = null;    //成就奖励文本
    private ironSprite: cc.Sprite = null;


    private testButton: cc.Button;


    onLoad() {
        this.bgSpr= this.node.getChildByName("Bg").getComponent(cc.Sprite);
        this.titleLabel = this.node.getChildByName("TitleLabel").getComponent(cc.Label);
        this.gradeLabel = this.node.getChildByName("GradeLabel").getComponent(cc.Label);
        this.desLabel = this.node.getChildByName("DesLabel").getComponent(cc.RichText);
        this.progressLabel = this.node.getChildByName("ProgressLabel").getComponent(cc.Label);
        this.rewardLabel = this.node.getChildByName("RewardLabel").getComponent(cc.Label);
        this.ironSprite = this.node.getChildByName("Iron").getComponent(cc.Sprite);
        this.enableGetButton = this.node.getChildByName("EnableGetButton").getComponent(cc.Button);
        this.disableGetButton = this.node.getChildByName("DisableGetButton").getComponent(cc.Button);
        this.overButton = this.node.getChildByName("OverButton").getComponent(cc.Button);
        this.enableGetEftNode = this.node.getChildByName("EnableGetEft");


        this.testButton = this.node.getChildByName("testButton").getComponent(cc.Button);
    }

    start() {
    }

    onEnable() {
        this.node.y = -cc.view.getVisibleSize().height;
    }
    /**
    * 设置领取按钮的点击事件监听
    * @param callback 
    */
    setEnableGetBtnClickEvent(callback: Function, target?: any) {
        this.enableGetButton.node.on("click", callback, target);
    }
    /**
    * 设置不能领取按钮的点击事件监听
    * @param callback 
    */
    setDisableGetBtnClickEvent(callback: Function, target?: any) {
        this.disableGetButton.node.on("click", callback, target);
    }


    /**
   * 设置测试按钮的点击事件监听
   * @param callback 
   */
    setTestBtnClickEvent(callback: Function, target?: any) {
        this.testButton.node.on("click", callback, target);
    }

    /**
     * 设置成就标题名
     */
    setTitleLabel(text: string) {
        this.titleLabel.string = text;
    }
    /**
     * 设置成就等级
     */
    setGradeLabel(text: string) {
        this.gradeLabel.string = text;
    }
    /**
     * 设置成就表述
     */
    setDesLabel(text: string) {
        this.desLabel.string = text;
    }
    /**
  * 设置成就进度
  */
    setProgressLabel(text: string) {
        this.progressLabel.string = text;
    }
    /**
     * 设置成就奖励
     */
    setRewardLabel(val: number) {
        this.rewardLabel.string = "+" + val.toString();
    }
    /**
     * 设置成就图标
     */
    setIronSprite(path: string) {
        let self = this;
        cc.resources.load(path, cc.SpriteFrame, function (err, frame :cc.SpriteFrame) {
            if (err) {
                console.error(err);
                return;
            }
            self.ironSprite.spriteFrame = frame
        })
    }

    /**
     * 打开可以领取的状态
     */
    openEnableGetState() {
        this.bgSpr.spriteFrame=this.enableGetbgSf;
        this.enableGetEftNode.active = true;
        this.enableGetButton.node.active = true;
        this.disableGetButton.node.active = false;
        this.overButton.node.active = false;
    }
    /**
     * 打开不可以领取的状态
     */
    openDisEnableGeState() {
        this.bgSpr.spriteFrame=this.disenableGetbgSf;
        this.disableGetButton.node.active = true;
        this.enableGetEftNode.active = false;
        this.enableGetButton.node.active = false;
        this.overButton.node.active = false;
    }
    /**
     * 打开over领取的状态
     */
    openOverBtnState() {
        this.bgSpr.spriteFrame=this.disenableGetbgSf;
        this.overButton.node.active = true;
        this.enableGetEftNode.active = false;
        this.enableGetButton.node.active = false;
        this.disableGetButton.node.active = false;
    }

    /**
     * 入场动画
     */
    setEntranceAct(delayTime: number, targetPos, dur = 0.2, cal?: Function) {
        cc.tween(this.node).sequence(
            cc.tween().delay(delayTime),
            cc.tween().to(dur, { y: targetPos.y }, { easing: "quadOut" })
        ).start();
        this.scheduleOnce(() => {
            cal && cal();
        }, dur + delayTime)
    }


     /**
     * 移动动画
     */
    setMoveAct( targetPos, dur = 0.2, cal?: Function) {
          cc.tween(this.node).to(dur, { y: targetPos.y }, { easing: "sineInOut" }
          ).start();
          this.scheduleOnce(() => {
              cal && cal();
          }, dur)
      }

    /**
     * 渐隐动画
     */
    setHideAct(dur = 0.2, delayTime: number) {
        cc.tween(this.node)
            .to(dur, { opacity: 0 })
            .delay(delayTime*0.5)
            .to(dur*0.5, { opacity: 255 })
            .start();
    }

}
