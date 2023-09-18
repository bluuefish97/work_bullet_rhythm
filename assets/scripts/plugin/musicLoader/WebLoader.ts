
export default class WebLoader implements LoaderInterface {
    protected GmeName = "bulletRhythm"
    LoadMusicTable(URL: string, callback: Function) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log('网络音乐单下载成功')
                callback(JSON.parse(response));
            }
            else if (xhr.readyState == 4 && xhr.status >= 400) {
                console.log('网络音乐单下载失败')
                callback(null)
            }
        };
        xhr.open("GET", URL, true);
        xhr.send();
    }
    LoadSongClip(URL: string, songName: string, callBack: Function = null) {
        //加载音乐单
        cc.assetManager.loadRemote(URL, (err, res) => {
            if (err) {
                console.log('音乐加载失败');
                console.log(err);
                callBack(null)
            } else {
                console.log('音乐加载成功');
                callBack(res);
            }
        }
        )
    }
    LoadPoint(URL: string, callback: Function) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log('节奏点加载成功');
                callback(JSON.parse(response))
            }
            else if (xhr.readyState == 4 && xhr.status >= 400) {
                console.log('节奏点加载失败');
                callback(null);
            }
        };
        xhr.open("GET", URL, true);
        xhr.send();
    }



}
