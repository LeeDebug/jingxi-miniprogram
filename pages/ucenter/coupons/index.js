// pages/ucenter/coupons/index.js

var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    setTimeout(() => {
      this.getCouponsList();
    }, 0);
  },

  // 获取菜单列表
  getCouponsList() {
    util.request(api.GetAllCoupons).then((res) => {
      if (res.errno === 0) {
        const list = res.data
        // console.log('couponsList => list:\n', list)
        this.setData({
          couponsList: list,
          // menuImages: JSON.parse(JSON.stringify(list)).map(v => v.image_url)
        })
      }
    });
  },

  // 点击领取优惠券
  getCoupon({ detail: { coupon } }) {
    console.log('getCoupon -> coupon:\n', coupon)
    util.request(api.GetCoupon, {
      a: 111,
      coupon_id: coupon.id
    }, 'POST').then((res) => {
        console.log('GetCoupon => res:\n', res)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})