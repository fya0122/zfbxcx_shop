const app = getApp()
Page({
  data: {
    recList: []
  },
  onLoad(e) {
    const searchtype = e.searchtype
    if (searchtype === 'words') {
      this._getSearchData(e.searchvalue) // input搜索触发的接口
    } else if (searchtype === 'cat') {
      this._getSpecifyData(e.catid) // 点击图标以后触发的接口
    }
  },
  _getSearchData (value) {
    my.httpRequest({
      url: app.baseServerUrl + '/items/search',
      data: {
        itemName: value
      },
      method: 'POST',
      success: (res) => {
        if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
          console.log(res.data.data)
          // this.setData({
          //   recList: res.data.data.map(item => {
          //     return {
          //       catId: item.catId,
          //       cover: item.cover,
          //       coverList: item.coverList,
          //       discounts: item.discounts,
          //       priceDiscountYuan: item.priceDiscountYuan,
          //       priceNormalYuan: item.priceNormalYuan,
          //       tagList: item.tagList
          //     }
          //   })
          // })
          // console.log(this.data.recList)
        }
      }
    });
  },
  _getSpecifyData (id) {
    my.httpRequest({
      url: app.baseServerUrl + '/items/searchByCat',
      data: {
        catId: id
      },
      method: 'POST',
      success: (res) => {
        if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
          console.log(res.data.data)
        }
      }
    });
  }
});
