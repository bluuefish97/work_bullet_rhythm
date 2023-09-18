import { Facade } from "../core/puremvc/patterns/facade/Facade";
import { CommandDefine } from "./command/commandDefine";
import { LoadCmd } from "./command/LoadCmd";
import { ProxyDefine } from "./proxy/proxyDefine";
import { MusicPxy } from "./proxy/MusicPxy";
import { GamePxy } from "./proxy/GamePxy";
import { OpenPanelCmd } from "./command/OpenPanelCmd";
import { ConsumablesCmd } from "./command/ConsumablesCmd";
import { SignRequestCmd } from "./command/SignRequestCmd";
import { UnlockGunCmd } from "./command/UnlockGunCmd";
import { EquipGunCmd } from "./command/EquipGunCmd";
import { UnlockSongCmd } from "./command/UnlockSongCmd";
import { PlaySongCmd } from "./command/PlaySongCmd";
import { ReviveCmd } from "./command/ReviveCmd";
import { FinishCmd } from "./command/FinishCmd";
import { StartSongCmd } from "./command/StartSongCmd";
import { UpdateAchiProCmd } from "./command/UpdateAchiProCmd";
import { GetAchiRewardCmd } from "./command/GetAchiRewardCmd";
import { GetMapSkinChipCmd } from "./command/GetMapSkinChipCmd";
import { UseMapSkinCmd } from "./command/UseMapSkinCmd";
import { StartRecCmd } from "./command/StartRecCmd";
import { EndRecCmd } from "./command/EndRecCmd";
import { ShareRecCmd } from "./command/ShareRecCmd";
import { ReportAnalytics } from "../plugin/reportAnalytics";
import { UnlockBoxCmd } from "./command/UnlockBoxCmd";
import { EquipBoxCmd } from "./command/EquipBoxCmd";
import StartEndlessPlayingCmd from "./command/StartEndlessPlayingCmd";
import { EndlessPlayingPxy } from "./proxy/EndlessPlayingPxy";
import { ELP_PreLoadSongAssetCmd } from "./command/ELP_PreLoadSongAssetCmd";
import { ELP_EnterNextChanllengeCmd } from "./command/ELP_EnterNextChanllengeCmd";
import { ELP_UploadingScoreAndTimeCmd } from "./command/ELP_UploadingScoreAndTimeCmd";
import { ActivityPxy } from "./proxy/ActivityPxy";
import { V1_1_4Pxy } from "./proxy/V1_1_4Pxy";


export class ApplicationFacade extends Facade {
    public initializeController(): void {
        super.initializeController();
        this.registerCommand(CommandDefine.LoadRequest, LoadCmd);
        this.registerCommand(CommandDefine.OpenPanel, OpenPanelCmd);
        this.registerCommand(CommandDefine.Consumables, ConsumablesCmd);
        this.registerCommand(CommandDefine.SignRequest, SignRequestCmd);
        this.registerCommand(CommandDefine.UnluckGunRequest, UnlockGunCmd);
        this.registerCommand(CommandDefine.EquipGunRequest, EquipGunCmd);
        this.registerCommand(CommandDefine.UnluckSongRequest, UnlockSongCmd);
        this.registerCommand(CommandDefine.PlaySongRequest, PlaySongCmd);
        this.registerCommand(CommandDefine.ReviveRequest, ReviveCmd);
        this.registerCommand(CommandDefine.Finish, FinishCmd);
        this.registerCommand(CommandDefine.StartSongRequest, StartSongCmd);    //装备一首歌
        this.registerCommand(CommandDefine.UpdateAchiPro, UpdateAchiProCmd);    //成就的进度更新
        this.registerCommand(CommandDefine.GetAchiRewardRequest, GetAchiRewardCmd);    //成就奖励领取请求
        this.registerCommand(CommandDefine.GetMapSkinChip, GetMapSkinChipCmd);    //获得地图碎片
        this.registerCommand(CommandDefine.UseMapSkin, UseMapSkinCmd);    //装备一个地图
        this.registerCommand(CommandDefine.StartRec, StartRecCmd);    //开始录屏
        this.registerCommand(CommandDefine.EndRec, EndRecCmd);    //结束录屏
        this.registerCommand(CommandDefine.ShareRec, ShareRecCmd);    //分享录屏

        //方块皮肤
        this.registerCommand(CommandDefine.UnluckBoxRequest, UnlockBoxCmd);          //解锁一个方块皮肤
        this.registerCommand(CommandDefine.EquipBoxRequest, EquipBoxCmd);            //装备一个方块皮肤

        //无尽模式
        this.registerCommand(CommandDefine.StartEndlessPlayingRequest, StartEndlessPlayingCmd)      //开始无尽模式
        this.registerCommand(CommandDefine.ELP_PreLoadSongAsset, ELP_PreLoadSongAssetCmd)      //预先加载下一关的资源
        this.registerCommand(CommandDefine.ELP_EnterNextChanllenge, ELP_EnterNextChanllengeCmd)      //进入下一关
        this.registerCommand(CommandDefine.ELP_UploadingScoreAndTime, ELP_UploadingScoreAndTimeCmd)      //上传分数和时间
    }

    public initializeModel(): void {
        super.initializeModel();
        this.registerProxy(new GamePxy(ProxyDefine.GamePxy));
        this.registerProxy(new MusicPxy(ProxyDefine.MusicPxy));
        this.registerProxy(new ActivityPxy(ProxyDefine.ActivityPxy));
        this.registerProxy(new V1_1_4Pxy(ProxyDefine.V1_1_4Pxy));
        this.registerProxy(new EndlessPlayingPxy(ProxyDefine.EndlessPlayingPxy))
    }

    public initializeView(): void {
        super.initializeView();
    }

    public startup(): void {
        console.log("run here");
        ReportAnalytics.getInstance().reportAnalytics("View_Show", "GameFrist_Fps", 1);
        this.sendNotification(CommandDefine.LoadRequest);
    }
}