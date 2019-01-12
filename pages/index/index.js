const app = getApp()
Page({
  data: {
    imgUrls: [],
    recList: [],
    newList: []
  },
  onLoad () {
    this._getSwiperData() // 得到轮播图的数据
  },
  // 下拉刷新
  onPullDownRefresh () {
    console.log(123)
    console.log('我是下拉刷新')
    this._getSwiperData()
  },
  _getSwiperData () {
    my.httpRequest({
      url: app.baseServerUrl + '/index/carousels',
      method: 'POST',
      success:((res) => {
        if (res.data.msg === 'OK' && res.data.status === 200 && res.data.data) {
          this.setData({
            imgUrls: res.data.data.filter((item) => {
              return item.imageUrl.length > 0
            }).map(item => {
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
      }),
      complete: (() => {
        this._getRecData() // 得到推荐的数据
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
        } else {
          this.setData({
            recList: []
          })
        }
      }),
      fail: ((err) => {
        console.log(err)
        this.setData({
          recList: []
        })
      }),
      complete: (() => {
        this._getNewData() // 得到新品的数据
      })
    })
  },
  _getNewData () {
    my.httpRequest({
      url: app.baseServerUrl + '/index/items/new',
      method: 'POST',
      success: (res) => {
        if (res.data.msg === 'OK' && res.data.status === 200 && res.data.data) {
          this.setData({
            newList: res.data.data.filter((item) => {
              return item.isRecommend === false && item.isNew === true
            }).map(item => {
              return {
                catId: item.catId,
                cover: item.cover,
                likeCounts: item.likeCounts,
                priceNormalYuan: item.priceNormalYuan,
                priceDiscountYuan: item.priceDiscountYuan,
                tagList: item.tagList.slice(0, 4)
              }
            })
          })
        } else {
          this.setData({
            newList: []
          })
        }
      },
      fail: ((err) => {
        console.log(err)
        this.setData({
          newList: []
        })
      }),
      complete: (() => {
        my.stopPullDownRefresh()
      })
    });
  }
});
