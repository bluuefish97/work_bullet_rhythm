const { ccclass, property } = cc._decorator;

@ccclass
export default class Android extends cc.Component {
    @property
    private gameNameKey: string = "zdjz"
    @property(cc.Node)
    private  splashNode: cc.Node = null;

    onLoad()
    {
        this.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().height);
    }

    /**
     * 闪屏
     * @param callback
     */
    public splash(callback) {
        this.node.active=true;
        this.splashAnimation(callback);
    }

    //安卓首页闪屏动画
    private splashAnimation(callback: Function) {
        let self = this;
        setTimeout(() => {
            self.splashNode.runAction(cc.sequence(
                cc.fadeOut(0.5),
                cc.callFunc(() => {
                    callback();
                })
            )
            )
        }, 2000);
    }

    /**
     * 协议检查
     */
    chackProtocol(callback: Function) {
        if (cc.sys.localStorage.getItem(this.gameNameKey + "agreeProtocol")) {
            this.protocolNode.active = false;
            callback();
        }
        else {
            this.protocolNode.active = true;
            this.agreeBtn.node.on("click",()=>{
                this.node.active=false;
                callback();
                cc.sys.localStorage.setItem(this.gameNameKey+"agreeProtocol",true);
            });
        }
    }
}
