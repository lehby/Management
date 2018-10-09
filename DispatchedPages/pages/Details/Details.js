let { baseUrl } = getApp().globalData
const baseUrls = `${baseUrl}/Api/GasOrders/GetOrderInfo`//获取订单详情接口
let app = getApp().globalData
const utils = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){
    console.log(options)
    this.QueryId(options)
  },
  QueryId(options) {
    let this_ = this
    wx.request({
      url: baseUrls,
      data: {
        sign: "",
        orderId: options.id
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data.Data)
        let data = res.data.Data
        utils.Decrypt(data.Contact)
        utils.Decrypt(data.Phone)
        utils.Decrypt(data.Address)
        utils.Decrypt(data.Price)
        data.OrderItems.map(item => {
          utils.Decrypt(item.Quantity)
          utils.Decrypt(item.Price)
        })
        // let OperateExplain
        // let OperatorName
        // let FormatOperateTime
        // data.OrderTracks.map(item => {
        //   if (item.TrackType == 100) {
        //     OperateExplain = item.OperateExplain
        //     OperatorName = item.OperatorName
        //     FormatOperateTime = item.FormatOperateTime
        //   }
        // })
        this_.setData({
          data,
          // OperateExplain,
          // OperatorName,
          // FormatOperateTime
        })
        console.log(this_.data)
      },
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