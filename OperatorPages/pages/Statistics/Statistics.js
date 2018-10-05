// pages/Statistics/Statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StartDate: '2018-09-01',  
    EndDate: '2018-09-01',
  },
  bindDateChange: function(e) {
    this.setData({
      StartDate: e.detail.value
    })
  },
  onDateChange: function(e) {
    this.setData({
      EndDate: e.detail.value
    })
  },


  // 底部导航跳转
  Newlyadded: function () {
    wx.redirectTo({
      url: '/OperatorPages/pages/NewOrder/NewOrder',
    })
  },
  Repair: function () {
    wx.redirectTo({
      url: '/OperatorPages/pages/RepairOrder/RepairOrder',
    })
  },
  Booting: function () {
    wx.redirectTo({
      url: '/OperatorPages/pages/OrderList/OrderList',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})