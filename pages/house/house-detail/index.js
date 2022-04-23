// pages/house/house-detail/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autoplay: true,
    interval: 3000,
    duration: 1000,
    house: {},
    houseNum: 0,
    shopHouset: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getHouse(options.houseId);
  },

  //租赁
  toRent(){
    
  },

  getHouse: function (houseId) {
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/house/detail',
      data: {
        id: houseId
      },
      success: function (res) {
        var house = res.data.house;
        house.describe = house.describe.replace(/\<img/gi, '<img style="max-width: 100%; height: auto"')
        that.setData({
          house: house,
        });
      }
    })

  },

  tapBuy: function(e){
    if (!app.globalData.token) {
      wx.navigateTo({
        url: '/pages/login/index',
      })
      return;
    }
    
    if(!app.globalData.userInfo.deposit){
      wx.showModal({
        title: "提示",
        content: '您还未交押金',
        success: function(res){
          if(res.confirm){
            wx.navigateTo({
              url: '/pages/my/deposit/index',
            })
          }
        }
      })
      return;
    }
    var houseList = [{
      id: this.data.house.id,
      houseName: this.data.house.houseName,
      picUrl: this.data.house.picUrl,
      num: 1,
      price: this.data.house.price,
      storeId: this.data.house.storeId
    }];
    wx.navigateTo({
      url: '/pages/order/order-confirm/index?houseList=' + JSON.stringify(houseList),
    })
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