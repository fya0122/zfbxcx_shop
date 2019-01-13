const app = getApp()
Page({
  data: {
    titleName: '',
    list: []
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
          this.setData({
            list: res.data.data.map(item => {
              return {
                catId: item.catId,
                cover: item.cover,
                tagList: item.tagList.slice(0, 4),
                priceDiscountYuan: item.priceDiscountYuan,
                likeCounts: item.likeCounts
              }
            })
          })
        } else {
          this.setData({
            list: []
          })
        }
      },
      fail: ((err) => {
        console.log(err)
        this.setData({
          list: []
        })
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
          this.setData({
            list: res.data.data.map(item => {
              return {
                catId: item.catId,
                cover: item.cover,
                tagList: item.tagList.slice(0, 2),
                priceDiscountYuan: item.priceDiscountYuan,
                likeCounts: item.likeCounts
              }
            })
          })
        } else {
          this.setData({
            list: []
          })
        }
      },
      fail: ((err) => {
        console.log(err)
        this.setData({
          list: []
        })
      }),
      complete: (() => {
        my.hideNavigationBarLoading();
      })
    });
  }
});
