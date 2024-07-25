// components/coupon-choose/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    // 优惠券内容
    couponsList: {
      type: Array,
      value: []
    },
    // 订单原价
    originalPrice: {
      type: Number,
      value: 0.00,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 已选中的优惠券 id
    selecedCoupon: '',
    selecedCouponItem: {},
    // 折扣后的价格
    discountedPrice: 0.00,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击 radio 切换
    changeCoupon({ detail }) {
      // console.log('changeCoupon -> detail: ', detail)
      // const coupon_id = detail.value * 1
      // console.log('changeCoupon -> coupon_id: ', coupon_id)
      // this.setData({
      //   selecedCoupon: coupon_id
      // })
      // console.log('changeCoupon -> selecedCoupon: ', this.data.selecedCoupon)
      // 生成新价格
      // this.generateRealPrice()
    },

    // 点了 radio 之外的地方
    selectCoupon(e) {
      // console.log('selectCoupon -> e: ', e)
      const coupon_id = e.currentTarget.dataset.couponid
      // console.log('selectCoupon -> coupon_id: ', coupon_id)
      this.setData({
        selecedCoupon: coupon_id
      })
      // console.log('selectCoupon -> selecedCoupon: ', this.data.selecedCoupon)
      // 生成新价格
      this.generateRealPrice()
    },

    // 根据获取的原始价格，生成新价格
    generateRealPrice() {
      // console.log('generateRealPrice -> selecedCoupon: ', this.data.selecedCoupon)
      const couponItem = this.properties.couponsList.find(v => v.id == this.data.selecedCoupon)
      // console.log('generateRealPrice -> couponItem: ', couponItem)
      // 定义最终价格
      let discountedPrice = 0.00
      // 折扣价格
      // console.log('generateRealPrice -> originalPrice: ', this.properties.originalPrice)
      if (couponItem.discount_type == 'percentage') {
        // console.log('generateRealPrice -> percentage -> discount_value: ', couponItem.discount_value)
        discountedPrice = this.properties.originalPrice * couponItem.discount_value
      }
      // 减免价格
      if (couponItem.discount_type == 'fixed') {
        // console.log('generateRealPrice -> fixed -> discount_value: ', couponItem.discount_value)
        discountedPrice = this.properties.originalPrice - couponItem.discount_value
      }
      // console.log('generateRealPrice -> discountedPrice: ', discountedPrice)
      // 全部计算完，最终给 data 赋值
      this.setData({
        selecedCouponItem: couponItem,
        discountedPrice: discountedPrice,
      })
      // 抛出事件
      this.throwPriceEvent()
    },

    throwPriceEvent() {
      this.triggerEvent('GenerateActualPrice', {
        // 选择的优惠券 id
        coupon_id: this.data.selecedCoupon,
        // 选择的优惠券 obj
        selecedCouponItem: this.data.selecedCouponItem,
        // 原来的价格
        originalPrice: this.properties.originalPrice,
        // 总共优惠了多少钱
        reducedPrice: this.properties.originalPrice - this.data.discountedPrice,
        // 折扣后的价格
        discountedPrice: this.data.discountedPrice,
      })
    },

  }
})