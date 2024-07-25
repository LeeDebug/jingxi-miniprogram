// pages/seasonal-menu/index.js

var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCard: false,
    avatar: 'https://i.imgur.com/ZrXVNx2.png', // 老板头像
    seasonalMenuList: [],
    menuImages: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    setTimeout(() => {
      this.getSeasonalMenuList();
    }, 0);
  },

  // 获取菜单列表
  getSeasonalMenuList() {
    util.request(api.SeasonalMenuList).then((res) => {
      if (res.errno === 0) {
        const list = res.data
        list.map(v => v.release_time = util.formatTime(new Date(v.release_time)))
        // console.log('SeasonalMenuList => list:\n', list)
        this.setData({
          seasonalMenuList: list,
          menuImages: JSON.parse(JSON.stringify(list)).map(v => v.image_url)
        })
      }
    });
  },
  
  previewImage(e) {
    let current = e.currentTarget.dataset.src;
    let that = this;
    wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: that.data.menuImages // 需要预览的图片http链接列表
    })
  },

  // 前往某个商品页面
  gotoGoods() {
    wx.navigateTo({
      // ! 先写死一个商品值
      url: '/pages/goods/goods?id=1109008',
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