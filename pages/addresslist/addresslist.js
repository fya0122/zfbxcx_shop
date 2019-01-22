const app = getApp()
Page({
  data: {
    addressList: []
  },
  onShow() {
    this._getAddressList()
  },
  selectradioaddress (e) {
    console.log(e)
    console.log(123)
  },
  // 跳转到addressinfo页面
  goToAddress () {
    my.navigateTo({
      url: '../addressinfo/addressinfo'
    });
  },
  // 获取your地址列表
  _getAddressList () {
    my.showNavigationBarLoading();
    const userId = 1001
    my.httpRequest({
      url: app.baseServerUrl + `/address/addressList/${userId}`,
      method: 'POST',
      success: ((res) => {
        if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
          this.setData({
            addressList: res.data.data
          })
        } else {
          this.setData({
            addressList: []
          })
        }
      }),
      fail: ((err) => {
        console.log(err)
        this.setData({
          addressList: []
        })
      }),
      complete: (() => {
        my.hideNavigationBarLoading();
      })
    });
  },
  // 编辑某个地址呢
  editYourAddress (e) {
    const id = e.currentTarget.dataset.id
    my.navigateTo({
      url: `../addressinfo/addressinfo?id=${id}`
    });
  }
});
