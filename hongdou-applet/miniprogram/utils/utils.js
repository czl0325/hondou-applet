const formatTime = (date) => {
  if (date == null) {
    return ''
  }
  if (typeof (date) != 'string') {
    date = date.toString()
  }
  var stamp = (new Date().getTime() - new Date(date).getTime()) / 1000
  if (stamp < 60) {
    return "刚刚"
  } else if (stamp >= 60 && stamp < 3600) {
    return "" + parseInt(stamp / 60) + "分钟前"
  } else if (stamp >= 3600 && stamp < 3600 * 24) {
    return "" + parseInt(stamp / 3600) + "小时前"
  } else if (stamp >= 3600 * 24 && stamp < 3600 * 24 * 30) {
    return "" + parseInt(stamp / 3600 / 24) + "天前"
  } else if (stamp >= 3600 * 24 * 30 && stamp < 3600 * 24 * 365) {
    return "" + parseInt(stamp / 3600 / 24 / 30) + "个月前"
  } else if (stamp >= 3600 * 24 * 365) {
    return "" + parseInt(stamp / 3600 / 24 / 365) + "年前"
  }
}

const stringToDate = (dateStr, separator = "-") => {
  var dateArr = dateStr.split(separator);
  var year = parseInt(dateArr[0]);
  var month;
  if (dateArr[1].indexOf("0") == 0) {
    month = parseInt(dateArr[1].substring(1));
  } else {
    month = parseInt(dateArr[1]);
  }
  var day = parseInt(dateArr[2]);
  var date = new Date(year, month - 1, day);
  return date;
}

const dateToString = (date, toMinute=false) => {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString();
  var day = (date.getDate()).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  var last = ""
  if (toMinute) {
    last = " " + prefixZero(date.getHours(), 2) + ":" + prefixZero(date.getMinutes(), 2)
  }
  var dateTime = year + "-" + month + "-" + day + last;
  return dateTime;
}

const dateFormat = (fmt, date) => {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

const escape2Html = (str) => {
  var arrEntities = {
    'lt': '<',
    'gt': '>',
    'nbsp': ' ',
    'amp': '&',
    'quot': '"'
  };
  str = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto;width:100%" ')
  str = str.replace(/src='\/UpFile/gi, "src='http://www.ecl.com.cn/UpFile")
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) {
    return arrEntities[t];
  });
}

const prefixZero = (num, n) => {
  return (Array(n).join(0) + num).slice(-n);
}

const urlEncode = src => {
  return src.replace(/\&/g, '@').replace(/\?/g, '^').replace(/\=/g, '!');
}

const urlDecode = src => {
  return src.replace(/\@/g, '&').replace(/\^/g, '?').replace(/\!/g, '=')
}

module.exports = {
  formatTime,
  stringToDate,
  dateToString,
  escape2Html,
  dateFormat,
  prefixZero,
  urlEncode,
  urlDecode
}