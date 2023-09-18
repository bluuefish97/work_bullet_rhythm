import BasePanel from "../../util/BasePanel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class WelcomeNewPanel extends BasePanel {


    private songLabel: cc.Label=null;
    private efCircle: cc.Node=null;
    private startBtn: cc.Button=null;
    onLoad () {
        super.onLoad();
        this.efCircle=this.node.getChildByName("Disk").getChildByName("efCircle");
        this.songLabel=this.node.getChildByName("Disk").getChildByName("SongLabel").getComponent(cc.Label);
        this.startBtn = this.node.getChildByName("Start_btn").getComponent(cc.Button);
    }

    start () {
        this.efsAct();
    }

    efsAct()
    {
        let rotateAct=cc.tween().by(6,{angle:360});
        cc.tween(this.efCircle).repeatForever(rotateAct).start();
    }

    /**
     * 设置开始按钮的点击事件监听
     * @param callback 
     */
    setSignBtnClickEvent(callback: Function) {
        this.startBtn.node.on("click", callback, this);
    }

    /**
     * 设置开始歌曲名的显示
     */
    setScoreLabelShow(val: number)
    {
        this.songLabel.string=val.toString();
    }

}
