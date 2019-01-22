const app = getApp()
Page({
  data: {
    confirmOrder: [],
    totalPrice: 0,
    orderRemark: '用户并未留下备注信息',
    isExistAddress: false,
    defaultAddressInfo: {}
  },
  onLoad() {
    this._getConfirmOrderData()
    this._getDefaultAddressByUserId()
  },
  // 得到订单
  _getConfirmOrderData () {
    let confirmOrder = my.getStorageSync({ key: 'pcart_item_id_array' }).data;
    let totalPrice = 0
    for (const item of confirmOrder) {
      totalPrice += item.counts * parseInt(item.priceDiscountYuan)
    }
    this.setData({
      confirmOrder: confirmOrder,
      totalPrice: totalPrice
    })
  },
  // 得到默认的用户地址呢
  _getDefaultAddressByUserId () {
    let userId = 1001
    my.httpRequest({
      url: app.baseServerUrl + `/address/default/${userId}`,
      method: 'POST',
      success: ((res) => {
        if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
          this.setData({
            isExistAddress: true,
            defaultAddressInfo: res.data.data
          })
        } else {
          this.setData({
            isExistAddress: false,
            defaultAddressInfo: {}
          })
        }
      }),
      fail: ((err) => {
        console.log(err)
        this.setData({
          isExistAddress: false,
          defaultAddressInfo: {}
        })
      })
    });
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
  },
  // 跳转到地址页呢
  gotoaddresslist () {
    my.navigateTo({ url: '../addresslist/addresslist' });
  }
});
