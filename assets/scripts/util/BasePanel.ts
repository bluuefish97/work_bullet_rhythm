//面板的基类

const { ccclass, property } = cc._decorator;

@ccclass
export default class BasePanel extends cc.Component {
    // @property({type:cc.AudioClip})
    // public btnClip:cc.AudioClip=null;
    
    public onEnterCall:Function=null;
    public onPauseCall:Function=null;
    public onResumeCall:Function=null;
    public onExitCall:Function=null;

    onLoad()
    {
        this.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
        this.node.setPosition(0, 0);
    }
    /**
     *  打开面板
     */
    onEnter() {
        this.node.zIndex = 999;
        this.node.active=true;
        this.onEnterCall&&this.onEnterCall();
        console.log(this.node.name + ': onEnter') 
 
    }

     /**
     * 暂停使用
     */
    onPause() {
        this.node.pauseSystemEvents(true);
        this.node.zIndex = 0;
        this.node.active=false;
        this.onPauseCall&&this.onPauseCall();
        console.log(this.node.name + ': onPause')
    }

    onResume() {
        this.node.resumeSystemEvents(true);
        this.node.zIndex = 999;
        this.node.active=true;
        this.onResumeCall&&this.onResumeCall();
        console.log(this.node.name + ': onResume')
    }
    onExit() {
        this.node.zIndex =0;
        this.node.active=false;
        this.onExitCall&&this.onExitCall();
        console.log(this.node.name + ': onExit') 
    }
}
