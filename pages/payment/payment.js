const app = getApp()
Page({
  data: {
    orderid: '',
    orderprice: '',
    tradeNo: ''
  },
  onLoad (e) {
    const orderid = e.orderid
    const orderprice = e.orderprice
    if (orderid && orderprice) {
      this.setData({
        orderid: orderid,
        orderprice: orderprice
      })
    }
  },
  // 支付宝支付
  doAlipay () {
    if (this.data.orderid) {
      const qq = 1144642211
      const orderId = this.data.orderid
      my.httpRequest({
        url: app.baseServerUrl + '/team/alipay',
        data: {
          orderId: orderId,
          qq: qq
        },
        method: 'POST',
        success: ((res) => {
          if (res.data.msg === 'OK' && res.data.status === 200 && res.data.data) {
            this.setData({
              tradeNo: res.data.data
            })
          }
        }),
        fail: ((err) => {
          console.log(err)
        }),
        complete: (() => {
          my.hideNavigationBarLoading();
        })
      });
    } else {
      my.alert({
        title: '系统错误!错误码：1029',
        success: ((res) => {
          my.switchTab({
            url: '../index/index'
          });
        }) 
      });
    }
  }
});
