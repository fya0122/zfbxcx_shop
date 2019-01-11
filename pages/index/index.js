const app = getApp()
Page( {
  data: {
    imgUrls: [],
    recList: []
  },
  onLoad () {
    this._getSwiperData() // 轮播图
    this._getRecData() // 得到推荐的数据
  },
  _getSwiperData () {
    my.httpRequest({
      url: app.baseServerUrl + '/index/carousels',
      method: 'POST',
      success:((res) => {
        if (res.data.msg === 'OK' && res.data.status === 200 && res.data.data) {
          this.setData({
            imgUrls: res.data.data.map(item => {
              return {
                id: item.id,
                imageUrl: item.imageUrl
              }
            })
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
  },
  _getRecData () {
    my.httpRequest({
      url: app.baseServerUrl + '/index/items/rec',
      method: 'POST',
      success: ((res) => {
        if (res.data.msg === 'OK' && res.data.status === 200 && res.data.data) {
          this.setData({
            recList: res.data.data.filter((item) => {
              return item.isRecommend === true && item.isNew === false
            }).map(item => {
              return {
                catId: item.catId,
                cover: item.cover
              }
            })
          })
        }
      })
    })
  }
} );
