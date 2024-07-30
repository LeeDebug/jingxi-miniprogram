// pages/ucenter/coupons/first/index.js

const util = require('../../../../utils/util.js');
const api = require('../../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // 正面 和 背面 的样式
    styleFrontend: '',
    styleBackend: '',
    // 领取优惠券的模态框
    showGotModel: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo,
    })
  },

  /**
   * 翻开 背面 奖品
   */
  showBackend() {
    if (this.data.userInfo && this.data.userInfo.coupon_count == 0) {
      // 点击领取优惠券
      util.request(api.GetCoupon, {
        coupon_code: 'HAPPY0906'
      }, 'POST').then((res) => {
        console.log('showBackend -> GetCoupon -> res:\n', res)
        if (res.errno == 0) {
          this.setData({
            showGotModel: true,
          })
        } else {
          wx.showToast({
            title: '您开过一次了哟~',
            icon: 'error'
          })
        }
      })
    } else {
      /**
       * 否则直接提示
       */
      wx.showToast({
        title: '您开过一次了哟~',
        icon: 'error'
      })
    }
    this.setData({
      styleFrontend: 'transform:rotateY(180deg)',
      styleBackend: 'transform:rotateY(0deg)'
    })
  },
  /**
   * 返回 正面 封面
   */
  showFrontend() {
    this.setData({
      styleFrontend: 'transform:rotateY(0deg)',
      styleBackend: 'transform:rotateY(-180deg)'
    })
  },
  /**
   * 隐藏模态框
   */
  hideModal() {
    this.setData({
      showGotModel: false,
    })
  },
  gotoViewCoupons() {
    wx.navigateTo({
      url: '/pages/ucenter/coupons/my',
    })
  },

})