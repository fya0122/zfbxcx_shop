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
    this._getSwiperData()
  },
  _getSwiperData () {
    my.showNavigationBarLoading()
    my.httpRequest({
      url: app.baseServerUrl + '/index/carousels',
      method: 'POST',
      success:((res) => {
        if (res.data.msg === 'OK' && res.data.status === 200 && res.data.data) {
          // console.log('swiper_ok')
          // console.log(res.data.data)
          this.setData({
            imgUrls: res.data.data.filter((item) => {
              return item.imageUrl.length > 0
            }).map(item => {
              return {
                catId: item.catId,
                id: item.id,
                imageUrl: item.imageUrl,
                itemId: item.itemId,
                type: item.type
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
        my.stopPullDownRefresh()
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
                id: item.id,
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
                id: item.id,
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
        my.hideNavigationBarLoading();
        console.log('接口over')
      })
    });
  },
  // 点击商品上新的任何一个，跳转到了详情呢
  gotodetail (e) {
    const id = e.currentTarget.dataset.id
    if (id) {
      my.navigateTo({
        url: `../classifydetail/classifydetail?id=${id}`
      });
    }
  },
  // 轮播图点击跳转
  swiperGoTo (e) {
    const catId = e.currentTarget.dataset.catId
    const itemId = e.currentTarget.dataset.itemId
    const type = e.currentTarget.dataset.type
    if (type === 1) {
      my.navigateTo({
        url: `../classifydetail/classifydetail?id=${itemId}`
      });
    } else if (type === 2) {
      my.navigateTo({
        url: `../classifylist/classifylist?searchtype=cat&catid=${catId}&name=搜索结果`
      });
    }
  }
});
