<template>
  <v-layout v-if="pageData.total>0" class="page" justify-center pa-3 row>
    <span class="mt-3 page-total hidden-sm-and-down">共{{ pageData.total }}条</span>
    <v-select
      v-model="pagination.pageSize"
      :items="pageSizeObjs"
      outlined
      dense
      :menu-props="{ offsetY: true }"
      hide-details
      class="small page-select ml-3 mt-1 hidden-sm-and-down"
      @input="pageSizeChange()"
    />
    <span>
      <v-pagination
        v-model="pageData.current"
        :length="pageData.pages"
        @input="pageChange()"
      />
    </span>

    <span class="mt-3 page-total ml-5 hidden-sm-and-down">到</span>
    <v-text-field
      v-model="pagination.pageNum"
      outlined
      hide-details
      class="small page-go mt-1 ml-2 hidden-sm-and-down"
      @keyup.enter="toPage()"
    />
    <span class="mt-3 page-total ml-2 hidden-sm-and-down">页</span>
  </v-layout>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    pageData: {},
    pageSizes: null
  },
  data() {
    return {
      pagination: {
        pageNum: 1,
        pageSize: 10
      },
      pageSizeObjs: []
    }
  },
  computed: {
    paginationChange() {
      return this.pageData.current
    }
  },
  watch: {
    paginationChange() {
      this.pagination.pageNum = this.pageData.current
    },
    pageData(newVal, oldVal) {
      if (newVal.records.length < 1 && newVal.pages > 0) {
        this.pageData.current = this.pageData.current - 1
        this.pageChange()
      }
    }
  },
  mounted() {
    this.pageSizeFormat()
  },
  methods: {
    toPage() {
      const re = /^[0-9]+$/
      if (re.test(this.pagination.pageNum) && this.pagination.pageNum <= this.pageData.pages) {
        this.pageData.current = parseInt(this.pagination.pageNum)
        this.pageChange()
      } else {
        this.pagination.pageNum = this.pageData.current
      }
    },
    pageSizeChange() {
      this.pageData.current = 1
      this.pageChange()
    },
    pageSizeFormat() {
      const temp = this.pageSizes || [10, 20, 30]
      temp.forEach(value => {
        const obj = {
          text: value + '条/页',
          value: value
        }
        this.pageSizeObjs.push(obj)
      })
      this.pagination.pageSize = temp[0]
    },
    pageChange() {
      const page = {
        current: this.pageData.current,
        size: this.pagination.pageSize
      }
      this.$emit('pageChange', page)
    }
  }
}
</script>

<style scoped lang="scss">
  $page-font-size:13px;
  .page{
    .page-total{
      font-size: $page-font-size;
    }
    .page-select{
      max-width: 100px !important;
    }
    .page-go{
      max-width: 40px !important;
    }
  }
</style>
