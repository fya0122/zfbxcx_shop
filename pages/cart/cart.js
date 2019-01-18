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
                    item_http.isSelect = item_local.isSelect
                  }
                }
              }
              this.setData({
                isHasValue: true,
                cartList: res.data.data.map(item => {
                  return {
                    isSelect: item.isSelect || false,
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
  },
  // 改变单选
  updateCheckbox (e) {
    const id = e.currentTarget.dataset.id
    const isSelect = e.currentTarget.dataset.isSelect
    const cartList = this.data.cartList
    const item = cartList.find(e => e.id === id)
    if (item.isSelect === isSelect) {
      item.isSelect = !item.isSelect
    }
    this.setData({
      cartList: cartList
    })
    my.setStorageSync({ key: 'cart_item_id_array', data: cartList })
  }
});
