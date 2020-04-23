<template>
  <v-card>
    <uploader
      ref="uploader"
      :options="options"
      :file-status-text="statusText"
      class="uploader-example"
      @file-complete="fileComplete"
      @complete="complete"
    >
      <uploader-unsupport />
      <uploader-drop>
        <p>文件上传</p>
        <uploader-btn class="v-btn--contained theme--dark v-size--default primary">
          <v-icon class="mr-1">mdi-cloud-upload</v-icon>选择文件
        </uploader-btn>
        <uploader-list>
          <div slot-scope="props" class="file-panel mt-3">
            <div class="file-list pa-2">
              <div v-for="file in props.fileList" :key="file.id">
                <uploader-file ref="files" :class="'file_' + file.id" :file="file" :list="true" />
              </div>
              <div v-if="!props.fileList.length" class="no-file">
                <v-icon>add</v-icon>
                暂无待上传文件
              </div>
            </div>
          </div>
        </uploader-list>
      </uploader-drop>

    </uploader>
  </v-card>
</template>

<script>
import store from '@/store'
import request from '@/utils/request'
export default {
  data() {
    return {
      options: {
        target: process.env.VUE_APP_BASE_API + '/admin-server/upload/chunk',
        testChunks: true,
        simultaneousUploads: 1,
        chunkSize: 10 * 1024 * 1024,
        headers: {
          Authorization: 'Bearer ' + store.state.user.token
        }
      },
      attrs: {
        accept: 'image/*'
      },
      statusText: {
        success: '上传成功',
        error: '出错了',
        uploading: '上传中',
        paused: '暂停中',
        waiting: '等待中'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.uploader = this.$refs.uploader.uploader
    })
  },
  methods: {
    // 上传完成
    complete() {
      this.$message.success('上传成功')
    },
    // 一个根文件（文件夹）成功上传完成。
    fileComplete(rootFile) {
      request({
        url: '/admin-server/upload/mergeFile',
        method: 'post',
        data: {
          filename: rootFile.name,
          identifier: rootFile.uniqueIdentifier,
          totalSize: rootFile.size,
          type: rootFile.type
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss">

    .file-panel {
        background-color: #fff;
        border: 1px solid #e2e2e2;
        border-radius: 7px 7px 0 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, .2);

        .file-title {
            display: flex;
            height: 40px;
            line-height: 40px;
            padding: 0 15px;
            border-bottom: 1px solid #ddd;

            .operate {
                flex: 1;
                text-align: right;
            }
        }

        .file-list {
            position: relative;
            height: 240px;
            overflow-x: hidden;
            overflow-y: auto;
            background-color: #fff;

            > li {
                background-color: #fff;
            }
        }
    }

    .no-file {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
    }

    .uploader-file-icon {
        &:before {
            content: '' !important;
        }

        &[icon=image] {
            background: url(../../assets/img/uploader/image-icon.png);
        }
        &[icon=video] {
            background: url(../../assets/img/uploader/video-icon.png);
        }
        &[icon=document] {
            background: url(../../assets/img/uploader/text-icon.png);
        }
        &[icon=unknown] {
            background: url(../../assets/img/uploader/unknown-icon.png);
        }
    }

    .uploader-drop {
        position: relative;
        padding: 10px;
        overflow: hidden;
        border: 1px dashed #ccc;
        background-color: white;
    }

    .uploader-file-actions > span {
        margin-right: 6px;
    }
</style>
