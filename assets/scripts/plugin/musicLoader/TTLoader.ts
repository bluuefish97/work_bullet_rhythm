import WebLoader from "./WebLoader";


export default class TTLoader extends WebLoader {
    LoadSongClip(URL: string, songName: string, callBack: Function) {
       //@ts-ignore
       var FileSystemManager = tt.getFileSystemManager();
       //@ts-ignore
       var MusicURL = tt.env.USER_DATA_PATH + `/${this.GmeName}`;
       console.log("检查音乐是否存在");
       FileSystemManager.access({
           path: `${MusicURL}/${songName}.mp3`,
           success: function () {
               console.log(`音乐存在,返回本地音乐`)
               callBack(`${MusicURL}/${songName}.mp3`);
           },
           fail: function () {
               console.log(`音乐不存在,下载网络音乐`)
               //@ts-ignore
               tt.downloadFile({
                   url: URL,
                   success(data) {
                       console.log('音乐下载成功', "音乐临时地址", data.tempFilePath);
                       console.log("判断目标文件夹是否存在");
                       FileSystemManager.access({
                           path: `${MusicURL}`,
                           success: function () {
                               console.log("目标文件夹存在,开始复制音乐文件");
                               FileSystemManager.copyFile({
                                   srcPath: data.tempFilePath,
                                   destPath: `${MusicURL}/${songName}.mp3`,
                                   success: function (uri) {
                                       console.log("音乐文件复制成功", `${MusicURL}/${songName}.mp3`);
                                       callBack(`${MusicURL}/${songName}.mp3`);
                                   },
                                   fail: function (err) {
                                       console.log("音乐文件复制失败", err)
                                       callBack(null);
                                   }
                               })
                           },
                           fail: function () {
                               console.log("目标文件夹存不在,创建音乐文件夹");
                               FileSystemManager.mkdir({
                                   dirPath: MusicURL,
                                   success: function () {
                                       console.log("目标文件夹创建成功,开始复制音乐文件");
                                       FileSystemManager.copyFile({
                                           srcPath: data.tempFilePath,
                                           destPath: `${MusicURL}/${songName}.mp3`,
                                           success: function (uri) {
                                               console.log("音乐文件复制成功", `${MusicURL}/${songName}.mp3`);
                                               callBack(`${MusicURL}/${songName}.mp3`);
                                           },
                                           fail: function (err) {
                                               console.log("音乐文件复制失败", err)
                                               callBack(null);
                                           }
                                       })
                                   },
                                   fail: function (err) {
                                       console.log("目标文件夹创建失败", err);
                                       callBack(null);
                                   }
                               })
                           }
                       })
                   },
                   fail(err) {
                       console.log('音乐下载失败', err);
                       callBack != null && callBack(false);
                   }
               })
           }
       })
    }

}


