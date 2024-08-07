// pages/ucenter/coupons/my.js

const app = getApp()
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // Tab区分：所有优惠券、待使用、已使用、已过期
    couponsTypeList: [
      { name: '所有' },
      { name: '待使用' },
      { name: '已使用' },
      { name: '已过期' }
    ],
    // 默认: 待使用
    curTabIdx: 1,
    couponsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    setTimeout(() => {
      this.getCouponsList({ coupon_type: this.data.curTabIdx });
    }, 0);
  },

  // 获取优惠券列表
  getCouponsList(query) {
    wx.showLoading({
      title: '加载中...'
    })
    util.request(api.UserCouponsList, {
      coupon_type: query.coupon_type
    }, 'GET').then((res) => {
      if (res.errno === 0) {
        const list = res.data
        // console.log('couponsList => list:\n', list)
        this.setData({
          couponsList: list,
          // menuImages: JSON.parse(JSON.stringify(list)).map(v => v.image_url)
        })
      }
      wx.hideLoading()
    });
  },

  // 点击领取优惠券
  useCoupon({ detail: { coupon } }) {
    // console.log('useCoupon -> coupon:\n', coupon)
    // 前往 点餐 页面
    wx.switchTab({
      url: '/pages/category/index',
    })
  },

  // 切换卡片
  tabSelect(e) {
    this.setData({
      curTabIdx: e.currentTarget.dataset.id
    })
    this.getCouponsList({ coupon_type: this.data.curTabIdx });
  },

  // 前往 点餐 页面
  gotoDianCanPage: app.gotoDianCanPage,

  // 前往 领券中心 页面
  gotoGetCouponsCenter() {
    wx.navigateTo({
      url: '/pages/ucenter/coupons/center',
    })
  }

})