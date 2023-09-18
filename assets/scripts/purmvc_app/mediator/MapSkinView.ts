import MapSkinUnit from "./MapSkinUnit";
import { Utility } from "../../util/Utility";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { CommandDefine } from "../command/commandDefine";
import { ConsumablesType, ConsumablesAlterInfo } from "../repositories/Rep";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MapSkinView extends cc.Component {
    // @property({type:cc.AudioClip})
    // public btnClip:cc.AudioClip=null;
    @property(cc.Prefab)
    skinPre: cc.Prefab = null;

    private pageView: cc.PageView = null;
    private forwardPointer: cc.Button = null;
    private backPointer: cc.Button = null;
    private adGetMapShipBtn: cc.Button = null;
    private voucherButton: cc.Button = null;
    private equipButton: cc.Button = null;
    private equipedButton: cc.Button = null;
    private voucherLabel: cc.Label = null;
    private voucherMsgBtn: cc.Button = null;
    private MapShipLabel: cc.Label = null;
    private MapShipBar: cc.ProgressBar = null;

    private voucherMsgPart: cc.Node = null;

    private isRolling: boolean = false;
    private isTopShow: boolean

    public get PageView() : cc.PageView {
        return this.pageView
    }
    

    public get IsTopShow(): boolean {
        return this.node.active
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    findCompent() {
        this.pageView = this.node.getChildByName("MapPageView").getComponent(cc.PageView);
        this.forwardPointer = this.node.getChildByName("pointer_L").getComponent(cc.Button);
        this.backPointer = this.node.getChildByName("pointer_R").getComponent(cc.Button);
        this.adGetMapShipBtn = this.node.getChildByName("Adbtn").getComponent(cc.Button);
        this.voucherButton = this.node.getChildByName("VoucherButton").getComponent(cc.Button);
        this.equipButton = this.node.getChildByName("EquipButton").getComponent(cc.Button);
        this.equipedButton = this.node.getChildByName("EquipedButton").getComponent(cc.Button);
        this.MapShipLabel = this.node.getChildByName("ProLabel").getComponent(cc.Label);
        this.voucherLabel = this.node.getChildByName("chipVoucher").getComponentInChildren(cc.Label);
        this.voucherMsgBtn = this.node.getChildByName("chipVoucher").getComponentInChildren(cc.Button);
        this.voucherMsgPart= this.node.getChildByName("msgPart");
        this.MapShipBar = this.node.getChildByName("ChipNumProgressBar").getComponent(cc.ProgressBar);
        this.adGetMapShipBtn.node.active = false;
        this.voucherButton.node.active = false;
        this.equipButton.node.active = false;
        this.equipedButton.node.active = false;
        this.voucherMsgPart.active=false;
        this.voucherMsgPart.setContentSize(cc.view.getVisibleSize());
        this.voucherMsgBtn.node.on("click", this.openVoucherMsgPart,this);
        this.voucherMsgPart.on("click", () => {
            this.voucherMsgPart.active=false;
        },this);
    }

    onEnable()
    {
    }
    /**
   * 设置向前的点击事件监听
   * @param callback 
   */
    setForwardPointerClickEvent(callback: Function, target?) {
        this.forwardPointer.node.on("click", callback, target);
    }

    /**
   * 设置向后的点击事件监听
   * @param callback 
   */
    setBackBtnClickEvent(callback: Function, target?) {
        this.backPointer.node.on("click", callback, target);
    }

    /**
   * 设置广告获取的点击事件监听
   * @param callback 
   */
    setAdGetMapShipBtnClickEvent(callback: Function, target?) {
        this.adGetMapShipBtn.node.on("click", callback, target);
    }
    /**
    * 设置抵用券使用的点击事件监听
    * @param callback 
    */
    setVoucherButtonClickEvent(callback: Function, target?) {
        this.voucherButton.node.on("click", callback, target);
    }

    /**
    * 设置装备的点击事件监听
    * @param callback 
    */
    setEquipButtonClickEvent(callback: Function, target?) {
        this.equipButton.node.on("click", callback, target);
    }

    /**
    * 设置正在使用的点击事件监听
    * @param callback 
    */
    setEquipedButtonClickEvent(callback: Function, target?) {
        this.equipedButton.node.on("click", callback, target);
    }

    /**
     * 翻页事件
     */
    setPageturningClickEvent(callback:Function, target?){
        this.pageView.node.on("page-turning", callback, target);
    }


    /**
     * 添加一个页面到地图皮肤列表内
     */
    public addMapSkinPage(path: string) {
        let skin = cc.instantiate(this.skinPre);
        let skinUnit = skin.getComponent(MapSkinUnit);
        skinUnit.setIronSpr(path);
        this.pageView.addPage(skin);
        skinUnit.pageIdx=this.pageView.getPages().length-1;
    }

    /**
     * 向前或后翻页
     */
    public scrollToPageLastOrNext(isLast: boolean) {
        if (!this.isRolling) {
            this.isRolling = true;
            let curIdx = this.pageView.getCurrentPageIndex();
            let tempID;
            if (isLast) {
                tempID = curIdx - 1 >= 0 ? curIdx - 1 : 0;
            }
            else {
                tempID = curIdx + 1 <= this.pageView.getPages().length - 1 ? curIdx + 1 : this.pageView.getPages().length - 1;
            }
            this.pageView.scrollToPage(tempID, 0.5);
            this.scheduleOnce(() => {
                this.isRolling = false;
            }, 0.5)
            return tempID;
        }
        else return -1;

    }

    /**
     * 设置获取的碎片值
     */
    public setMapShipLabelShow(cur: number, target: number) {
        this.MapShipLabel.string = cur + "/" + target;
    }

    /**
     * 设置抵用券的值
     */
    public setVoucherLabel(val: number) {
        this.voucherLabel.string = val.toString();
    }

    /**
     * 设置获取的碎片进度值
     */
    public setMapShipBar(cur: number, target: number) {
        this.MapShipBar.progress = cur / target;
    }

    /**
     * 进度值变化效果
     */
    public transMapShipPro(originVal: number, accVal: number, target: number, callback: Function) {
        let temp = (originVal + accVal) / target;
        let efts=this.MapShipBar.getComponentInChildren(cc.ParticleSystem);
        efts.resetSystem();
        cc.tween(this.MapShipBar).to(accVal / 20, { progress: temp })
            .call(callback)
            .call(()=>{efts.stopSystem()})
            .start();
        let self = this;
        let cal = function (val) {
            self.setMapShipLabelShow(val, target);
        }

        Utility.addScoreAnim(originVal, accVal, 0.05, cal, this);
    }

    /**
     * 关闭进度显示
     */
    public switchMapShipProress(ison: boolean) {
        this.MapShipLabel.node.active = ison;
        this.MapShipBar.node.active = ison;
    }

    public switchToState(state: MapSkinState) {
        this.adGetMapShipBtn.node.active = false;
        this.voucherButton.node.active = false;
        this.equipButton.node.active = false;
        this.equipedButton.node.active = false;
        this.node.getChildByName("VoucherComusMsgLabel").getComponent(cc.Label).string="";
        switch (state) {
            case MapSkinState.NotHold:
                this.adGetMapShipBtn.node.active = true;
                break;
            case MapSkinState.CanHold:
                this.voucherButton.node.active = true;
                break;
            case MapSkinState.Hold:
                this.equipButton.node.active = true;
                break;
            case MapSkinState.Using:
                this.equipedButton.node.active = true;
                break;
            default:
                break;
        }
    }


    public setConsumeVoucherLabel(val: number) {
       this.node.getChildByName("VoucherComusMsgLabel").getComponent(cc.Label).string="可以使用"+val+"个碎片合成哦!"
        this.voucherButton.node.getComponentInChildren(cc.Label).string="-"+val.toString();
    }
    /**
     * 打开详细信息面板
     */
    private openVoucherMsgPart()
    {
        console.log("打开详细信息面板");
       
        this.voucherMsgPart.active=true;
        let view=this.voucherMsgPart.getChildByName("view");
        view.stopAllActions();
        view.scale=0
      cc.tween(view).to(0.15,{scale:0.8})
      .to(0.3,{scale:1},{easing:cc.easing.elasticOut}).start();
    }
    //--------------测试
    public testAddVoucher() {
        Facade.getInstance().sendNotification(CommandDefine.Consumables,
            {
                info: new ConsumablesAlterInfo(ConsumablesType.voucher, 1),
                callback: null
            })
    }
}

export enum MapSkinState {
    Hold = "Hold",
    Using = "Using",
    NotHold = "NotHold",
    CanHold = "CanHold"
}
