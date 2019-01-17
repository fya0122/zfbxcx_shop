const app = getApp()
Page({
  data: {
    emptyHidden: true
  },
  onLoad() {
    this._getShoppingCartData()
  },
  helpYourSelf () {
    my.switchTab({
      url: '../index/index'
    });
  },
  _getShoppingCartData () {
    my.httpRequest({
      url: app.baseServerUrl + '',
      success: (res) => {  
      }
    });
  }
});
