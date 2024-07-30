// components/coupons-show/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    // 优惠券内容
    coupon: {
      type: Object,
      value: {
        aaa: 1
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 规则 展开状态
    showAllRules: false, // 默认折叠
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleGetCoupon() {
      this.triggerEvent('getCoupon', {
        coupon: this.properties.coupon
      })
    },

    handleUseCoupon() {
      this.triggerEvent('useCoupon', {
        coupon: this.properties.coupon
      })
    },

    // 展开规则 or 折叠规则
    handleToggleRules() {
      this.setData({
        showAllRules: !this.data.showAllRules
      })
    },
  }
})