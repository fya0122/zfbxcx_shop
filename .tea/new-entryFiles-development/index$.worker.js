
require('./config$.js?appxworker=1');
require('./importScripts$.js?appxworker=1');
function success() {
require('../..//app.js?appxworker=1');
require('../../components/choosecity/choosecity.js?appxworker=1');
require('../../components/classifyitem/classifyitem.js?appxworker=1');
require('../../pages/my/my.js?appxworker=1');
require('../../pages/index/index.js?appxworker=1');
require('../../pages/addressinfo/addressinfo.js?appxworker=1');
require('../../pages/addresslist/addresslist.js?appxworker=1');
require('../../pages/cart/cart.js?appxworker=1');
require('../../pages/classify/classify.js?appxworker=1');
require('../../pages/classifylist/classifylist.js?appxworker=1');
require('../../pages/classifydetail/classifydetail.js?appxworker=1');
require('../../pages/confirmorder/confirmorder.js?appxworker=1');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
