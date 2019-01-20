const app = getApp()
Page({
  data: {
    confirmOrder: [],
    totalPrice: 0,
    orderRemark: '用户并未留下备注信息',
    isExistAddress: true
  },
  onLoad() {
    this._getConfirmOrderData()
  },
  // 得到订单
  _getConfirmOrderData () {
    let confirmOrder = my.getStorageSync({ key: 'pcart_item_id_array' }).data;
    console.log('this is confirmOrder')
    console.log(confirmOrder)
    let totalPrice = 0
    for (const item of confirmOrder) {
      totalPrice += item.counts * parseInt(item.priceDiscountYuan)
    }
    this.setData({
      confirmOrder: confirmOrder,
      totalPrice: totalPrice
    })
    console.log(this.data.confirmOrder)
  },
  // input框的改变
  changeInputHandle (e) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      const value = e.detail.value
      if (value && value !== null && value !== undefined && value !== '') {
        this.setData({
          orderRemark: value
        })
      } else {
        this.setData({
          orderRemark: '用户并未留下备注信息'
        })
      }
    }, 900)
  },
  // 提交订单
  submitorder () {
    my.showNavigationBarLoading();
    const confirmOrder = this.data.confirmOrder
    let itemStr = ''
    for (const item of confirmOrder) {
      itemStr += `${item.id}|${item.counts},`
    }
    console.log('this is itemStr')
    console.log(itemStr)
    my.httpRequest({
      url: app.baseServerUrl + '/order/createOrder',
      method: 'POST',
      data: {
        itemStr: itemStr,
        buyerId: '666',
        remark: this.data.orderRemark || '',
        addressId: ''
      },
      success: ((res) => {
        if (res.data.data && res.data.status === 200 && res.data.msg === 'OK') {
          const orderid = res.data.data
          if (orderid) {
            const cart_item_id_array = my.getStorageSync({ key: 'cart_item_id_array' }).data
            const pcart_item_id_array = my.getStorageSync({ key: 'pcart_item_id_array' }).data
            for (const item_p of pcart_item_id_array) {
              for (const index in cart_item_id_array) {
                if (item_p.id === cart_item_id_array[index].id) {
                  cart_item_id_array.splice(index, 1)
                }
              }
            }
            my.setStorageSync({ key: 'cart_item_id_array', data: cart_item_id_array })
            my.removeStorageSync({ key: 'pcart_item_id_array' })
            my.switchTab({
              url: '../index/index'
            })
          }
        } else {
          my.alert({ title: '提交失败', content: '系统错误了哟!~' })
        }
      }),
      fail: ((err) => {
        console.log(err)
        my.alert({ title: '提交失败', content: '系统错误了哟!~' })
      }),
      complete: (() => {
        my.hideNavigationBarLoading();
      })
    });
  }
});
