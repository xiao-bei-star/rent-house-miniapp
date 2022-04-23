// pages/car/car-list/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList: [],
    isLoad: false,
    page: 1,
    pageSize: 10,
    categoryId: -1,
    inputVal: ""
  },

  showInput: function() {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function() {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.getCarList();
  },

  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    this.getCarList();
  },

  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.getCarList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.categoryId) {
      this.setData({
        categoryId: options.categoryId
      });
    }
    this.getCarList();
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
    wx.showNavigationBarLoading()
    this.setData({
      page: 1
    });
    this.getCarList();
    setTimeout(function() {
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1000);
  },

  loadMore: function () {
    console.log("load more")
    var that = this;
    var isLoad = this.data.isLoad;
    console.log(isLoad)
    if (!isLoad) {
      this.setData({
        page: that.data.page + 1
      });
      this.getCarList();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getCarList: function() {
    var that = this;
    that.setData({
      isLoad: true
    });
    wx.request({
      url: app.globalData.domain + '/api/car/list',
      data: {
        categoryId: that.data.categoryId,
        page: that.data.page,
        limit: that.data.pageSize,
        carName: that.data.inputVal
      },
      success: function(res) {
        if (res.data.code != 0) {
          that.setData({
            isLoad: false
          });
          return;
        }
        if (that.data.page == 1) {
          that.setData({
            carList: []
          });
        }
        if (res.data.carList.length == 0) {
          that.setData({
            isLoad: true
          });
          return;
        }
        var car = that.data.carList;
        for (var i = 0; i < res.data.carList.length; i++) {
          car.push(res.data.carList[i]);
        }
        that.setData({
          carList: car,
          isLoad: false
        });
      }
    })
  }
  
})