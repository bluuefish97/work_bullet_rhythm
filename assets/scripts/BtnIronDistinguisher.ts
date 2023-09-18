import config, { Platform } from "../config/config";
import GameManager from "./GameManager";

/****************************************************
文件：BtnIronDistinguisher.ts
作者：zhangqiang
邮箱: 2574628254@qq.com
日期：2021年2月25日15:19:35
功能：广告IRon渠道区分
*****************************************************/
const { ccclass, property } = cc._decorator;

@ccclass("ColorConfig")
class ADIronConfig {
    @property({
        type: cc.Node,
        tooltip: "样式颜色"
    })
    iron_box: cc.Node = null;
    @property({
        type: cc.Vec2,
        tooltip: "按钮位置"
    })
    btn_pos: cc.Vec2 = new cc.Vec2();
    @property({
        type: cc.Vec2,
        tooltip: "按钮大小"
    })
    btn_size: cc.Vec2 = new cc.Vec2();
}



@ccclass
export default class BtnIronDistinguisher extends cc.Component {
    @property(ADIronConfig)
    Douyin_Config: ADIronConfig = null;
    @property(ADIronConfig)
    defulat_Config: ADIronConfig = null;
    @property({
        type: cc.Node,
        tooltip: "广告图标"
    })
    iron_AD: cc.Node = null;
    @property({
        type: cc.Node,
        tooltip: "广告的其他内容"
    })
    iron_other: cc.Node = null;

    private originX: number = 0;
    onLoad() {
        if (this.iron_other) {
            this.originX = this.iron_other.x;
        }
    }
    start() {
        config
        switch (config.platform) {
            case Platform.douYin:
                this.Douyin_Config.iron_box.active = true;
                this.defulat_Config.iron_box.active = false;
                if (this.Douyin_Config.btn_size.x != 0 || this.Douyin_Config.btn_size.y != 0) {
                    this.node.width = this.Douyin_Config.btn_size.x;
                    this.node.height = this.Douyin_Config.btn_size.y;
                }
                if (this.Douyin_Config.btn_pos.x != 0 || this.Douyin_Config.btn_pos.y != 0) {
                    this.node.setPosition(this.Douyin_Config.btn_pos);
                }
                break;
            default:
                this.defulat_Config.iron_box.active = true;
                this.Douyin_Config.iron_box.active = false;
                if (this.defulat_Config.btn_size.x != 0 || this.defulat_Config.btn_size.y != 0) {
                    this.node.width = this.defulat_Config.btn_size.x;
                    this.node.height = this.defulat_Config.btn_size.y;
                }
                if (this.defulat_Config.btn_pos.x != 0 || this.defulat_Config.btn_pos.y != 0) {
                    if (config.platform != Platform.oppo) {
                        this.node.setPosition(this.defulat_Config.btn_pos);
                    }
                }
                if (this.iron_AD) {
                    this.iron_AD.active = true;
                    this.iron_other.x = this.originX;
                }

                break;
        }
    }
}
