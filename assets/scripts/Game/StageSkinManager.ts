/**
 *   Copyright (c) 2020-2021 ZhangQiang
 */

const { ccclass, property } = cc._decorator;

/**
 * 游戏场景的皮肤管理
 */
@ccclass
export default class StageSkinManager extends cc.Component {

    @property(cc.JsonAsset)
    skinJson: cc.JsonAsset = null;

    @property(cc.Node)
    lineNode: cc.Node = null;
    @property(cc.Node)
    HitlightNode: cc.Node = null;
    @property(cc.Node)
    windNode: cc.Node = null;
    @property(cc.Node)
    scoreLabelNode: cc.Node = null;
    @property(cc.Node)
    gunPlatformNode: cc.Node = null;
    @property(cc.Node)
    roadNode: cc.Node = null;
    @property(cc.Node)
    roadLineNode: cc.Node = null;
    @property(cc.Node)
    roadLineLightLNode: cc.Node = null;
    @property(cc.Node)
    roadLineLightRNode: cc.Node = null;
    @property(cc.Sprite)
    BgSprite: cc.Sprite = null;

    @property(cc.Sprite)
    FgSprite: cc.Sprite = null;


    private skinConfigArray:Array<StageSkinInfo>=new Array<StageSkinInfo>();
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.skinConfigArray = this.skinJson.json;
    }

    start() {

    }


    /**
     *  配置场景皮肤 
     */
    public configureStageSkin(skinIdx: number,cal:Function) {
        let info=this.skinConfigArray[skinIdx];
        this.configureLineColor(info.lineColor);
        this.configureHitlightColor(info.hitlightColor);
        this.configureWindColor(info.windColor);
        this.configureScoreLabelColor(info.scoreLabelColor);
        this.configureGunPlatformColor(info.gunPlatformColor);
        this.configureFgSkewY(info.fgSkewY);
        this.configureRoadColor(info.roadColor);
        this.configureRoadLineColor(info.roadLineColor);
        this.configureFgBgSpr(info.groundsPath,cal);
        this.configureRoadLineLightColor(info.roadLineLightColor);
       this.configureRoadLineLightScaleX(info.roadLineLightScaleX);
    }

    /**
     * 配置Line的颜色
     */
    private configureLineColor(colorStr: string) {
        console.log("LineColor  " + colorStr);

        this.lineNode.color = cc.color(colorStr);
    }

     /**
     * 配置 Hitlight的颜色
     */
    private configureHitlightColor(colorStr: string) {
        console.log("HitlightColor  " + colorStr);
        this.HitlightNode.children.forEach((item:cc.Node)=>{
            item.color = cc.color(colorStr);
        })
        
    }

    
     /**
     * 配置 wind的颜色
     */
    private configureWindColor(colorStr: string) {
        console.log("WindColor  " + colorStr);
        this.windNode.color = cc.color(colorStr);
    }

      
     /**
     * 配置scoreLabel的颜色
     */
    private configureScoreLabelColor(colorStr: string) {
        console.log("ScoreLabelColor  " + colorStr);
        this.scoreLabelNode.color = cc.color(colorStr);
    }

    /**
     * 配置gunPlatformNode的颜色
     */
    private configureGunPlatformColor(colorStr: string) {
        console.log("GunPlatformColor  " + colorStr);
        this.gunPlatformNode.color = cc.color(colorStr);
    }
    
    /**
     * 配置RoadNode的颜色
     */
    private configureRoadColor(colorStr: string) {
        console.log("RoadColor  " + colorStr);
        this.roadNode.color = cc.color(colorStr);
    }
    
     /**
     * 配置 roadLineNode的颜色
     */
    private configureRoadLineColor(colorStr: string) {
        console.log("RoadLineColor " + colorStr);
        this.roadLineNode.children.forEach((item:cc.Node)=>{
            item.color = cc.color(colorStr);
        })
        
    }

        /**
     * 配置roadLinelightNode的颜色
     */
    private configureRoadLineLightColor(colorStr: string) {
        console.log("RoadColor  " + colorStr);
        this.roadLineLightLNode.color = cc.color(colorStr);
        this.roadLineLightRNode.color = cc.color(colorStr);
    }

            /**
     * 配置roadLinelightNode的scaleX
     */
    private configureRoadLineLightScaleX(num: number) {
        console.log("RoadLineLightScaleX  " + num);
        this.roadLineLightLNode.scaleX = num;
        this.roadLineLightRNode.scaleX = num;
    }
         /**
     * 配置前景背景图片
     */
    private configureFgBgSpr(colorStr: string,cal:Function) {
        let self=this;
        console.log(colorStr);
        
        cc.assetManager.loadBundle('remoteStageSkin', (err, bundle) => {
            bundle.loadDir(colorStr, function (err, assets) {
                self.BgSprite.spriteFrame = assets.find((data) => { return data.name == "bg" });
                self.FgSprite.spriteFrame = assets.find((data) => { return data.name == "fg" });
                cal();
            })
        });
    }

    /**
     * 调整前景的Y值
     */
    private configureFgSkewY(num: number) {
      this.FgSprite.node.z=num;
    }
}

class StageSkinInfo {

    id: number;
    stageName: string;
    groundsPath: string;
    roadColor: string;
    roadLineColor: string;
    roadLineLightColor:string;
    "roadLineLightScaleX":number;
    lineColor:string;
    hitlightColor:string;
    windColor:string;
    gunPlatformColor:string;
    scoreLabelColor:string;
    fgSkewY: number;
    
}
