let { baseUrl } = getApp().globalData
const baseUrls = `${baseUrl}/Api/GasOrders/GetProcessedOrders`//获取全部订单列表接口
const UntreatedUrls = `${baseUrl}/Api/GasOrders/GetWaitForProcessOrders`//获取待处理订单列表接口
const Cancel = `${baseUrl}/Api/GasOrders/CancelOrder`//取消订单接口
const Confirm = `${baseUrl}/Api/GasOrders/ReceiptOrder`//确认订单接口
let app = getApp().globalData
const utils = require("../../../utils/util.js")

let Num = 2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部订单', '待处理订单', '取消订单'],
    currentTab: 0,
    waitconfirm: [],
    Untreated: [],
    CancelList: [],
    pageIndex: 1,//当前页数，1代表第一页，以此类推
    pageSize: 3,//每页返回的数据条数
    ShowModal: false, //弹框按钮操控
    orderId: "",
    getText: ''
  },
  //确认订单事件
  conflrm(e) {
    console.log(e)
    let orderId = e.currentTarget.dataset.orderid
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
    let OrderId = _this.data.orderId
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
          _this.ObtainList()
          wx.showToast({
            title: "取消成功！",
            duration: 2000
          });
          // 隐藏弹框
          _this.HideModal()
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
  onLoad: function (options) {
    this.ObtainList()
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh() {
    this.ObtainList()
    this.Untreated()
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 2000
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let count = this.data.pageSize * Num;
    this.setData({
      pageIndex: this.data.pageIndex,
      pageSize: count,
    })
    Num++;
    this.ObtainList()
    this.Untreated()
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 2000
    });
  },
  //待处理订单列表接口
  Untreated() {
    let this_ = this
    let pageIndex = this_.data.pageIndex
    let pageSize = this_.data.pageSize
    wx.request({
      url: UntreatedUrls,
      data: {
        sign: "",
        pageIndex: pageIndex,
        pageSize: pageSize,
        enterpriseId: app.User.EnterpriseId,
        orderStatus: 0
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data.Data)
        let data = res.data.Data
        data.map(item => {
          utils.Decrypt(item.Price)
          utils.Decrypt(item.Phone)
          utils.Decrypt(item.Address)
        })
        this_.setData({
          Untreated: data
        })
      },
    })
  },
  //获取全部订单列表接口
  ObtainList() {
    let this_ = this
    let pageIndex = this_.data.pageIndex;
    let pageSize = this_.data.pageSize;
    wx.request({
      url: baseUrls,
      data: {
        sign: "",
        pageIndex: pageIndex,
        pageSize: pageSize,
        userId: app.User.UserId,
        enterpriseId: app.User.EnterpriseId,
        orderStatus: 0
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data.Data)
        let data = res.data.Data
        let arr = [];
        data.map(item => {//解密
          utils.Decrypt(item.Price)
          utils.Decrypt(item.Phone)
          utils.Decrypt(item.Address)
          if (item.Status == 100) {//遍历出取消订单
            arr.push(item)
          }
        })
        this_.setData({
          waitconfirm: data,
          CancelList: arr
        })
      },
    })
  },
  //导航控制
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    let currentTab = this.data.currentTab
    if (currentTab == 0) {
      this.ObtainList()
    } else if (currentTab == 1) {
      this.Untreated()
    }
  },
  //确定详情
  onConfirmDetails() {
    wx.navigateTo({
      url: '/OperatorPages/pages/ConfirmDetails/ConfirmDetails',
    })
  },
  //订单详情
  onWaitconfirmDetails(e) {
    wx.navigateTo({
      url: '/OperatorPages/pages/WaitconfirmDetails/WaitconfirmDetails?id=' + e.currentTarget.dataset.id,
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
  Statistics: function () {
    wx.redirectTo({
      url: '/OperatorPages/pages/Statistics/Statistics',
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})