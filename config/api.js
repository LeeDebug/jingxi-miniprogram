/**
 * 本地服务器
 */
// const ApiRoot = 'http://localhost:8380';
const ApiRoot = 'http://127.0.0.1:8380';
// const ApiRoot = 'http://192.168.1.3:8380';
/**
 * Tencent 服务器
 */
// const ApiRoot = 'http://82.156.25.59:8380'; // 腾讯服务器（8月20日即将过期）
// const ApiRoot = 'http://192.144.217.153:8380'; // 腾讯服务器，新的 Docker 实例服务器

const ApiRootUrl = ApiRoot + '/api/'

module.exports = {
  ApiRoot: ApiRoot,
  // 登录
  AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin', //微信登录
  // 手机号
  // AuthLoginByWeixin: ApiRootUrl + 'auth/loginByWeixin', //微信登录
  // 时令菜单
  SeasonalMenuList: ApiRootUrl + 'seasonal/list', // 获取菜单列表
  // 优惠券
  GetAllCoupons: ApiRootUrl + 'coupons/getAllCoupons', // 获取所有优惠券列表（已标识出当前用户不能领取的）
  UserCouponsList: ApiRootUrl + 'user_coupons/list', // 获取当前用户下的优惠券列表
  GetCoupon: ApiRootUrl + 'user_coupons/getCoupon', // 将优惠券领取到当前用户中
  // 邀请记录
  getInvitationsList: ApiRootUrl + 'user_invitations/list', // 获取该用户所有邀请记录
  // 首页
  IndexUrl: ApiRootUrl + 'index/appInfo', //首页数据接口
  // 分类
  CatalogList: ApiRootUrl + 'catalog/index', // 分类目录全部分类数据接口
  CatalogCurrent: ApiRootUrl + 'catalog/current', // 分类目录当前分类数据接口（即 某个分类的 banner 图）
  GetCurrentList: ApiRootUrl + 'catalog/currentlist', // 根据特定分类筛选商品接口
  // 购物车
  CartAdd: ApiRootUrl + 'cart/add', // 添加商品到购物车
  CartList: ApiRootUrl + 'cart/index', //获取购物车的数据
  CartUpdate: ApiRootUrl + 'cart/update', // 更新购物车的商品
  CartDelete: ApiRootUrl + 'cart/delete', // 删除购物车的商品
  CartChecked: ApiRootUrl + 'cart/checked', // 选择或取消选择商品
  CartGoodsCount: ApiRootUrl + 'cart/goodsCount', // 获取购物车商品件数
  CartCheckout: ApiRootUrl + 'cart/checkout', // 下单前信息确认
  // 商品
  GoodsCount: ApiRootUrl + 'goods/count', //统计商品总数
  GoodsDetail: ApiRootUrl + 'goods/detail', //获得商品的详情
  GoodsList: ApiRootUrl + 'goods/list', //获得商品列表
  GoodsShare: ApiRootUrl + 'goods/goodsShare', //获得商品的详情
  SaveUserId: ApiRootUrl + 'goods/saveUserId',
  // 收货地址
  AddressDetail: ApiRootUrl + 'address/addressDetail', //收货地址详情
  DeleteAddress: ApiRootUrl + 'address/deleteAddress', //保存收货地址
  SaveAddress: ApiRootUrl + 'address/saveAddress', //保存收货地址
  GetAddresses: ApiRootUrl + 'address/getAddresses',
  RegionList: ApiRootUrl + 'region/list', //获取区域列表
  PayPrepayId: ApiRootUrl + 'pay/preWeixinPay', //获取微信统一下单prepay_id
  OrderSubmit: ApiRootUrl + 'order/submit', // 提交订单
  OrderList: ApiRootUrl + 'order/list', //订单列表
  OrderDetail: ApiRootUrl + 'order/detail', //订单详情
  OrderDelete: ApiRootUrl + 'order/delete', //订单删除
  OrderCancel: ApiRootUrl + 'order/cancel', //取消订单
  OrderConfirm: ApiRootUrl + 'order/confirm', //物流详情
  OrderCount: ApiRootUrl + 'order/count', // 获取订单数
  OrderCountInfo: ApiRootUrl + 'order/orderCount', // 我的页面获取订单数状态
  OrderExpressInfo: ApiRootUrl + 'order/express', //物流信息
  OrderGoods: ApiRootUrl + 'order/orderGoods', // 获取checkout页面的商品列表
  // 足迹
  FootprintList: ApiRootUrl + 'footprint/list', //足迹列表
  FootprintDelete: ApiRootUrl + 'footprint/delete', //删除足迹
  // 搜索
  SearchIndex: ApiRootUrl + 'search/index', //搜索页面数据
  SearchHelper: ApiRootUrl + 'search/helper', //搜索帮助
  SearchClearHistory: ApiRootUrl + 'search/clearHistory', //搜索帮助
  ShowSettings: ApiRootUrl + 'settings/showSettings',
  SaveSettings: ApiRootUrl + 'settings/save',
  SettingsDetail: ApiRootUrl + 'settings/userDetail',
  UploadAvatar: ApiRootUrl + 'upload/uploadAvatar',
  GetBase64: ApiRootUrl + 'qrcode/getBase64', //获取商品详情二维码
};