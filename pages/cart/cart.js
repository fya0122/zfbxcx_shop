const app = getApp()
Page({
  data: {
    cartList: [],
    isHasValue: false // 默认没有值的
  },
  onShow() {
    this._getShoppingCartData()
  },
  helpYourSelf () {
    my.switchTab({
      url: '../index/index'
    });
  },
  _getShoppingCartData () {
    const cart = my.getStorageSync({ key: 'cart_item_id_array' }).data
    if (cart) {
      my.showNavigationBarLoading()
      if (Array.isArray(cart) === true) {
        let itemIds = ''
        for (const item of cart) {
          itemIds += item.id + ','
        }
        my.httpRequest({
          url: app.baseServerUrl + '/item/queryItems',
          data: {
            itemIds: itemIds
          },
          method: 'POST',
          success: ((res) => {
            if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
              for (const item_http of res.data.data) {
                for (const item_local of cart) {
                  if (item_http.id === item_local.id) {
                    item_http.counts = item_local.counts
                  }
                }
              }
              this.setData({
                isHasValue: true,
                cartList: res.data.data.map(item => {
                  return {
                    catId: item.catId,
                    cover: item.cover,
                    discounts: item.discounts,
                    id: item.id,
                    likeCounts: item.likeCounts,
                    name: item.name,
                    priceDiscountYuan: item.priceDiscountYuan,
                    priceNormalYuan: item.priceNormalYuan,
                    sellCounts: item.sellCounts,
                    tagList: item.tagList,
                    counts: item.counts
                  }
                })
              })
              console.log(res.data.data)
            } else {
              this.setData({
                isHasValue: false,
                cartList: []
              })
            }
          }),
          fail: ((err) => {
            console.log(err)
            this.setData({
              isHasValue: false,
              cartList: []
            })
          }),
          complete: (() => {
            my.hideNavigationBarLoading();
          })
        });
      }
    } else {
      this.setData({
        isHasValue: false,
        cartList: []
      })
    }
  }
});
