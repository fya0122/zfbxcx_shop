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
    let userInfo = my.getStorageSync({ key: 'yourGlobalUserInfo' }).APDataStorage || my.getStorageSync({ key: 'yourGlobalUserInfo' }).data
    console.log('app.js')
    console.log(userInfo)
    if (typeof userInfo === 'string') {
      userInfo = JSON.parse(userInfo)
    }
    if (typeof userInfo === 'object') {
      userInfo = userInfo
    }
    if (userInfo) {
      return userInfo
    } else {
      return null
    }
  },
  // 设置用户对象
  setGlobalUserInfo (userInfo) {
    my.setStorageSync({ key: 'yourGlobalUserInfo', data: JSON.stringify(userInfo) });
  }
});
