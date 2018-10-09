let {
  baseUrl
} = getApp().globalData
const baseUrls = `${baseUrl}/Api/GasOrders/GetProcessedOrders` //检查下单客户接口
let app = getApp().globalData
const utils = require("../../../utils/util.js")

let Num = 2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    DivisionModal: false,//控制分单弹框按钮
    allotModal: false,//控制分单弹框按钮
    navbar: ['全部订单', '新单', '分组', '派单'],
    currentTab: 0,
    //每个状态的显示和隐藏
    Grouping: 0,
    GroupName: "",
    //创建组
    CreateGroup: [
    ],
    // PaymentItems: [//支付方式选择
    //   { name: '配送工1', vehicle: '三轮', checked: true },
    //   { name: '配送工2', vehicle: '三轮', checked: false },
    //   { name: '配送工3', vehicle: '三轮', checked: false },
    //   { name: '配送工4', vehicle: '三轮', checked: false },
    // ],
    NewSingle: [//新单
      {
        CustomeId: '348867486123',
        Address: '龙泉区某某镇某某路',
        OrderType: '新单',
        date: "2018-08-23",
        time: "14:30",
      },
      {
        CustomeId: '23676586787',
        Address: '龙泉区某某镇某某路',
        OrderType: '新单',
        date: "2018-08-23",
        time: "14:30",
      },
    ],
    Distribution: [//已派单
      {
        CustomeId: '348867486123',
        Address: '龙泉区某某镇某某路',
        OrderType: '派单',
        date: "2018-08-23",
        time: "14:30",
      },
      {
        CustomeId: '23676586787',
        Address: '龙泉区某某镇某某路',
        OrderType: '派单',
        date: "2018-08-23",
        time: "14:30",
      },
    ],
    Division: [//分单
      {
        OrderType: '分组',
        singlelist: [
          {
            CustomeId: '348867486123',
            Address: '龙泉区某某镇某某路',
            OrderType: '派单',
            date: "2018-08-23",
            time: "14:30",
          },
          {
            CustomeId: '348867486123',
            Address: '龙泉区某某镇某某路',
            OrderType: '派单',
            date: "2018-08-23",
            time: "14:30",
          }
        ]
      },
      {
        OrderType: '分组',
        singlelist: [
          {
            CustomeId: '348867486123',
            Address: '龙泉区某某镇某某路',
            OrderType: '派单',
            date: "2018-08-23",
            time: "14:30",
          },
          {
            CustomeId: '348867486123',
            Address: '龙泉区某某镇某某路',
            OrderType: '派单',
            date: "2018-08-23",
            time: "14:30",
          }
        ]
      },
    ],
    AllOrders: [],
    pageIndex: 1,//当前页数，1代表第一页，以此类推
    pageSize: 3,//每页返回的数据条数
    index: "",//分单点击事件索引值
    Groupindex:"",//分组索引值
  },
  //导航控制
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    let currentTab = this.data.currentTab
    if (currentTab == 0) {
      this.AllOrders()
    }
  },
  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh() {
    this.AllOrders()
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
    let pageSize = this.data.pageSize;
    this.setData({
      pageIndex: Num,
      pageSize: pageSize,
    })
    Num++
    this.AllOrders()
    wx.showToast({
      title: "加载中",
      icon: 'loading',
      duration: 2000
    });
  },
  AllOrders() {//全部订单请求
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
        orderStatus: 10
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data.Data)
        let data = res.data.Data
        data.map(item => {//解密
          utils.Decrypt(item.Price)
          utils.Decrypt(item.Phone)
          utils.Decrypt(item.Address)
        })
        if (pageIndex > 1) {
          console.log("多条")
          let CreateGroup = this_.data.CreateGroup//分组数据
          if (CreateGroup.length == 0) {//判断没分过组
            console.log("1")
            let data = this_.data.AllOrders
            data = data.concat(res.data.Data)
            this_.setData({
              AllOrders: data
            })
          } else if (CreateGroup[0].GroupList.length > 0) {//判断分过组里面有数据
            let CreateGroupID = []
            for (let i = 0; i < CreateGroup.length; i++) {
              for (let j = 0; j < CreateGroup[i].GroupList.length; j++) {
                CreateGroupID.push(CreateGroup[i].GroupList[j].ID)
              }
            }
            console.log(CreateGroupID, res.data.Data[0].ID)
            if (this_.contains(CreateGroupID, res.data.Data[0].ID) == false) {
              let data = this_.data.AllOrders
              data = data.concat(res.data.Data)
              this_.setData({
                AllOrders: data
              })
            }
          }
        } else {
          console.log("一条")
          let CreateGroup = this_.data.CreateGroup//分组数据
          if (CreateGroup.length == 0) {
            console.log("3")
            this_.setData({
              AllOrders: data
            })
          }
        }
      }
    })
  },
  //判断数组里是否包含了值
  contains(GroupID, ID) {
    for (let k = 0; k < GroupID.length; k++) {
      if (GroupID[k] == ID) {
        return true;
      }
    }
    return false;
  },
  //配送工分配页面跳转
  onDistribution() {
    wx.navigateTo({
      url: '/DispatchedPages/pages/Distribution/Distribution',
    })
  },
  // 获取ipt分组名称值
  voteTitle(e) {
    let value = e.detail.value
    if (value !== "") {
      this.setData({
        GroupName: value
      })
      let CreateGroup = this.data.CreateGroup;
      let obj = {};
      obj.GroupList = []
      obj.GroupName = this.data.GroupName;//分组名字
      obj.GroupOrder = obj.GroupList.length + "个订单";
      CreateGroup.push(obj);
      this.setData({ CreateGroup })
    }
  },
  //分组添加订单点击事件
  GroupAdd(e) {
    console.log(e.currentTarget.dataset.index)
    console.log(this.data.CreateGroup)
    let idx = e.currentTarget.dataset.index//添加点击事件索引
    let index = this.data.index//订单的索引
    console.log(index)
    let AllOrders = this.data.AllOrders
    let CreateGroup = this.data.CreateGroup
    let obj = {};
    let arr = []
    if (CreateGroup.length > 1) {
      if (CreateGroup[idx].GroupList.length !== 0) {
        console.log("多条")
        CreateGroup[idx].GroupList.map(item => {
          arr.push(item)
        })
        arr.push(AllOrders[index])
        AllOrders.splice(index, 1)
      } else {
        arr.push(AllOrders[index])
        AllOrders.splice(index, 1)
      }
      obj.GroupList = arr
      obj.GroupName = CreateGroup[idx].GroupName;//分组名字
      obj.GroupOrder = obj.GroupList.length + "个订单";
      CreateGroup[idx] = obj
    } else {
      if (CreateGroup[0].GroupList.length !== 0) {
        console.log("一条")
        CreateGroup[0].GroupList.map(item => {
          arr.push(item)
        })
        arr.push(AllOrders[index])
        AllOrders.splice(index, 1)
      } else {
        arr.push(AllOrders[index])
        AllOrders.splice(index, 1)
      }
      obj.GroupList = arr
      obj.GroupName = CreateGroup[0].GroupName;//分组名字
      obj.GroupOrder = obj.GroupList.length + "个订单";
      CreateGroup[0] = obj
    }
    console.log(CreateGroup)
    this.setData({
      CreateGroup,
      AllOrders
    })
    this.allotModal();
  },
  //移除分组里单的索引值
  remove(e){
    console.log(e.currentTarget.dataset.dex)
    let dex=e.currentTarget.dataset.dex
    console.log(dex)
    let Groupindex=this.data.Groupindex
    console.log(Groupindex)
    let CreateGroup=this.data.CreateGroup
    let AllOrders=this.data.AllOrders
    console.log(CreateGroup[Groupindex].GroupList[dex])
    AllOrders.unshift(CreateGroup[Groupindex].GroupList[dex])
    CreateGroup[Groupindex].GroupList.splice([dex],1)
    CreateGroup[Groupindex].GroupOrder = CreateGroup[Groupindex].GroupList.length + "个订单";
    this.setData({
      AllOrders,
      CreateGroup
    })
  },
  //获取分组的索引值
  NewSingle(e){
    console.log(e.currentTarget.dataset.d)
    let Groupindex=e.currentTarget.dataset.d
    this.setData({Groupindex})
  },
  //保存分组点击事件
  onPreservation() {
    this.setData({
      Grouping: 2,
      GroupName: ""
    })
  },
  // 创建分组点击事件
  onCreate() {
    this.setData({
      Grouping: 3
    })
  },
  /**
   * 分组弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 分组隐藏模态对话框
   */
  allotModal: function () {
    this.setData({
      allotModal: false
    });
  },
  /**
   * 分组对话框取消按钮点击事件
   */
  allotCancel: function () {
    this.allotModal();
  },
  /**
   * 分组对话框确认按钮点击事件
   */
  allotConfirm: function () {
    this.allotModal();
  },
  //分单点击事件
  allot(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    this.setData({
      index
    })
    this.setData({
      allotModal: true,
    })
    if (this.data.CreateGroup[0] === undefined) {
      this.setData({
        Grouping: 1
      })
    } else {
      this.setData({
        Grouping: 2
      })
    }
  },

  //派单跳转订单详情
  Details() {
    wx.navigateTo({
      url: '/DispatchedPages/pages/Details/Details',
    })
  },
  //新单跳转订单详情
  onDetails() {
    wx.navigateTo({
      url: '/DispatchedPages/pages/Details/Details',
    })
  },

  //底部跳转
  Repair: function () {
    wx.redirectTo({
      url: '/DispatchedPages/pages/RepairOrder/RepairOrder',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.AllOrders()
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