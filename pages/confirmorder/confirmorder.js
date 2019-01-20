const app = getApp()
Page({
  data: {
    confirmOrder: [],
    totalPrice: 0,
    orderRemark: '用户并未留下备注信息'
  },
  onLoad() {
    this._getConfirmOrderData()
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
        remark: '',
        addressId: ''
      },
      success: ((res) => {
        if (res.data.data && res.data.status === 200 && res.data.msg === 'OK') {
          my.alert({ title: 'ok', content: '提交成功呢!~' })
        } else {
          my.alert({ title: '提交失败', content: '系统错误了哟!~' })
        }
      }),
      fail: ((err) => {
        console.log(err)
        my.alert({ title: '提交失败', content: '系统错误了哟!~' })
      })
    });
  }
});
