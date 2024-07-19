Page({
  data: {
    DotStyle: true,
    defaultLevel: 1,
    cardCur: 0,
    swiperList: [
      {
        id: 1,
        type: 'image',
        name: '白银',
        // url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
        url: '/images/img/mumber-level-1.png',
      },
      {
        id: 2,
        type: 'image',
        name: '黄金',
        // url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
        url: '/images/img/mumber-level-2.png',
      },
      {
        id: 3,
        type: 'image',
        name: '铂金',
        // url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
        url: '/images/img/mumber-level-3.png',
      },
      {
        id: 4,
        type: 'image',
        name: '钻石',
        // url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
        url: '/images/img/mumber-level-4.png',
      },
      {
        id: 5,
        type: 'image',
        name: '黑金',
        // url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
        url: '/images/img/mumber-level-5.png',
      }
    ],
  },
  onLoad() {
    // TODO: 想把当前等级设置为默认轮播，但失败了
    // setTimeout(() => {
    //   this.setData({
    //     cardCur: this.data.defaultLevel
    //   })
    // }, 10);
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
})