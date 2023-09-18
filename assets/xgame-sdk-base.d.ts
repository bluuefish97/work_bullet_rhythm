declare var g: any;
declare var XGameGlobal: any;
declare var xgame_defined: any;
declare function define(name: any, requires: any, ctor: any): void;
declare function extension_amd_init(): void;
declare module "sdk/src/Const" {
    export enum PLATFORM {
        inner = 1,
        wechat_dev = 2,
        wechat_mini = 3,
        wechat_pay = 4,
        bytedance_mini = 5,
        oppo_mini = 6,
        vivo_mini = 7,
        qq_mini = 9,
        huawei_mini = 10
    }
    export enum PLUG {
        inner_platform = 1,
        wechat_mini = 2,
        wechat_pay = 3,
        mini_ad_control = 4,
        bytedance_mini = 5,
        oppo_mini = 6,
        vivo_mini = 7,
        qq_mini = 9,
        huawei_mini = 10,
        meituan_mini = 15
    }
    export enum AdType {
        unknow = 0,
        banner = 1,
        inters = 2,
        video = 3,
        custom = 4,
        native = 5,
        splash = 6
    }
}
declare module "sdk/src/Component" {
    import { AdType } from "sdk/src/Const";
    export class AdEvent {
        type: AdType;
        instType: string;
        success: boolean;
        adChannel: string;
        adGroup: string;
        adPlan: string;
        adIdea: string;
        adChannelName: string;
        adGroupName: string;
        adPlanName: string;
        adIdeaName: string;
        rewardAmount: string;
        rewardLabel: string;
        revenue: number;
        revenueCurrency: string;
        eventParams: any;
        message: string;
        loadTime: number;
        isReward: boolean;
        isShare: boolean;
    }
    export class ShowResult {
        onShow: (e: AdEvent) => void;
        onHide: (e: AdEvent) => void;
        onClick: (e: AdEvent) => void;
        onResult: (e: AdEvent) => void;
        onError: (msg?: string) => void;
    }
}
declare module "sdk/src/ad/IAdPos" {
    import { ShowResult } from "sdk/src/Component";
    export default interface IAdPos {
        create(): IAdPos;
        getFlag(cb: (flag: boolean) => void): void;
        show(result: ShowResult): void;
        hide(): void;
    }
}
declare module "sdk/src/ad/IAdBannerPos" {
    import IAdPos from "sdk/src/ad/IAdPos";
    export default interface IAdBannerPos extends IAdPos {
    }
}
declare module "sdk/src/ad/IAdCustomPos" {
    import IAdPos from "sdk/src/ad/IAdPos";
    export default interface IAdCustomPos extends IAdPos {
        setPosition(x: number, y: number): void;
        setAnchor(x: number, y: number): void;
    }
}
declare module "sdk/src/ad/IAdIntersPos" {
    import IAdPos from "sdk/src/ad/IAdPos";
    export default interface IAdIntersPos extends IAdPos {
    }
}
declare module "sdk/src/ad/IAdVideoPos" {
    import IAdPos from "sdk/src/ad/IAdPos";
    export default interface IAdVideoPos extends IAdPos {
    }
}
declare module "sdk/src/IModule" {
    export default class IModule {
        static MODULE_UNKNOW: number;
        static MODULE_PLATFORM: number;
        static MODULE_USER: number;
        static MODULE_AD: number;
        static MODULE_CHANNEL: number;
        getType(): number;
        onModule(sdk: any): void;
        init(cb: (ret: any) => void): void;
        onInit(): void;
        onInitAfter(): void;
        onLogin(): void;
    }
}
declare module "sdk/src/IAd" {
    import IModule from "sdk/src/IModule";
    import IAdBannerPos from "sdk/src/ad/IAdBannerPos";
    import IAdVideoPos from "sdk/src/ad/IAdVideoPos";
    import IAdIntersPos from "sdk/src/ad/IAdIntersPos";
    import IAdCustomPos from "sdk/src/ad/IAdCustomPos";
    import { ShowResult } from "sdk/src/Component";
    export default interface IAd extends IModule {
        getType(): number;
        showBanner(result: ShowResult): void;
        hideBanner(): void;
        getIntersFlag(cb: (flag: boolean) => void): void;
        showInters(result: ShowResult): void;
        getVideoFlag(cb: (flag: boolean) => void): void;
        showVideo(result: ShowResult): void;
        newResult(): ShowResult;
        createCustomAd(idIndex: number): IAdCustomPos | null;
        createBannerPos(pos_no: string): IAdBannerPos | null;
        createIntersPos(pos_no: string): IAdIntersPos | null;
        createVideoPos(pos_no: string): IAdVideoPos | null;
        createCustomPos(pos_no: string): IAdCustomPos | null;
        getDefaultBannerPos(): IAdBannerPos | null;
        getDefaultIntersPos(): IAdIntersPos | null;
        getDefaultVideoPos(): IAdVideoPos | null;
        getDefaultCustomPos(index: number): IAdCustomPos | null;
    }
}
declare module "platform/base/src/BaseAd" {
    import IAdBannerPos from "sdk/src/ad/IAdBannerPos";
    import IAdCustomPos from "sdk/src/ad/IAdCustomPos";
    import IAdIntersPos from "sdk/src/ad/IAdIntersPos";
    import IAdVideoPos from "sdk/src/ad/IAdVideoPos";
    import { ShowResult } from "sdk/src/Component";
    import IAd from "sdk/src/IAd";
    export default class BaseAd implements IAd {
        getType(): number;
        showBanner(result: ShowResult): void;
        hideBanner(): void;
        getIntersFlag(cb: (flag: boolean) => void): void;
        showInters(result: ShowResult): void;
        getVideoFlag(cb: (flag: boolean) => void): void;
        showVideo(result: ShowResult): void;
        newResult(): ShowResult;
        createCustomAd(idIndex: number): IAdCustomPos;
        createBannerPos(pos_no: string): IAdBannerPos;
        createIntersPos(pos_no: string): IAdIntersPos;
        createVideoPos(pos_no: string): IAdVideoPos;
        createCustomPos(pos_no: string): IAdCustomPos;
        onModule(sdk: any): void;
        onInit(): void;
        onInitAfter(): void;
        onLogin(): void;
    }
}
declare module "sdk/src/Structs" {
    export class ProductInfo {
        id: string;
        name: string;
        desc: string;
        price: number;
    }
    export class OrderInfo {
        product: ProductInfo;
        orderId: string;
        status: number;
    }
    export class PlatformInfo {
        platform: string;
        win_width: number;
        win_height: number;
        brand: string;
        model: string;
        language: string;
        system_version: string;
        app_version: string;
        bundle_id: string;
        core_version: string;
        platform_version_name: string;
        platform_version_code: number;
        query: any;
    }
    export class AjaxRes {
        status: number;
        url: string;
        header: {};
        method: string;
        data: any;
    }
    export class AjaxOpt {
        url: string;
        data: any;
        method: string;
        dataType?: string;
        header?: {};
        success: (res: AjaxRes) => void;
        error: (msg: string) => void;
    }
    export class Plug {
        ptype: number;
        params: any;
    }
    export class BridgeCallNativeStatic {
        cname: string;
        fname: string;
        fsign: string;
    }
    export class Bridge {
        callNativeStatic: (call: BridgeCallNativeStatic, ...params: any[]) => void;
    }
    export type PayCallback = (ret: string, order: OrderInfo[]) => void;
}
declare module "sdk/src/IChannel" {
    import IModule from "sdk/src/IModule";
    import { Plug } from "sdk/src/Structs";
    export default interface IChannel extends IModule {
        getType(): number;
        loadInfo(info: any): any;
        getPlug(ptype: number): Plug;
        reqRemoteConfig(configId: number, cb: (ret: string, res: any) => void): any;
    }
}
declare module "platform/base/src/BaseChannel" {
    import IChannel from "sdk/src/IChannel";
    import { Plug } from "sdk/src/Structs";
    export default class BaseChannel implements IChannel {
        getType(): number;
        loadInfo(info: any): void;
        getPlug(ptype: number): Plug;
        onModule(sdk: any): void;
        onInit(): void;
        onInitAfter(): void;
        onLogin(): void;
    }
}
declare module "sdk/src/IPlatform" {
    import IModule from "sdk/src/IModule";
    import { AjaxOpt, PlatformInfo } from "sdk/src/Structs";
    export default interface IPlatform extends IModule {
        onInitEnd(success: (ret: string) => void): void;
        login(success: (ret: string, data: any) => void): void;
        pay(product_no: string, success: (ret: string) => void): void;
        ajax(opt: AjaxOpt): void;
        getServerUrl(): string;
        getServerHost(): string;
        saveLocal(name: string, value: string): any;
        getLocal(name: string): string;
        removeLocal(name: string): void;
        clearLocal(): void;
        saveSession(name: string, value: string): void;
        getSession(name: string): string;
        removeSession(name: string): void;
        clearSession(): void;
        getInfo(): PlatformInfo;
        shareApp(): void;
        phoneVibrate(type: string): void;
        setTimeout(callback: () => void, delay: number, ...args: any[]): any;
        clearTimeout(id: any): any;
        setInterval(callback: () => void, delay: number, ...args: any[]): any;
        clearInterval(id: any): void;
        exitTheGame(): void;
        onLoginOut(ret: string): void;
    }
}
declare module "platform/base/src/BasePlatform" {
    import IPlatform from "sdk/src/IPlatform";
    import { AjaxOpt, PlatformInfo } from "sdk/src/Structs";
    export default class BasePlatform implements IPlatform {
        getServerHost(): string;
        clearLocal(): void;
        clearSession(): void;
        onInitEnd(success: (ret: string) => void): void;
        login(success: (ret: string, data: any) => void): void;
        pay(product_no: string, success: (ret: string) => void): void;
        ajax(opt: AjaxOpt): void;
        getServerUrl(): string;
        saveLocal(name: string, value: string): void;
        getLocal(name: string): string;
        removeLocal(name: string): void;
        saveSession(name: string, value: string): void;
        getSession(name: string): string;
        removeSession(name: string): void;
        getInfo(): PlatformInfo;
        shareApp(): void;
        phoneVibrate(type: string): void;
        setTimeout(callback: () => void, delay: number, ...args: any[]): void;
        clearTimeout(id: any): void;
        setInterval(callback: () => void, delay: number, ...args: any[]): void;
        clearInterval(id: any): void;
        exitTheGame(): void;
        getType(): number;
        onModule(sdk: any): void;
        onInit(): void;
        onInitAfter(): void;
        onLogin(): void;
    }
}
declare module "sdk/src/IUser" {
    import IModule from "sdk/src/IModule";
    import { OrderInfo, PayCallback, ProductInfo } from "sdk/src/Structs";
    export class UserInfo {
        user_id: number;
        last_login_time: number;
        name: string;
        token: string;
    }
    export class AccountInfo {
        account_id: number;
        open_id: string;
        data: any;
    }
    export class UserLoginResData {
        user: UserInfo;
        account: AccountInfo;
    }
    export class UserLoginRes {
        ret: string;
        data: UserLoginResData;
    }
    export default interface IUser extends IModule {
        getAccountId(): number;
        getUserId(): number;
        getUserToken(): string;
        getLogined(): boolean;
        login(cb: (ret: string, res: UserLoginRes) => void): void;
        logout(): void;
        reqPayedOrders(): void;
        pay(product_no: string, success: (ret: string) => void): void;
        setOnPayed(payed: PayCallback): void;
        onPayed(ret: string, orders: OrderInfo[]): boolean;
        getOrders(): OrderInfo[];
        commitOrder(order_id: string): void;
        newProduct(): ProductInfo;
        api(url: string, data: any, success: (ret: string, data: any) => void, checkLogin?: boolean): void;
        androidMarPay(money: string, propId: string, propName: string): void;
    }
}
declare module "platform/base/src/BaseUser" {
    import IUser from "sdk/src/IUser";
    import { PayCallback, OrderInfo, ProductInfo } from "sdk/src/Structs";
    export default class BaseUser implements IUser {
        getAccountId(): number;
        getUserId(): number;
        getUserToken(): string;
        login(success: (ret: string, res: any) => void): void;
        logout(): void;
        reqPayedOrders(): void;
        pay(product_no: string, success: (ret: string) => void): void;
        setOnPayed(payed: PayCallback): void;
        onPayed(ret: string, orders: OrderInfo[]): boolean;
        getOrders(): OrderInfo[];
        commitOrder(order_id: string): void;
        newProduct(): ProductInfo;
        api(url: string, data: any, success: (ret: string, data: any) => void, checkLogin?: boolean): void;
        androidMarPay(money: string, propId: string, propName: string): void;
        getType(): number;
        onModule(sdk: any): void;
        onInit(): void;
        onInitAfter(): void;
        onLogin(): void;
    }
}
declare module "sdk/src/IExtension" {
    export default interface IExtension {
        onInit(sdk: any): any;
        onInitAfter(): any;
        onLogin(): any;
    }
}
declare module "sdk/src/Utils" {
    export class Queue {
        queue: any[];
        starting: boolean;
        finishcb: any;
        complete(...args: any[]): void;
        then(cb: (q: Queue, ...args: any[]) => void): this;
        start(cb?: (q: Queue) => void, ...args: any[]): void;
        cancel(): void;
        static create(): Queue;
    }
}
declare module "sdk/src/XGame" {
    import IExtension from "sdk/src/IExtension";
    import IAd from "sdk/src/IAd";
    import IChannel from "sdk/src/IChannel";
    import IModule from "sdk/src/IModule";
    import IPlatform from "sdk/src/IPlatform";
    import IUser from "sdk/src/IUser";
    export default class XGame {
        private modules;
        private plat;
        private user;
        private ad;
        private channel;
        private channelId;
        private extensions;
        initModules(modules: IModule[]): void;
        Platform(): IPlatform;
        User(): IUser;
        Ad(): IAd;
        Channel(): IChannel;
        onLogin(): void;
        getChannelId(): number;
        init(channelId: number, success: (ret: string) => void): void;
        regExtension(ext: IExtension): void;
    }
}
declare module "platform/base/src/config" { }
