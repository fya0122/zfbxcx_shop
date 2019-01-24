const app = getApp()
Page({
  data: {
    userInfo: {},
    isLogin: false
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
  }
});
