import BaseClickTip from "./BaseClickTip";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MapSkinClickTip extends BaseClickTip {
    show()
    {
        super.show();
        let scaleTween=cc.tween().to(0.5,{scale:1.2},{easing:cc.easing.sineOut}).to(0.3,{scale:1},{easing:cc.easing.sineIn});
        cc.tween(this.tip).repeatForever(
            cc.tween().sequence(
                scaleTween,
                cc.tween().delay(1) 
            )
        ).start();
    }
}
