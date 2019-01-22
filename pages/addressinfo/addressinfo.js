const app = getApp()
Page({
  data: {
    yourCity: ''
  },
  onLoad () {},
  submitAddress (e) {
    const receiver = e.detail.value.receiver.replace(/\s+/g, "")
    const mobile = e.detail.value.mobile.replace(/\s+/g, "")
    const descAddress = e.detail.value.descAddress.replace(/\s+/g, "")
    if (receiver && mobile && descAddress) {
      if (this.data.yourCity) {
        let userinfo = app.getGlobalUserInfo()
        let userId = 1001
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
            city: this.data.yourCity,
            descAddress: descAddress,
            addressId: ''
          },
          method: 'POST',
          success: (res) => {
            if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
              const myaddress = res.data.data
              my.setStorageSync({ key: 'addressChoosed', data: myaddress })
              // my.switchTab({ url: '../../addresslist/addresslist' })
              my.navigateBack({});
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
  onDistributeCity (e) {
    if (e.city) {
      this.setData({
        yourCity: e.city
      })
    }
  }
});
