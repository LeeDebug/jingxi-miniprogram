var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    name: '',
    nickName: '',
    mobile: '',
    avatarUrl: '/static/images/default_avatar.png',
    hasAvatar: 0,
    root: api.ApiRoot
  },

  onLoad: function (options) {
    this.getSettingsDetail();
  },

  // 获取个人信息
  getSettingsDetail() {
    let that = this;
    util.request(api.SettingsDetail).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          name: res.data.name,
          mobile: res.data.mobile,
          nickName: res.data.nickname,
          hasAvatar: 0
        });
        if (res.data.avatar != '') {
          that.setData({
            avatarUrl: res.data.avatar,
            hasAvatar: 1
          })
        }
      }
    });
  },

  // 选择头像
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      avatarUrl,
    })
    let that = this;
    wx.uploadFile({
      url: api.UploadAvatar,
      filePath: avatarUrl,
      name: 'upload_file',
      formData: {
        // 'userId': 'test'
      },
      success(res) {
        if (res.statusCode == 200) {
          let re = res.data
          let echo = JSON.parse(re);
          let data = echo.data;
          let avatarUrl = data.fileUrl
          that.setData({
            avatarUrl: avatarUrl,
            hasAvatar: 1
          })
        }
      }
    })
  },

  // 修改昵称
  bindinputNickName(event) {
    let nickName = event.detail.value;
    this.setData({
      nickName: nickName,
    });
  },

  // 修改姓名
  bindinputName(event) {
    let name = event.detail.value;
    this.setData({
      name: name,
    });
  },

  // 获取手机号码
  getPhoneNumber (e) {
    wx.showToast({
      title: '正在开发中...',
      icon: 'error'
    })
    // console.log(e.detail.code)  // 动态令牌
    // console.log(e.detail.errMsg) // 回调信息（成功失败都会返回）
    // console.log(e.detail.errno)  // 错误码（失败时返回）
  },
  // 修改手机号
  mobilechange(e) {
    let mobile = e.detail.value;
    this.setData({
      mobile: mobile,
    });
  },

  // 保存个人信息
  saveInfo() {
    let name = this.data.name;
    let mobile = this.data.mobile;
    mobile = mobile.replace(/(^\s*)|(\s*$)/g, "");
    if (mobile != '') {
      var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(16[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
      if (mobile.length < 11) {
        return util.showErrorToast('手机号码长度不对');
      } else if (!myreg.test(mobile)) {
        return util.showErrorToast('手机号码有问题');
      }
    }
    let avatar = this.data.avatarUrl;
    let nickName = this.data.nickName;
    nickName = nickName.replace(/(^\s*)|(\s*$)/g, "");
    if (nickName == '') {
      util.showErrorToast('请输入昵称');
      return false;
    }
    util.request(api.SaveSettings, {
      name: name,
      mobile: mobile,
      nickName: nickName,
      avatar: avatar,
    }, 'POST').then(function (res) {
      if (res.errno === 0) {
        util.showErrorToast('保存成功');
        wx.navigateBack()
      }
    });
  },

})