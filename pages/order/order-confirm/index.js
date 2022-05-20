// pages/confirm-order/index.js
const app = getApp();
var WxPay = require('../../../utils/pay.js')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalAmount: 0,
    price: 0,
    picturl:app.globalData.picRootPath
  },

  changeDate(e) {
    this.setData({
      date: e.detail.value
    })
  },

  changeDays(e){
    var price = this.data.price
    this.setData({
      totalAmount: price * e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var houseList = JSON.parse(options.houseList);
    console.log(houseList)
    var totalAmount = 0;
    for (var i = 0; i < houseList.length; i++) {
      totalAmount += houseList[i].price;
    }

    this.setData({
      houseList: houseList,
      totalAmount: totalAmount,
      price: totalAmount,
      date: util.formatDate(new Date()),
    })
  },

  confirmOrder: function(e) {
    console.log(e);
    var remark = e.detail.value.remark;
    var that = this;
    var loginToken = app.globalData.token // 用户登录 token
    var orderStatus = 1;

    var orderHouseList = [];
    var houseList = this.data.houseList;
    for (var i = 0; i < houseList.length; i++) {
      var orderhouse = {
        houseId: houseList[i].id,
        houseName: houseList[i].houseName,
        picUrl: houseList[i].picUrl,
        price: houseList[i].price,
        num: 1
      };
      orderHouseList.push(orderhouse)
    }
    
    var order = {
      orderHouseList: orderHouseList,
      totalAmount: that.data.totalAmount,
      startDate: that.data.date,
      endDate: util.formatAddMonth(new Date(that.data.date), e.detail.value.days),
      remark: remark
    };
    wx.showLoading({})

    wx.request({
      url: app.globalData.domain + '/api/order/create',
      method: 'POST',
      header: {
        token: loginToken
      },
      data: order,
      success: (res) => {
        if (res.data.code != 0) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success: function(e) {

            }
          })
          return;
        }
        //模拟支付
        wx.navigateTo({
          url: '/pages/order/order-pay/index?id=' + res.data.id,
        })

        return;
        if (this.data.distributionIndex == 1) {
          WxPay.wxpay(app, res.data.totalAmount, res.data.orderNum, '房屋购买', function(code) {
            // 下单成功，跳转到订单管理界面
            if (code == 0) {
              wx.navigateTo({
                url: "/pages/shop/order/order-list/index"
              });
            }
          });
        } else {
          wx.navigateTo({
            url: "/pages/shop/order/order-list/index"
          });
        }

      },
      complete: function(res) {
        wx.hideLoading();
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