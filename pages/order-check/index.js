var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');
const app = getApp()

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
      checkedGoodsList: [],
      checkedAddress: {},
      goodsTotalPrice: 0.00, //商品总价
      freightPrice: 0.00, //快递费
      orderTotalPrice: 0.00, //订单总价
      actualPrice: 0.00, //实际需要支付的总价
      addressId: 0, // 地址 id
      goodsCount: 0, // 商品数量
      postscript: '', // 备注
      outStock: 0,
      payMethodItems: [{
              name: 'offline',
              value: '线下支付'
          },
          {
              name: 'online',
              value: '在线支付',
              checked: 'true'
          },
      ],
      payMethod:1,
      // 是否展示 选择优惠券 底部弹窗
      showCouponBottomModal: false,
      // 底部弹窗抛出来的数据
      chooseCouponModalThrowData: {},
      // 可使用的优惠券列表
      canUseCouponsList: [],
    },

    
  /**
   * 点击跳转
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

    payChange(e){
        let val = e.detail.value;
        if(val == 'offline'){
            this.setData({
                payMethod:0
            })
        }
        else{
            this.setData({
                payMethod:1
            })
        }
    },
    toGoodsList: function (e) {
        if (this.data.addType == 1) {
          wx.showToast({
            title: '尚未下单，暂时不能查看',
            icon: 'none'
          })
          return false
        }
        wx.navigateTo({
            url: '/pages/ucenter/goods-list/index?id=0',
        });
    },
    toSelectAddress: function () {
        wx.navigateTo({
            url: '/pages/ucenter/address/index?type=1',
        });
    },
    toAddAddress: function () {
        wx.navigateTo({
            url: '/pages/ucenter/address-add/index',
        })
    },
    bindinputMemo(event) {
        let postscript = event.detail.value;
        this.setData({
            postscript: postscript
        });
    },
    onLoad: function (options) {
        let addType = options.addtype;
        let orderFrom = options.orderFrom;
        if (addType != undefined) {
            this.setData({
                addType: addType
            })
        }
        if (orderFrom != undefined) {
            this.setData({
                orderFrom: orderFrom
            })
        }
    },
    onUnload: function () {
        wx.removeStorageSync('addressId');
    },
    onShow: function () {
        // 页面显示
        // TODO结算时，显示默认地址，而不是从storage中获取的地址值
        try {
            var addressId = wx.getStorageSync('addressId');
            if (addressId == 0 || addressId == '') {
                addressId = 0;
            }
            this.setData({
                'addressId': addressId
            });
        } catch (e) {}
        this.getCheckoutInfo();
    },

    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        try {
            var addressId = wx.getStorageSync('addressId');
            if (addressId == 0 || addressId == '') {
                addressId = 0;
            }
            this.setData({
                'addressId': addressId
            });
        } catch (e) {
            // Do something when catch error
        }
        this.getCheckoutInfo();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    },

    getCheckoutInfo: function () {
        let that = this;
        let addressId = that.data.addressId;
        let orderFrom = that.data.orderFrom;
        let addType = that.data.addType;
        util.request(api.CartCheckout, {
            addressId: addressId,
            addType: addType,
            orderFrom: orderFrom,
            type: 0
        }).then(function (res) {
            if (res.errno === 0) {
                let addressId = 0;
                if (res.data.checkedAddress != 0) {
                    addressId = res.data.checkedAddress.id;
                }
                that.setData({
                    checkedGoodsList: res.data.checkedGoodsList,
                    checkedAddress: res.data.checkedAddress,
                    actualPrice: res.data.actualPrice,
                    addressId: addressId,
                    freightPrice: res.data.freightPrice,
                    goodsTotalPrice: res.data.goodsTotalPrice,
                    orderTotalPrice: res.data.orderTotalPrice,
                    goodsCount: res.data.goodsCount,
                    outStock: res.data.outStock
                });
                let goods = res.data.checkedGoodsList;
                wx.setStorageSync('addressId', addressId);
                if (res.data.outStock == 1) {
                    util.showErrorToast('有部分商品缺货或已下架');
                } else if (res.data.numberChange == 1) {
                    util.showErrorToast('部分商品库存有变动');
                }
            }
        });
    },

    // 获取可用优惠券
    getCouponsList() {
      util.request(api.UserCouponsList, {
        coupon_type: 1 // 默认回去 待使用 的
      }, 'GET').then((res) => {
        if (res.errno === 0) {
          const list = res.data
          // console.log('couponsList => list:\n', list)
          this.setData({
            canUseCouponsList: list,
          })
        }
      });
    },
    // 打开 选择优惠券 底部弹窗
    openChooseCouponModal() {
      this.getCouponsList()
      this.setData({
        // 打开弹窗
        showCouponBottomModal: true
      })
    },
    // 隐藏 选择优惠券 底部弹窗
    hideChooseCouponModal() {
      this.setData({
        // 关闭弹窗
        showCouponBottomModal: false,
        // 清空数据
        chooseCouponModalThrowData: {}
      })
    },
    // 底部弹窗的回调，存储优惠券及价格信息
    generateActualPrice({ detail }) {
      // console.log('generateActualPrice -> detail: ', detail)
      // 暂存数据
      this.setData({
        chooseCouponModalThrowData: detail
      })
    },
    // 最终确认使用优惠券
    handleSelectCoupon() {
      // console.log('handleSelectCoupon -> chooseCouponModalThrowData: ', this.data.chooseCouponModalThrowData)
      this.setData({
        // 关闭弹窗
        showCouponBottomModal: false,
        // 展示 实付 价格
        actualPrice: this.data.chooseCouponModalThrowData.discountedPrice
      })
    },

    // TODO 有个bug，用户没选择地址，支付无法继续进行，在切换过token的情况下
    submitOrder: function (e) {
        if (this.data.addressId <= 0) {
            util.showErrorToast('请选择收货地址');
            return false;
        }
        let addressId = this.data.addressId;
        let postscript = this.data.postscript;
        let freightPrice = this.data.freightPrice;
        let actualPrice = this.data.actualPrice;

        // 如果使用了优惠券，则上传优惠券id
        let couponId = ''
        if (this.data.chooseCouponModalThrowData && this.data.chooseCouponModalThrowData.coupon_id) {
          couponId = this.data.chooseCouponModalThrowData.coupon_id
        }

        wx.showLoading({
            title: '',
            mask:true
        })
        util.request(api.OrderSubmit, {
            addressId: addressId,
            postscript: postscript,
            freightPrice: freightPrice,
            actualPrice: actualPrice,
            couponId: couponId,
            offlinePay: 0
        }, 'POST').then(res => {
            if (res.errno === 0) {
                wx.removeStorageSync('orderId');
                wx.setStorageSync('addressId', 0);
                const orderId = res.data.orderInfo.id;
                pay.payOrder(parseInt(orderId)).then(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=1&orderId=' + orderId
                    });
                }).catch(res => {
                    wx.redirectTo({
                        url: '/pages/payResult/payResult?status=0&orderId=' + orderId
                    });
                });
            } else {
                util.showErrorToast(res.errmsg);
            }
        }).finally(() => {
          wx.hideLoading()
        });
    },

    offlineOrder: function (e) {
        if (this.data.addressId <= 0) {
            util.showErrorToast('请选择收货地址');
            return false;
        }
        let addressId = this.data.addressId;
        let postscript = this.data.postscript;
        let freightPrice = this.data.freightPrice;
        let actualPrice = this.data.actualPrice;
        util.request(api.OrderSubmit, {
            addressId: addressId,
            postscript: postscript,
            freightPrice: freightPrice,
            actualPrice: actualPrice,
            offlinePay: 1
        }, 'POST').then(res => {
            if (res.errno === 0) {
                wx.removeStorageSync('orderId');
                wx.setStorageSync('addressId', 0);
                wx.redirectTo({
                    url: '/pages/payOffline/index?status=1',
                })
            } else {
                util.showErrorToast(res.errmsg);
                wx.redirectTo({
                    url: '/pages/payOffline/index?status=0',
                })
            }
        });
    }
})