Page({
  data: {
    confirmOrder: [],
    totalPrice: 0
  },
  onLoad() {
    this._getConfirmOrderData()
  },
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
  }
});
