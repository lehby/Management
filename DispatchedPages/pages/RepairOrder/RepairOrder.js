const utils = require("../../../utils/util.js")
let app = getApp().globalData
let {
  baseUrl
} = getApp().globalData
const RepairUrl = `${baseUrl}/Api/RepairOrders/GetProcessedOrders` //获取维修订单列表	

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部订单', '新单', '派单'],
    currentTab: 0,
    SendOut:[],
    // 当前页数
    pageIndex: 1,
    // 当前条数
    pageSize: 4,
  },
  //配送工分配页面跳转
  onDistribution() {
    wx.navigateTo({
      url: '/DispatchedPages/pages/Distribution/Distribution',
    })
  },
  //跳转详情
  details(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/DispatchedPages/pages/RepairDetails/RepairDetails?ID=' + id,
    })
  },
  //导航控制
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  //底部跳转
  Booting: function() {
    wx.redirectTo({
      url: '/DispatchedPages/pages/OrderList/OrderList',
    })
  },
  // 获取派单列表
  Distributeleaflets: function() {
    let _this = this
    let Size = _this.data.pageSize
    let Index = _this.data.pageIndex
    wx.request({
      url: RepairUrl,
      data: {
        Sign: "",
        pageSize: Size, //返回条数
        pageIndex: Index, //页数
        userId: app.User.UserId, //系统人员唯一编号
        enterpriseId: app.User.EnterpriseId, //企业唯一编号
        orderStatus: "10" //订单状态
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function(res) {
        let Waitcon = _this.data.SendOut
        let Waitconfirm = res.data.Data
        console.log(Waitconfirm)
        // 数组拼接
        Waitcon=Waitcon.concat(Waitconfirm)

        for (let i = 0; Waitconfirm.length > i; i++) {
          Waitconfirm[i].Contact = utils.Decrypt(Waitconfirm[i].Contact)
          Waitconfirm[i].Phone = utils.Decrypt(Waitconfirm[i].Phone)
          Waitconfirm[i].Address = utils.Decrypt(Waitconfirm[i].Address)
          Waitconfirm[i].SubscribeTime = Waitconfirm[i].SubscribeTime.replace('T', ' ')
        }
        _this.setData({
          SendOut: Waitcon
        })
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let _this = this
    _this.Distributeleaflets()
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 1000
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let _this = this
    let a = 4
    let page = _this.data.pageIndex
    let Size = _this.data.pageSize
    if (Size - 4 > _this.data.SendOut.length) {
      wx.showToast({
        title: "没有更多了",
        icon: 'loading',
        duration: 1000
      });
      return false
    }
    page++
    let Sizes = Size
    _this.setData({
      pageIndex: page,
      pageSize: Sizes
    })
    _this.Distributeleaflets()
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 1000
    });
  },

 dd(){
   let a = [{
     name: "程咬金",
     sex: "1",
     age: 26
   },
   {
     name: "11",
     sex: "0",
     age: 20
   },
   {
     name: "程新松",
     sex: "1",
     age: 22
   },
   {
     name: "11",
     sex: "1",
     age: 18
   }
   ];
   var new_data = JSON.stringify(a, ['name', 'sex']);
   console.log(new_data);


 },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.Distributeleaflets()
    this.dd()
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