const api = require('../../helper/apis.js');
const req = require('../../helper/req.js');

// 实例化API核心类
const qqmapsdk = new api.createQQMap();

Page({
  data: {
    info: {},
    address: '',
    distance: 0
  },
  onLoad(query) {
    req.getShopDetail(query.id)
    .then(res => {
      if (!res.error){
        this.setData({
          info: res.info
        });
        return {
          latitude: res.info.lat,
          longitude: res.info.lng
        }
      }else {
        throw '获取商铺详情失败'
      }
    })
    .then(location => {
      return Promise.all([
        qqmapsdk.reverseGeocoder({ location }),
        api.getLocation({
          type: 'gcj02'
        }),
        location
      ])
    })
    .then(([shopAddress, myLocation, toLocation]) => {
      if (shopAddress.status === 0){
        this.setData({
          address: shopAddress.result.address
        });
      }
      let from = {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude
      }
      return qqmapsdk.calculateDistance({
        from,
        // to: [toLocation]
        to: [{
          latitude: 39.9 + Math.random()/10,
          longitude: 116.3 + Math.random() / 10
        }]
      })
      .then(res => {
        this.setData({
          distance: Math.floor(res.result.elements[0].distance)
        });
      })
      .catch(err => {
        console.log(err);
      })
    });
    
  }
})