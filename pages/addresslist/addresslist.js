Page({
  data: {},
  onLoad() {},
  selectradioaddress (e) {
    console.log(e)
    console.log(123)
  },
  goToAddress () {
    my.navigateTo({
      url: '../addressinfo/addressinfo'
    });
  }
});
