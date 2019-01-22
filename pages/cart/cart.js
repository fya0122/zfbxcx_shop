const app = getApp()
Page({
  data: {
    cartList: [],
    isHasValue: false, // 默认没有值的
    checkAll: true, // 全选
    totalPrice: 0,
    totalCount: 0
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
    if (cart && cart.length > 0) {
      my.showNavigationBarLoading()
      if (Array.isArray(cart) === true) {
        let itemIds = ''
        for (const item of cart) {
          itemIds += item.id + ','
        }
        console.log('itemIds')
        console.log(itemIds)
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
                    item_http.isSelect = item_local.isSelect || 'yes'
                  }
                }
              }
              this.setData({
                isHasValue: true,
                cartList: res.data.data.map(item => {
                  return {
                    isSelect: item.isSelect,
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
              // 全选的检测
              this._checkAll(this.data.cartList)
              // 计算金额和总的数量
              this._calculatePriceAndCount(this.data.cartList)
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
      if (item.isSelect === 'yes') {
        item.isSelect = 'no'
      } else {
        item.isSelect = 'yes'
      }
    }
    this.setData({
      cartList: cartList
    })
    my.setStorageSync({ key: 'cart_item_id_array', data: this.data.cartList })
    this._checkAll(this.data.cartList)
    this._calculatePriceAndCount(this.data.cartList)
  },
  // 全选的检测
  _checkAll (cartList) {
    const length = cartList.length
    let isSelectTotal = 0
    for (const item of cartList) {
      if (item.isSelect === 'yes') {
        isSelectTotal += 1
      }
    }
    if (isSelectTotal === length) {
      this.setData({
        checkAll: true
      })
    } else {
      this.setData({
        checkAll: false
      })
    }
  },
  // 计算金额和数量
  _calculatePriceAndCount (cartList) {
    const total = cartList.filter(item => item.isSelect === 'yes')
    let totalPrice = 0
    let totalCount = 0
    for (const item of total) {
      totalPrice += item.counts * parseInt(item.priceDiscountYuan)
      totalCount += item.counts
    }
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount
    })
  },
  // 改变全选
  changecheckall () {
    let yescount = 0
    let nocount = 0
    for (const item of this.data.cartList) {
      if (item.isSelect === 'yes') {
        yescount += 1
      } else if (item.isSelect === 'no') {
        nocount += 1
      }
    }
    if (yescount === this.data.cartList.length) {
      const cartList = this.data.cartList
      for (const item of cartList) {
        item.isSelect = 'no'
      }
      this.setData({
        checkAll: false,
        cartList: cartList
      })
    } else {
      const cartList = this.data.cartList
      for (const item of cartList) {
        item.isSelect = 'yes'
      }
      this.setData({
        checkAll: true,
        cartList: cartList
      })
    }
    my.setStorageSync({ key: 'cart_item_id_array', data: this.data.cartList })
    this._calculatePriceAndCount(this.data.cartList)
  },
  // 去确认的页面
  goToConfirm () {
    my.showNavigationBarLoading();
    const pcart = this.data.cartList.filter(item => item.isSelect === 'yes')
    let totalPrice = 0
    for (const item of pcart) {
      totalPrice += item.counts * parseInt(item.priceDiscountYuan)
    }
    if (totalPrice > 0) {
      my.setStorageSync({ key: 'pcart_item_id_array', data: pcart });
      my.hideNavigationBarLoading();
      my.navigateTo({
        url: '../confirmorder/confirmorder'
      });
    } else {
      my.alert({
        title: '温馨提示',
        content: '至少购买一件商品才能结算哟',
        buttonText: '好的' 
      })
    }
  }
});
