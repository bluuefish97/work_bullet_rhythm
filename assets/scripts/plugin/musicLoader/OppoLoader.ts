import WebLoader from "./WebLoader";


const { ccclass, property } = cc._decorator;

@ccclass
export default class OppoLoader extends WebLoader {

    LoadSongClip(URL: string,songName: string,callback:Function) {
       //加载音乐单
       if (cc.sys.platform === cc.sys.OPPO_GAME) {
        // @ts-ignore
        // this.FileSystemManager = qg.getFileSystemManager();
        // @ts-ignore
        var MusicURL = qg.env.USER_DATA_PATH + this.GmeName;
        console.log(MusicURL)
         // @ts-ignore
        qg.getFileSystemManager().access({
            path: `${MusicURL}_${songName}.mp3`,
            success: function (data) {
                console.log(`音乐存在，返回本地音乐`)
                callback!=null&& callback(`${MusicURL}_${URL}.mp3`);
            },
            fail: function (data) {
                console.log(`音乐不存在,下载网络音乐`)
                // @ts-ignore
                MusicURL = qg.env.USER_DATA_PATH + `/MusicColorBall_Music_${songName}.mp3`;
                console.log(MusicURL)
                // @ts-ignore
                qg.downloadFile({
                    url: URL,
                    filePath: MusicURL,
                    success(msg) {
                        console.log(`网络音乐下载成功`)
                        callback!=null&& callback(MusicURL);
                    },
                    fail(msg) {
                        // 下载失败,使用临时地址
                        console.log(`网络音乐单下载失败,使用临时存储`)
                        // @ts-ignore
                        qg.downloadFile({
                            url: URL,
                            success(msg) {
                                console.log(`网络音乐下载成功`)
                                callback!=null&&callback(msg.tempFilePath);
                            },
                            fail(msg) {
                                // 下载失败
                                console.log(`网络音乐下载失败, code = ${msg}`)
                                callback!=null&&callback(false)
                            },
                            complete() {
                            }
                        });

                    },
                    complete() {

                    }
                });


            }
        })

    }
    }
}
