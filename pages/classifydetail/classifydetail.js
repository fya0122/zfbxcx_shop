const app = getApp()
Page({
  data: {},
  onLoad(e) {
    const id = e.id
    if (id) {
      this._getSpecificDataById(id) // 根据id获取具体的某个detail
    }
  },
  _getSpecificDataById (id) {
    my.httpRequest({
      url: app.baseServerUrl + '/items/searchById',
      data: {
        itemId: id
      },
      method: 'POST',
      success: ((res) => {
        if (res.data.status === 200 && res.data.msg === 'OK' && res.data.data) {
          console.log(res.data.data)
        }
      }),
      fail: ((err) => {
        console.log(err)
      })
    });
  }
});
