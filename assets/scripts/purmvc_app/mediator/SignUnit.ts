
const { ccclass, property } = cc._decorator;

@ccclass
export default class SignUnit extends cc.Component {
    @property(cc.SpriteFrame)
    normalSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    sevenSF: cc.SpriteFrame = null;
    private dayLabel: cc.Label = null;
    private awardLabel: cc.Label = null;
    private ironSpr: cc.Sprite = null;
    private bg: cc.Sprite = null;
    private oldtip: cc.Node = null;
    private newtip: cc.Node = null;
    onLoad() {
        this.dayLabel = this.node.getChildByName("dayLabel").getComponent(cc.Label);
        this.awardLabel = this.node.getChildByName("Award").getComponent(cc.Label);
        this.ironSpr = this.node.getChildByName("Iron").getComponent(cc.Sprite);
        this.bg = this.node.getChildByName("Bg").getComponent(cc.Sprite);
        this.oldtip = this.node.getChildByName("Oldtip");
        this.newtip = this.node.getChildByName("NewTip");
        this.oldtip.opacity = 0;
        this.newtip.opacity = 0;
    }
    onEnable() {
        
    }
    /**
     * 设置天数显示
     * @param text 
     */
    public setDayNameLabel(text: string) {
        this.dayLabel.string = text;
        //console.log(text);
    }
    /**
     * 设置奖励显示
     * @param text 
     */
    public setAwardLabel(text: string) {
        this.awardLabel.string = text;
    }
    /**
     * 设置iron显示
     * @param path 
     */
    public setIronSpr(path: string) {
        let self = this;
        cc.resources.load(path, cc.SpriteFrame, function (err, frame:cc.SpriteFrame) {
            if (err) {
                console.error(err);
                return;
            }
            self.ironSpr.spriteFrame = frame
        })
    }

     /**
     * 设置bg显示
     */
    public setBgSpr(isNormal:boolean) {
      this.bg.spriteFrame=isNormal? this.normalSF:this.sevenSF;
    }
    /**
     * 显示等待被签到
     */
    public showNowTip() {
        this.oldtip.opacity = 0;
        this.newtip.opacity = 255;
    }

    /**
     * 显示已经被签到
     */
    public showOldtip() {
        this.newtip.opacity = 0
        this.oldtip.opacity = 255;
    }
    
    /**
     * 显示等待被签到
     */
    public showWaitTip() {
        this.oldtip.opacity = 0;
        this.newtip.opacity = 0;
    }

    /**
     * 强调动画
     */
    showHighlightAct() {
        let ironNode = this.ironSpr.node;
        let ironDur = 0.4;
        let rotateTween = cc.tween().sequence(
            cc.tween().to(ironDur / 4, { angle: -20 }),
            cc.tween().to(ironDur / 2, { angle: 20 }),
            cc.tween().to(ironDur / 4, { angle: 0 }),
        )
        cc.tween(ironNode).repeatForever(
            cc.tween().sequence(
                cc.tween().parallel(
                    cc.tween().to(ironDur, { scale: 1.2 }, { easing: "cubicOut" }),
                    rotateTween
                ),
                cc.tween().parallel(
                    cc.tween().to(ironDur, { scale: 1 }, { easing: "cubicIn" }),
                    rotateTween
                ) ,
                cc.tween().delay(1)
            )
        ).start();
    }
}
