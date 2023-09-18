/**
 * 成就界面中介
 */
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import UIPanelCtr from "../../util/UIPanelCtr";
import AchiPanel from "./AchiPanel";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { AchivInfo } from "../repositories/Rep";
import { AchiUnitMediator } from "./AchivUnitMediator";
import { MediatorDefine } from "./mediatorDefine";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";

export class AchiMediator extends Mediator {
    private achiPanel: AchiPanel = null;
    private unitHight: number = 300;
    private gamePxy: GamePxy;
    public constAchiListPos: Array<cc.Vec2> = new Array<cc.Vec2>();    //成就条的列表位置坐标数组
    public normalAchiUnitList: Array<AchiUnitMediator> = new Array<AchiUnitMediator>();    //正常的成就列表
    public topAchiUnitList: Array<AchiUnitMediator> = new Array<AchiUnitMediator>();    //需置顶的成就列表
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }
        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.gamePxy = Facade.getInstance().retrieveProxy(ProxyDefine.GamePxy) as GamePxy;
        this.achiPanel = viewNode.getComponent(AchiPanel);
        setTimeout(() => {
            this.gamePxy.getAchivConfig(this.assignAchivUnit.bind(this));
        }, 1)

        this.bindListener();
    }

    private bindListener(): void {
        this.achiPanel.setCloseBtnClickEvent(() => {
          //  cc.audioEngine.play(this.achiPanel.btnClip,false,1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();
        })
        this.achiPanel.onEnterCall=()=>{
            this.updownAchivUnitListTargetPos();
            ReportAnalytics.getInstance().reportAnalytics("View_Show","AchievementUI_Show",1);
        }
    }

    public listNotificationInterests(): string[] {
        return [

        ];
    }

    public handleNotification(notification: INotification): void {
    }


    /**
     * 配置成就单元
     */
    private assignAchivUnit(configs: Array<AchivInfo>) {
        this.achiPanel.setListScrollViewContentSizeY(configs.length * this.unitHight + 300);
        for (let i = 0; i < configs.length; i++) {
            this.constAchiListPos.push(cc.v2(0, -i * this.unitHight - this.unitHight / 2));
        }
        for (let i = 0; i < configs.length; i++) {  // 
            let acivUnit = this.achiPanel.createAchivUnit();
            let med = new AchiUnitMediator(MediatorDefine.AchiUnitMediator + configs[i].id, acivUnit);
            med.initAchiInfo(configs[i]);
            Facade.instance.registerMediator(med);
        }
        this.updownAchivUnitListTargetPos();
    }

   
  /**
     * 删除一个normal的成就单元
     */
    public spliceNormalAchivUnit(achiUnitMed: AchiUnitMediator)
    {
        if (this.normalAchiUnitList.indexOf(achiUnitMed) >= 0)    //该成就单元存在过Notmallist
        {
            this.normalAchiUnitList.splice(this.normalAchiUnitList.indexOf(achiUnitMed), 1);
        }
        this.updateNormalPos(1);
        this.updateTopListPos(1);
    }

    /**
     * push一个成就单元到normallist中
     */
    public pushNormalAchivUnit(achiUnitMed: AchiUnitMediator) {
        if (this.topAchiUnitList.indexOf(achiUnitMed) >= 0)   //该成就单元存在过toplist
        {
            this.topAchiUnitList.splice(this.topAchiUnitList.indexOf(achiUnitMed), 1);
        } else if (this.normalAchiUnitList.indexOf(achiUnitMed) >= 0)    //该成就单元存在过Notmallist
        {
            this.normalAchiUnitList.splice(this.normalAchiUnitList.indexOf(achiUnitMed), 1);
            console.log("删除");
        }
        this.normalAchiUnitList.push(achiUnitMed);      //把这个成就单元先push进Notmal
        this.updateNormalPos();
        this.updateTopListPos();
    }

    /**
     * 置顶一个成就单元到normallist中
     */
    public unshiftNormalAchivUnit(achiUnitMed: AchiUnitMediator) {
        if (this.normalAchiUnitList.indexOf(achiUnitMed) >= 0)    //该成就单元存在过Notmallist
        {
            this.normalAchiUnitList.splice(this.normalAchiUnitList.indexOf(achiUnitMed), 1);
        }
        if (this.topAchiUnitList.indexOf(achiUnitMed) >= 0)   //该成就单元存在过toplist
        {
            this.topAchiUnitList.splice(this.topAchiUnitList.indexOf(achiUnitMed), 1);   
        }  
        this.normalAchiUnitList.unshift(achiUnitMed);      //把这个成就单元unshift进Notmal
      this.updateNormalPos();
      this.updateTopListPos();
    }


    /**
     * 删除一个Toplist的成就单元
     */
    public spliceTopAchivUnit(achiUnitMed: AchiUnitMediator)
    {
        if (this.topAchiUnitList.indexOf(achiUnitMed) >= 0)   //该成就单元存在过toplist
        {
            this.topAchiUnitList.splice(this.topAchiUnitList.indexOf(achiUnitMed), 1);
        }
        this.updateNormalPos();
        this.updateTopListPos();
    }

    /**
     * 置顶一个成就单元到Toplist中
     */
    public unshiftTopAchivUnit(achiUnitMed: AchiUnitMediator) {
        if (this.normalAchiUnitList.indexOf(achiUnitMed) >= 0)    //该成就单元存在过Notmallist
        {
            this.normalAchiUnitList.splice(this.normalAchiUnitList.indexOf(achiUnitMed), 1);
        }
        if (this.topAchiUnitList.indexOf(achiUnitMed) < 0)   //该成就单元存在过toplist
        {
            this.topAchiUnitList.unshift(achiUnitMed);      //把这个成就单元unshift进Top
        }  
      this.updateNormalPos();
      this.updateTopListPos();
    }


    /**
     * 更新toplist内的坐标
     */ 
    updateTopListPos(offset=0)
    {
        this.topAchiUnitList.forEach((med,idx)=>{
            med.setUnitTargetPos(this.constAchiListPos[idx+offset]);
        })
    }

    /**
     * 更新normalList内的坐标
     */
    updateNormalPos(offset=0)
    {
        let temp=0;
        if(this.topAchiUnitList.length>0)
        {
            temp=this.topAchiUnitList.length;
        }
        this.normalAchiUnitList.forEach((med,idx)=>{
            med.setUnitTargetPos(this.constAchiListPos[idx+temp+offset]);
        })
    }

    /**
     * 移动成就单元的位置
     */

    public updownAchivUnitListTargetPos() {
        this.topAchiUnitList.forEach((unitMed ) => {
            unitMed.achiUnitEntrance();
        })
        this.normalAchiUnitList.forEach((unitMed) => {
            unitMed.achiUnitEntrance();
        })
    }

    /**
     * 更新成就单元的位置
     */
    public updatemMoveAchivUnitListTargetPos() {
        this.topAchiUnitList.forEach((unitMed) => {
            unitMed.achiUnitUpdateMove();
        })
        this.normalAchiUnitList.forEach((unitMed) => {
            unitMed.achiUnitUpdateMove();
        })
    }
}