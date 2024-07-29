const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad (options) {

  },
  onShow () {
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo != '') {
      wx.navigateBack();
    };
  },
  // getUserInfo: function (e) {
  //     app.globalData.userInfo = e.detail.userInfo
  //     user.loginByWeixin().then(res => {
  //         app.globalData.userInfo = res.data.userInfo;
  //         app.globalData.token = res.data.token;
  //         let is_new = res.data.is_new;//服务器返回的数据；
  //         if (is_new == 0) {
  //             util.showErrorToast('您已经是老用户啦！');
  //             wx.navigateBack();
  //         }
  //         else if (is_new == 1) {
  //             wx.navigateBack();
  //         }

  //     }).catch((err) => { });
  // },

  getUserProfile: function () {
    // wx.navigateTo({
    //     url: '/pages/app-auth/index',
    // });
    wx.showLoading({
      title: '正在登录...',
    })
    let that = this;
    let code = '';
    wx.login({
      success: (res) => {
        code = res.code;
        wx.hideLoading()
      },
    });
    // 获取用户信息
    wx.getUserProfile({
      lang: 'zh_CN',
      desc: '用户登录',
      success: (res) => {
        let loginParams = {
          code: code,
          app: 3,
          encryptedData: res.encryptedData,
          iv: res.iv,
          rawData: res.rawData,
          signature: res.signature
        };
        that.postLogin(loginParams);
      },
      // 失败回调
      fail: () => {
        // 弹出错误
        App.showError('已拒绝小程序获取信息');
      }
    });
  },
  postLogin(info) {
    const ui = wx.getStorageSync('userInfo')
    console.log('[app-auth.js] postLogin -> wx.getStorageSync -> userInfo: ', ui)

    // [ 微信登录授权页面，唯一的登录页面 ]
    wx.showLoading({
      title: '获取登录信息...',
    })

    util.request(api.AuthLoginByWeixin, {
      code: info.code
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        wx.setStorageSync('userInfo', res.data.userInfo);
        wx.setStorageSync('token', res.data.token);
        app.globalData.userInfo = res.data.userInfo;
        app.globalData.token = res.data.token;
        let is_new = res.data.is_new; //服务器返回的数据；
        if (is_new == 0) {
          util.showErrorToast('您已经是老用户啦！');
          wx.navigateBack();
        } else if (is_new == 1) {
          // 新用户跳转到首页，领取新人券
          wx.switchTab({
            url: '/pages/index/index',
          });
        }
      }
    }).finally(() => {
      wx.hideLoading()
    });
  },
  goBack: function () {
    wx.navigateBack();
  }
})