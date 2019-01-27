const app = getApp()
Page({
  data: {
    orderid: '',
    orderprice: '',
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
                        my.switchTab({
                          url: '../my/my'
                        });
                      }) 
                    });
                  } else {
                    my.alert({
                      title: '唤起收银台失败',
                      success: (() => {
                        my.switchTab({
                          url: '../index/index',
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
                        url: '../index/index',
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
