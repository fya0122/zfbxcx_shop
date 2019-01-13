const app = getApp()
Page({
  data: {
    cats: []
  },
  onLoad() {
    this._getCatsData()
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
      })
    });
  }
});
