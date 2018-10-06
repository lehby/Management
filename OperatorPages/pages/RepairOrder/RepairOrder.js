const utils = require("../../../utils/util.js")
let app = getApp().globalData
let { baseUrl } = getApp().globalData
const RepairUrl = `${baseUrl}/Api/RepairOrders/GetRepairLabels` //获取维修订单列表

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部订单', '待处理订单','取消订单'],
    currentTab: 0,
    waitconfirm:[
      {Price:'1200',Phone:'13325468900',CustomeId:'348867486123',Address:'龙泉区某某镇某某路',OrderType:'系统订单'},
      {Price:'1200',Phone:'13325468900',CustomeId:'348867486123',Address:'龙泉区某某镇某某路',OrderType:'系统订单'},
    ],
    confirm:[
      {Price:'1200',Phone:'13325468900',CustomeId:'348867486123',Address:'龙泉区某某镇某某路',OrderType:'电话订单'},
      {Price:'1200',Phone:'13325468900',CustomeId:'348867486123',Address:'龙泉区某某镇某某路',OrderType:'电话订单'},
    ],
  },
  //已确定详情
  onConfirmDetails(){
    wx.navigateTo({
      url: '/pages/RepairConfirm/RepairConfirm',
    })
  },
  //待确定详情
  onWaitconfirmDetails(){
    wx.navigateTo({
      url: '/pages/RepairUndetermined/RepairUndetermined',
    })
  },
  //导航控制
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },


  // 确认订单
  conflrm: function () {

  },
  // 取消订单
  cancel: function () {

  },

  // 底部导航跳转
  Newlyadded: function () {
    wx.redirectTo({
      url: '/OperatorPages/pages/NewOrder/NewOrder',
    })
  },
  Booting: function () {
    wx.redirectTo({
      url: '/OperatorPages/pages/OrderList/OrderList',
    })
  },
  Statistics: function () {
    wx.redirectTo({
      url: '/OperatorPages/pages/Statistics/Statistics',
    })
  },
  // 获取维修订单列表
  MaintenanceList:function(){


    wx.request({
      url: RepairUrl,
      data: {
        Sign: "",
       
      },
      method: 'post',
      // header: {}, // 设置请求的 header
      success: function (res) {

      }
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