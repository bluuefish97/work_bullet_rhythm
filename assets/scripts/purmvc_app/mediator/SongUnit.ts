

import { CONSTANTS } from "../../Constants";



const { ccclass, property } = cc._decorator;

@ccclass
export default class SongUnit extends cc.Component {
    // @property({ type: cc.AudioClip })
    // public btnClip: cc.AudioClip = null;
    // @property({ type: cc.AudioClip })
    // public startplayBtnClip: cc.AudioClip = null;

    // @property(cc.Prefab)        //音浪预制体
    // soundWavePrf: cc.Prefab = null;

    @property(cc.SpriteFrame)
    hardSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    varyhardSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    playStateSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    stopStateSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    playBgSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    stopBgSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    ADStartBtnSF: cc.SpriteFrame = null;
    @property
    public isFinish: boolean = false;

    private songNameLabel: cc.Label = null;
    private singerNameLabel: cc.Label = null;
    private bestScoreLabel: cc.Label = null;
    private powerNumLabel: cc.Label = null;
    private songIronSpr: cc.Sprite = null;
    private waitingNode: cc.Node = null;
    private starsContent: cc.Node = null
    private adUnlockBtn: cc.Button = null;
    private diaUnlockBtn: cc.Button = null;
    public songPlaySwitchBtn: cc.Button = null
    private startBtn: cc.Button = null;
    private selectTip: cc.Node = null
    private hardTip: cc.Node = null
    private newTip: cc.Node = null
    public isPlayState: boolean = false;
    public isPause: boolean = true;
    private StartBtnSF: cc.SpriteFrame = null;
    isADstate:boolean=false;
    ADInfo: any=null;
    public get StartBtnNode(): cc.Node {
        return this.startBtn.node;
    }

    public get IsPlayState(): boolean {
        return this.isPlayState
    }

    public set IsPlayState(v: boolean) {
        this.isPlayState = v;
    }

    onLoad() {
        this.starsContent = this.node.getChildByName("Stars");
        this.selectTip = this.node.getChildByName("SelectTip");
        this.waitingNode = this.node.getChildByName("waiting");
        this.hardTip = this.node.getChildByName("HardTip");
        this.newTip = this.node.getChildByName("NewTip");
        this.songIronSpr = this.node.getChildByName("Iron").getComponent(cc.Sprite);
        this.adUnlockBtn = this.node.getChildByName("Ads_btn").getComponent(cc.Button);
        this.diaUnlockBtn = this.node.getChildByName("Dias_btn").getComponent(cc.Button);
        this.startBtn = this.node.getChildByName("Start_btn").getComponent(cc.Button);
        this.songPlaySwitchBtn = this.node.getChildByName("Switch").getComponent(cc.Button);

        this.songNameLabel = this.node.getChildByName("SongNameLabel").getComponent(cc.Label);
        this.singerNameLabel = this.node.getChildByName("SingerNameLabel").getComponent(cc.Label);
        this.bestScoreLabel = this.node.getChildByName("BestScoreLabel").getComponent(cc.Label);
        this.powerNumLabel = this.startBtn.getComponentInChildren(cc.Label);
        for (let i = 1; i <= this.starsContent.childrenCount; i += 2) {
            this.starsContent.children[i].active = false;
        }
        this.isPause = true;
        this.setStopStateShow();
        this.setSelectTipShowState(false);
        this.setPowerNumLabel(CONSTANTS.oneConsumePowerValue.toString())
        this.StartBtnSF = this.startBtn.getComponent(cc.Sprite).spriteFrame;
    }

    onEnable() {
        this.waitingNode.active = false;
        if (this.isFinish) {
            this.setFinishEntranceAct();
        }
        else {
            this.node.x = cc.view.getVisibleSize().width;
            let worldy = this.node.convertToWorldSpaceAR(cc.v2(0, 0)).y
            let topy = cc.view.getVisibleSize().height - 850;
            let delayTime = (Math.abs(worldy - topy)) / 4800;
            this.setEntranceAct(delayTime);
        }

    }

    /**
     * 设置歌曲名
     */
    setSongNameLabel(text: string) {
        this.songNameLabel.string = text;
    }
    /**
     * 设置歌手名
     */
    setSingerNameLabel(text: string) {
        this.singerNameLabel.string = text;
    }

    /**
 * 设置消耗的体力值
 */
    setPowerNumLabel(text: string) {
        this.powerNumLabel.string = text;
    }

    /**
     * 设置获得的星星数
     */
    setStarsNum(num: number) {
        let temp = 0;
        for (let i = 1; i <= this.starsContent.childrenCount; i += 2) {
            if (num > temp) {
                this.starsContent.children[i].active = true;
                temp++;
            }
            else {
                this.starsContent.children[i].active = false;
            }
        }
    }

    /**
     * 设置最高分
     */
    setBestScore(num: number) {
        this.bestScoreLabel.string = num.toString();
    }


    /**
     * 设置歌曲的图片
     */
    setSongIronSpr(fs: cc.SpriteFrame) {
        this.songIronSpr.spriteFrame = fs;
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
    * 设置开始按钮点击事件监听
    */
    setStartBtnClickEvent(callback: Function) {
        this.startBtn.node.on("click", callback, this)
    }
    /**
     * 设置播放按钮点击事件监听
     */
    songPlaySwitchBtnClickEvent(callback: Function) {
        this.songPlaySwitchBtn.node.on("click", callback, this)
    }

    /**
     * 设置AD点击事件监听
     */
    ADClickEvent(callback: Function) {
        this.node.on(cc.Node.EventType.TOUCH_START, callback, this)
    }
    /**
     * 设置歌曲的解锁类型
     */
    setUnlockType(type: string, val: number = null) {
        this.adUnlockBtn.node.active = false;
        this.diaUnlockBtn.node.active = false;
        this.startBtn.node.active = false;
        if (type == "coin") {
            this.diaUnlockBtn.node.active = true;
            this.diaUnlockBtn.node.getComponentInChildren(cc.Label).string = val.toString();
        }
        else if (type == "video") {
            this.adUnlockBtn.node.active = true;
        }
        this.isADstate=false;
    }

    /**
     * 设置歌曲的解锁状态
     */
    setUnlockState() {
        this.adUnlockBtn.node.active = false;
        this.diaUnlockBtn.node.active = false;
        this.startBtn.node.active = true;
        this.startBtn.getComponent(cc.Sprite).spriteFrame = this.StartBtnSF;
        this.isADstate=false;
        this.startBtn.node.children.forEach((item)=>{
            item.active=true;
        })
    }

    /**
     * 设置歌曲的AD状态
     */
    setADState() {
        this.adUnlockBtn.node.active = false;
        this.diaUnlockBtn.node.active = false;
        this.startBtn.node.active = true;
        this.startBtn.getComponent(cc.Sprite).spriteFrame = this.ADStartBtnSF;
        this.isADstate=true;
        this.startBtn.node.children.forEach((item)=>{
            item.active=false;
        })
    }

    /**
     * 设置歌曲为播放时状态
     */
    setPlayStateShow() {
        this.songPlaySwitchBtn.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = this.playStateSF;
        this.node.getChildByName("Bg").getComponent(cc.Sprite).spriteFrame = this.playBgSF;
        // this.playingWaveAct();
    }

    /**
    * 设置歌曲为选中时状态
    */
    setSelectTipShowState(IsShow: boolean) {
        this.selectTip.active = IsShow;
        this.isPlayState = IsShow;
    }

    /**
    * 设置结束歌曲为解锁状态
    */
    setEndUnlokTipShow(IsShow: boolean) {

        let newTip = this.node.getChildByName("EndNewTip");
        newTip.active = IsShow;
        if (IsShow) {
            this.adUnlockBtn.node.active = false;
            this.diaUnlockBtn.node.active = false;
            this.startBtn.node.active = false;
        }
    }

    /**
      * 设置结束歌曲的解锁状态
      */
    setEndUnlockState() {
        let newTip = this.node.getChildByName("EndNewTip");
        newTip.active = false;
        this.adUnlockBtn.node.active = false;
        this.diaUnlockBtn.node.active = false;
        this.startBtn.node.active = true;
    }

    /**
     * 设置歌曲为停止时状态
     */
    setStopStateShow() {
        this.stopWave();
        this.waitingNode.active = false;
        this.songPlaySwitchBtn.node.active = true;
        this.songPlaySwitchBtn.node.getChildByName("bg").getComponent(cc.Sprite).spriteFrame = this.stopStateSF;
        this.node.getChildByName("Bg").getComponent(cc.Sprite).spriteFrame = this.stopBgSF;
    }

    /**
     * 设置歌曲的播放图标状态
     */
    setSongPlayState(_playState, _isPause) {
        this.isPause = _isPause;
        this.setSelectTipShowState(_playState)
        if (_playState) {
            if (this.isPause) {
                this.setStopStateShow();
            }
            else {
                this.setPlayStateShow();
            }
        }
        else {
            this.setStopStateShow();
        }
    }

    /**
   * 设置歌曲的难度显示
   */
    showHardTip(hardLv: string) {
        switch (hardLv) {
            case "hard":
                this.hardTip.active = true;
                this.hardTip.getComponent(cc.Sprite).spriteFrame = this.hardSF;
                break;
            case "superhard":
                this.hardTip.active = true;
                this.hardTip.getComponent(cc.Sprite).spriteFrame = this.varyhardSF;
                break;
            default:
                this.hardTip.active = false;
                break;
        }

    }

    /**
   * 设置歌曲的全新标识显示
   */
    showNewStateTip(isShow: boolean) {
        this.newTip.active = isShow;
    }

    /**
     * 设置歌曲条的入场动画
     */
    setEntranceAct(delayTime: number) {
        this.node.stopAllActions();
        cc.tween(this.node).sequence(
            cc.tween().delay(delayTime),
            cc.tween().to(0.2, { x: 0 }, { easing: "cubicOut" })
        ).start();
    }


    /**
     * 设置结束歌曲条的入场动画
     */
    setFinishEntranceAct() {
        // let durTime = 0.5;
        // this.node.scale = 0;
        // this.node.stopAllActions();
        // let jumpAct = cc.jumpTo(durTime, this.node.getPosition(), 100, 1);
        // let scaleAct = cc.sequence(
        //     cc.scaleTo(durTime * 0.8, 0.9),
        //     cc.scaleTo(durTime * 0.2, 0.8))
        // let mainAct = cc.spawn(jumpAct, scaleAct);
        // this.node.runAction(mainAct);
    }

    /**
     * 歌曲播放加载中
     */
    waitingAct() {
        let roll = this.waitingNode.getChildByName("roll");
        this.waitingNode.active = true;
        roll.active = true;
        this.songPlaySwitchBtn.node.active = false;
        // this.waitingSpr.fillRange = 1; 
        roll.angle = 0;
        roll.stopAllActions();
        cc.tween(roll).repeatForever(
            cc.tween().to(5, { angle: 360 }),
        ).start();
    }
    /**
     * 歌曲播放加载完成
     */
    waitingEndAct() {
        let roll = this.waitingNode.getChildByName("roll");
        this.waitingNode.active = true;
        roll.active = true;
        roll.stopAllActions();
        cc.tween(roll).sequence(
            cc.tween().to(0.2, { angle: 0 }),
            cc.callFunc(() => {
                this.songPlaySwitchBtn.node.active = true;
                this.waitingNode.active = false;
            })
        ).start();

        // this.waitingSpr.fillRange = 1;  
        cc.tween(roll).repeatForever(
            cc.tween().to(5, { angle: 360 }),
        ).start();
    }
    /**
     * 歌曲播放中
     */
    playingWaveAct() {
        if (this.isFinish) return;
        this.oneWave();
        this.schedule(this.oneWave, 2)
    }

    /**
     * 提供开始按钮的世界坐标
     */
    getStartBtnWorldPos() {
        let worldPos = this.startBtn.node.convertToWorldSpaceAR(cc.v2(0, 0));
        return worldPos
    }



    oneWave()       //一次音浪
    {
        // let self = this;
        // let obj = PoolManager.instance.getNode(self.soundWavePrf, self.node);
        // let wave = obj.getComponent(SoundWave);
        // wave.setStartPos(cc.v2(Utility.randomRange(350, 500), -150))
    }

    stopWave() {
        // this.unschedule(this.oneWave)
        // this.node.getComponentsInChildren(SoundWave).forEach((wave) => {
        //     wave.hideAct();
        // })
    }
}
