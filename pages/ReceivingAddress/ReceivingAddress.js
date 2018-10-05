
var util = require('../../utils/util.js')
var formatLocation = util.formatLocation
let {
  Orderaddress
} = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasLocation: false,
    location: "",
    locationAddress: "",
    address: "",
    // 页面传值
    Page:""
  },
  chooseLocation: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          hasLocation: true,
          location: formatLocation(res.longitude, res.latitude),
          locationAddress: res.address
        })
      }
    })
  },
  clear: function() {
    this.setData({
      hasLocation: false
    })
  },
  // 获取用户输入地址
  assignment(e) {
    let text = e.detail.value
    this.setData({
      address: text
    })

  },
  keep: function() {
    let _this = this
    let addressD = _this.data.address
    let location = _this.data.locationAddress
    // 拼接获取到的地址
    let locations = location + addressD
    let longitude = _this.data.location
    let longitudes = longitude.longitude[0] + "." + longitude.longitude[1]
    let latitudes = longitude.latitude[0] + "." + longitude.latitude[1]
    Orderaddress.Address = locations
    Orderaddress.Longitude = longitudes
    Orderaddress.Latitude = latitudes
    if (addressD == "" || addressD == undefined) {
      wx.showToast({
        title: "请输入详细地址！",
        icon: 'loadlng',
        duration: 1000
      });
    } else if (location == "" || location == undefined){
      wx.showToast({
        title: "请选择地址！",
        icon: 'loadlng',
        duration: 1000
      });
    }else{
      if (_this.data.Page==1){
        wx.redirectTo({
          url: '/OperatorPages/pages/NewOrder/NewOrder?Order=0',
        })
     }else{
        wx.redirectTo({
          url: '/OperatorPages/pages/NewOrder/NewOrder?Order=1',
        })
     }
     
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      Page:options.page
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})