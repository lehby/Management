const utils = require("../../../utils/util.js")
let app = getApp().globalData
let {
  baseUrl
} = getApp().globalData
const RepairUrl = `${baseUrl}/Api/RepairOrders/GetOrderInfo` //获取维修订单详情	
// 图片路径
const photo = `${baseUrl}/Api/Files/GetRepairPhoto`

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 渲染列表
    Detail: "",
    // 查询详请ID编号
    orderid: "",
    // 预览图片数组
    img: "",
    photo: "",//图片路径
    imgs: []
  },


  // 查询详情
  details() {
    let _this = this
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
      success: function (res) {
        let detail = res.data.Data
        console.log(detail)
        for (let i = 0; detail.lemgth > i; i++) {
          detail[i].Contact = utils.Decrypt(detail[i].Contact)
          detail[i].Phone = utils.Decrypt(detail[i].Phone)
          detail[i].Address = utils.Decrypt(detail[i].Address)
          detail[i].SubscribeTime = detail[i].SubscribeTime.replace('T',' ')
        }
        _this.setData({
          Detail: detail
        })
        // 详情图片
        let imglist = _this.data.Detail.RepairPhotos
        _this.imgs(imglist)
        _this.setData({
          img: imglist
        })
      },
    })
  },

  // 图片预览------------------------------
  previewImg: function (e) {
    var data_evnt = e; //将函数事件对象传入 ，以及图片获取到的数组 
    util.imgpreview(data_evnt, this.data.imgs)
  },
  // 图片路径拼接
  imgs(imglist) {
    let arr = []
    for (let i = 0; imglist.length > i; i++) {
      let imgs = photo + "/?photoId=" + imglist[i].PhotoId
      arr.push(imgs)
    }
    this.setData({
      imgs: arr
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    _this.setData({
      orderid: options.ID
    })
    _this.details()
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