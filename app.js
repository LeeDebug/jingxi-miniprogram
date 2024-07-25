var util = require('utils/util.js');
var api = require('config/api.js');
App({
  data: {
    deviceInfo: {}
  },
  onLaunch: function () {
    const ui = wx.getStorageSync('userInfo')
    console.log('[app.js] onLaunch -> wx.getStorageSync -> userInfo: ', ui)
    if (!ui) {
      console.error("[app.js] 该设备为首次登录，取消自动登录机制！")
      return false
    }

    this.data.deviceInfo = wx.getSystemInfoSync();
    console.log(this.data.deviceInfo);
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: (res) => {
        util.request(api.AuthLoginByWeixin, {
          code: res.code
        }, 'POST').then(function (res) {
          if (res.errno === 0) {
            let userInfo = res.data.userInfo;
            wx.setStorageSync('token', res.data.token);
            wx.setStorageSync('userInfo', userInfo);
          }
        });
      },
    });
    let that = this;
    wx.getSystemInfo({ //  获取页面的有关信息
      success: function (res) {
        wx.setStorageSync('systemInfo', res)
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
      }
    });
  },
  globalData: {
    userInfo: {
      nickname: '点我登录',
      username: '点击登录',
      avatar: 'http://lucky-icon.meiweiyuxian.com/hio/default_avatar_big.png'
    },
    token: '',
  },
  // 前往 时令菜单 页面
  goSeasonalPage() {
    wx.switchTab({
      url: '/pages/seasonal-menu/index'
    })
  }
})