import { CONSTANTS } from "../Constants";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    copyrightSP: cc.Sprite = null;
    @property(cc.EditBox)
    psdEdit: cc.EditBox = null;
    @property(cc.Node)
    detailNode: cc.Node = null;
    @property(cc.Node)
    loginNode: cc.Node = null;

    @property(cc.Label)
    pathsLabel: cc.Label = null;
    
    @property(cc.Label)
    tipLabel: cc.Label = null;
     standardAnswer  = "xplayzdjz"
    private password: string = null;
    onLoad() {
        this.pathsLabel.string = "歌单地址:" + CONSTANTS.MusicTableUrl;
        this.node.zIndex = cc.macro.MAX_ZINDEX - 1
        this.detailNode.active = false;
        this.loginNode.active = true;
        this.tipLabel.string=""
    }

    start() {

        // var logo=Tools.getInstance().LoadTexture2D()
        cc.loader.load({
            url: `https://tencentcnd.minigame.xplaymobile.com/Twogos/LOGO.png`,
            type: 'png'
        }, (err, res) => {
            if (err) { } else {
                var logo = new cc.SpriteFrame(res);
                this.copyrightSP.spriteFrame = logo
            }
        });

        this.psdEdit.node.on("editing-did-ended", () => {
            this.password = this.psdEdit.string;
        })
    }


    surePsd() {
        var self = this;
        let pointadress = "https://tencentcnd.minigame.xplaymobile.com/MusicGames/TestPassword/TestPassWord.json "
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                let  psd = JSON.parse(response)[0].password;
                if (self.password == psd) {
                    self.detailNode.active = true;
                    self.loginNode.active = false;
                    self.tipLabel.string="密码正确"
                }
                else
                {
                    self.tipLabel.string="密码错误！！！"
                }
                self.scheduleOnce(()=>{
                    self.tipLabel.string=""
                },1)
            }
            else{
                self.tipLabel.string="网络错误"
            }
        };
        xhr.open("GET", pointadress, true);
        xhr.send();
       
    }

    
}
