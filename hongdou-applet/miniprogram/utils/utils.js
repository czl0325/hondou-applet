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

const dateToString = (date) => {
  var year = date.getFullYear();
  var month = (date.getMonth() + 1).toString();
  var day = (date.getDate()).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  var dateTime = year + "-" + month + "-" + day;
  return dateTime;
}

module.exports = {
  formatTime,
  stringToDate,
  dateToString
}