var util = require('../../../utils/util.js');

Page({

  data: {
    invitation_code: 'HAPK213JJK',
  },

  onLoad() {
    util.loginNow()
  },

  onShow() {
  },

  /**
   * 点击页面 发送给好友 时触发
   * @param {*} res 
   */
  onShareAppMessage (res) {
    console.log('onShareAppMessage -> res:\n ', res)
    if (res.from === 'button') {
      // 来自页面内分享按钮
    }
    return {
      title: '快来加入我们吧！（标题可编辑，图片也可编辑）',
      path: 'pages/ucenter/mumber/index?invitation_code=' + this.data.invitation_code,
      imageUrl: 'https://gd-hbimg.huaban.com/33b47324f45cab8e7e7cba4e6d3a0cee3c96c8b75edf5-FRP1mK_fw1200'
    }
  },
  /**
   * 分享成功 回调
   * @param {*} res 
   */
  onShareAppMessageSuccess (res) {
    console.log('onShareAppMessageSuccess -> res:\n', res)
  },
  /**
   * 分享失败 回调
   * @param {*} res 
   */
  onShareAppMessageFail (res) {
    console.log('onShareAppMessageFail -> res:\n', res)
  },

  /**
   * 打开 邀请记录 页面
   */
  toInvitationsPage() {
    if (!util.loginNow()) return false
    wx.navigateTo({
      url: '/pages/ucenter/invitations/index',
    });
  },

  /**
   * 打开 会员权益 页面
   */
  toMumberInterestsPage() {
    if (!util.loginNow()) return false
    wx.navigateTo({
      url: '/pages/ucenter/mumber/interests/index',
    });
  },

  /**
   * 打开 升级礼包 页面
   */
  toUpgradeGiftsPage() {
    if (!util.loginNow()) return false
    wx.navigateTo({
      url: '/pages/ucenter/mumber/upgrade-gifts/index',
    });
  },

})