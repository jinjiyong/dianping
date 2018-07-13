const api = require('../../helper/apis.js');
const req = require('../../helper/req.js');

const app = getApp()

Page({
  data: {
    guessLike: [],
    page: 0,
    isLoading: false,
    isAll: false
  },
  onLoad() {
    this.getData();
  },
  getMore() {
    this.getData();
  },
  getData() {
    const { guessLike, page, isLoading, isAll } = this.data;
    if (isLoading || isAll) {
      return;
    }
    this.setData({
      page: page + 1,
      isLoading: true
    });
    req.getShops({}, {
      page: this.data.page,
      rows: 10
    })
    .then(res => {
      if (res.length) {
        this.setData({
          guessLike: [...guessLike, ...res],
          isLoading: false
        })
      }
      if (res.error) {
        this.setData({
          isLoading: false,
          isAll: true
        });
      }
    })
  }
})
