const app = getApp()
Page({
  data: {
    cats: []
  },
  onLoad() {
    my.showNavigationBarLoading()
    this._getCatsData() // 获取分类页面的数据
  },
  _getCatsData () {
    my.httpRequest({
      url: app.baseServerUrl + '/cats',
      method: 'POST',
      success: ((res) => {
        if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
          this.setData({
            cats: res.data.data.map((item) => {
              return {
                code: item.code.toLowerCase(),
                id: item.id,
                name: item.name
              }
            })
          })
        }
      }),
      fail: ((err) => {
        console.log(err)
        this.setData({
          cats: []
        })
      }),
      complete: (() => {
        my.hideNavigationBarLoading();
      })
    });
  },
  searchItems (e) {
    const value = e.detail.value
    if (value === null) {
      return
    }
    if (value === undefined) {
      return
    }
    my.navigateTo({
      url: '../classifylist/classifylist?searchtype=words&searchvalue=' + value
    });
  },
  // 点击图标的时候
  ontapItems (e) {
    const id = e.target.dataset.id
    const name = e.target.dataset.name
    console.log(id)
    console.log(name)
    if (name) {
      my.navigateTo({
        url: `../classifylist/classifylist?searchtype=cat&catid=${id}&name=${name}`
      });
    }
  }
});
