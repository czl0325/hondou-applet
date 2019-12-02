const formatTime = (date) => {
  if (date == null) {
    return ''
  }
  if (typeof(date) != 'string') {
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

module.exports = {
  formatTime
}