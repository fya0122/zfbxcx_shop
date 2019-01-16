App({
  // api前缀
  baseServerUrl: 'https://www.imoocdsp.com',
  // 商品对象
  cartItem (id, counts) {
    const cartItem = new Object()
    cartItem.id = id
    cartItem.counts = counts
    return cartItem
  }
});
