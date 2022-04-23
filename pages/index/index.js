// pages/house/house-list/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseList: [],
    isLoad: false,
    page: 1,
    pageSize: 10,
    categoryId: -1,
    inputVal: "",
    modes: ["类型", "整租", "合租"],
    modeIndex: 0,
    types: ["户型", "一室", "二室", "三室", "四室", "四室以上"],
    typeIndex: 0,
    areas: ["面积", "50m²以下", "50-100m²", "100-150m²", "150m²以上"],
    areaIndex: 0,
    prices: ["价格", "1500元以下", "1500元到2500元", "2500元到4000元", "4000元以上"],
    priceIndex: 0
  },

  bindModeChange(e){
    this.setData({
      modeIndex: e.detail.value
    })
    this.getHouseList();
  },

  bindAreaChange(e){
    this.setData({
      areaIndex: e.detail.value
    })
    this.getHouseList();
  },

  bindTypeChange(e){
    this.setData({
      typeIndex: e.detail.value
    })
    this.getHouseList();
  },

  bindPriceChange(e){
    this.setData({
      priceIndex: e.detail.value
    })
    this.getHouseList();
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
    this.getHouseList();
  },

  clearInput: function() {
    this.setData({
      inputVal: ""
    });
    this.getHouseList();
  },

  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.getHouseList();
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
    this.getHouseList();
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
    this.getHouseList();
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
      this.getHouseList();
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

  getHouseList: function() {
    var that = this;
    that.setData({
      isLoad: true
    });
    var mode = '';
    if(this.data.modeIndex != 0){
      mode = this.data.modeIndex
    }
    var type = '';
    if(this.data.typeIndex != 0){
      type = this.data.typeIndex
    }

    var minArea = '';
    var maxArea = '';
    if(this.data.areaIndex == 1){
      maxArea = 50;
    }else if(this.data.areaIndex == 2){
      minArea = 50;
      maxArea = 100;
    }else if(this.data.areaIndex == 3){
      minArea = 100;
      maxArea = 150;
    }else if(this.data.areaIndex == 4){
      minArea = 150;
    }

    var minPrice = '';
    var maxPrice = '';
    if(this.data.priceIndex == 1){
      maxPrice = 1500;
    }else if(this.data.priceIndex == 2){
      minPrice = 1500;
      maxPrice = 2500;
    }else if(this.data.priceIndex == 3){
      minPrice = 2500;
      maxPrice = 4000;
    }else if(this.data.priceIndex == 4){
      minPrice = 4000;
    }

    wx.request({
      url: app.globalData.domain + '/api/house/list',
      data: {
        mode: mode,
        type: type,
        minArea: minArea,
        maxArea: maxArea,
        minPrice: minPrice,
        maxPrice: maxPrice,
        page: that.data.page,
        limit: that.data.pageSize,
        houseName: that.data.inputVal
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
            houseList: []
          });
        }
        if (res.data.houseList.length == 0) {
          that.setData({
            isLoad: true
          });
          return;
        }
        var house = that.data.houseList;
        for (var i = 0; i < res.data.houseList.length; i++) {
          res.data.houseList[i].picUrl = app.globalData.picUrl + res.data.houseList[i].picUrl;
          house.push(res.data.houseList[i]);
        }
        that.setData({
          houseList: house,
          isLoad: false
        });
      }
    })
  }
  
})