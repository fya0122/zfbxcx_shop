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
  }
});
