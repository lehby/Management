let { baseUrl } = getApp().globalData
const baseUrls = `${baseUrl}/Api/GasOrders/GetOrderInfo`//获取全部订单列表接口
let app = getApp().globalData
const Cancel = `${baseUrl}/Api/GasOrders/CancelOrder`//取消订单接口
const Confirm = `${baseUrl}/Api/GasOrders/ReceiptOrder`//确认订单接口
const utils = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ShowModal: false, //弹框按钮操控
    orderId: "",
    getText: '',
    ID: "",
    OperateExplain: "",
    OperatorName:"",
    FormatOperateTime:""
  },
  //确认订单事件
  conflrm(e) {
    let orderId = this.data.ID
    let customerId = e.currentTarget.dataset.customerid
    wx.request({
      url: Confirm,
      data: {
        Sign: "",
        OrderId: orderId,
        CustomerId: customerId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.data.Code == 200) {
          wx.redirectTo({
            url: '/OperatorPages/pages/OrderList/OrderList',
          })
        }
      },
    })
  },
  //取消订单显示弹窗事件
  cancel(e) {
    console.log(e)
    let orderId = e.currentTarget.dataset.orderid
    this.setData({
      orderId,
      ShowModal: true,
    })
  },
  // 获取取消原因
  getText: function (e) {
    let getTexts = e.detail.value
    this.setData({
      getTexts
    })
  },
  /**
   * 隐藏模态对话框
   */
  HideModal: function () {
    this.setData({
      ShowModal: false
    });
  },
  /**
  * 对话框确认按钮点击事件
  */
  onConfirm: function (e) {
    let _this = this
    // 订单
    let UserId = app.User.UserId
    // 用户
    let OrderId = _this.data.ID
    // tu款说明
    let Explain = _this.data.getTexts
    if (Explain !== "") {
      wx.request({
        url: Cancel,
        data: {
          Sign: "",
          OrderId: OrderId,
          UserId: UserId,
          Explain: Explain
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: "取消成功！",
            duration: 2000
          });
          // 隐藏弹框
          _this.HideModal()
          wx.redirectTo({
            url: '/OperatorPages/pages/OrderList/OrderList',
          })
        },
      })
    } else {
      wx.showToast({
        title: "请填写取消原因",
        duration: 1000
      });
    }
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.HideModal();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      ID: options.id
    })
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
        let OperateExplain
        let OperatorName
        let FormatOperateTime
        data.OrderTracks.map(item => {
          if (item.TrackType == 100) {
            OperateExplain = item.OperateExplain
            OperatorName = item.OperatorName
            FormatOperateTime = item.FormatOperateTime
          }
        })
        this_.setData({
          data,
          OperateExplain,
          OperatorName,
          FormatOperateTime
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