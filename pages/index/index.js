let app = getApp().globalData
// CollectingSilverPages/pages/Home/Home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Duties:"",//职位状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app)
    this.setData({
      Duties: app.User.Duties
    })
  },
  //接线员分包页面跳转
  Operator() {
    wx.redirectTo({
      url: '/OperatorPages/pages/NewOrder/NewOrder',
    })
  },
  //收银员分包页面跳转
  CollectingSilver() {
    wx.redirectTo({
      url: '/CollectingSilverPages/pages/Home/Home',
    })
  },
  //派单员分包页面跳转
  Dispatched() {
    wx.redirectTo({
      url: '/DispatchedPages/pages/Home/Home',
    })
  },
  //库管员分包页面跳转
  Storehouse() {
    wx.redirectTo({
      url: '/StorehousePages/pages/Home/Home',
    })
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