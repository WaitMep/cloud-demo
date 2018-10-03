class HTTP {
  request({
    url,
    data = {},
    method = 'GET',
    header = {}
  }) {
    return new Promise((resolve, reject) => {
      this._request(url, resolve, reject, data, method, header)
    })
  }
  _request(url, resolve, reject, data, method, header){
    wx.request({
      url: url,
      data: data,
      header: header,
      method: method,
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => { 
        reject(err)
      }
    })
  }
}

export {
  HTTP
}