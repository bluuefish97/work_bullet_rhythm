import SongUnit from "../../../purmvc_app/mediator/SongUnit";
import GameManager from "../../../GameManager";
import { ClipEffectType } from "../../../AudioEffectCtrl";
import config, { Platform } from "../../../../config/config";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component { 


    _touchMoved: boolean = false;

    start() {

    }
    onEnable() {
        if(config.platform==Platform.oppo){
            this._registerEvent();
        }
    }
    onDisable() {
        if(config.platform==Platform.oppo){
            this._unregisterEvent();
        }
       
    }
    //private methods
    _registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);

    }

    _unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
    }
    // touch event handler
    _onTouchBegan(event, captureListeners) {
       // this._touchMoved = false;
    }
    _onTouchMoved(event, captureListeners) {

        // let touch = event.touch;
        // let deltaMove = touch.getLocation().sub(touch.getStartLocation());
        // if (deltaMove.mag() > 7) {
           
        //         let cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
        //         cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
        //         cancelEvent.touch = event.touch;
        //         cancelEvent.simulate = true;
        //         event.target.dispatchEvent(cancelEvent);
        //         this._touchMoved = true;
        //     }

    }

    _onTouchEnded(event, captureListeners) {
        if ( event.target !== this.node) {
            let songUnit = event.target.parent.getComponent(SongUnit)
            if (songUnit && songUnit.isADstate) {
                let ADinfo = songUnit.ADInfo;
                ASCAd.getInstance().nativeClick(ADinfo.adId);
            }
        }
    }

    _onTouchCancelled(event, captureListeners) {
    }
}
