const app = getApp()
Page({
  data: {
    yourCity: '',
    addressinfo: {},
    defaultCity: '点击选择城市!~'
  },
  onLoad (e) {
    const modifyId = e.id
    if (modifyId) {
      my.showNavigationBarLoading()
      this._modifyAddressInfo(modifyId)
    }
  },
  // if has modifyId，才会去请求接口去填充数据，否则是直接进入完成的
  _modifyAddressInfo (id) {
    my.httpRequest({
      url: app.baseServerUrl + '/address/fetch',
      data: {
        addressId: id,
        userId: '1001'
      },
      method: 'POST',
      success: ((res) => {
        if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
          this.setData({
            addressinfo: res.data.data,
            defaultCity: res.data.data.city // 传递给子组件，让子组件是展示而改变city
          })
        } else {
          this.setData({
            addressinfo: {}
          })
        }
      }),
      fail: ((err) => {
        console.log(err)
        this.setData({
          addressinfo: {}
        })
      }),
      complete: (() => {
        my.hideNavigationBarLoading()
      })
    });
  },
  // 点击完成按钮
  submitAddress (e) {
    const receiver = e.detail.value.receiver.replace(/\s+/g, "") || this.data.addressinfo.receiver
    const mobile = e.detail.value.mobile.replace(/\s+/g, "") || this.data.addressinfo.mobile
    const descAddress = e.detail.value.descAddress.replace(/\s+/g, "") || this.data.addressinfo.descAddress
    if (receiver && mobile && descAddress) {
      if (this.data.yourCity || this.data.addressinfo.city) {
        let userinfo = app.getGlobalUserInfo()
        let userId = this.data.addressinfo.userId || 1001
        if (userinfo !== null && userinfo !== undefined) {
          userId = userinfo.id
        }
        let addressId = ''
        my.httpRequest({
          url: app.baseServerUrl + '/address/createOrUpdate',
          data: {
            userId: userId,
            receiver: receiver,
            mobile: mobile,
            city: this.data.yourCity || this.data.addressinfo.city,
            descAddress: descAddress,
            addressId: this.data.addressinfo.id ? this.data.addressinfo.id : addressId
          },
          method: 'POST',
          success: (res) => {
            if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
              const myaddress = res.data.data
              my.setStorageSync({ key: 'addressChoosed', data: myaddress })
              // my.switchTab({ url: '../../addresslist/addresslist' })
              my.navigateBack({
                delta: 1
              });
            }
          },
        });
      } else {
        my.alert({
          title: '请填写所在城市啊老铁!~' 
        })
        return
      }
    } else {
      my.alert({
        title: '请依次填写相关信息呢!~' 
      })
      return
    }
  },
  // 子组件传递过来的
  onDistributeCity (e) {
    if (e.city) {
      this.setData({
        yourCity: e.city
      })
    }
  }
});
