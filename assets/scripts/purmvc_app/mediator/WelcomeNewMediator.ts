
import { Mediator } from "../../core/puremvc/patterns/mediator/Mediator";
import { INotification } from "../../core/puremvc/interfaces/INotification";
import { CommandDefine } from "../command/commandDefine";
import WelcomeNewPanel from "./WelcomeNewPanel";
import { MusicPxy } from "../proxy/MusicPxy";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { ProxyDefine } from "../proxy/proxyDefine";
import { SongInfo } from "../repositories/Rep";
import GameManager from "../../GameManager";
import { ClipEffectType } from "../../AudioEffectCtrl";

export class WelcomeNewMediator extends Mediator {
    private welcomeNewPanel: WelcomeNewPanel = null;
    private musicPxy: MusicPxy;
    private newSong:SongInfo;
    public constructor(mediatorName: string = null, viewComponent: any = null) {
        super(mediatorName, viewComponent);

        if (viewComponent == null) {
            return;
        }

        let viewNode = viewComponent as cc.Node;
        if (!viewNode) {
            return;
        }
        this.musicPxy = Facade.getInstance().retrieveProxy(ProxyDefine.MusicPxy) as MusicPxy;
        this.welcomeNewPanel = viewNode.getComponent(WelcomeNewPanel);
        let newSongName = this.musicPxy.getLastPlaySongName();
        this.newSong=this.musicPxy.getSongInfo(newSongName);
        this.welcomeNewPanel.setScoreLabelShow(newSongName);
        this.bindListener();
    }

    private bindListener(): void {
          this.welcomeNewPanel.setSignBtnClickEvent(()=>{
           // cc.audioEngine.play(this.welcomeNewPanel.btnClip,false,1);
            GameManager.getInstance().audioEffectCtrl.playEffect(ClipEffectType.normalBtn);
            this.sendNotification(CommandDefine.StartSongRequest, this.newSong);
        });
    }

    public listNotificationInterests(): string[] {
        return [
        ];
    }

    public handleNotification(notification: INotification): void {
    }
}