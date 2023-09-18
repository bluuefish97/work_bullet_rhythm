/**
 * z暂时没有用
 */

import { PlayHardLv } from "../Game/PlayStage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HardTipBox extends cc.Component {

    @property(cc.SpriteFrame)
    hardSf: cc.Label = null;
    @property(cc.SpriteFrame)
    varyHardSf: cc.Label = null;

    topTip:cc.Node=null;
    downTip:cc.Node=null;
    Light:cc.Node=null;
    box:cc.Node=null;
     onLoad () {

     }

     setHardLv(playHardLv:PlayHardLv)
     {

     }

}
