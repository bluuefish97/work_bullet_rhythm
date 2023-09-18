import WebLoader from "./WebLoader";


export default class VivoLoader extends WebLoader {
    // private  FileSystemManager: any;
    // LoadMusicTable(URL: string,callback:Function) {
    //     console.log('平台：vivo')
    //     return new Promise<Array<any>>((resolve) => {
    //             // @ts-ignore
    //             qg.download({
    //                 url: URL,
    //                 success: function (data) {
    //                     console.log(`网络音乐单下载成功, 文件位置 : ${data.tempFilePath}`)
    //                     cc.loader.load(`${data.tempFilePath}`, function (err, txt) {
    //                         if (err) {
    //                             console.log("音乐单加载失败" + err);
    //                             callback!=null&&callback(false)
    //                         } else {
    //                             console.log("音乐单加载成功");
    //                             var text = String(txt);
    //                             resolve(JSON.parse(text));
    //                             callback!=null&&callback(true);
    //                         }
    //                     })
    //                 },
    //                 fail: function (data, code) {
    //                     console.log(`网络音乐单下载失败, code = ${code}`)
    //                     callback!=null&&callback(false)
    //                 }
    //             });
    //     })
    // }
    LoadSongClip(URL: string, songName:string,callBack:Function) {
       //加载音乐单
       if (cc.sys.platform === cc.sys.VIVO_GAME) {
        var MusicURL = 'internal://cache/path/'+this.GmeName;
        // @ts-ignore
        var res = qg.accessFile({
            uri: `${MusicURL}/${songName}.mp3`,
        })
        if (res == 'true') {
            console.log(`音乐存在，返回本地音乐`)
            callBack!=null&&callBack(`${MusicURL}/${songName}.mp3`);
        }
        if (res == 'false') {
            console.log(`音乐不存在，下载网络音乐`)
            // @ts-ignore
            this.downloadTask = qg.download({
                url: URL,
                success: function (data) {
                    console.log(`网络音乐下载成功, 文件位置 : ${data.tempFilePath}`)
                    // @ts-ignore
                    var res2 = qg.accessFile({
                        uri: MusicURL,
                    })
                    if (res2 == 'true') {
                        console.log('音乐文件夹存在,开始复制文件')
                        // @ts-ignore
                        qg.copyFile({
                            srcUri: `${data.tempFilePath}`,
                            dstUri: `${MusicURL}/${songName}.mp3`,
                            success: function (uri) {
                                console.log(`文件复制成功: ${uri}`)
                                callBack!=null&&callBack(`${uri}`);
                            },
                            fail: function (data, code) {
                                console.log(`文件复制失败, code = ${code}`)
                                callBack!=null&&callBack(false)
                            }
                        })
                    }
                    if (res2 == 'false') {
                        console.log('音乐文件夹不存在，开始创建文件夹')
                        // @ts-ignore
                        qg.mkdir({
                            uri: MusicURL,
                            success: function (uri) {
                                console.log('文件目录创建成功,开始复制文件')
                                //移动文件
                                // @ts-ignore
                                qg.copyFile({
                                    srcUri: `${data.tempFilePath}`,
                                    dstUri: `${MusicURL}/${songName}.mp3`,
                                    success: function (uri) {
                                        console.log(`文件复制成功: ${uri}`)
                                        callBack!=null&&callBack(`${uri}`);
                                    },
                                    fail: function (data, code) {
                                        console.log(`文件复制失败, code = ${code}`)
                                        callBack!=null&&callBack(false)
                                    }
                                })

                            },
                            fail: function (data, code) {
                                console.log('文件目录创建失败')
                                console.log(`handling fail, code = ${code}`)
                                callBack!=null&&callBack(false)
                            }
                        })
                    }


                },
                fail: function (data, code) {
                    console.log(`网络音乐下载失败, code = ${code}`)
                    callBack!=null&&callBack(false)
                }
            });
        }
    }
    }



}
