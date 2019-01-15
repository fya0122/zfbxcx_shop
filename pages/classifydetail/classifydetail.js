const app = getApp()
Page({
  data: {
    currentObj: {}
  },
  onLoad(e) {
    const id = e.id
    if (id) {
      this._getSpecificDataById(id) // 根据id获取具体的某个detail
    }
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
          console.log('succ >>> ok')
          console.log(this.data.currentObj)
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
  }
});
