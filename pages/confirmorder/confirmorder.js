Page({
  data: {},
  onLoad() {
    const data = my.getStorageSync({ key: 'pcart_item_id_array' }).data;
    console.log(data)
  },
});
