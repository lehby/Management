let app = getApp().globalData
const baseUrls = app.baseUrl + '/Api/Login/UserLogin' //登录接口
const utils = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Phone: "",
    Password: "",
    Verification: "",//获取验证码的值
    text: "获取验证码",
    currentTime: 60, //倒计时
    disabled: false, //按钮是否禁用
    showModal: false,
    EnterpriseNames: "",
    UserData: ""
  },
  //点击短信验证码发送事件
  bindButtonTap() {
    let this_ = this
    this_.setData({
      disabled: true
    })

    let currentTime = this_.data.currentTime
    let text = this_.data.text
    if (text === "获取验证码" || text === "重新发送") {
      wx.showToast({
        title: '短信验证码已发送',
        icon: 'none',
        duration: 2000
      });
      const interval = setInterval(function () {
        currentTime--; //每执行一次让倒计时秒数减一
        this_.setData({
          text: currentTime + "s",
        })
        if (currentTime <= 0) {
          clearInterval(interval)
          this_.setData({
            text: '重新发送',
            currentTime: 60,
            disabled: false,
          })
        }
      }, 1000)
    }
  },
  Verification(e) {
    this.setData({
      Verification: e.detail.value
    })
  },
  userName(e) {
    this.setData({
      Phone: e.detail.value
    })
  },
  password(e) {
    this.setData({
      Password: e.detail.value
    })
  },
  //登录点击事件
  onLogin() {
    let Phone = this.data.Phone
    let Password = this.data.Password
    let Verification = this.data.Verification
    let this_ = this
    console.log(Phone, Password)
    if (Phone !== "" && Password !== "") {
      wx.request({
        url: baseUrls,
        data: {
          Sign: "",
          LoginAccount: Phone,
          Password: utils.Encryption(Password),
          VerificationCode: Verification
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'post',
        success: res => {
          console.log(res.data.Data)
          if (res.data.Data == null) {
            wx.showToast({
              title: '您输入的账号密码有误',
              icon: 'none',
              duration: 2000
            });
          } else {
            let data = res.data.Data
            console.log(data.Users[0])
            let arr = []
            for (let i = 0; i < data.Users.length; i++) {
              if (data.Users[i].EnterpriseAttribute == 30) {//筛选企业属性=30的
                arr.push(data.Users[i].EnterpriseName)
              }
            }
            console.log(arr)
            if (arr.length == 0) {
              utils.showError("该账号不允许登录该系统")
            } else {
              this_.setData({
                EnterpriseNames: arr,
                showModal: true,
                UserData: res.data.Data
              })
            }
            
          }
        },
      })
    } else {
      wx.showToast({
        title: '请输入您的账号密码',
        icon: 'none',
        duration: 2000
      });
    }
  },
  //选择企业事件
  Enterprise(e) {
    let UserData = this.data.UserData
    let index = e.currentTarget.dataset.index
    app.User = UserData.Users[index]
    this.setData({
      showModal: false,
    })
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  //找回密码点击事件
  RetrievePassword() {
    wx.navigateTo({ //找回密码页面
      url: "/pages/RetrievePassword/RetrievePassword"
    })
  },
  //注册点击事件
  Register() {
    wx.navigateTo({ //注册密码页面
      url: "/pages/Register/Register"
    })
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
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