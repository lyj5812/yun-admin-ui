import store from '@/store'
class MyUploadAdapter {
  constructor(loader) {
    // 要在上载期间使用的文件加载器实例
    this.loader = loader
  }
  // 启动上载过程
  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        this._initRequest()
        this._initListeners(resolve, reject, file)
        this._sendRequest(file)
      }))
  }
  // 中止上载过程
  abort() {
    if (this.xhr) {
      this.xhr.abort()
    }
  }
  // 使用传递给构造函数的URL初始化XMLHttpRequest对象.
  _initRequest() {
    const xhr = this.xhr = new XMLHttpRequest()
    xhr.open('POST', process.env.VUE_APP_BASE_API + '/admin-server/upload/aliyun/oss', true)
    xhr.setRequestHeader('Authorization', 'Bearer ' + store.state.user.token)
    xhr.responseType = 'json'
  }
  // 初始化 XMLHttpRequest 监听.
  _initListeners(resolve, reject, file) {
    const xhr = this.xhr
    const loader = this.loader
    const genericErrorText = `无法上传文件: ${file.name}.`
    xhr.addEventListener('error', () => reject(genericErrorText))
    xhr.addEventListener('abort', () => reject())
    xhr.addEventListener('load', () => {
      const response = xhr.response
      // 当code＝＝200说明上传成功，可以增加弹框提示；
      // 当上传失败时，必须调用reject()函数。
      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText)
      }
      // 上传成功，从后台获取图片的url地址
      resolve({
        default: response.data
      })
    })

    // 支持时上传进度。文件加载器有#uploadTotal和#upload属性，用于在编辑器用户界面中显示上载进度栏。
    if (xhr.upload) {
      xhr.upload.addEventListener('progress', evt => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total
          loader.uploaded = evt.loaded
        }
      })
    }
  }
  // 准备数据并发送请求
  _sendRequest(file) {
    // 通过FormData构造函数创建一个空对象
    const data = new FormData()
    // 通过append()方法在末尾追加key为files值为file的数据，就是你上传时需要传的参数，需要传更多参数就在下方继续append
    data.append('file', file)// 上传的参数data
    // data.append( 'memberId', "666" );
    /**
     * 重要提示:这是实现诸如身份验证和CSRF保护等安全机制的正确位置。
     * 例如，可以使用XMLHttpRequest.setRequestHeader()设置包含应用程序先前生成的CSRF令牌的请求头。
     */
    this.xhr.send(data)
  }
}

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // 在这里将URL配置为后端上载脚本
    return new MyUploadAdapter(loader)
  }
}

export {
  MyUploadAdapter,
  MyCustomUploadAdapterPlugin
}
