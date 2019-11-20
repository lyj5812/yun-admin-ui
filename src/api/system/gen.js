import request from '@/utils/request'

export function linkDB(data) {
  return request({
    url: '/gen-server/gen/linkDB',
    method: 'post',
    data
  })
}

export function genCode(data) {
  return request({
    url: '/gen-server/gen/genCode',
    method: 'post',
    responseType: 'arraybuffer',
    data
  }).then((response) => {
    // 处理文件流
    const blob = new Blob([response.data], { type: 'application/zip' })
    const filename = '生成代码.zip'
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    window.setTimeout(function() {
      URL.revokeObjectURL(blob)
      document.body.removeChild(link)
    }, 0)
  })
}
