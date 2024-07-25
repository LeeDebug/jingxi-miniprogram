var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');

// TODO 订单显示数量在图标上

const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    status: {},
    root: api.ApiRoot,
    is_new: 0,
    root: api.ApiRoot
  },
  goProfile: function (e) {
    let res = util.loginNow();
    if (res == true) {
      wx.navigateTo({
        url: '/pages/ucenter/settings/index',
      });
    }
  },

  // 前往 我的钱包
  togoBalancePage() {
    let res = util.loginNow();
    if (res == true) {
      wx.navigateTo({
        url: '/pages/ucenter/balance/index',
      });
    }
  },

  // 前往 积分中心
  togoPointsPage() {
    let res = util.loginNow();
    if (res == true) {
      wx.navigateTo({
        url: '/pages/ucenter/points/index',
      });
    }
  },

  // 前往 我的优惠券
  togoCouponsPage() {
    let res = util.loginNow();
    if (res == true) {
      wx.navigateTo({
        url: '/pages/ucenter/coupons/my',
      });
    }
  },
  // 前往会员中心
  toMumberCenterPage: function (e) {
    let res = util.loginNow();
    if (res == true) {
      wx.navigateTo({
        url: '/pages/ucenter/mumber/index',
      });
    }
  },
  toOrderListTap: function (event) {
    let res = util.loginNow();
    if (res == true) {
      let showType = event.currentTarget.dataset.index;
      wx.setStorageSync('showType', showType);
      wx.switchTab({
        url: '/pages/ucenter/order-list/index?showType=' + showType,
      });
    }
  },
  toCartCart: function (e) {
    let res = util.loginNow();
    if (res == true) {
      wx.navigateTo({
        url: '/pages/cart/cart',
      });
    }
  },
  toAddressList: function (e) {
    let res = util.loginNow();
    if (res == true) {
      wx.navigateTo({
        url: '/pages/ucenter/address/index?type=0',
      });
    }
  },
  toFootprint: function (e) {
    let res = util.loginNow();
    if (res == true) {
      wx.navigateTo({
        url: '/pages/ucenter/footprint/index',
      });
    }
  },
  goAuth: function (e) {
    wx.navigateTo({
      url: '/pages/app-auth/index',
    });
  },
  // goAuth() {
  //   let code = '';
  //   let that = this;
  //   wx.login({
  //     success: (res) => {
  //       code = res.code;
  //       that.postLogin(code)
  //     },
  //   });
  // },
  postLogin(code) {
    const ui = wx.getStorageSync('userInfo')
    console.log('[ucenter.js] postLogin -> wx.getStorageSync -> userInfo: ', ui)
    if (!ui) {
      console.error("[ucenter.js] 该设备为首次登录，直接跳转到微信授权登录界面！")
      wx.navigateTo({
        url: '/pages/app-auth/index',
      });
      return false
    }

    let that = this;
    util.request(api.AuthLoginByWeixin, {
      code: code
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        let userInfo = res.data.userInfo;
        that.setData({
          is_new: res.data.is_new,
          userInfo: userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('token', res.data.token);
        wx.setStorageSync('userInfo', userInfo);
        app.globalData.token = res.data.token;
      }
    });
  },
  onLoad: function (options) {
    // 取消自动登录？？？
    // this.goAuth();
  },
  onShow: function () {
    this.getOrderInfo();
    this.getSettingsDetail();
    wx.removeStorageSync('categoryId');
  },
  getSettingsDetail() {
    let that = this;
    util.request(api.SettingsDetail).then(function (res) {
      if (res.errno === 0) {
        let userInfo = res.data;
        // wx.setStorageSync('userInfo', userInfo);
        that.setData({
          userInfo: userInfo,
          hasUserInfo: true
        });
      }
    });
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    this.getOrderInfo();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  getOrderInfo: function (e) {
    let that = this;
    util.request(api.OrderCountInfo).then(function (res) {
      if (res.errno === 0) {
        let status = res.data;
        that.setData({
          status: status
        });
      }
    });
  },
})