const utils = require("../../../utils/util.js")
let app = getApp().globalData
let {
  baseUrl
} = getApp().globalData
const RepairUrl = `${baseUrl}/Api/RepairOrders/GetOrderInfo` //获取维修订单详情	

const ConfirmUrl = `${baseUrl}/Api/RepairOrders/ReceiptOrder` //确认订单
const CancelUrl = `${baseUrl}/Api/RepairOrders/CancelOrder` //取消订单

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ShowModal: false, //弹框按钮操控
    // 渲染列表
    Detail:"",
    // 查询详请编号
    orderid: "",
     // 取消原因
    getdata: "",
  },


  // 查询详情
  details() {
    let _this=this
    let orderIds = this.data.orderid
    wx.request({
      url: RepairUrl,
      data: {
        sign: "",
        orderId: orderIds,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
        let detail=res.data.Data
        console.log(detail)
        for (let i = 0; detail.lemgth>i;i++){
          detail[i].Contact = utils.Decrypt(detail[i].Contact)
          detail[i].Phone = utils.Decrypt(detail[i].Phone)
          detail[i].Address = utils.Decrypt(detail[i].Address)
        }
        _this.setData({
          Detail: detail
        })
      },
    })
  },

  //确定订单
  conflrm() {
    let orderIds = this.data.orderid
    console.log(orderIds)
    wx.request({
      url: ConfirmUrl,
      data: {
        Sign: "",
        OrderId: orderIds,
        UserId: app.User.UserId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.Data) {
          wx.showToast({
            title: "确认成功",
            duration: 1000
          });
        }
      },
    })
  },


  // 获取取消原因
  getdata: function (e) {
    let _this = this
    let getdatas = e.detail.value
    _this.setData({
      getdata: getdatas
    })
  },
  /**
 * 显示输入狂取消按键
 */
  phoneList() {
    this.setData({
      ShowModal: true,
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
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.HideModal();
  },
  /**
    * 对话框确认按钮点击事件
    */
  onConfirm: function (e) {
    let _this = this
    // 用户
    let orderid = _this.data.orderid
    // 取消订单说明orderId
    let Explain = _this.data.getdata
    if (Explain !== "") {
      wx.request({
        url: CancelUrl,
        data: {
          Sign: "",
          OrderId: orderid,
          Explain: Explain,
          UserId: app.User.UserId,
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.Data) {
            wx.showToast({
              title: "提交成功",
              duration: 1000
            });
            // 隐藏弹框
            _this.HideModal()
            _this.setData({
              getdata: "",
            })
            wx.redirectTo({
              url: '/OperatorPages/pages/RepairOrder/RepairOrder',
            })
          } else {
            util.showError("提交有误请从新提交")
            return false
          }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this
    _this.setData({
      orderid: options.ID
    })
    _this.details()
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