
安卓版本需将androidPanel预制体放入load场景下的canvas节点下

ios版本：
需要修改 Constants 中    static readonly MaxHorVal:number=0.25;         //节奏点最大的左右间隔

需要修改互推结算界面位置改成 FinishPanel  
if (ASCAd.getInstance().getNavigateSettleFlag()&&config.platform!=Platform.douYin) {
            let x = cc.winSize.width / 2;
            let y = 360;
            ASCAd.getInstance().showNavigateSettle(3, x, y);
        }
结算页的Y修改     （默认： 400）


qq渠道ID:5144155

//检测密码：xplayzdjz

///**
 * 服务器URL
 */
//const host = "https://cloud.xminigame.com/api"
 const host = "http://centos.6263game.com:10010" //测试
要修改

星座活动版本：v1.1.4