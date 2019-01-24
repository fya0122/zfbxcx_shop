App({
  // api前缀
  baseServerUrl: 'https://www.imoocdsp.com',
  // 商品对象
  cartItem (id, counts) {
    const cartItem = new Object()
    cartItem.id = id
    cartItem.counts = counts
    return cartItem
  },
  // 用户对象
  getGlobalUserInfo () {
    const userInfo = my.getStorageSync({ key: 'yourGlobalUserInfo' }).data
    console.log('app.js')
    console.log(userInfo)
    if (userInfo) {
      return userInfo
    } else {
      return null
    }
  },
  // 设置用户对象
  setGlobalUserInfo (userInfo) {
    my.setStorageSync({ key: 'yourGlobalUserInfo', data: userInfo });
  }
});
