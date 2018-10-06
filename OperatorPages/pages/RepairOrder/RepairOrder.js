const utils = require("../../../utils/util.js")
let app = getApp().globalData
let {
  baseUrl
} = getApp().globalData
const RepairUrl = `${baseUrl}/Api/RepairOrders/GetProcessedOrders` //获取维修订单列表	

const TreatedUrl = `${baseUrl}/Api/RepairOrders/GetWaitForProcessOrders` //获取维修待处理	

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部订单', '待处理订单', '取消订单'],
    currentTab: 0,
    // 全部订单列表
    waitconfirm:"",
    // 当前页数
    pageIndex:1,
    // 当前条数
    pageSize:4,
    // 待处理订单列表
    confirm: ""
  },

  //已确定详情
  conflrm() {
    wx.navigateTo({
      url: '/OperatorPages/pages/RepairConfirm/RepairConfirm',
    })
  },
  // 取消
  cancel(){
    wx.navigateTo({
      url: '/OperatorPages/pages/RepairConfirm/RepairConfirm',
    })
  },

  //待处理详情
  onWaitconfirmDetails(e) {
    wx.navigateTo({
      url: '/OperatorPages/pages/RepairUndetermined/RepairUndetermined',
    })
  },
  //导航控制
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx == 1) {
      this.TreatedList()
    }
  },


  // 确认订单
  conflrm: function() {

  },
  // 取消订单
  cancel: function() {

  },

  // 底部导航跳转
  Newlyadded: function() {
    wx.redirectTo({
      url: '/OperatorPages/pages/NewOrder/NewOrder',
    })
  },
  Booting: function() {
    wx.redirectTo({
      url: '/OperatorPages/pages/OrderList/OrderList',
    })
  },
  Statistics: function() {
    wx.redirectTo({
      url: '/OperatorPages/pages/Statistics/Statistics',
    })
  },

  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  // onPullDownRefresh: function () {
  //   let _this = this
  //   _this.TreatedList()
  //   wx.showToast({
  //     title: "加载中",
  //     icon: 'loading',
  //     duration: 1000
  //   });
  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   let _this = this
  //   let a = 2
  //   let page = _this.data.pageIndex
  //   let Size = _this.data.pageSize
  //   page++
  //   let Sizes = Size + a
  //   _this.setData({
  //     pageIndex: page,
  //       pageSize: Sizes
  //   })
  //   _this.TreatedList()
  //   wx.showToast({
  //     title: "加载中",
  //     icon: 'loading',
  //     duration: 1000
  //   });
  // },

  // 获取维修全部订单列表
  MaintenanceList: function() {
    let _this=this
    console.log(app)
    wx.request({
      url: RepairUrl,
      data: {
        Sign: "",
        pageSize:4, //返回条数
        pageIndex:1, //页数
        userId: app.User.UserId, //系统人员唯一编号
        enterpriseId: app.User.EnterpriseId, //企业唯一编号
        orderStatus: "0" //订单状态
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function(res) {
        console.log(res)
        _this.setData({
          waitconfirm: res.data.Data
        })
      }
    })
  },

  // 获取待处理订单
  TreatedList: function() {
    let _this = this
    console.log(app)
    wx.request({
      url: TreatedUrl,
      data: {
        Sign: "",
        pageSize: 4, //返回条数
        pageIndex:1, //页数
        enterpriseId: app.User.EnterpriseId, //企业唯一编号
        orderStatus: "0" //订单状态
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function(res) {
        console.log()
        _this.setData({
          confirm: res.data.Data
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     this.MaintenanceList()

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})