
import BaseClickTip from "./BaseClickTip";
import { Dictionary } from "../Structure";

/**
 * 请点击
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class PleaseClickSys extends cc.Component {
    private static _instance: PleaseClickSys;
    private clickTipTypeDict: Dictionary<TipType, Array<BaseClickTip>> = new Dictionary<TipType, Array<BaseClickTip>>();  //保存在游戏中存在的所有提示数组

    public static getInstance(): PleaseClickSys {
        return PleaseClickSys._instance
    }

    onLoad() {
        if (!PleaseClickSys._instance) {
            PleaseClickSys._instance = this;
        } else if (PleaseClickSys._instance != this) {
            this.destroy();
        }
    }

    /**
     * 显示指定的提示
     */
    pushClickTip(ClickTip: BaseClickTip,type:TipType) {
        ClickTip.show();
        let  clickTipArray;
        if (!this.clickTipTypeDict.get_D(type)) {
            clickTipArray = new Array<BaseClickTip>();
            this.clickTipTypeDict.add_D(type,clickTipArray)
        }
        else
        {
            clickTipArray=this.clickTipTypeDict.get_D(type);
        }
       if(clickTipArray.indexOf(ClickTip)>=0)
       {
           return;
       }
        clickTipArray.push(ClickTip)
        console.log('弹出'+ClickTip.node.parent.name+'的提示');
    }

    /**
     * 清空显示
     */
    clearClickTipArray(type:TipType) {
        let  clickTipArray;
        if (!this.clickTipTypeDict.get_D(type)) {
           return
        }
        else
        {
            clickTipArray=this.clickTipTypeDict.get_D(type);
        }
        while (clickTipArray.length > 0) {
            var clickTip =clickTipArray.pop();
            clickTip.hide();
        }
    }

    /**
     * 关闭一个提示
     */
    closeClickTip(ClickTip: BaseClickTip,type:TipType) {
        ClickTip.hide();
        let  clickTipArray:Array<BaseClickTip>;
        if (!this.clickTipTypeDict.get_D(type)) {
           return
        }
        else
        {
            clickTipArray=this.clickTipTypeDict.get_D(type);
        }
        let index=clickTipArray.indexOf(ClickTip);
        if(index>=0)
        {
            clickTipArray.splice(index,1)
        }
       
    }
}


export enum TipType {
    SignChip = "SignChip",
    AchivChip = "AchivChip",
    MapChip = "MapChip"
}