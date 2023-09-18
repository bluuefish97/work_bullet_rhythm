import { Utility } from "../../util/Utility";

const { ccclass, property } = cc._decorator;
@ccclass
export default class V1_1_4PlayerRankItem extends cc.Component {
    IDX: number = null;
    @property({type: cc.Label,
        visible() {
            return !this.isTop;
        }
    })
    idLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    fillPowerNumLabel: cc.Label = null;
    @property(cc.Sprite)
    HeadIron: cc.Sprite = null;
    @property
    isTop: boolean = false;
    private defultSpr: cc.SpriteFrame;
    onLoad(){
        
    }
    start(){
        this.defultSpr = this.HeadIron.spriteFrame;
    }
    
    init(){
        this.node.opacity=0;
    }


    /**
      * 设置info
      */
    public setInfo(info: any, defultID: number) {
        // this.node.stopAllActions();
        if (!info) {
            this.node.opacity=0;
            return;
        }else{
            this.node.opacity=255;
        }
      
        if(!this.isTop){
            this.setRankIDLabel(info.rank);
            this.node.x = 0;
        }
        this.setNameLabel(info.nickName)
        this.setHeadIron(info.avatar)
        this.setFilledPowerNumLabel(info.rankScore)
        this.IDX = defultID;
    }



    /**
     * 设置玩家排名
     */
    public setRankIDLabel(idx) {
        this.idLabel.string = idx;
    }
    /**
     * 设置玩家姓名
     */
    public setNameLabel(str) {
        let tempStr = str;
        if (str && str.length > 8) {
            let n = str.slice(0, 8);
            tempStr = n + "..."
        }
        else {
            tempStr = str
        }
        this.nameLabel.string = tempStr;
    }

     /**
     * 设置玩家贡献值
     */
    public setFilledPowerNumLabel(str) {
        if (!isNaN(parseFloat(str))) {
            str = Utility.formatNumber(str);
        }
        this.fillPowerNumLabel.string = str;
    }
 /**
    * 设置玩家头像
    */
   private setHeadIron(str: string) {
    let remoteUrl = str;
    if (remoteUrl == null) {
        this.HeadIron.spriteFrame = this.defultSpr;
    }
    else {
        // cc.assetManager.loadRemote(remoteUrl, { ext: '.png' }, (err, texture: cc.Texture2D) => {
        //     this.MHeadIron.spriteFrame = new cc.SpriteFrame(texture)
        // })
      //  this.MHeadIron.spriteFrame = this.MdefultSp;
        let image = new Image();
        image.onload = () => {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            this.HeadIron.spriteFrame = new cc.SpriteFrame(texture);
        }
        image.onerror = error => {
        };
        image.src = remoteUrl;
    }

   

}
}
