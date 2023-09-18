/**
 * 说明: 平台版本处理控制接口
 */

interface IPVJudgment {

    /**
     * ov小游戏平台对应的处理
     */
    MiniGameDeal(): void;

    /**
     * 抖音小游戏平台对应的处理
     */
    DouYinGameDeal(): void;

    /**
    * QQ小游戏平台对应的处理
    */
    QQMiniGameDeal(): void;

    /**
     * 安卓OPPO游戏平台对应的处理
     */
    AndroidOPPOGameDeal(): void;

    /**
   * 安卓VIVO游戏平台对应的处理
   */
    AndroidVIVOGameDeal(): void;

    /**
   * 安卓DOUYIN游戏平台对应的处理
   */
    AndroidDOUYINGameDeal(): void;

    /**
   * IOSOPPO游戏平台对应的处理
   */
    IOSOPPOGameDeal(): void;

    /**
   * IOSVIVO游戏平台对应的处理
   */
    IOSVIVOGameDeal(): void;

    /**
   * IOSDOUYIN游戏平台对应的处理
   */
    IOSDOUYINGameDeal(): void;



}