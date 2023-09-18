import { Utility } from "../../util/Utility";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rankitem extends cc.Component {

    private bg: cc.Node = null;
    @property(cc.SpriteFrame)
    private TOPBgSpr: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private TOP1IDSpr: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private TOP2IDSpr: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private TOP3IDSpr: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private TOP1HeadSpr: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private TOP2HeadSpr: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    private TOP3HeadSpr: cc.SpriteFrame = null;


    private RankIDNode: cc.Node = null;
    private RankIDLabel: cc.Label = null;
    private MHeadIron: cc.Sprite = null;
    private WHeadIron: cc.Sprite = null;
    private MnameLabel: cc.Label = null;
    private WnameLabel: cc.Label = null;
    private MMaxLabel: cc.Label = null;
    private WMaxLabel: cc.Label = null;

    public IDX: number = -1;
    private MdefultSp: cc.SpriteFrame;
    private WdefultSp: cc.SpriteFrame;

    private TOPRankIDNode: cc.Node = null;
    private MCrownNode: cc.Node = null;
    private WCrownNode: cc.Node = null;

    private TOPDefaultBgSpr: cc.SpriteFrame = null;
    onLoad() {
        this.bg = this.node.getChildByName("bg");
        this.RankIDNode = this.node.getChildByName("RankID");
        this.TOPRankIDNode = this.node.getChildByName("TOPID");
        this.MCrownNode = this.node.getChildByName("MCrown");
        this.WCrownNode = this.node.getChildByName("WCrown");
        this.RankIDLabel = this.RankIDNode.getChildByName("RankIDLabel").getComponent(cc.Label);
        this.MHeadIron = this.node.getChildByName("MHeadIron").getComponentInChildren(cc.Sprite);
        this.WHeadIron = this.node.getChildByName("WHeadIron").getComponentInChildren(cc.Sprite);
        this.MnameLabel = this.node.getChildByName("MnameLabel").getComponent(cc.Label);
        this.WnameLabel = this.node.getChildByName("WnameLabel").getComponent(cc.Label);
        this.MMaxLabel = this.node.getChildByName("MMaxLabel").getComponent(cc.Label);
        this.WMaxLabel = this.node.getChildByName("WMaxLabel").getComponent(cc.Label);
        this.MdefultSp = this.MHeadIron.spriteFrame;
        this.WdefultSp = this.WHeadIron.spriteFrame;
        this.TOPDefaultBgSpr = this.bg.getComponent(cc.Sprite).spriteFrame
    }

    start() {

    }

    /**
     * 设置info
     */
    public setInfo(Minfo: any, Winfo: any, defultID: number) {
        this.node.stopAllActions();
        this.node.x=0;
        this.setRankIDLabel((defultID + 1).toString());
        this.IDX=defultID;
        this.changleItemStyle(defultID + 1);
        if (Minfo == null) {
            this.setMnameLabel("虚位以待")
            this.setMHeadIron(null)
            this.setMMaxLabel("0")
        } else {
            this.setMnameLabel(Minfo.nickName)
            this.setMHeadIron(Minfo.avatar)
            this.setMMaxLabel(Minfo.rankScore)
        }
        if (Winfo == null) {
            this.setWnameLabel("虚位以待")
            this.setWHeadIron(null)
            this.setWMaxLabel("0")
        } else {
            this.setWnameLabel(Winfo.nickName)
            this.setWHeadIron(Winfo.avatar)
            this.setWMaxLabel(Winfo.rankScore)
        }

    }

    /**
     * 人场动画
     */
    public enterAct(isLift=true){
       // let originX=cc.winSize.width*(2*(this.IDX%2)-1);
        let originX=isLift?-cc.winSize.width:cc.winSize.width;
        this.node.x=originX;
        cc.tween(this.node).delay(this.IDX*0.05).to(0.3,{x:0},{easing:cc.easing.sineIn}).start();
    }



    /**
     * 改变Item样式
     */
    changleItemStyle(ID) {
        if (ID > 3) {
            this.defaultStype();
        }
        else {
            this.TOPStype();
          let  _TOPIDSpr;
          let  _TOPHeadSpr;
            switch (ID) {
                case 1:
                    _TOPIDSpr= this.TOP1IDSpr
                    _TOPHeadSpr= this.TOP1HeadSpr
                    break;
                case 2:
                    _TOPIDSpr= this.TOP2IDSpr
                    _TOPHeadSpr= this.TOP2HeadSpr
                    break;
                  
                case 3:
                    _TOPIDSpr= this.TOP3IDSpr
                    _TOPHeadSpr= this.TOP3HeadSpr
                    break;
                default:
                    break;
            }
            this.TOPRankIDNode.getComponent(cc.Sprite).spriteFrame =_TOPIDSpr;
            this.MCrownNode.getComponent(cc.Sprite).spriteFrame =_TOPHeadSpr;
            this.WCrownNode.getComponent(cc.Sprite).spriteFrame =_TOPHeadSpr;
        }
    }

    /**
     * 默认样式
     */
    defaultStype() {
        this.bg.getComponent(cc.Sprite).spriteFrame = this.TOPDefaultBgSpr
        this.RankIDNode.active = true;
        this.TOPRankIDNode.active = false;
        this.MCrownNode.active = false;
        this.WCrownNode.active = false;
    }

    TOPStype() {
        this.bg.getComponent(cc.Sprite).spriteFrame = this.TOPBgSpr
        this.RankIDNode.active = false;
        this.TOPRankIDNode.active = true;
        this.MCrownNode.active = true;
        this.WCrownNode.active = true;
    }
    /**
     * 设置排名下标
     */
    private setRankIDLabel(str: string) {
        this.RankIDLabel.string = str;
    }

    /**
    * 设置男生头像
    */
    private setMHeadIron(str: string) {
        let remoteUrl = str;
        if (remoteUrl == null) {
            this.MHeadIron.spriteFrame = this.MdefultSp;
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
                this.MHeadIron.spriteFrame = new cc.SpriteFrame(texture);
            }
            image.onerror = error => {
            };
            image.src = remoteUrl;
        }

       

    }

    /**
    * 设置男生姓名
    */
    private setMnameLabel(str: string) {
        let tempStr=str;
        if(str&&str.length>5){
            let n=str.slice(0,5);
            tempStr=n+"..."
        }
        else{
            tempStr=str
        }
        this.MnameLabel.string = tempStr;
    }
    /**
    * 设置男生的分数
    */
    private setMMaxLabel(str: string) {
        str=Utility.formatNumber(str);
        this.MMaxLabel.string = str;
    }

    /**
* 设置女生头像
*/
    private setWHeadIron(str: string) {
        let remoteUrl = str;
        if (remoteUrl == null) {
            this.WHeadIron.spriteFrame = this.WdefultSp;
        }
        else {
            // cc.assetManager.loadRemote(remoteUrl, { ext: '.png' }, (err, texture: cc.Texture2D) => {
            //     this.WHeadIron.spriteFrame = new cc.SpriteFrame(texture)
            // })
         //   this.WHeadIron.spriteFrame = this.WdefultSp;
            let image = new Image();
            image.onload = () => {
                let texture = new cc.Texture2D();
                texture.initWithElement(image);
                texture.handleLoadedTexture();
                this.WHeadIron.spriteFrame = new cc.SpriteFrame(texture);
            }
            image.onerror = error => {
            };
            image.src = remoteUrl;
        }
    }

    /**
    * 设置女生姓名
    */
    private setWnameLabel(str: string) {
        let tempStr=str;
        if(str&&str.length>5){
            let n=str.slice(0,5);
            tempStr=n+"..."
        }
        else{
            tempStr=str
        }
        this.WnameLabel.string = tempStr;
    }
    /**
    * 设置女生的分数
    */
    private setWMaxLabel(str: string) {
        str=Utility.formatNumber(str);
        this.WMaxLabel.string = str;
    }
}
