function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}
function  formatTime1(date)  {
  var  year  =  date.getFullYear()
  var  month  =  date.getMonth()  +  1
  var  day  =  date.getDate()

  var  hour  =  date.getHours()
  var  minute  =  date.getMinutes()
  var  second  =  date.getSeconds()

  return  [year,  month,  day].map(formatNumber1).join('/')  +  ' '  +  [hour,  minute,  second].map(formatNumber1).join(':')
}

function  formatNumber1(n)  {
    n  =  n.toString()
    return  n[1]  ?  n  :  '0'  +  n
}

function Format(fmt) { 
  var o = {
		'M+': date.getMonth() + 1, //月份
		'd+': date.getDate(), //日
		'h+': date.getHours(), //小时
		'm+': date.getMinutes(), //分
		's+': date.getSeconds(), //秒
		'q+': Math.floor((date.getMonth() + 3) / 3), //季度
		'S': date.getMilliseconds() //毫秒
	};
	if(!this.isNotEmpty(fmt)){
		fmt = 'yyyy-MM-dd hh:mm:ss';
	}
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
		}
	}
	return fmt;
}
//加密
function Encryption(data) {
  return data
}
//解密
function Decrypt(data) {
  return data
}
/**
 * 错误消息提示
 */
function showError(err_msg, url) {
  wx.showModal({
    title: '提示',
    content: err_msg,
    showCancel: false,
    confirmColor: "#72bf5e",
    success: res => {
      if (url) {
        if (url.indexOf('user/index') > -1) {
          wx.switchTab({
            url: url,
          })
        } else {
          wx.navigateTo({
            url: url,
          })
        }
      }
    }
  })
}
module.exports = {
  formatTime: formatTime,
  Encryption: Encryption,
  Decrypt: Decrypt,
  showError: showError,
  Format:Format,
  formatTime1: formatTime1,
  formatLocation:formatLocation
}
