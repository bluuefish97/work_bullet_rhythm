

interface SDKInterface {


  /**
   * 判断是否联网
   */
  IsOnLine();

  /**
   * 初始化Sdk
   * @param callback 回调
   */
  InitAD();

  /**
   * 展示banner
   */
  showBanner();

  /**
   * 隐藏banner
   */
  hideBanner();

  /**
   * 判断是否有视频
   */
  getVideoFlag();

  /**
   * 判断是否有插屏
   */
  getInsertFlag();

  /**
   * 展示插屏广告
   */
  showInters();

  /**
   * 展示视频广告
   * @param callback  广告回调
   */
  showVideo(callback)

  /**
   * 展示互推Icon
   * @param width
   * @param height
   * @param x
   * @param y
   */
  showNavigateIcon(width, height, x, y);

  /**
   * 隐藏互推Icon
   */
  hideNavigateIcon();
  /**
   * 显示互推列表
   */
  showNavigateGroup(type, side);

  /**
   * 隐藏互推列表
   */
  hideNavigateGroup();

  /**
   * 显示结算页互推列表
   */
  showNavigateSettle(type, x, y);

  /**
   * 隐藏互推结算
   */
  hideNavigateSettle();

  /**
   * 添加桌面图标
   */
  addDeskTop();


  /**
   * 震动
   */
  vibrate();

  /**
   * 长震动
   */
  longVibrate();

  /**
   * 退出游戏
   */
  exitTheGame();

  /**
   * 字节跳动-----创造更多游戏按钮
   */
  CreateMoreGamesButton(morgamePosNode: cc.Node, screenWidth: number, screenHight: number)

  /**
* 字节跳动-----清理更多游戏按钮
*/
  CleanMoreGamesButton(btn)


  //安卓------------显示游戏中心
  showGameCenter()



  //QQ ---------游戏盒子点击回调
  QQShowAppBox()

  //微信 ---格子广告
  getBlockFlag(index: number, x: number, y: number)

  //微信 ---格子广告
  hideBlock(index: number)

  //微信 ---格子广告
  showBlock(index: number, x: number, y: number)

  /**
* 上传事件
* @param data 
*/
  reportAnalytics(data)

}
