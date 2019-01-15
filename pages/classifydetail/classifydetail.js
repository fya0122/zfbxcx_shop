const app = getApp()
Page({
  data: {
    currentObj: {},
    animationInfo: {}, // 动画对象，默认为{}，但在onShow已经进行了实例化
    animationOpacity: 0 // 透明度
  },
  onLoad(e) {
    const id = e.id
    if (id) {
      this._getSpecificDataById(id) // 根据id获取具体的某个detail
    }
  },
  onShow() {
    // 创建一个动画实例
    let animation = my.createAnimation({})
    this.setData({
      animationInfo: animation.export()
    })
  },
  _getSpecificDataById (id) {
    my.showNavigationBarLoading();
    my.httpRequest({
      url: app.baseServerUrl + '/items/searchById',
      data: {
        itemId: id
      },
      method: 'POST',
      success: ((res) => {
        if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
          const item = res.data.data
          this.setData({
            currentObj: {
                catId: item.catId,
                content: item.content ? JSON.parse(item.content) : item.content,
                cover: item.cover,
                coverList: item.coverList,
                discounts: item.discounts,
                headerImages: typeof(item.headerImages) === 'string' ? JSON.parse(item.headerImages) : item.headerImages,
                id: item.id,
                likeCounts: item.likeCounts,
                name: item.name,
                priceDiscountYuan: item.priceDiscountYuan,
                priceNormalYuan: item.priceNormalYuan,
                tagList: item.tagList,
                sellCounts: item.sellCounts
            }
          })
        }
      }),
      fail: ((err) => {
        console.log(err)
        this.setData({
          currentObj: {}
        })
      }),
      complete: (() => {
        my.hideNavigationBarLoading();
      })
    });
  },
  // 加入购物车
  addToCart () {
    this.setData({
      animationOpacity: 1
    })
    this.showAddToCartAnimation()
  },
  // 实现动画效果
  showAddToCartAnimation () {
    let animation = my.createAnimation({
      duration: 1200
    })
    this.animation = animation
    // 动作（旋转的同时+又在水平上面偏移）
    this.animation.rotate(-180).translateX('296rpx').step();
    this.setData({
      animationInfo: animation.export()
    })
  }
});
