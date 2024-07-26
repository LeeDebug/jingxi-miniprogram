
const util = require('../../utils/util.js');
const api = require('../../config/api.js');

Page({

  data: {
    // 滚动公告
    Headlines: [
      {
        id: 0,
        title: "下单前要先看好下周菜单哦~ (点击即可查看)",
        url: '/pages/seasonal-menu/index'
      },
      {
        id: 1,
        title: "优惠券中心上线啦，快去抢几张~",
        url: '/pages/ucenter/coupons/my'
      }
    ],
    banner: [],
    userInfo: {},
    // 决定 loading 圈的高度
    sysHeight: 0,
    loading: 0,
    autoplay: true,
    showContact: 1,
  },

  onLoad: function (options) {
  },

  onShow: function () {
    this.getIndexData();

    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo != '') {
        that.setData({
            userInfo: userInfo,
        });
    };
    let info = wx.getSystemInfoSync();
    let sysHeight = info.windowHeight - 100;
    this.setData({
        sysHeight: sysHeight,
        autoplay: true
    });
    wx.removeStorageSync('categoryId');
  },

  onPageScroll: function (e) {
    let scrollTop = e.scrollTop;
    let that = this;
    if (scrollTop >= 2000) {
        that.setData({
            showContact: 0
        })
    } else {
        that.setData({
            showContact: 1
        })
    }
  },

  onHide: function () {
      this.setData({
          autoplay: false
      })
  },

  onShareAppMessage: function () {
      let info = wx.getStorageSync('userInfo');
      return {
          title: '鲸禧控卡',
          desc: '开源微信小程序商城',
          path: '/pages/index/index?id=' + info.id
      }
  },

  /**
   * 触发 下拉刷新动作
   */
  onPullDownRefresh () {
    // wx.showNavigationBarLoading()
    this.getIndexData();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },

  getIndexData () {
      let that = this;
      // 即 index/appInfo 接口
      util.request(api.IndexUrl).then(function (res) {
          if (res.errno === 0) {
              that.setData({
                  // floorGoods: res.data.categoryList,
                  banner: res.data.banner,
                  // channel: res.data.channel,
                  // notice: res.data.notice,
                  loading: 1,
              });
              let cartGoodsCount = '';
              if (res.data.cartCount == 0) {
                  // wx.removeTabBarBadge({
                  //     index: 2,
                  // })
              } else {
                  cartGoodsCount = res.data.cartCount + '';
                  // wx.setTabBarBadge({
                  //     index: 2,
                  //     text: cartGoodsCount
                  // })
              }
          }
      });
  },

  /**
   * 点击轮播公告，跳转相应页面
   * @param {*} e 
   */
  linesclick(e) {
    var swip = e.currentTarget.dataset
    // console.log(swip);
    wx.switchTab({
      url: swip.url,
      fail() {
        wx.navigateTo({
          url: swip.url
        });
      }
    })
  },

})