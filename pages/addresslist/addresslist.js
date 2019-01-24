const app = getApp()
Page({
  data: {
    addressList: [],
    addressId: null
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
  // selectradioaddress (e) {
  //   console.log(e)
  //   console.log(123)
  // },
  // 跳转到addressinfo页面
  goToAddress () {
    my.navigateTo({
      url: '../addressinfo/addressinfo'
    });
  },
  // 获取your地址列表
  _getAddressList () {
    my.showNavigationBarLoading();
    const userInfo = app.getGlobalUserInfo()
    if (userInfo) {
      my.httpRequest({
        url: app.baseServerUrl + `/address/addressList/${userInfo.alipayUserId}`,
        method: 'POST',
        success: ((res) => {
          console.log(res)
          if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
            console.log('hello')
            if (res.data.data.length > 0) {
              this.setData({
                addressList: res.data.data
              })
              if (res.data.data.length === 1) {
                this.setData({
                  addressId: res.data.data[0].id
                })
              }
            } else {
              my.confirm({
                title: '检测到您无默认地址',
                content: '点击确认进行添加',
                success: ((res) => {
                  if (res.confirm) {
                    this.goToAddress()
                  } else {
                    my.navigateBack({});
                  }
                })
              });
            }
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
  // 选择默认地址(让红框移动)
  selectDefaultAddress (e) {
    const id = e.currentTarget.dataset.id
    if (id) {
      this.setData({
        addressId: id
      })
    }
  },
  // 点击确认选择
  confirmSelectAddress () {
    const userInfo = app.getGlobalUserInfo()
    const id = this.data.addressId
    if (id) {
      if (userInfo) {
        my.httpRequest({
          url: app.baseServerUrl + '/address/setDefault',
          data: {
            userId: userInfo.alipayUserId,
            addressId: id,
          },
          method: 'POST',
          success: ((res) => {
            if (res.data.status === 200 && res.data.msg === 'OK') {
              my.showToast({
                content: '设置地址成功!',
                success: (() => {
                  my.navigateBack({});
                })
              });
            }
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
    } else {
      my.alert({
        title: '系统错误!' 
      });
    }
  }
});
