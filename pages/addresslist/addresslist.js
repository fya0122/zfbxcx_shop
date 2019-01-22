const app = getApp()
Page({
  data: {
    addressList: [],
    addressId: null,
    flag: false // 当你删掉默认的时候红框的时候，猛的下红框会不显示
  },
  onLoad (e) {
    if (e.id) {
      this.setData({
        addressId: e.id
      })
    }
  },
  onShow () {
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
  },
  // 删除地址
  deleteAddress (e) {
    const id = e.currentTarget.dataset.id
    if (id) {
      my.confirm({
        title: '删除操作',
        content: '确认删除该地址吗？',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        success: (res) => {
          if (res.confirm === true && res.ok === true) {
            my.httpRequest({
              url: app.baseServerUrl + `/address/delete/${id}`,
              method: 'POST',
              success: ((res) => {
                if (res.data.status === 200 && res.data.msg === 'OK') {
                  my.showToast({
                    content: '删除成功',
                    success: (() => {
                      this._getAddressList()
                    })
                  });
                } else {
                  my.showToast({
                    content: '删除失败'
                  });
                }
              }),
              fail: (() => {
                my.showToast({
                  content: '删除失败'
                });
              })
            });
          }
        }
      });
    }
  },
  // 选择默认地址
  selectDefaultAddress (e) {
    const id = e.currentTarget.dataset.id
    if (id) {
      this.setData({
        addressId: id
      })
    }
  }
});
