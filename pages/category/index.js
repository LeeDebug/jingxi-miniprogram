// pages/category/index.js

const app = getApp()
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 时令菜单列表
    seasonalMenuList: [],
    navList: [],
    // 菜单品类列表
    list: [],
    categoryList: [],
    currentCategory: {},
    // 商品列表
    goodsListObj: {},
    // 每个商品当前选购的数量
    goodsOnCartNumber: {},
    // 购物车总数量
    cartTotal: 0,
    // 右侧商品列表的高度（影响 sticky 固定）
    scrollViewHeight: 'height: 1040rpx;',
    goodsCount: 0,
    nowIndex: 0,
    nowId: 0,
    allPage: 1,
    allCount: 0,
    size: 8,
    hasInfo: 0,
    showNoMore: 0,
    loading:0,
    index_banner_img:0,

    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    load: true,
    swiperList: [{
      url: "https://image.meiye.art/FlqKg5bugFQD5Qzm_QhGM7ET4Mtx?imageMogr2/thumbnail/450x/interlace/1"
    }, {
      url: "https://image.meiye.art/FhHGe9NyO0uddb6D4203jevC_gzc?imageMogr2/thumbnail/450x/interlace/1"
    }, {
      url: "https://image.meiye.art/Fha6tqRTIwHtlLW3xuZBJj8ZXSX3?imageMogr2/thumbnail/450x/interlace/1"
    }],
  },

  /**
   * 生命周期函数 -- 监听页面加载
   */
  onLoad(options) {
    util.loginNow()

    // 获取时令菜单列表
    this.getSeasonalMenuList()

    // 获取商品分类列表
    this.getCatalog()

    // 获取商品列表
    this.getCurrentList(0)
  },

  /**
   * 生命周期函数 -- 监听页面展示
   */
  onShow() {
    this.getCartList()
  },

  onPullDownRefresh: function() {
    // wx.showNavigationBarLoading()
    // this.getCatalog() // 获取菜单列表
    // wx.hideNavigationBarLoading() //完成停止加载
    // wx.stopPullDownRefresh() //停止下拉刷新
  },

  // 获取时令菜单列表
  getSeasonalMenuList() {
    util.request(api.SeasonalMenuList).then(res => {
      if (res.errno === 0) {
        const seasonalMenuList = res.data
        // seasonalMenuList.map(v => v.release_time = util.formatTime(new Date(v.release_time)))
        // console.log('SeasonalMenuList => seasonalMenuList:\n', seasonalMenuList)
        this.setData({
          seasonalMenuList: seasonalMenuList,
          // menuImages: JSON.parse(JSON.stringify(seasonalMenuList)).map(v => v.image_url)
        })
      }
    });
  },

  /**
   * 获取 商品分类 列表（即 左侧 tab 标签）
   */
  getCatalog() {
    util.request(api.CatalogList).then(res => {
      // const categoryList = [{ id: 0, name: '全部' }].concat(res.data.categoryList)
      const categoryList = res.data.categoryList
      // console.log('getCatalog -> CatalogList -> res:\n', res)
      this.setData({
        // navList: categoryList,
        list: categoryList,
        listCur: categoryList[0],
        TabCur: categoryList[0].id,
      });
      // console.log('getCatalog -> CatalogList -> navList:\n', this.data.navList)
    });

    /**
     * ! 暂时不知道做什么用？？？
     */
    // util.request(api.GoodsCount).then(res => {
    //   // console.log('getCatalog -> GoodsCount -> res:\n', res)
    //   this.setData({
    //     goodsCount: res.data.goodsCount
    //   });
    // });
  },

  /**
   * 获取购物车总数量及购物车商品列表
   */
  getCartList() {
    util.request(api.CartList).then(res => {
      if (res.errno === 0) {
        // console.log('getCartList -> red.data:\n', res.data)
        const goodsOnCartNumber = {}
        res.data.cartList.forEach(c => {
          goodsOnCartNumber[c.goods_id] = c.number
        })
        // console.log('getCartList -> goodsOnCartNumber:\n', goodsOnCartNumber)
        this.setData({
          goodsOnCartNumber: goodsOnCartNumber,
          cartTotal: res.data.cartTotal.checkedGoodsCount
        })
      }
    })
  },

  /**
   * ????????????????????
   * @param {*} id 
   */
  getCurrentCategory(id) {
    util.request(api.CatalogCurrent, {
      id: id
    }).then(res => {
      console.warn('getCurrentCategory -> CatalogCurrent -> res:\n', res)
      this.setData({
        currentCategory: res.data
      });
    });
  },

  /**
   * 根据当前 tab 标签的 id 筛选商品
   * @param {tab id} id 当前 tab 标签的 id
   */
  getCurrentList(id) {
    util.request(api.GetCurrentList, {
      // size: this.data.size,
      // page: this.data.allPage,
      id: id
    }, 'POST').then(res => {
      // console.log('getCurrentList -> res:\n', res)
      if (res.errno === 0) {
        let count = res.data.count;

        // 将列表数据处理为 category-list 对象
        const goodsList = res.data.data.map(v => {
          const fullString = v.min_retail_price.toFixed(2).split('.'); // 保留最多10位小数
          v.price_before_point = fullString[0]
          v.price_after_point = fullString[1]
          return v
        })
        let goodsListObj = {}
        this.data.list.forEach(c => {
          goodsListObj[c.id] = goodsList.filter(g => g.category_id == c.id)
        })

        this.setData({
          // allCount: count,
          // allPage: res.data.currentPage,
          goodsListObj: goodsListObj, // this.data.list.concat(res.data.data),
          // showNoMore: 1,
          // loading: 0,
        });
        if (count == 0) {
          console.error('getCurrentList -> count == 0')
          // this.setData({
          //   hasInfo: 0,
          //   showNoMore: 0
          // });
        }
      }
    });
  },

  getChannelShowInfo (e) {
    util.request(api.ShowSettings).then(res => {
      if (res.errno === 0) {
        let index_banner_img = res.data.index_banner_img;
        this.setData({
          index_banner_img: index_banner_img
        });
      }
    });
  },

  /**
   * 当切换商品分类时（即 切换左侧 tab 标签时）
   * @param {*} e 
   */
  switchCate(e) {
    let nowId = this.data.nowId;
    console.log('switchCate -> 上次 nowId:', nowId)
    let id = e.currentTarget.dataset.id;
    console.log('switchCate -> 这次 id:', id)
    // ! 如果点击的 tab 跟当前一样，则什么都不做
    if (id == nowId) {
      return false;
    }

    // 先清空所有数据
    this.setData({
      list: [],
      allPage: 1,
      allCount: 0,
      size: 8,
      loading: 1
    })

    // 如果点击的是第一个 tab 标签，即 全部
    if (id == 0) {
      this.getCurrentList(0);
      this.setData({
        currentCategory: {}
      })
    } else {
      wx.setStorageSync('categoryId', id)
      this.getCurrentList(id);
      // this.getCurrentCategory(id);
    }
    wx.setStorageSync('categoryId', id)
    this.setData({
      // 记录当前 cate id
      nowId: id,
      // 切换左侧分类列表
      TabCur: id,
      // 滚动右侧商品列表
      MainCur: id,
      // 暂时不知道啥用
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },

  onBottom() {
    let that = this;
    if (that.data.allCount / that.data.size < that.data.allPage) {
        that.setData({
            showNoMore: 0
        });
        return false;
    }
    that.setData({
        allPage: that.data.allPage + 1
    });
    let nowId = that.data.nowId;
    if (nowId == 0 || nowId == undefined) {
        that.getCurrentList(0);
    } else {
        that.getCurrentList(nowId);
    }
  },


  gotoGoodDetail({ currentTarget: { dataset } }) {
    console.log('dataset:\n', dataset)
    wx.navigateTo({
      url: '/pages/goods/goods?id=' + dataset.id,
    })
  },
  handleInnerNotClickable() {
    // 空函数，阻止冒泡
  },

  // 少买一件
  decreaseThisGood() {},
  // 多买一件
  increaseThisGood() {},

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  VerticalMain(e) {
    // console.log('\nfunc VerticalMain !')
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    // this.setData({
    //   scrollViewHeight: `height: ${Math.max(scrollTop, 1040)}rpx;`,
    // })
    // console.log('func VerticalMain -> scrollTop: ', scrollTop)
    for (let i = 0; i < list.length; i++) {
      // console.log('func VerticalMain -> list[i]: ', list[i])
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        // console.log('func VerticalMain -> (list[i].id - 1) * 50: ', (list[i].id - 1) * 50)
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },

  /**
   *  前往购物车页面
   */
  gotoCartPage() {
    wx.navigateTo({
      url: '/pages/cart/cart',
    })
  },

})
