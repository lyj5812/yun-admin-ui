import request from '@/utils/request'

export function getTableList(sourceId) {
  return request({
    url: `/gen-server/table/list/${sourceId}`,
    method: 'get'
  })
}

export function genCode(sourceId, data) {
  return request({
    url: `/gen-server/gen/${sourceId}`,
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

export function addSource(data) {
  return request({
    url: '/gen-server/source/add',
    method: 'post',
    data
  })
}

export function getSourceList() {
  return request({
    url: '/gen-server/source/list',
    method: 'get'
  })
}

export function getTableInfo(data) {
  return request({
    url: `/gen-server/table/info/${data.sourceId}/${data.tableName}`,
    method: 'get'
  })
}

export function editTableInfo(sourceId, tableName, data) {
  return request({
    url: `/gen-server/table/edit/${sourceId}/${tableName}`,
    method: 'put',
    data
  })
}
