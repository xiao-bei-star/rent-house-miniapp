//app.js
App({
  onLaunch: function () {
    var that = this;

    this.login(function () {

    });

  },
  //登录
  login: function (callback) {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          url: that.globalData.domain + '/api/wechat/login',
          data: {
            code: res.code
          },
          success: function (res) {
            if (res.data.code == 1) {
              that.globalData.sessionKey = res.data.sessionKey;
              // 去注册
              that.register(callback);
              return;
            }
            if (res.data.code != 0) {
              // 登录错误 
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
            that.globalData.token = res.data.token;
            that.globalData.userInfo = res.data.userInfo;
            callback();
          }
        })
      }
    })
  },

  //注册
  register: function (userInfo,callback) {
    var that = this;
    wx.login({
      success: function (res) {
        var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
        wx.getUserInfo({
          success: function (resUser) {
            // 下面开始调用注册接口
            wx.request({
              url: that.globalData.domain + '/api/wechat/register',
              data: {
                code: code,
                avatarUrl: userInfo.avatarUrl,
                nickname: userInfo.nickName,
                gender: userInfo.gender
              }, // 设置请求的 参数
              success: (res) => {
                if (res.data.code == 0) {
                  wx.hideLoading();
                  that.login(callback);
                } else {
                  // 登录错误 
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: '无法登录，请重试',
                    showCancel: false
                  })
                }

              }
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },

  globalData: {
    userInfo: null,
    // domain: "http://localhost:10086",
    // picRootPath: "http://localhost:10086",
    // 调试手机端用IP地址
    domain: "http://192.168.1.219:10086",
    picRootPath: "http://192.168.1.219:10086"
  }
})