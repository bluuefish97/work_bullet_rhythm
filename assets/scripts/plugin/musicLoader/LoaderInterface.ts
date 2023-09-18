
interface LoaderInterface {
    /** 
     * 加载歌曲配置文件
    **/
    LoadMusicTable(URL: string,callback:Function)

    /**
     * 加载歌曲文件
     * @param URL 
     */
    LoadSongClip(URL: string, songName:string,callback:Function)

    /**
    * 加载歌曲节奏点文件
    * @param URL 
    */
    LoadPoint(URL: string,callback:Function)
}
