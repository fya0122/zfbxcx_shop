const app = getApp()
Page({
  data: {
    titleName: '',
    recList: []
  },
  onLoad(e) {
    my.showNavigationBarLoading()
    const searchtype = e.searchtype
    if (searchtype === 'words') {
      if (e.name) {
        this.setData({
          titleName: e.name
        })
      } else {
        let titleName
        if (e.searchvalue === '') {
          titleName = '推荐商品'
        } else {
          titleName = e.searchvalue
        }
        this.setData({
          titleName: titleName
        })
      }
      this._getSearchData(e.searchvalue) // input搜索触发的接口
    } else if (searchtype === 'cat') {
      if (e.name) {
        this.setData({
          titleName: e.name
        })
      } else {
        this.setData({
          titleName: '系统错误, 请联系管理员!'
        })
      }
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
      },
      fail: ((err) => {
        console.log(err)
        this.setData({})
      }),
      complete: (() => {
        my.hideNavigationBarLoading();
      })
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
      },
      fail: ((err) => {
        console.log(err)
        this.setData({})
      }),
      complete: (() => {
        console.log(1234)
        my.hideNavigationBarLoading();
      })
    });
  }
});
