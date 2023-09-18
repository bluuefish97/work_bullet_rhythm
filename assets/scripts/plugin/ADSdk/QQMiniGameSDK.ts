import miniGameSDK from "./miniGameSDK";



const { ccclass, property } = cc._decorator;

@ccclass
export default class QQMiniGameSDK extends miniGameSDK {

    appBox: any = null;

    public InitAD() {
        super.InitAD();

    } 

    QQShowAppBox() {

    }


       /**
 * 显示结算页互推列表
 */
showNavigateSettle(type, x, y) {
}

    /**
     * QQ显示插屏
     */
    showInters()
    {
        super.showInters();

    }

    isversionNewThanEngineVersion(minimumVer: string): boolean {
        var versionArr = minimumVer.split('.');
        var ver = Number(versionArr[0]) * 100 + Number(versionArr[1]) * 10 + Number(versionArr[2]);
        console.log("ver", ver);
        //@ts-ignore
        var engineVersionArr =  qq.getSystemInfoSync().SDKVersion.split('.');
        var enginever = Number(engineVersionArr[0]) * 100 + Number(engineVersionArr[1]) * 10 + Number(engineVersionArr[2]);
        console.log("engineVersion", enginever);

        if (ver <= enginever) {
            return true;
        }
        else {
            return false;
        }
    }
}
