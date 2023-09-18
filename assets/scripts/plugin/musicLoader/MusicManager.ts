import WebLoader from "./WebLoader";
import OppoLoader from "./OppoLoader";
import VivoLoader from "./VivoLoader";
import { Singleton } from "../Singleton";
import TTLoader from "./TTLoader";
import config, { Platform } from "../../../config/config";
// import config, { Platform } from "../../../config/config";

const { ccclass, property } = cc._decorator;


interface LoaderConstructor {
    new(): LoaderInterface;
}


function createLoader(ctor: LoaderConstructor): LoaderInterface {
    return new ctor();
}

@ccclass
export default class MusicManager extends Singleton<MusicManager> {

    Loader: LoaderInterface;
    constructor() {
        super();
        console.log('新建单例:  MusicManager')
        this.InitMusicLoader();
    }
    private  InitMusicLoader() {
        console.log('初始化: MusicManager')
        switch (config.platform) {
            case Platform.vivo:
                this.Loader = createLoader(VivoLoader);
                break;
            case Platform.oppo:
               // this.Loader = createLoader(WebLoader)
                this.Loader = createLoader(OppoLoader);
                break;
            case Platform.douYin:
               // this.Loader = createLoader(WebLoader)
                this.Loader = createLoader(TTLoader);
                break;
            default:
                this.Loader = createLoader(WebLoader)
                break;
        }
    }
}
