

const {ccclass, property} = cc._decorator;

@ccclass
export default class BaseClickTip extends cc.Component {

    @property(cc.Node)
    tip: cc.Node = null;
    
    show()
    {
        this.tip.active=true;
    }

    hide()
    {   
        this.tip.active=false;
    }
}
