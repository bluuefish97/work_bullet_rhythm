import miniGameSDK from "./miniGameSDK";
import AdController from "./AdController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DouYinGameSDK extends miniGameSDK {


    showNavigateIcon(width, height, x, y){
    }

    hideNavigateIcon() {
    }

    showNavigateSettle(type, x, y){
    }

    hideNavigateSettle(){
    }



    CreateMoreGamesButton(morgamePosNode: cc.Node, screenWidth: number, screenHight: number) {
        var positon = morgamePosNode.convertToWorldSpaceAR(cc.v2(0, 0));
        let Xbili = positon.x / screenWidth
        let Ybili = (screenHight - positon.y) / screenHight
        // @ts-ignore
        let x = Xbili * tt.getSystemInfoSync().screenWidth
        // @ts-ignore
        let y = Ybili * tt.getSystemInfoSync().screenHeight
        let w=morgamePosNode.width*(tt.getSystemInfoSync().screenWidth/screenWidth)
        let h=morgamePosNode.height*(tt.getSystemInfoSync().screenWidth/screenWidth)
        // @ts-ignore
        let btn = tt.createMoreGamesButton({
            type: "image",
            image: "moreGame.png",
            actionType: "box",
            style: {
                left: x,
                top: y,
                width: w,
                height: h,
                lineHeight: 40,
                backgroundColor: "",
                textColor: "",
                textAlign: "center",
                fontSize: 16,
                borderRadius: 4,
                borderWidth: 0,
                borderColor: ""
            },
            appLaunchOptions: [{
                appId: "ttXXXXXX",
                query: "foo=bar&baz=qux",
                extraData: {}
            }
                // {...}
            ],
            onNavigateToMiniGame(res) {
                console.log("跳转其他小游戏", res);
            }
        });
        btn.onTap(() => {
            console.log("点击更多游戏");
        });
        console.log("更多游戏创建成功!!!!!!");
        console.log(btn);
        return btn;
    }
    CleanMoreGamesButton(btn) {
        if (btn) {
           // console.log(btn)
            console.log('更多按钮关闭');
            btn.destroy();
            btn=null;
        }
        // throw new Error("Method not implemented.");
    }


    CheckVersionSupport(): boolean {
       // @ts-ignore
        return tt.addShortcut!=undefined;
     }

    /**
     * 抖音添加桌面
     */
    addDeskTop()
    {

        // @ts-ignore
        if(!tt.addShortcut)  return;
        // @ts-ignore
        tt.addShortcut({
            success: function (res) {
                let status=res.status;
                let errMsg=res.errMsg;
                console.log(res)
                console.log('API调用成功结果:    '+  errMsg)
            //     console.log(status);
            //    console.log('当前小程序桌面快捷方式是否存在:    '+  status.exist);
            //    console.log('当前小程序快捷方式是否需要更新:    '+  status.needUpdate)
            
            },
            fail: function (res) {
                let errMsg=res.errMsg;
                console.log('API调用失败结果:    '+  errMsg)
            }
        })
    }

    isversionNewThanEngineVersion(minimumVer: string): boolean {
        var versionArr = minimumVer.split('.');
      var ver = Number(versionArr[0]) * 100 + Number(versionArr[1]) * 10 + Number(versionArr[2]);
      console.log("ver", ver);
      //@ts-ignore
      var engineVersionArr = tt.getSystemInfoSync().SDKVersion.split('.');
      var enginever = Number(engineVersionArr[0]) * 100 + Number(engineVersionArr[1]) * 10 + Number(engineVersionArr[2]);
      console.log("engineVersion", enginever);
  
      if (ver <= enginever) {
        return true;
      }
      else {
        return false;
      }
    }

    reportAnalytics(data: any) {
        console.log("抖音上传事件: " + data);
        //@ts-ignore
        tt.reportAnalytics(data, {           
        });
    }
}

