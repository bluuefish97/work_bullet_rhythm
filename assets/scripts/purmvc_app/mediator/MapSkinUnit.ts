
const { ccclass, property } = cc._decorator;

@ccclass
export default class MapSkinUnit extends cc.Component {

    // @property({type:cc.AudioClip})
    // public mapDownClip:cc.AudioClip=null;

    private ironSpr: cc.Sprite = null;
    private oldtip: cc.Node = null;
    private newtip: cc.Node = null;
    public pageIdx:number;
    onLoad() {
        this.ironSpr = this.node.getChildByName("Iron").getComponent(cc.Sprite);
    }
    onEnable() {
        this.hide();
    }
    
    /**
     * 地图块入场动画
     */
    public showAct()
    {
        let view=this.ironSpr.node;
        view.stopAllActions();
        view.y=view.height;
        view.scaleY=1;
        view.opacity=0;
        cc.tween(view).to(0.3,{y:-100,scaleY:0.8,opacity:255}).to(0.8,{y:0,scaleY:1},{easing:cc.easing.elasticOut}).start();
    }

    public hide()
    {
        let view=this.ironSpr.node;
        view.stopAllActions();
        cc.tween(view).to(0.2,{opacity:0}).start();
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
     * 播放落地声
     */
    playDownClip()
    {
        // this.scheduleOnce(()=>{
        //     cc.audioEngine.play(this.mapDownClip, false, 1);
        // },0.3)
    }
}
