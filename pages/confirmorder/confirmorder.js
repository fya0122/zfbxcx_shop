const app = getApp()
Page({
  data: {
    confirmOrder: [],
    totalPrice: 0,
    orderRemark: '用户并未留下备注信息',
    isExistAddress: false,
    defaultAddressInfo: {}
  },
  onLoad () {
    this._getConfirmOrderData()
  },
  onShow () {
    this._getDefaultAddressByUserId()
  },
  // 得到订单
  _getConfirmOrderData () {
    let confirmOrder = my.getStorageSync({ key: 'pcart_item_id_array' }).APDataStorage || my.getStorageSync({ key: 'pcart_item_id_array' }).data;
    let totalPrice = 0
    if (confirmOrder) {
      confirmOrder = JSON.parse(confirmOrder)
    }
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
    const userInfo = app.getGlobalUserInfo()
    if (userInfo) {
      my.httpRequest({
        url: app.baseServerUrl + `/address/default/${userInfo.alipayUserId}`,
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
    } else {
      my.alert({
        title: '尚未登录，点击确定进行登录',
        success: (() => {
          my.switchTab({
            url: '../my/my'
          });
        })
      });
    }
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
    const userInfo = app.getGlobalUserInfo()
    if (userInfo) {
      my.httpRequest({
        url: app.baseServerUrl + '/order/createOrder',
        method: 'POST',
        data: {
          itemStr: itemStr,
          buyerId: userInfo.id,
          remark: this.data.orderRemark || '',
          addressId: this.data.defaultAddressInfo ? this.data.defaultAddressInfo.id : ''
        },
        success: ((res) => {
          if (res.data.data && res.data.status === 200 && res.data.msg === 'OK') {
            const orderid = res.data.data
            if (orderid) {
              let cart_item_id_array = my.getStorageSync({ key: 'cart_item_id_array' }).APDataStorage || my.getStorageSync({ key: 'cart_item_id_array' }).data
              let pcart_item_id_array = my.getStorageSync({ key: 'pcart_item_id_array' }).APDataStorage || my.getStorageSync({ key: 'pcart_item_id_array' }).data
              if (cart_item_id_array) {
                cart_item_id_array = JSON.parse(cart_item_id_array)
              }
              if (pcart_item_id_array) {
                pcart_item_id_array = JSON.parse(pcart_item_id_array)
              }
              for (const item_p of pcart_item_id_array) {
                for (const index in cart_item_id_array) {
                  if (item_p.id === cart_item_id_array[index].id) {
                    cart_item_id_array.splice(index, 1)
                  }
                }
              }
              // 新版老徐的写法
              // let c = cart_item_id_array.concat(pcart_item_id_array)
              // let temp = {}
              // let result = []
              // c.map((item) => {
              //   if (!temp[item.id]) {
              //     result.push(item)
              //     temp[item.id] = true
              //   }
              // })
              my.setStorageSync({ key: 'cart_item_id_array', data: JSON.stringify(cart_item_id_array) })
              // my.setStorageSync({ key: 'cart_item_id_array', data: result })
              my.removeStorageSync({ key: 'pcart_item_id_array' })
              // 跳转到订单，就不让它返回了
              my.navigateTo({
                url: `../payment/payment?orderid=${orderid}&orderprice=${this.data.totalPrice}`
              });
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
    } else {
      my.hideNavigationBarLoading()
      my.alert({
        title: '尚未登录，点击确定进行登录',
        success: (() => {
          my.switchTab({
            url: '../my/my'
          });
        })
      });
    }
  },
  // 跳转到地址页呢
  gotoaddresslist () {
    if (this.data.defaultAddressInfo.id) {
      const id = this.data.defaultAddressInfo.id
      my.navigateTo({ url: `../addresslist/addresslist?id=${id}` });
    } else {
      my.navigateTo({ url: `../addresslist/addresslist` });
    }
  }
});
