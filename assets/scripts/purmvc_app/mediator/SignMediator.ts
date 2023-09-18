
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import SignPanel from "./SignPanel";
import UIPanelCtr from "../../util/UIPanelCtr";
import SignUnit from "./SignUnit";
import { GamePxy } from "../proxy/GamePxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { CommandDefine } from "../command/commandDefine";
import { SignInfo } from "../repositories/Rep";
import { OpenPanelBody } from "../command/OpenPanelCmd";
import { PanelType } from "../../util/PanelType";
import { MusicPxy } from "../proxy/MusicPxy";
import { CONSTANTS } from "../../Constants";
import { ReportAnalytics } from "../../plugin/reportAnalytics";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";
import { ActivityEventState } from "../proxy/ActivityPxy";
import { V1_1_4Pxy } from "../proxy/V1_1_4Pxy";

export class SignMediator extends Mediator {
    private signPanel: SignPanel = null;
    private readonly days: number = 7;
    private signUnits: Array<SignUnit> = new Array<SignUnit>();
    private signConfig: Array<SignInfo> = new Array<SignInfo>();
    private waitSignInfo: SignInfo;
    private gamePxy: GamePxy;
    private v1_1_4Pxy: V1_1_4Pxy;

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
        this.v1_1_4Pxy = Facade.getInstance().retrieveProxy(ProxyDefine.V1_1_4Pxy) as V1_1_4Pxy;
        this.signPanel = viewNode.getComponent(SignPanel);
        this.initCreateSignUnits(this.days);
        this.signPanel.closeBtn.node.active=false;
        this.gamePxy.getSignConfig(this.assignSignUnits.bind(this));
        this.setSignState(this.gamePxy.getIsSigned());
        this.bindListener();
    }

    private bindListener(): void {
        this.signPanel.setCloseBtnClickEvent(() => {
            //   cc.audioEngine.play(this.signPanel.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            UIPanelCtr.getInstance().popPanel();
            if (CONSTANTS.isAutoPop) {
                if (this.v1_1_4Pxy.V1_1_4EventState != ActivityEventState.END&&!this.v1_1_4Pxy.getSettleAnnoucePanelPut()) {
                    this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.V1_1_4AnnouncementPanel));
                    this.v1_1_4Pxy.setSettleAnnoucePanelPut();
                }
                else {
                    let musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
                    let arr = musicPxy.getData();
                    if (this.gamePxy.affordLockSongInfoList(arr)) {
                        this.sendNotification(CommandDefine.OpenPanel, new OpenPanelBody(PanelType.SongRecommendPanel));
                    }
                }
            }
            CONSTANTS.isAutoPop = false;
        });
        this.signPanel.setNomalBtnClickEvent(() => {
            this.signPanel.closeBtn.node.active=true;
            //   cc.audioEngine.play(this.signPanel.btnClip, false, 1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            ReportAnalytics.getInstance().reportAnalytics("Noad_Click", "SignUI_ReceiveClick", 1);
            this.sendNotification(CommandDefine.SignRequest, {
                type: "normal",
                value: this.waitSignInfo
            })

        });
        this.signPanel.setAdBtnClickEvent(() => {
            this.signPanel.closeBtn.node.active=true;
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            ReportAnalytics.getInstance().reportAnalytics("Ad_Click", "SignUI_Vclick", 1);
            this.sendNotification(CommandDefine.SignRequest, {
                type: "video",
                value: this.waitSignInfo
            })
        })

        this.signPanel.onEnterCall = () => {
            ReportAnalytics.getInstance().reportAnalytics("View_Show", "SignUI_Show", 1);
            if(this.gamePxy.getIsSigned()){
                this.signPanel.closeBtn.node.active=true;
            }
        }
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: INotification): void {
    }


    /**
     * 初始化签到单元
     * @param size 
     */
    private initCreateSignUnits(size: number) {
        for (let i = 0; i < size; i++) {
            let unit = this.signPanel.createSignUnit(i);
            let signUnit = unit.getComponent(SignUnit);
            signUnit.setBgSpr(i != 6);
            this.signUnits.push(signUnit);
        }
        this.signUnits[size - 1].showHighlightAct();
    };

    /**
     * 配置签到单元
     */
    private assignSignUnits(configs: Array<SignInfo>) {
        this.signConfig = configs;
        for (let i = 0; i < this.signUnits.length; i++) {
            this.signUnits[i].setDayNameLabel(configs[i].dayDes);
            this.signUnits[i].setAwardLabel(configs[i].rewardDes);
            this.signUnits[i].setIronSpr(configs[i].ironPath);
        }
        this.assignSignNumShow();
    }

    /**
     * 设置签到的情况
     */
    public assignSignNumShow() {
        let signNum = this.gamePxy.getSignNum() % 7;
        console.log("signNum  " + signNum)
        if (signNum == 0) {
            for (let i = 0; i < this.signUnits.length; i++) {
                if (i > signNum) {
                    this.signUnits[i].showWaitTip();
                }
                else if (i == signNum) {
                    this.signUnits[i].showNowTip();
                    this.waitSignInfo = this.signConfig[i];
                }
            }

        }
        else {
            for (let i = 0; i < this.signUnits.length; i++) {
                if (i < signNum) {
                    this.signUnits[i].showOldtip();
                }
                else if (i == signNum) {
                    this.signUnits[i].showNowTip();
                    this.waitSignInfo = this.signConfig[i];
                }
            }
        }

    }

    /**
     * 设置是否签到
     */
    public setSignState(isSigned: boolean) {
        console.log("是否已经签到 ?" + isSigned);
        if (isSigned)   //签到过
        {
            this.signPanel.setSignedShow();
        }
        else            //未签到
        {
            this.signPanel.setWaitSignShow();
        }
    }
}