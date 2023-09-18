/****************************************************
文件：OppoNativePasterStyle.ts
作者：zhangqiang
邮箱: 2574628254@qq.com
日期：2021年3月22日14:51:09
功能：
*****************************************************/


import AdController from "../plugin/ADSdk/AdController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class OppoNativePasterStyle extends cc.Component {
    @property(cc.Sprite)
    BigImage: cc.Sprite = null;
    @property(cc.Sprite)
    AdTip: cc.Sprite = null;
    @property(cc.Sprite)
    Close: cc.Sprite = null;

    private nativeInfo: any = null;

    private closeCal: Function = null;
    onEnable() {
        this.node.setContentSize(cc.view.getVisibleSize().width, cc.view.getVisibleSize().width / 2);
    }


    public setNativeInfo(info: any, cal=null) {
        if (!info || !info.Native_BigImage) {
            this.node.active = false;
            console.log("原生广告的大图为空!!!!");
            return
        }
        this.node.active = true;
        this.closeCal = cal;
        if (AdController.instance.bannnerShowIng) {
            AdController.instance.AdSDK.hideBanner();
        }
        this.nativeInfo = info;
        this.setSprite(this.nativeInfo.Native_BigImage, this.BigImage);
        this.setSprite(this.nativeInfo.NativeAdTip, this.AdTip);
        this.setSprite(this.nativeInfo.NativeClose, this.Close);
    }

    public onShowClick() {
        // ASCAd.getInstance().reportNativeAdClick(this.nativeInfo.adId);
        // ASCAd.getInstance().reportNativeAdShow(this.nativeInfo.adId);
    }

    public onCloseClick() {
        this.node.active = false;
        console.log(AdController.instance.bannnerShowIng);
        if (this.closeCal) {
            this.closeCal();
        }
        else if (AdController.instance.bannnerShowIng) {
            AdController.instance.AdSDK.showBanner();
        }
    }

    private setSprite(str: string, spr: cc.Sprite) {
        let remoteUrl = str;
        let image = new Image();
        image.onload = () => {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            let spf = new cc.SpriteFrame(texture);
            spr.spriteFrame = spf;
        }
        image.onerror = error => {
        };
        image.src = remoteUrl;
        image.crossOrigin = "anonymous";
    }

}
