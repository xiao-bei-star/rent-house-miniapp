// pages/order/order-detail/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    totalAmount: '',
    picturl:app.globalData.picRootPath
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var orderId = options.id;
    this.setData({
      orderId: orderId
    })
    this.getOrder();
  },

  getOrder: function() {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/order/detail',
      data: {
        token: app.globalData.token,
        id: that.data.orderId
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data.code != 0) {
          wx.showModal({
            title: '错误',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
        var totalAmount = res.data.order.orderCarList[0].price;
        var startDate = Date.parse(res.data.order.startDate);
        var endDate = new Date().getTime();
        var days = parseInt((endDate - startDate) / (1 * 24 * 60 * 60 * 1000));
        if (days == 0) {
          days = 1;
        }
        that.setData({
          order: res.data.order,
          totalAmount: totalAmount * days
        });
      }
    })
  },

  pay() {
    var id = this.data.order.id;
    var amount = this.data.totalAmount;
    wx.navigateTo({
      url: '/pages/order/order-pay/index?id='+id + "&amount="+amount,
    })
    return;

    var that = this;
    var id = this.data.order.id;
    wx.request({
      url: app.globalData.domain + '/api/order/pay',
      header: {
        token: app.globalData.token
      },
      data: {
        id: id,
        amount: that.data.totalAmount
      },
      success: (res) => {
        wx.navigateBack();
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