const utils = require("../../../utils/util.js")
let app = getApp().globalData
let {
  baseUrl
} = getApp().globalData
const RepairUrl = `${baseUrl}/Api/RepairOrders/GetProcessedOrders` //获取维修订单列表	

const TreatedUrl = `${baseUrl}/Api/RepairOrders/GetWaitForProcessOrders` //获取维修待处理	

const ConfirmUrl = `${baseUrl}/Api/RepairOrders/ReceiptOrder` //确认订单
const CancelUrl = `${baseUrl}/Api/RepairOrders/CancelOrder` //取消订单


Page({
  /**
   * 页面的初始数据
   */
  data: {
    ShowModal: false, //弹框按钮操控
    navbar: ['全部订单', '待处理订单', '取消订单'],
    currentTab: 1,
    // 取消订单列表
    Cancellation: "",
    // 取消原因
    Cancellingthecause: "",

    // 全部订单列表
    waitconfirm: "",
    // 当前页数
    pageIndex: 1,
    // 当前条数
    pageSize: 4,
    // 待处理订单列表
    confirm: "",
    // 取消原因
    getdata: "",
    // 取消订单id
    ID: "",
  },

  //确定订单
  conflrm(e) {
    let _thsi = this
    let orderIds = e.currentTarget.dataset.orderid
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
      success: function(res) {
        if (res.data.Data) {
          wx.showToast({
            title: "确认成功",
            duration: 1000
          });
          _this.TreatedList()
        }
      },
    })
  },


  // 获取取消原因
  getdata: function(e) {
    let _this = this
    let getdatas = e.detail.value
    _this.setData({
      getdata: getdatas
    })
  },
  /**
   * 显示输入狂取消按键
   */
  phoneList(e) {
    let _this = this
    let orderIds = e.currentTarget.dataset.orderid
    _this.setData({
      ShowModal: true,
      ID: orderIds,
    })
  },


  /**
   * 隐藏模态对话框
   */
  HideModal: function() {
    this.setData({
      ShowModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function() {
    this.HideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function(e) {
    let _this = this
    // 用户
    let orderid = _this.data.ID
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
        success: function(res) {
          if (res.data.Data) {
            wx.showToast({
              title: "提交成功",
              duration: 1000
            });
            _this.TreatedList()
            // 隐藏弹框
            _this.HideModal()
            _this.setData({
              getdata: "",
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


  //待处理详情
  onWaitconfirmDetails(e) {
    let id = e.currentTarget.dataset.id
     let cancel=e.currentTarget.dataset.cancel

    wx.navigateTo({
      url: '/OperatorPages/pages/RepairUndetermined/RepairUndetermined?ID=' + id,
    })
  },
  //导航控制
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (e.currentTarget.dataset.idx == 0) {
      this.MaintenanceList()
    }
    if (e.currentTarget.dataset.idx == 2) {
      this.cancellation()
    }
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
  onPullDownRefresh: function() {
    let _this = this
    _this.TreatedList()
    _this.MaintenanceList()
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
    page++
    let Sizes = Size + a
    _this.setData({
      pageIndex: page,
      pageSize: Sizes
    })
    _this.MaintenanceList()
    _this.TreatedList()
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 1000
    });
  },

  // 获取维修全部订单列表
  MaintenanceList: function() {
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
        orderStatus: "0" //订单状态
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function(res) {
        let Waitconfirm = res.data.Data
        let cancellation = []
        console.log(res)
        for (let i = 0; Waitconfirm.length > i; i++) {
          Waitconfirm[i].Contact = utils.Decrypt(Waitconfirm[i].Contact)
          Waitconfirm[i].Phone = utils.Decrypt(Waitconfirm[i].Phone)
          Waitconfirm[i].Address = utils.Decrypt(Waitconfirm[i].Address)
          if (Waitconfirm[i].Status) {
            cancellation.push(Waitconfirm[i])
          }
        }
        _this.setData({
          waitconfirm: Waitconfirm,
          Cancellation: cancellation
        })
      }
    })
  },
  // 取消订单
  cancellation: function() {
    this.MaintenanceList()
    // let Cancellation = this.data.Cancellation
    // let cancellingthecause=[]
    // for (let j = 0; Cancellation.length > j; j++) {
    //   if (Cancellation[j].OrderTracks.length>1){
    //     cancellingthecause.push(Cancellation[j].OrderTracks[1])
    //   }
    // }
  },

  // 获取待处理订单
  TreatedList: function() {
    let _this = this
    console.log(_this.data.Cancellation)
    let Size = _this.data.pageSize
    let Index = _this.data.pageIndex
    wx.request({
      url: TreatedUrl,
      data: {
        Sign: "",
        pageSize: Size, //返回条数
        pageIndex: Index, //页数
        enterpriseId: app.User.EnterpriseId, //企业唯一编号
        orderStatus: "0" //订单状态
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function(res) {
        let Confirm = res.data.Data
        for (let i = 0; Confirm.length > i; i++) {
          Confirm[i].Contact = utils.Decrypt(Confirm[i].Contact)
          Confirm[i].Phone = utils.Decrypt(Confirm[i].Phone)
          Confirm[i].Address = utils.Decrypt(Confirm[i].Address)
        }
        _this.setData({
          confirm: Confirm
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.TreatedList()

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