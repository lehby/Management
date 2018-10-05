let { baseUrl } = getApp().globalData
const baseUrls = `${baseUrl}/Api/Customers/CheckOrderCustomer`//检查下单客户接口
const Order = `${baseUrl}/Api/GasOrders/StaffSumbitOrder`//提交订气订单接口
const RepairUrl = `${baseUrl}/Api/RepairOrders/StaffSumbitOrder` //提交维修订单接口
const LabelUrl = `${baseUrl}/Api/RepairOrders/GetRepairLabels` //获取维修标签
let app = getApp().globalData
const utils = require("../../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array: [
      '立即出发',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
      '19:00',
      '19:30',
      '20:00',
    ], //预定时间弹框
    array2: [
      '今天',
      '明天'
    ],
    index: 0,
    index1: 0,
    navbar: ['新增订气', '新增维修'],
    currentTab: 0,
    goodsModal: false, //控制商品弹框按钮
    isgoods: false, //控制商品列表的显示隐藏
    //********************************************订单表单信息*************************************//
    // 用气编号
    GasNo: "",
    // 名字
    CustomerName: "",
    // 电话
    telephone: "",
    // 地址
    CustomerAddress: "",
    //客户唯一编号
    CustomerId: "",
    //联系地址所在纬度
    Latitude: "",
    //联系地址所在经度
    Longitude: "",
    AccountId: "",
    OrderItems: "",
    EnterpriseId: "",
    showgoods: false,//控制商品弹框隐藏显示
    goodslist: [],
    goods: [],
    Quantity: 0,
    Price: 0,
    OptionsBox: [//瓶和公斤选择
      { name: '瓶', checked: true },
      { name: '公斤', checked: false }
    ],
    //********************************************维修订单信息*************************************//
    // 用气编号
    MaintenanceNumber: "",
    // 维修名称
    MaintenanceName: "",
    // 维修电话
    MaintenanceTelephone: "",
    // 维修地址
    RepairAddress: "",
    //问题描述
    MaintenanceDescription: "",
    // 预约时间
    appointment: "立即出发",
    // 服务模式立即0预约10
    ServiceMode: "0",
    // 客户唯一id
    customerid: "",
    // 经度
    longitude: "",
    // 纬度
    latitude: "",
    // 维修编码
    RepairLabelIds: "",
    // 点击后的保修
    RepairLabel: [],
    // 渲染的保修列表
    guaranteeList: [],
    // 切换inpt框是否可编辑、
    edit: false,
  },
  //导航控制
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    if (this.data.currentTab == 1) {
      this.repair()
    }
  },

  //预约时间Picker索引值
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  //预约那天Picker索引值
  bindDayPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
  // 底部导航跳转
  Booting: function () {
    wx.redirectTo({
      url: "/OperatorPages/pages/OrderList/OrderList",
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
  //********************************************订单表单信息*************************************//
  //瓶和公斤选项框点击事件
  OptionsBox: function (e) {
    var checked = e.detail.value
    var changed = {}
    for (var i = 0; i < this.data.OptionsBox.length; i++) {
      if (checked.indexOf(this.data.OptionsBox[i].name) !== -1) {
        changed['OptionsBox[' + i + '].checked'] = true
      } else {
        changed['OptionsBox[' + i + '].checked'] = false
      }
    }
    console.log(changed)
    this.setData(changed)
    this.getData()
  },
  getData() {//获取查询到已有的信息
    //判断用户选择的是瓶还是公斤
    console.log(app)
    let arr = []
    let OptionsBox = this.data.OptionsBox
    if (OptionsBox[0].checked === true || OptionsBox[1].checked === false) {
      for (let i = 0; i < app.CustomerInfo.Products.length; i++) {
        let obj = {
          Quantity: app.CustomerInfo.Products[i].Quantity,
          Price: app.CustomerInfo.Products[i].UnitPrice,
          ProductName: app.CustomerInfo.Products[i].ProductName,
          ProductId: app.CustomerInfo.Products[i].ProductId
        }
        arr.push(obj)
      }
      this.setData({
        goodslist: arr
      })
    } else if (OptionsBox[1].checked === true || OptionsBox[0].checked === false) {
      for (let j = 0; j < app.CustomerInfo.Products.length; j++) {
        let obj = {
          Quantity: app.CustomerInfo.Products[j].Quantity,
          Price: app.CustomerInfo.Products[j].KilogramPrice,
          ProductName: app.CustomerInfo.Products[j].ProductName,
          ProductId: app.CustomerInfo.Products[j].ProductId
        }
        arr.push(obj)
      }
      this.setData({
        goodslist: arr
      })
    }
  },
  // 收索电话用气编号
  collecting: function () {
    let this_ = this
    let Phone = this_.data.telephone
    let GasNo = this_.data.GasNo
    let EnterpriseId = app.User.EnterpriseId
    wx.request({//检查下单客户请求
      url: baseUrls,
      data: {
        Sign: "",
        EnterpriseId: EnterpriseId,
        GasNo: GasNo,
        Phone: utils.Encryption(Phone)
      },
      method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data)
        if (res.data.Data == null) {
          utils.showError("未搜索出结果")
        } else {
          let data = res.data.Data
          utils.Decrypt(data.CustomerName)
          utils.Decrypt(data.CustomerPhone)
          utils.Decrypt(data.CustomerAddress)
          utils.Decrypt(data.AccountName)
          utils.Decrypt(data.AccountPhone)
          data.Products.map(item => {
            utils.Decrypt(item.UnitPrice)
            utils.Decrypt(item.KilogramPrice)
          })
          app.CustomerInfo = data
          if (data.GasNo !== "") {
            console.log("qi")
            app.Orderaddress.GasNo = data.GasNo
            this_.setData({
              GasNo: data.GasNo,
            })
          } else if (data.CustomerPhone !== "") {
            console.log("mingzi")
            app.Orderaddress.Phone = data.CustomerPhone
            this_.setData({
              telephone: data.CustomerPhone,
            })
          }
          app.Orderaddress.Contact = data.CustomerName
          this_.setData({//获取查询到的信息
            CustomerName: data.CustomerName,
            CustomerAddress: data.CustomerAddress,
            CustomerId: data.CustomerId,
            Latitude: data.CustomerLatitude,
            Longitude: data.CustomerLongitude,
            AccountId: data.AccountId,
          })
          console.log(getApp().globalData)
        }
      },
    })
  },
  // 获取订气订单用气编号
  Gasnumber: function (e) {
    app.Orderaddress.GasNo = e.detail.value
    this.setData({
      GasNo: e.detail.value
    })
  },
  // 获取订购人
  Subscribers: function (e) {
    app.Orderaddress.Contact = e.detail.value
    this.setData({
      CustomerName: e.detail.value
    })
  },
  // 获取订单用户电话
  telephone: function (e) {
    app.Orderaddress.Phone = e.detail.value
    this.setData({
      telephone: e.detail.value
    })
  },
  // 获取订气订单地址
  address: function (e) {
    this.setData({
      CustomerAddress: e.detail.value
    })
  },
  //新用户获取地址和经纬度页面跳转
  onAddres() {
    wx.navigateTo({
      url: '/pages/ReceivingAddress/ReceivingAddress?page=1'
    })
  },
  //重新选择地址
  reselectionAddres() {
    wx.navigateTo({
      url: '/pages/ReceivingAddress/ReceivingAddress?page=1'
    })
  },
  // 订气订单提交
  ConfirmSuccess() {
    let this_ = this
    let OptionsBox = this_.data.OptionsBox
    let PrceType
    let SubscribeTime
    if (OptionsBox[0].checked === true) {//购买模式判断
      PrceType = 0
    }
    else if (OptionsBox[1].checked === true) {
      PrceType = 10
    };
    let array = this_.data.array
    let time = "";
    if (array[this_.data.index] === "立即出发") {//预约时间判断
      time = 0
      SubscribeTime = ""
    }
    else if (array[this_.data.index] !== "立即出发") {
      time = 10
      let Times = utils.formatTime1(new Date());
      let day = Times.slice(0, 10)
      SubscribeTime = day + " " + this_.data.array[this_.data.index]
      console.log(SubscribeTime)
    };
    let goodslist = this_.data.goodslist
    let array1 = [];
    if (OptionsBox[0].checked === true) {//瓶
      for (let k = 0; k < goodslist.length; k++) {
        if (goodslist[k].Quantity > 0) {
          let OrderItems = {
            Price: utils.Encryption(goodslist[k].Price),
            Quantity: utils.Encryption(goodslist[k].Quantity),
            ProductId: utils.Encryption(goodslist[k].ProductId),
            Kilogram: 0
          }
          array1.push(OrderItems)
          this_.setData({
            OrderItems: array1
          })
        }
      }
    } else if (OptionsBox[1].checked === true) {
      for (let l = 0; l < goodslist.length; l++) {
        if (goodslist[l].Quantity > 0) {
          let OrderItems = {
            Price: utils.Encryption(goodslist[l].Price),
            Quantity: utils.Encryption(goodslist[l].Quantity),
            ProductId: utils.Encryption(goodslist[l].ProductId),
            Kilogram: 0
          }
          array1.push(OrderItems)
          this_.setData({
            OrderItems: array1
          })
        }
      }
    }
    console.log(this_.data.OrderItems)
    console.log(app)
    if (this_.data.CustomerName == "" || this_.data.CustomerAddress == "" || this_.data.Quantity == 0) {
      wx.showToast({
        title: '信息不能为空',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.request({
        url: Order,
        data: {
          Sign: "",
          GasNo: this_.data.GasNo,
          EnterpriseId: app.User.EnterpriseId,
          CustomerId: this_.data.CustomerId,
          Price: utils.Encryption(this_.data.Price),
          Quantity: utils.Encryption(this_.data.Quantity),
          Contact: utils.Encryption(this_.data.CustomerName),
          Phone: utils.Encryption(this_.data.telephone),
          Address: utils.Encryption(this_.data.CustomerAddress),
          Longitude: this_.data.Longitude,
          Latitude: this_.data.Latitude,
          GasBuyMode: PrceType,
          DistributionMode: time,
          SubscribeTime: SubscribeTime,
          UserId: app.User.UserId,
          OrderItems: this_.data.OrderItems,
        },
        method: 'post', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          console.log(res)
          if (res.data.Code == 200) {//下订单成功初始化数据
            app.Orderaddress.GasNo = "",
            app.Orderaddress.Contact = "",
            app.Orderaddress.Phone = "",
            app.Orderaddress.Address = "",
            app.Orderaddress.Longitude = "",
            app.Orderaddress.Latitude = ""
            app.CustomerInfo = null
            this_.setData({
              GasNo: "",
              CustomerName: "",
              telephone: "",
              CustomerAddress: "",
              CustomerId: "",
              Latitude: "",
              Longitude: "",
              AccountId: "",
              OrderItems: "",
              EnterpriseId: "",
              goodslist: [],
              goods: [],
              Quantity: 0,
              Price: 0,
            })
          }
        },
      })
    }
  },
  /**
  * 商品弹出框蒙层截断touchmove事件
  */
  preventTouchMove: function () { },
  /**
   * 商品隐藏模态对话框
   */
  goodsHideModal: function () {
    this.setData({
      showgoods: false
    });
  },
  /**
   * 商品对话框取消按钮点击事件
   */
  goodsCancel: function () {
    this.goodsHideModal();
  },
  /**
   * 商品对话框确认按钮点击事件
   */
  goodsConfirm: function () {
    let goodslist = this.data.goodslist;
    let goods = [];
    for (let i = 0; i < goodslist.length; i++) {
      if (goodslist[i].Quantity > 0) {
        goods.push(goodslist[i])
      }
    }
    console.log(goods)
    this.setData({
      isgoods: true,
      goods: goods
    })
    this.goodsHideModal();
  },
  /**
   * 商品点击显示弹框
   */
  ongoods() {
    this.setData({
      showgoods: true,
    })
    this.getData()
  },
  /**
   * 用户点击商品减1
   */
  subtracttap: function (e) {
    const index = e.target.dataset.index;
    const goodslist = this.data.goodslist;
    const Quantity = goodslist[index].Quantity;
    if (Quantity <= 0) {
      return;
    } else {
      goodslist[index].Quantity--;
      this.setData({
        goodslist: goodslist
      });
    }
    this.calculateTotal();
  },
  /**
   * 用户点击商品加1
   */
  addtap: function (e) {
    const index = e.target.dataset.index;
    const goodslist = this.data.goodslist;
    const Quantity = goodslist[index].Quantity;
    goodslist[index].Quantity++;
    this.setData({
      goodslist: goodslist
    });
    this.calculateTotal();
  },
  /**
   * 计算商品总数
   */
  calculateTotal: function () {
    let goodslist = this.data.goodslist;
    let Count = 0;
    let Price = 0;
    let OptionsBox = this.data.OptionsBox
    if (OptionsBox[0].checked === true || OptionsBox[1].checked === false) {//瓶
      for (let i = 0; i < goodslist.length; i++) {
        let good = goodslist[i];
        Count += good.Quantity;
        Price += good.Quantity * good.Price;
      }
      this.setData({
        Quantity: Count,
        Price: Price
      })
    } else {//公斤
      for (let i = 0; i < goodslist.length; i++) {
        let goods = goodslist[i];
        Count += parseInt(goods.Quantity);
        Price += goods.Quantity * goods.Price;
      }
      this.setData({
        Quantity: Count,
        Price: 0
      })
    }
  },
  //********************************************维修订单信息*************************************//
  //新用户获取地址和经纬度页面跳转
  onRepairAddres() {
    wx.navigateTo({
      url: '/pages/ReceivingAddress/ReceivingAddress',
    })
  },
  //重新获取地址信息
  reselectionRepair() {
    wx.navigateTo({
      url: '/pages/ReceivingAddress/ReceivingAddress',
    })
  },
  // 获取用气编号维修
  MaintenanceNumber: function (e) {
    this.setData({
      MaintenanceNumber: e.detail.value
    })
  },
  // 获取维修人姓名
  MaintenanceName: function (e) {
    app.Orderaddress.Contact = e.detail.value
    this.setData({
      MaintenanceName: e.detail.value
    })
  },
  // 获取申报人电话
  MaintenanceTelephone: function (e) {
    app.Orderaddress.Phone = e.detail.value
    this.setData({
      MaintenanceTelephone: e.detail.value
    })
  },
  // 获取维修地址
  RepairAddress: function (e) {
    app.Orderaddress.Address = e.detail.value
    this.setData({
      RepairAddress: e.detail.value
    })
  },
  // 获取维修描述
  MaintenanceDescription: function (e) {
    this.setData({
      MaintenanceDescription: e.detail.value
    })
  },

  // 获取用户选择时间
  MaintenanceReservation: function (e) {
    let timelist = this.data.array
    let index = e.detail.value
    let timelists = timelist[index]
    let Times = utils.formatTime1(new Date());
    let day = Times.slice(10, 16)
    if (timelists == "立即出发") {
      this.setData({
        ServiceMode: 0,
        appointment: day
      })
    } else {
      this.setData({
        ServiceMode: 10,
        appointment: timelists
      })
    }
  },
  // 获取报修标签
  repair: function () {
    let _this = this
    wx.request({
      url: LabelUrl,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        let guaranteeList = res.data.Data
        console.log(guaranteeList)
        if (res.data.Code == 200) {
          _this.setData({
            guaranteeList: guaranteeList
          })
        } else {
          console.log("获取标签错误")
        }
      },
    })
  },

  // 获取点的什么维修事项
  Discoloration: function (e) {
    let _this = this
    let index = e.target.dataset.index - 1
    let list = _this.data.guaranteeList
    // 拼接点击过的项目
    let prpair = _this.data.RepairLabel
    if (list[index].Enabled == true) {
      list[index].Enabled = false
    } else {
      list[index].Enabled = true
    }
    _this.setData({
      guaranteeList: list
    })
    for (let i = 0; i < _this.data.guaranteeList.length; i++) {
      if (_this.data.guaranteeList[i].Enabled == false) {
        let sort = _this.data.guaranteeList[i].ID
        var maintenanceitem
        // 数组拼接，转字符串拼接
        prpair = prpair.concat(sort);
        maintenanceitem = prpair.join(',');
        _this.setData({
          RepairLabelIds: maintenanceitem
        })
      }
    }
  },


  // 收索维修订单
  collectingCable: function () {
    let _this = this
    let phone = _this.data.MaintenanceTelephone
    let GasNo = _this.data.MaintenanceNumber
    wx.request({ //检查下单客户请求
      url: baseUrls,
      data: {
        Sign: "",
        EnterpriseId: app.User.EnterpriseId,
        GasNo: GasNo,
        Phone: utils.Decrypt(phone)
      },
      method: 'post',
      // header: {}, // 设置请求的 header
      success: function (res) {
        let Repair = res.data.Data
        console.log(Repair)
        if (res.data.Data == null) {
          utils.showError("为搜索到该用户请手动输入")
        } else {
          let Name = utils.Decrypt(Repair.CustomerName) //客户名称
          let Phone = utils.Decrypt(Repair.CustomerPhone) //客户电话
          let Address = utils.Decrypt(Repair.CustomerAddress) //客户地址
          let GasNo = Repair.GasNo //用气编号
          app.Orderaddress.Contact = Name//客户名称
          app.Orderaddress.Phone = Phone//客户电话
          app.Orderaddress.Address = Address
          app.Orderaddress.GasNo = GasNo//用气编号
          _this.setData({
            MaintenanceName: Name,
            MaintenanceTelephone: Phone,
            RepairAddress: Address,
            MaintenanceNumber: GasNo,
            customerid: Repair.CustomerId,
            longitude: Repair.CustomerLongitude,
            latitude: Repair.CustomerLatitude,
            edit: true
          })
        }
      },
    })
  },
  // 提交维修表单
  Submit: function () {
    // 预约时间拼接
    let Times = utils.formatTime1(new Date());
    let day = Times.slice(0, 10)
    let Selectiontime = this.data.appointment
    let Subscribe = day + " " + Selectiontime
    if (!this.data.MaintenanceName || !this.data.MaintenanceTelephone || !this.data.RepairAddress) {
      wx.showToast({
        title: '信息不能为空',
        icon: 'success',
        duration: 2000
      })
      return false
    }
    if (!this.data.MaintenanceDescription) {
      wx.showToast({
        title: '请输入问题描述',
        icon: 'success',
        duration: 2000
      })
      return false
    }
    wx.request({
      url: RepairUrl,
      data: {
        Sign: "",
        EnterpriseId: app.User.EnterpriseId,//企业唯一编号
        CustomerId: this.data.customerid,//客户唯一编号
        Contact: utils.Encryption(this.data.MaintenanceName),//联系人
        Phone: utils.Encryption(this.data.MaintenanceTelephone),//联系电话
        Address: utils.Encryption(this.data.RepairAddress),//联系地址
        Longitude: this.data.longitude,//纬度
        Latitude: this.data.latitude,//精度
        ServiceMode: this.data.ServiceMode,//服务模式
        SubscribeTime: Subscribe,//预约时间
        ProblemDescription: this.data.MaintenanceDescription,//问题描述
        UserId: app.User.UserId,//系统人员唯一编号
        RepairLabelIds: this.data.RepairLabelIds,//维修项目编号
        PhotoIds: "2",//照片编号
      },
      method: 'post',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res)
        if (res.data.Code == 200) {
          wx.redirectTo({
            url: '/OperatorPages/pages/RepairOrder/RepairOrder',
          })
          app.Orderaddress.Contact = ""
          app.Orderaddress.Phone = ""
          app.Orderaddress.Address = ""
          app.Orderaddress.Latitude = ""
          app.Orderaddress.Longitude = ""
          app.CustomerInfo = null
        } else {
          wx.showToast({
            title: "请从新提交",
            image: "../../imgs/2222.png",
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //********************************************订单表单信息*************************************//
    if (options.Order == 0) {//订气订单传值
      console.log("订气")
      this.setData({
        currentTab: 0,
        CustomerAddress: app.Orderaddress.Address
      })
      if (app.Orderaddress.Latitude !== "") {
        console.log("1")
        this.setData({
          Latitude: app.Orderaddress.Latitude,
          Longitude: app.Orderaddress.Longitude,
          CustomerName: app.Orderaddress.Contact,
          telephone: app.Orderaddress.Phone,
          GasNo: app.Orderaddress.GasNo,
        })
        if (app.CustomerInfo !== null) {
          this.setData({
            CustomerId: app.CustomerInfo.CustomerId
          })
        }
      }
    } else if (options.Order == 1) {//维修订单传值
      console.log("维修")
      this.setData({
        currentTab: 1,
        RepairAddress: app.Orderaddress.Address,
      })
      if (app.Orderaddress.Latitude !== "") {
        this.setData({
          latitude: app.Orderaddress.Latitude,
          longitude: app.Orderaddress.Longitude,
          MaintenanceTelephone: app.Orderaddress.Phone,
          MaintenanceName: app.Orderaddress.Contact,
          MaintenanceNumber: app.Orderaddress.GasNo,
        })
      }
    }
    //********************************************维修订单信息*************************************//

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