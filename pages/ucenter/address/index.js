var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
const app = getApp()
// 触底上拉刷新 TODO 这里要将page传给服务器，作者没写
Page({
    data: {
        addresses: [],
        nowAddress: 0
    },
    goAddressDetail: function(e) {
        let id = e.currentTarget.dataset.addressid;
        wx.navigateTo({
            url: '/pages/ucenter/address-detail/index?id=' + id,
        })
    },
    getAddresses() {
        let that = this;
        util.request(api.GetAddresses).then(function(res) {
            if (res.errno === 0) {
                that.setData({
                    addresses: res.data
                })
            }
        });
    },
    selectAddress:function(e) {
        let addressId = e.currentTarget.dataset.addressid
        wx.setStorageSync('addressId', addressId);
        wx.navigateBack();
    },
    onLoad: function(options) {
        let type = options.type;
        this.setData({
            type: type
        })
    },
    onUnload: function() {},
    onShow: function() {
        this.getAddresses();
        let addressId = wx.getStorageSync('addressId');
        if (addressId) {
            this.setData({
                nowAddress: wx.getStorageSync('addressId')
            });
        }
        else {
            this.setData({
                nowAddress: 0
            });
        }
    },

    // 同步微信地址
    syncWxAddress: async function() {
      const that = this
      // 前往微信地址选择界面
      // console.log('func syncWxAddress\n')
      await wx.chooseAddress({
        async success (address) {
          // console.log('wx.chooseAddress => success => address:\n')
          // console.log(1, address.userName)
          // console.log(2, address.postalCode)
          // console.log(3, address.provinceName)
          // console.log(4, address.cityName)
          // console.log(5, address.countyName)
          // console.log(6, address.detailInfo)
          // console.log(7, address.nationalCode)
          // console.log(8, address.telNumber)

          // 检查数据正确性（理论上不会触发）
          if (address.userName == '' || address.userName == undefined) {
            util.showErrorToast('姓名获取失败');
            return false;
          }
          if (address.telNumber == '' || address.telNumber == undefined) {
            util.showErrorToast('手机号码获取失败');
            return false;
          }
          if (address.provinceName == '' || address.provinceName == undefined
            || address.cityName == '' || address.cityName == undefined
            || address.countyName == '' || address.countyName == undefined
          ) {
            util.showErrorToast('省市区获取失败');
            return false;
          }
          if (address.detailInfo == '' || address.detailInfo == undefined) {
            util.showErrorToast('详细地址获取失败');
            return false;
          }

          // 匹配 省 的 id
          // console.log('func api.RegionList => province\n')
          let provinceChoose = undefined
          const provinceRes = await util.request(api.RegionList, {
            parentId: 1 // 中国
          })
          // console.log('func api.RegionList => then => provinceRes:\n', provinceRes)
          if (provinceRes.errno === 0) {
            provinceChoose = provinceRes.data.find(v => v.name === address.provinceName) || provinceRes.data[0]
            // console.log('func api.RegionList => then => provinceChoose:\n', provinceChoose)
          }
          if (provinceChoose.id === undefined || !provinceChoose.id) {
            util.showErrorToast('省ID获取失败');
            return false
          }

          // 匹配 省 的 id
          // console.log('func api.RegionList => city\n')
          let cityChoose = undefined
          const cityRes = await util.request(api.RegionList, {
            parentId: provinceChoose.id // 获取的省
          })
          // console.log('func api.RegionList => then => cityRes:\n', cityRes)
          if (cityRes.errno === 0) {
            cityChoose = cityRes.data.find(v => v.name === address.cityName) || cityRes.data[0]
            // console.log('func api.RegionList => then => cityChoose:\n', cityChoose)
          }
          if (cityChoose.id === undefined || !cityChoose.id) {
            util.showErrorToast('市ID获取失败');
            return false
          }

          // 匹配 区 的 id
          // console.log('func api.RegionList => district\n')
          let districtChoose = undefined
          const districtRes = await util.request(api.RegionList, {
            parentId: cityChoose.id // 获取的市
          })
          // console.log('func api.RegionList => then => districtRes:\n', districtRes)
          if (districtRes.errno === 0) {
            districtChoose = districtRes.data.find(v => v.name === address.cityName) || districtRes.data[districtRes.data.length - 1]
            // console.log('func api.RegionList => then => districtChoose:\n', districtChoose)
          }
          if (districtChoose.id === undefined || !districtChoose.id) {
            util.showErrorToast('区ID获取失败');
            return false
          }

          // 调用保存地址接口
          // console.log('func api.SaveAddress\n')
          // console.log('obj => provinceChoose: ', provinceChoose.id)
          // console.log('obj => cityChoose: ', cityChoose.id)
          // console.log('obj => districtChoose: ', districtChoose.id)
          await util.request(api.SaveAddress, {
            // address: "231123"
            // city_id: 37
            // district_id: 403
            // mobile: "13522468845"
            // name: "aaa"
            // province_id: 2

            // id: address.id, // 暂时先不写，看会不会报错
            name: address.userName,
            mobile: address.telNumber,
            province_id: provinceChoose.id, // address.provinceName,
            city_id: cityChoose.id, // address.cityName,
            district_id: districtChoose.id, // address.countyName,
            address: address.detailInfo,
            is_default: false, // 不设为默认地址
          }, 'POST').then(function(res) {
            // 成功后的逻辑
            if (res.errno === 0) {
              // wx.navigateBack()
              that.getAddresses();
            } else {
              // console.log('api.SaveAddress => then => res:\n', res)
            }
          });
        },
        fail (err) {
          console.log('wx.chooseAddress => error\n')
          console.error(err)
        }
      })
    },
    // 新增收货地址
    addAddress: function() {
        wx.navigateTo({
            url: '/pages/ucenter/address-detail/index?id=' + 0,
        })
    },
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading()
        this.getAddresses();
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
    }
})