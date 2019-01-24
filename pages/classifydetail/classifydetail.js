const app = getApp()
Page({
  data: {
    currentObj: {},
    animationInfo: {}, // 动画对象，默认为{}，但在onShow已经进行了实例化
    animationOpacity: 0, // 透明度
    cartIco: 'cart-empty'
  },
  onLoad(e) {
    const id = e.id
    if (id) {
      this._getSpecificDataById(id) // 根据id获取具体的某个detail
    }
  },
  onShow() {
    // 创建一个动画实例
    let animation = my.createAnimation({})
    this.setData({
      animationInfo: animation.export()
    })
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
  },
  // 加入购物车
  addToCart (e) {
    this.setData({
      animationOpacity: 1
    })
    this.showAddToCartAnimation() // 动画

    // 商品id存入缓存购物车
    const id = e.target.dataset.id
    this.cartItemIncrease(id)
  },
  // 实现动画效果
  showAddToCartAnimation () {
    let animation = my.createAnimation({
      duration: 600
    })
    this.animation = animation
    // 动作（旋转的同时+又在水平上面偏移）
    this.animation.rotate(-180).translateX('296rpx').step();
    this.setData({
      animationInfo: animation.export()
    })
    // 点击完了以后，万一还想再点击的话，我们依旧可以有动画的(复原动画)
    setTimeout(() => {
      this.setData({
        animationOpacity: 0,
        cartIco: 'cart-full'
      }, () => {
        setTimeout(() => {
          this.animation.rotate(0).translateX(0).step({
            duration: 0
          });
          this.setData({
            animationInfo: this.animation.export()
          })
        }, 550)
      })
    }, 600)
  },
  // 放入购物车
  cartItemIncrease (id) {
    let shoppingCart = my.getStorageSync({ key: 'cart_item_id_array' }).APDataStorage || my.getStorageSync({ key: 'cart_item_id_array' }).data
    if (shoppingCart !== null && shoppingCart !== undefined) { // 本地有这个购物车
      shoppingCart = JSON.parse(shoppingCart)
      const result = shoppingCart.find(e => e.id === id)
      if (result) { // 如果购物车有这个id，那么这个id的数量+1
        result.counts = result.counts + 1
        console.log('Hello World.')
        console.log(shoppingCart)
        my.setStorageSync({
          key: 'cart_item_id_array',
          data: JSON.stringify(shoppingCart)
        })
      } else { // 代表这个购物车没有这个id，让这个商品的数量为1
        shoppingCart.push(app.cartItem(id, 1))
        my.setStorageSync({
          key: 'cart_item_id_array',
          data: JSON.stringify(shoppingCart)
        })
      }
    } else { // 代表没有购物车，那么我们创建个空的数组，代表购物车，并且，你点击的那个id的数量为1
      const myArr = []
      myArr.push(app.cartItem(id, 1))
      my.setStorageSync({
        key: 'cart_item_id_array',
        data: JSON.stringify(myArr)
      })
    }
  },
  // 跳转至购物车
  gotocart () {
    my.switchTab({
      url: '../cart/cart'
    })
  },
  // 购买
  goToBuy () {
    const currentObj = this.data.currentObj
    let buyObj = {
      catId: currentObj.catId,
      content: currentObj.content,
      cover: currentObj.cover,
      discounts: currentObj.discounts,
      id: currentObj.id,
      likeCounts: currentObj.likeCounts,
      name: currentObj.name,
      priceDiscountYuan: currentObj.priceDiscountYuan,
      priceNormalYuan: currentObj.priceNormalYuan,
      sellCounts: currentObj.sellCounts,
      tagList: currentObj.tagList,
      counts: 1
    }
    let pcart_item_id_array = []
    pcart_item_id_array.push(buyObj)
    my.setStorageSync({ key: 'pcart_item_id_array', data: JSON.stringify(pcart_item_id_array) })
    my.navigateTo({ url: '../confirmorder/confirmorder' })
  }
});
