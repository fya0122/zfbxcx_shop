const app = getApp()
Page( {
  data: {
    imgUrls: []
  },
  onLoad () {
    this._getSwiperData() // 轮播图
  },
  _getSwiperData () {
    my.httpRequest({
      url: app.baseServerUrl + '/index/carousels',
      method: 'POST',
      success:((res) => {
        if (res.data.msg === 'OK' && res.data.status === 200 && res.data.data) {
          this.setData({
            imgUrls: res.data.data
          })
        } else {
          this.setData({
            imgUrls: []
          })
        }
      }),
      fail: ((err) => {
        console.log(err)
        this.setData({
          imgUrls: []
        })
      })
    });
  }
} );
