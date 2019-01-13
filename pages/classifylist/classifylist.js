Page({
  data: {},
  onLoad(e) {
    const searchtype = e.searchtype
    if (searchtype === 'words') {
      console.log(e.searchvalue)
    } else if (searchtype === 'cat') {
      console.log(e.catid)
      console.log(e.name)
    }
  },
});
