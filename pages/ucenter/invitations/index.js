// pages/ucenter/invitations/index.js

var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    root: api.ApiRoot,
    // 邀请记录 收益及邀请数据
    invitationInfo: {
      // 邀请总收益
      all_rebate_earnings: 0.00,
      // 今日邀请人数
      today_people_count: 0,
      // 总邀请人数
      total_people_count: 0,
    },
    // 邀请记录数据列表
    invitationsList: [],
    basicsList: [
      {
        status: '1',
        status_text: '接收',
        icon: 'usefull',
      }, {
        status: '2',
        status_text: '注册',
        icon: 'radiobox',
      }, {
        status: '3',
        status_text: '下单',
        icon: 'roundclose',
      }, {
        status: '4',
        status_text: '返利',
        icon: 'roundcheck',
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInvitationsList()
  },

  /**
   * 获取 邀请列表
   */
  getInvitationsList() {
    util.request(api.getInvitationsList).then(res => {
      const invitationsList = res.data
      // console.log('getInvitationsList -> invitationsList:\n', invitationsList)
      /**
       * 处理邀请数据
       */
      const invitationInfo = {
        all_rebate_earnings: 0.00,
        today_people_count: invitationsList.filter(v => util.isToday(v.invitee_register_time)).length,
        total_people_count: invitationsList.length,
      }
      invitationsList.forEach(r => {
        invitationInfo.all_rebate_earnings += r.referrer_user_rebate_ratio
      })
      invitationInfo.all_rebate_earnings = invitationInfo.all_rebate_earnings.toFixed(2)
      this.setData({
        invitationsList: invitationsList,
        invitationInfo: invitationInfo,
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },


  /**
   * 以下是邀请记录列表的滑动操作
   */
  // ListTouch触摸开始
  ListTouchStart(e) {
    // this.setData({
    //   ListTouchStart: e.touches[0].pageX
    // })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    // this.setData({
    //   ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    // })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    // if (this.data.ListTouchDirection == 'left') {
    //   this.setData({
    //     modalName: e.currentTarget.dataset.target
    //   })
    // } else {
    //   this.setData({
    //     modalName: null
    //   })
    // }
    // this.setData({
    //   ListTouchDirection: null
    // })
  },

})