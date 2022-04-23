// pages/deposit-no/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    subTitle: "",
    buttonTxt: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  doIt: function(e) {
    var that = this;
    if (!this.data.hasDeposit) {
      wx.navigateTo({
        url: '/pages/my/deposit/index',
      })
      return;
    }
    if (this.data.hasDeposit) { //退还押金
      wx.showModal({
        title: '提示',
        content: '确定要退还押金？',
        showCancel: true,
        success: function(res){
          if (res.confirm){
            that.refund();
          }
          return;
        }
      })      
    }
  },

  refund: function(){
    wx.request({
      url: app.globalData.domain + '/api/member/delDeposit',
      data: {
        token: app.globalData.token
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提示',
            content: '成功',
            success: function (res) {
              wx.navigateBack({

              })
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              
            }
          })
        }
      }
    })
  },

  getMemberInfo: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/member/info',
      data: {
        token: app.globalData.token
      },
      success: function(res) {
        if (res.data.code == 0) {
          var deposit = res.data.member.deposit;
          if (deposit) {
            that.setData({
              hasDeposit: true,
              title: "您已缴纳押金" + deposit + "元",
              subTitle: "可租赁房屋",
              buttonTxt: "退还押金"
            })
          } else {
            that.setData({
              hasDeposit: false,
              title: "您还未缴纳押金",
              subTitle: "缴纳押金后可租赁房屋",
              buttonTxt: "去交押金"
            })
          }
        }
      }
    })
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
    this.getMemberInfo();
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