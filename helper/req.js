const api = require('./apis');

const baseURL = 'https://www.koocv.com';

let get = (op={})=>{
  return api.request({
      url: baseURL + op.path,
    ...op,
    method: 'GET'
  }).then(res=>res.data)
}

let post = (op={})=>{
  if(!op.header) op.header = {}
  return api.request({
    url: baseURL + op.path,
    ...op,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...op.header
    },
    method: 'POST'
  }).then(res=>res.data);
};


exports.getShops = (data={},q)=>{
  return post({
    path: `/article/shoplist?page=${q.page}&rows=${q.rows}`,
    data
  })
};

exports.getShopDetail = id =>{
  return get({
    path: '/article/detail',
    data: {id}
  })
}

exports.login = (userInfo)=>{
  return api.login()
  .then(res=>{
    return get({
      url: 'https://wx.miaov.com/login',
      header: {
        'X-WX-Code': res.code,
        'X-WX-Encrypted-Data': userInfo.encryptedData,
        'X-WX-IV': userInfo.iv,
      }
    })
  })
  .then(res=>{
    if(res.code===0){
      wx.setStorageSync('userInfo', res.data.userinfo);
      return res.data.userinfo;
    }else{
      throw res;
    }
  })
};

exports.checkFav = ({open_id, article_id}={})=>{
  return post({
    path: '/fav/getfavid',
    data: {
      open_id,
      article_id
    }
  })
}

exports.addFav = ({open_id, article_id}={})=>{
  return post({
    path: '/fav/addfav',
    data: {
      open_id,
      article_id
    }
  });
}
exports.delFav = ({open_id, article_id,fav_id}={})=>{
  return post({
    path: '/fav/delfav',
    data: {
      open_id,
      article_id,
      fav_id
    }
  });
}

exports.getFav = (open_id)=>{
  return post({
    path: '/fav/getlist',
    data: {open_id}
  })
}
