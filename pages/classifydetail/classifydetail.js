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
      })
      setTimeout(() => {
        this.animation.rotate(0).translateX(0).step({
          duration: 0
        });
        this.setData({
          animationInfo: this.animation.export()
        })
      }, 550)
    }, 600)
  },
  // 放入购物车
  cartItemIncrease (id) {
    const shoppingCart = my.getStorageSync({ key: 'cart_item_id_array' }).data
    if (shoppingCart !== null && shoppingCart !== undefined) {
      const result = this.checkMyArr(shoppingCart, id)
      if (result === true) {
        for (const item of shoppingCart) {
          if (item.id === id) {
            item.counts = item.counts + 1
          }
        }
        my.setStorageSync({
          key: 'cart_item_id_array',
          data: shoppingCart
        })
      } else if (result === false) {
        shoppingCart.push(app.cartItem(id, 1))
        my.setStorageSync({
          key: 'cart_item_id_array',
          data: shoppingCart
        })
      }
    } else {
      const myArr = []
      myArr.push(app.cartItem(id, 1))
      my.setStorageSync({
        key: 'cart_item_id_array',
        data: myArr
      })
    }
    // if (shoppingCart.data.length) {
    //   for (const item of shoppingCart.data) {
    //     if (item.id === id) {
    //       item.counts = item.counts + 1
    //       my.setStorageSync({
    //         key: 'cart_item_id_array',
    //         data: shoppingCart
    //       })
    //     }
    //   }
    //   shoppingCart.data.push(app.cartItem(id, 1))
    //   my.setStorageSync({
    //     key: 'cart_item_id_array',
    //     data: shoppingCart
    //   })
    // } else {
    //   const myArray = []
    //   const yourCart = app.cartItem(id, 1)
    //   myArray.push(yourCart)
    //   my.setStorageSync({
    //     key: 'cart_item_id_array',
    //     data: myArray
    //   })
    // }
  },
  // 判断是否存在这个数组呢
  checkMyArr (arr, id) {
    for (const item of arr) {
      if (item.id === id) {
        return true
      }
    }
    return false
  }
});
