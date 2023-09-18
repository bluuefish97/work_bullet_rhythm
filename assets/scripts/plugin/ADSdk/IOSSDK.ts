import AudioManager from "../audioPlayer/AudioManager";
import AdController from "./AdController";
import { Facade } from "../../core/puremvc/patterns/facade/Facade";
import { CommandDefine } from "../../purmvc_app/command/commandDefine";
import { AchiUpdateInfo } from "../../purmvc_app/command/UpdateAchiProCmd";
import GameManager from "../../GameManager";

const { ccclass, property } = cc._decorator;
let videoCallback = null;
@ccclass
export default class IOSSDK implements SDKInterface {
    getInsertFlag() {
        throw new Error("Method not implemented.");
    }
    vibrate() {
        throw new Error("Method not implemented.");
    }
    longVibrate() {
        throw new Error("Method not implemented.");
    }
    getBlock(index: number, x: number, y: number) {
        throw new Error("Method not implemented.");
    }
    hideBlock(index: number) {
        throw new Error("Method not implemented.");
    }
    showBlock(index: number, x: number, y: number) {
        throw new Error("Method not implemented.");
    }
    getVideoFlag() {
        throw new Error("Method not implemented.");
    }
    IsOnLine() {
        throw new Error("Method not implemented.");
    } InitAD() {
        throw new Error("Method not implemented.");
    }
    showBanner() {
        throw new Error("Method not implemented.");
    }
    hideBanner() {
        throw new Error("Method not implemented.");
    }
    hasVideo() {
        throw new Error("Method not implemented.");
    }
    hasInsert() {
        throw new Error("Method not implemented.");
    }
    showInters() {
        throw new Error("Method not implemented.");
    }
    showVideo(callback: any) {
        throw new Error("Method not implemented.");
    }
    showNavigateIcon(width: any, height: any, x: any, y: any) {
        throw new Error("Method not implemented.");
    }
    hideNavigateIcon() {
        throw new Error("Method not implemented.");
    }
    showNavigateGroup(type: any, side: any) {
        throw new Error("Method not implemented.");
    }
    hideNavigateGroup() {
        throw new Error("Method not implemented.");
    }
    showNavigateSettle(type: any, x: any, y: any) {
        throw new Error("Method not implemented.");
    }
    hideNavigateSettle() {
        throw new Error("Method not implemented.");
    }
    isversionNewThanEngineVersion(minimumVer: string): boolean {
        throw new Error("Method not implemented.");
    }
    addDeskTop() {
        throw new Error("Method not implemented.");
    }
    Vibrate() {
        throw new Error("Method not implemented.");
    }
    LongVibrate() {
        throw new Error("Method not implemented.");
    }
    exitTheGame() {
        throw new Error("Method not implemented.");
    }
    CreateMoreGamesButton(morgamePosNode: cc.Node, screenWidth: number, screenHight: number) {
        throw new Error("Method not implemented.");
    }
    CleanMoreGamesButton(btn: any) {
        throw new Error("Method not implemented.");
    }
    showGameCenter() {
        throw new Error("Method not implemented.");
    }
    QQShowAppBox() {
        throw new Error("Method not implemented.");
    }
    reportAnalytics(data: any) {
        throw new Error("Method not implemented.");
    }

}
