import { PoolManager } from "./PoolManager";

//namespace UtilityCommon{
class Utility {
  //自定义日期的结构体格式
  static DateFormat_Custom = function (_d: Date): CustomDate {
    let _date = new CustomDate();
    _date.year = _d.getFullYear();
    _date.month = _d.getMonth() + 1;
    _date.date = _d.getDate();  //日期
    _date.day = _d.getDay();      //星期几
    _date.hour = _d.getHours() > 9 ? _d.getHours() : '0' + _d.getHours();
    _date.minute = _d.getMinutes() > 9 ? _d.getMinutes() : '0' + _d.getMinutes();
    _date.second = _d.getSeconds() > 9 ? _d.getSeconds() : '0' + _d.getSeconds();
    _date.time = _d.getTime();
    _date.timeString = _date.year + ':' + _date.month + ':' + _date.date + ':' + _date.hour + ':' + _date.minute + ':' + _date.second;
    return _date
  }
  //检测是否是新的一天
  static checkIsNewDay(nowDate: CustomDate, lastSignDate: CustomDate) {
    if (nowDate.year == lastSignDate.year) {
      if (nowDate.month == lastSignDate.month) {
        if (nowDate.date > lastSignDate.date) {
          return true;
        }
      } else if (nowDate.month > lastSignDate.month) {
        return true;
      }
    } else if (nowDate.year > lastSignDate.year) {
      return true;
    }
    return false;
  }


  static ParseFloat(value, n) {
    return Math.round(parseFloat(value) * 1000 * n) / (1000 * n);
  }

  static random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  //将一个字符串按指定字符分割成数组
  static partStrBy(str: string, char: string) {
    let chars = str.split(char);
    return chars;

  }

  static timeChangeToStr(time: number, digit: number) {
    let h: number; //小时
    let m: number; //分钟
    let s: number; //秒
    h = Math.floor(time / (60 * 60))
    m = Math.floor((time % (60 * 60)) / 60)
    s = time % 60;
    // console.log("h " + h + "  m  " + m + "  s  " + s);
    let hstr: string = h < 10 ? "0" + h : h.toString()
    let mstr: string = m < 10 ? "0" + m : m.toString()
    let sstr: string = s < 10 ? "0" + s : s.toString()
    let str;
    if (digit == 2) {
      str = mstr + " ： " + sstr;  //+ " : " 
    }
    else if (digit == 3) {
      str = " " + hstr + " : " + mstr + " : " + sstr;
    }

    // console.log(str);
    return str;
  }

  /**
   * 判断某版本是否大于当前版本
   * @param version    支持的最低版本
   * @param engineVersion  引擎版本
   */
  static isversionNewThanEngineVersion(version, engineVersion) {
    var versionArr = version.split('.');
    var ver = Number(versionArr[0]) * 100 + Number(versionArr[1]) * 10 + Number(versionArr[2]);
    console.log("ver", ver);
    var engineVersionArr = engineVersion.split('.');
    var enginever = Number(engineVersionArr[0]) * 100 + Number(engineVersionArr[1]) * 10 + Number(engineVersionArr[2]);
    console.log("engineVersion", enginever);

    if (ver <= enginever) {
      return true;
    }
    else {
      return false;
    }
  }
  static RandomInt(min: number, max: number) {
    let vel = Math.floor(Math.random() * (max - min) + min);
    return vel;
  }

  static randomRange(min: number, max: number) {
    let vel = Math.random() * (max - min) + min;
    return vel;
  }

  /**
   * 字符串滚动
   * @param node 
   * @param speed 
   * @param context 
   */
  static roll(node: cc.Node, speed: number, context: cc.Component) {
    let dt = 0.016
    let   /**滚动 */
      rollBg = function () {
        node.x -= dt / node.scale * speed;
        if (node.x <= -(node.width) / node.scale) {
          node.x = (node.width / node.scale) / 2;
        }
      }
    if (node.width * node.scale > node.parent.width * node.parent.scale) {
      context.schedule(rollBg, dt)
    }
    else {
      context.unscheduleAllCallbacks();
    }
  }


  //车获得钻石飞动画
  static bezierAnim(pref: cc.Prefab, parent: cc.Node, firstPos: cc.Vec2, endPos: cc.Vec2, dur: number, _cal, point1offSetX, point1offSetY, point2offSetX, point2offSetY) {
    let obj = PoolManager.instance.getNode(pref, parent);

    let localFirstPos: cc.Vec2 = cc.v2(0, 0);
    let localEndPos: cc.Vec2 = cc.v2(0, 0)
    parent.convertToNodeSpaceAR(firstPos, localFirstPos);
    parent.convertToNodeSpaceAR(endPos, localEndPos);
    obj.setPosition(localFirstPos);
    let cPoint1 = cc.v2(localFirstPos.x + point1offSetX, localFirstPos.y + point1offSetY);
    let cPoint2 = cc.v2(localEndPos.x + point2offSetX, localEndPos.y + point2offSetY);
    let bezier = [cPoint1, cPoint2, localEndPos];
    let bezierTo = cc.bezierTo(dur, bezier).easing(cc.easeCubicActionOut());
    let cal = cc.callFunc(function () {
      if (_cal) {
        _cal();
      }
      PoolManager.instance.putNode(obj);
    })
    obj.runAction(cc.sequence(bezierTo, cal));
  }

  /**
   * 如果value在min与max之间，返回value。如果value小于min，返回min。如果value大于max，返回max
   * @param value 
   * @param min 
   * @param max 
   */
  public static clamp(value: number, min: number, max: number) {
    let temp = value
    if (value <= min) {
      temp = min;
    }
    else if (value > max) {
      temp = max;
    }
    return temp;
  }

  /** 
  *数字滚动增加动画
  */
  public static addScoreAnim(orignNum, offsetNum, dur, cal, compent, endCal = () => { }) {
    var target = orignNum + offsetNum;
    var callback = function () {
      if (offsetNum > 10000) {
        orignNum += 2000;
      } else if (offsetNum > 1000) {
          orignNum += 200;
        } else if (offsetNum > 100) {
          orignNum += 20;
        } else if (offsetNum > 10) {
          orignNum += 4;
        } else if (offsetNum > 0) {
          orignNum += 1;
        }
        else {
          compent.unschedule(callback);
          endCal();
          //this._startRollNum=false;
        }


      offsetNum = Math.abs(target - orignNum)
      cal(orignNum);
    }
    compent.schedule(callback, dur);
  }

  /**
 *数组去重
 */
  public static unique(arr) {
    var hash = [];
    var temp=[];
    for (var i = 0; i < arr.length; i++) {
      console.log(arr[i].name);
      console.log("下标——————"+hash.indexOf(arr[i].name));
      if (hash.indexOf(arr[i].name) == -1) {
        hash.push(arr[i].name);
        temp.push(arr[i]);
      }
    }
    return temp;
  }


  /**
   * 实现数字千分位
   * @param num
   * @param precision
   * @param separator
   * @returns {*}
   *=======================================================
   *     formatNumber(10000)="10,000"
   *     formatNumber(10000, 2)="10,000.00"
   *     formatNumber(10000.123456, 2)="10,000.12"
   *     formatNumber(10000.123456, 2, ' ')="10 000.12"
   *     formatNumber(.123456, 2, ' ')="0.12"
   *     formatNumber(56., 2, ' ')="56.00"
   *     formatNumber(56., 0, ' ')="56"
   *     formatNumber('56.')="56"
   *     formatNumber('56.a')=NaN
   *=======================================================
   */
 public static  formatNumber(num, precision?, separator?) {
      var parts;
      // 判断是否为数字
      if (!isNaN(parseFloat(num)) && isFinite(num)) {
          // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
          // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
          // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
          // 的值变成了 12312312.123456713
          num = Number(num);
          // 处理小数点位数
          num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
          // 分离数字的小数部分和整数部分
          parts = num.split('.');
          // 整数部分加[separator]分隔, 借用一个著名的正则表达式
          parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ' '));
  
          return parts.join('.');
      }
      return NaN;
  }


  public static cutOffStr(str:string){
      let tempStr=str;
      if(str&&str.length>5){
          let n=str.slice(0,5);
          tempStr=n+"..."
      }
      else{
          tempStr=str
      }
      return tempStr;
  }
}



class CustomDate {
  year: number;
  month: number;
  date: number;
  day: number;
  hour: number | string;
  minute: number | string;
  second: number | string;
  time: number;
  timeString: string;
}

export { Utility, CustomDate }


