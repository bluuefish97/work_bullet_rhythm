import { Utility } from "./util/Utility";
import { Facade } from "./core/puremvc/patterns/facade/Facade";
import { CommandDefine } from "./purmvc_app/command/commandDefine";

const { ccclass, property } = cc._decorator;

@ccclass
export default class RecController {
    private static instance: RecController;
    public recState: RecState;
    public recTime: number = 0;
    private interval;
    public recPath;     //录屏地址
    constructor() {
        if (RecController.instance)
            throw Error();
        RecController.instance = this;
        this.recState = RecState.WaitRecing;
    }
    static getInstance(): RecController {
        if (!RecController.instance)
            RecController.instance = new RecController();
        return RecController.instance;
    }

    
    /**
     * 开始录屏计时
     * @param cal 
     */
    public startRec(cal) {
        this.recPath=null;
        let timeStr = Utility.timeChangeToStr(this.recTime, 2);
        cal(timeStr);
       this.interval= setInterval(() => {
            this.recTime++;
            let timeStr = Utility.timeChangeToStr(this.recTime, 2);
            cal(timeStr);
            if(this.recTime>=290)
            {
                clearInterval( this.interval );//停止
                Facade.getInstance().sendNotification(CommandDefine.EndRec);
            }
        }, 1000)
    }

    /**
     * 停止录屏计时
     * @param cal 
     */
    public StopRec() {
        clearInterval( this.interval );//停止
        this.recTime=0
    }

}

export enum RecState {
    WaitRecing = 0,      //等待录制状态
    InRecing = 1,        //正在录制中
    EndRecing = 2        //录制完成
}
