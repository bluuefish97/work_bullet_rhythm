import BasePanel from "../../util/BasePanel";
import config, { Platform } from "../../../config/config";
import OppoNativePasterStyle from "../../util/OppoNativePasterStyle";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SongRecommendPanel extends BasePanel {


    @property(cc.SpriteFrame)
    playSF: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    stopSF: cc.SpriteFrame = null;
    private box: cc.Node = null;
    private canelBtn: cc.Button = null;
    private aD_UnLockBtn: cc.Button = null;
    private unLockBtn: cc.Button = null;
    private playBtn: cc.Button = null;
    private songNameLabel: cc.Label = null;
    private songIron: cc.Sprite = null;

    public get AD_UnLockBtn(): cc.Button {
        return this.aD_UnLockBtn;
    }
    public get UnLockBtn(): cc.Button {
        return this.unLockBtn;
    }


    onLoad() {
        super.onLoad();
        this.box = this.node.getChildByName("Box");
        this.canelBtn = this.box.getChildByName("CanelBtn").getComponent(cc.Button);
        this.aD_UnLockBtn = this.box.getChildByName("AD_UnLockBtn").getComponent(cc.Button);
        this.unLockBtn = this.box.getChildByName("UnLockBtn").getComponent(cc.Button);
        this.playBtn = this.box.getChildByName("PlayBtn").getComponent(cc.Button);
        this.songNameLabel = this.box.getChildByName("SongNameLabel").getComponent(cc.Label);
        this.songIron = this.box.getChildByName("SongIron").getComponent(cc.Sprite);
    }

    onEnter() {
        super.onEnter();
        this.switchUnlockState(false);
        this.canelBtn.node.active = true;
        switch (config.platform) {
            // case Platform.android:
            //     {
            //         ASCAd.getInstance().getNativeImageFlag() && ASCAd.getInstance().showNativeImage(0, 0, 0, 0);
            //         break;
            //     }
            // case Platform.oppo:
            //     {
            //         let styleObj = this.node.getComponentInChildren(OppoNativePasterStyle);
            //         let info = ASCAd.getInstance().getNativeAdInfo(1);
            //         if (styleObj) {
            //             styleObj.setNativeInfo(info);
            //         }
            //         break;
            //     }

            default:
                break;
        }
        this.box.scale = 0;
        cc.tween(this.box).to(0.2, { scale: 1.3 }).to(0.8, { scale: 1 }, { easing: cc.easing.elasticOut }).start();
    }

    onExit() {
        super.onExit();
        // ASCAd.getInstance().hideNativeImage();
        // console.log("SongRecommendPanel  退出");
    }

    start() {

    }

    public switchUnlockState(isUnlock: boolean) {
        this.unLockBtn.node.active = isUnlock;
        this.aD_UnLockBtn.node.active = !isUnlock;
    }

    /**
     * 设置放弃按钮点击事件监听
     */
    public setCanelBtnClickEvent(callback: Function) {
        let exCallback = () => {
            callback();
            // setTimeout(() => {
            //     ASCAd.getInstance().showInters();
            // }, 500);
        }
        this.canelBtn.node.on("click", exCallback, this);
    }
    /**
     * 设置解锁按钮点击事件监听
     */
    public setADUnLockBtnClickEvent(callback: Function) {
        this.aD_UnLockBtn.node.on("click", callback, this);
    }
    /**
    * 设置开始游戏按钮点击事件监听
    */
    public setUnLockBtnClickEvent(callback: Function) {
        this.unLockBtn.node.on("click", callback, this);
    }
    /**
     * 设置播放歌曲按钮点击事件监听
     */
    public setPlayBtnClickEvent(callback: Function) {
        this.playBtn.node.on("click", callback, this);
    }

    /**
    * 设置推荐歌曲的歌名显示
    */
    setRecommendSongName(str: string) {

        this.songNameLabel.string = str;
    }

    setSongIronSpr(sf: cc.SpriteFrame) {
        this.songIron.spriteFrame = sf;
    }
    /**
     * 设置推荐歌曲的播放显示
     */
    setPlayStateShow(isPlay: boolean) {

        this.playBtn.node.getComponent(cc.Sprite).spriteFrame = isPlay ? this.playSF : this.stopSF;
    }

}
