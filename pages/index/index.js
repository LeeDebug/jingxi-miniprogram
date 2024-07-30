
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
    // 是否展示 领取新人礼包
    showGFCModel: false,
  },

  onLoad (options) {
    util.loginNow()

    /**
     * 如果是被邀请注册的，则将数据存储到本地，等注册时带上推荐人的 user_id 数据
     */
    console.log('[index page] onLoad -> options:\n', options)
  },

  onShow () {
    this.getIndexData();

    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    if (userInfo != '') {
      that.setData({
        userInfo: userInfo,
      });
    };

    /**
     * 如果该用户没领过优惠券，提醒去开新人礼包
     */
    // console.log('userInfo.coupon_count: ', userInfo.coupon_count)
    if (!userInfo.coupon_count) {
      this.showGetFirstCouponModel()
    }

    // 如果优惠券为 0 则提示获得抽奖机会？？？

    let info = wx.getSystemInfoSync();
    let sysHeight = info.windowHeight - 100;
    this.setData({
      sysHeight: sysHeight,
      autoplay: true
    });
    wx.removeStorageSync('categoryId');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },

  onPageScroll (e) {
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

  onHide () {
    this.setData({
      autoplay: false
    })
  },

  onShareAppMessage () {
    let info = wx.getStorageSync('userInfo');
    return {
      title: '鲸禧控卡',
      desc: '开源微信小程序商城',
      path: '/pages/index/index?referrer_user_id=' + info.id
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
          //   index: 2,
          // })
        } else {
          cartGoodsCount = res.data.cartCount + '';
          // wx.setTabBarBadge({
          //   index: 2,
          //   text: cartGoodsCount
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

  /**
   * 提示领取新人礼包
   */
  showGetFirstCouponModel() {
    this.setData({
      showGFCModel: true
    })
  },
  hideGFCModal() {
    this.setData({
      showGFCModel: false
    })
  },
  /**
   * 前往领取新人礼包页面
   */
  gotoFirstCoupon() {
    if (!util.loginNow()) return false
    wx.navigateTo({
      url: '/pages/ucenter/coupons/first/index',
    })
  },


})