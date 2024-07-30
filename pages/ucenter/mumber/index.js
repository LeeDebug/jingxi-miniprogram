var util = require('../../../utils/util.js');

Page({

  data: {
    invitation_code: 'HAPK213JJK',
    /**
     * 日历数据
     */
    daysList: [],
    spacesBeforeDays: 0,
    curMonthDeliverNumber: 0, // 当月配送餐数
    year: 0,
    month: 0,
    today: 0,
    week: "",

  },

  onLoad() {
    util.loginNow()

    /**
     * 获取日历相关数据
     */
    this.getNowTime();
    this.getSpace();
    this.createDay();
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




  /**
   * 获取今天的时间
   */
  getNowTime() {
    const time = new Date();
    this.setData({
      year: time.getFullYear(),
      month: time.getMonth() + 1,
      today: time.getDate(),
      current_day: time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate(),
      week: time.getDay()
    })
  },
  /**
   * 获取每个月前面的空白格
   */
  getSpace() {
    let time = new Date(this.data.year, this.data.month - 1, 1);
    time = new Date(time.setDate(0))
    const spacesBeforeDays = time.getDay();
    this.setData({
      spacesBeforeDays
    })
  },
  /**
   * [ 创建当月的日历数据 ]
   */
  createDay() {
    let daysList = [];
    let time = new Date(this.data.year, this.data.month, 0)
    let len = time.getDate()
    for (let i = 1; i <= len; i++) {
      time.setDate(i);
      daysList.push({
        "day": i,
        "is_distributed": i % 2
      });
    }
    const curMonthDeliverNumber = daysList.filter(d => d.is_distributed).length
    this.setData({
      daysList,
      curMonthDeliverNumber
    })
  },
  /**
   * 点击日期，更改点击日期的背景显示状态
   * @param {*} e 
   */
  click(e) {
    // let today = e.currentTarget.dataset.today;
    // this.setData({
    //   today
    // })
  },
  /**
   * 今月选择31，下月只有30，那么选择的today更改为30
   */
  check() {
    let {
      today,
      year,
      month
    } = this.data;
    const time = new Date(year, month, 0);
    let maxDay = time.getDate()
    if (today > maxDay) {
      this.setData({
        today: maxDay
      })
    }
  },
  /**
   * 上个月
   */
  next() {
    let month = this.data.month;
    if (month == 12) {
      this.setData({
        year: this.data.year + 1,
        month: 1
      })
    } else {
      this.setData({
        month: month + 1
      })
    }
    this.getSpace();
    this.createDay();
    this.check();
  },
  /**
   * 下个月
   */
  last() {
    let month = this.data.month;
    if (month == 1) {
      this.setData({
        year: this.data.year - 1,
        month: 12
      })
    } else {
      this.setData({
        month: month - 1
      })
    }
    this.getSpace();
    this.createDay();
    this.check();
  },

})