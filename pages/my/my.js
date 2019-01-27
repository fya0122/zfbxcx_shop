const app = getApp()
Page({
  data: {
    userInfo: {},
    isLogin: false,
    defaultIndex: 0,
    my_tabs: [
      {icon: '../../resources/icon/smallIco/orderstatus/all.png', selectIcon: '../../resources/icon/smallIco/orderstatus/all-sel.png', txt: '全部', id: 0, status: 0},
      {icon: '../../resources/icon/smallIco/orderstatus/wait-pay.png', selectIcon: '../../resources/icon/smallIco/orderstatus/wait-pay-sel.png', txt: '待付款', id: 1, status: 10},
      {icon: '../../resources/icon/smallIco/orderstatus/wait-receive.png', selectIcon: '../../resources/icon/smallIco/orderstatus/wait-receive-sel.png', txt: '待收货', id: 2, status: 20},
      {icon: '../../resources/icon/smallIco/orderstatus/done.png', selectIcon: '../../resources/icon/smallIco/orderstatus/done-sel.png', txt: '已完成', id: 3, status: 40},
      {icon: '../../resources/icon/smallIco/orderstatus/canceled.png', selectIcon: '../../resources/icon/smallIco/orderstatus/canceled-sel.png', txt: '已取消', id: 4, status: 50},
    ],
    orderList: []
  },
  onLoad () {
    const userInfo = app.getGlobalUserInfo()
    console.log('onLoad')
    console.log(userInfo)
    if (userInfo !== null && userInfo !== undefined) { // 表示已经登录了
      this.setData({
        userInfo: userInfo,
        isLogin: true
      })
      // 查询订单
      this._getOrderByOrderStatus(this.data.defaultIndex)
    } else {
      this._userAuthorized()
    }
  },
  // 授权登录
  _userAuthorized () {
    my.showNavigationBarLoading()
    my.getAuthCode({
      scopes: 'auth_user',
      success: (res) => {
        if (res.authCode) {
          this._yourLogin(res.authCode)
        } else {
          this.setData({
            userInfo: {},
            isLogin: false
          })
        }
      },
      fail: ((err) => {
        console.log(err)
        this.setData({
          userInfo: {},
          isLogin: false
        })
      }),
      complete: (() => {
        my.hideNavigationBarLoading();
      })
    });
  },
  // 登录借口
  _yourLogin (code) {
    my.httpRequest({
      url: app.baseServerUrl + `/team/login/${code}/1144642211`,
      method: 'POST',
      success: (res) => {
        if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
          this.setData({
            userInfo: res.data.data,
            isLogin: true
          })
          console.log('this is http res.data.data')
          console.log(this.data.userInfo)
          app.setGlobalUserInfo(this.data.userInfo)
          // 查询订单(第一次，默认是0，代表的所有)
          this._getOrderByOrderStatus(0)
        } else {
          this.setData({
            userInfo: {},
            isLogin: false
          })
        }
      },
    });
  },
  // 退出
  logout () {
    my.showActionSheet({
      items: ['退出'],
      success: ((res) => {
        if (res.index === 0) {
          my.clearStorageSync()
          this.setData({
            isLogin: false,
            userInfo: {}
          })
        }
      })
    });
  },
  // 选择图标
  selectIcon (e) {
    const index = e.currentTarget.dataset.id
    const status = e.currentTarget.dataset.status
    if (index === this.data.defaultIndex) {
      return
    } else {
      this.setData({
        defaultIndex: index
      })
      this._getOrderByOrderStatus(status)
    }
  },
  // 查询订单
  _getOrderByOrderStatus (status) {
    my.showNavigationBarLoading()
    if (this.data.userInfo.id) {
      my.httpRequest({
        url: app.baseServerUrl + '/order/queryAllOrders',
        data: {
          userId: this.data.userInfo.id,
          orderStatus: status
        },
        method: 'POST',
        success: ((res) => {
          if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
            this.setData({
              orderList: res.data.data
            })
            console.log('我是订单')
            console.log(this.data.orderList)
          } else {
            this.setData({
              orderList: []
            })
          }
        }),
        fail: ((err) => {
          console.log(err)
          this.setData({
            orderList: []
          })
        }),
        complete: (() => {
          my.hideNavigationBarLoading()
        })
      });
    }
  },
  // 确认收货
  confirmAccept (e) {
    const orderId = e.currentTarget.dataset.orderId
    my.confirm({
      title: "友情提示",
      content: "亲，确认已经收到宝贝？",
      confirmButtonText: "确认收货",
      cancelButtonText: "还没收到",
      success: ((res) => {
        if (res.confirm) {
          my.httpRequest({
            url: app.baseServerUrl + '/order/changeToFinished',
            data: {
              orderId: orderId
            },
            method: 'POST',
            success: ((res) => {
              if (res.data.status === 200 && res.data.msg === 'OK') {
                this._getOrderByOrderStatus(this.data.defaultIndex)
              }
            })
          });
        }
      })
    });
  },
  // 取消订单
  cancelOrder (e) {
    const orderId = e.currentTarget.dataset.orderId
    my.confirm({
      title: "友情提示",
      content: "确认取消本订单吗？",
      confirmButtonText: "确认取消",
      cancelButtonText: "我再考虑一下",
      success: ((res) => {
        if (res.confirm) {
          my.httpRequest({
            url: app.baseServerUrl + '/order/changeToCanceled',
            data: {
              orderId: orderId
            },
            method: 'POST',
            success: ((res) => {
              if (res.data.status === 200 && res.data.msg === 'OK') {
                this._getOrderByOrderStatus(this.data.defaultIndex)
              }
            })
          });
        }
      })
    });
  },
  // 付款
  payAgain (e) {
    const orderId = e.currentTarget.dataset.orderId
    const qq = 1144642211
    my.httpRequest({
      url: app.baseServerUrl + '/team/alipay',
      data: {
        orderId: orderId,
        qq: qq
      },
      method: 'POST',
      success: ((res) => {
        if (res.data.msg === 'OK' && res.data.status === 200 && res.data.data) {
          // 唤起收银台
          if (res.data.data) {
            my.tradePay({
              tradeNO: res.data.data,
              success: ((res) =>{
                console.log(res)
                if (res.resultCode === '9000') {
                  my.alert({
                    title: '支付成功!',
                    success: ((res) => {
                      this._getOrderByOrderStatus(this.data.defaultIndex)
                    }) 
                  });
                } else {
                  my.alert({
                    title: '唤起收银台失败',
                    success: (() => {
                      my.switchTab({
                        url: '../my/my',
                        success: (() => {
                          my.clearStorageSync()
                        })
                      });
                    }) 
                  });
                }
              }),
              fail: ((err) => {
                console.log(err)
                my.alert({
                  title: '唤起收银台失败',
                  success: (() => {
                    my.switchTab({
                      url: '../my/my',
                      success: (() => {
                        my.clearStorageSync()
                      })
                    });
                  }) 
                });
              })
            });
          }
        }
      }),
      fail: ((err) => {
        console.log(err)
      }),
      complete: (() => {
        my.hideNavigationBarLoading();
      })
    });
  }
});
