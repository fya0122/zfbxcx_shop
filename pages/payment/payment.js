const app = getApp()
Page({
  data: {
    orderid: '',
    orderprice: ''
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
      my.httpRequest({
        url: app.baseServerUrl + `/team/alipay?orderId=${this.data.orderid}&qq=1144642211`,
        header: {
          'content-type': 'application/json'
        },
        dataType: 'json',
        method: 'POST',
        success: ((res) => {
          console.log(res)
        })
      });
    } else {
      my.alert({
        title: '系统错误!错误码：1029' 
      });
      my.switchTab({
        url: '../index/index'
      });
      my.clearStorageSync();
    }
  }
});
