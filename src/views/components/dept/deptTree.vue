<template>
  <v-card flat>
    <v-row
      class="pa-3"
    >
      <v-col cols="12" lg="12" xs="12">
        <v-text-field
          v-model="search"
          dense
          label="搜索"
          placeholder="搜索"
          outlined
          prepend-inner-icon="search"
          :append-outer-icon="openAll?'vertical_align_center':'swap_vert'"
          clearable
          @click:append-outer="opneOrCloseAll()"
        />
        <v-treeview
          v-model="treeTmp"
          :items="depts"
          :open.sync="open"
          :search="search"
          open-all
          :filter="filter"
          item-key="deptId"
          item-text="deptName"
          activatable
          :selectable="selectable"
          selected-color="primary"
          active-class="primary--text"
          class="lighten-5"
          :active.sync="active"
          transition
        >
          <template v-slot:label="{ item }">

            <v-row class="body-1 font-weight-medium" @click="selectdItem(item)">
              <v-col xs="8" md="8">
                &nbsp;
                <v-icon
                  v-if="item.ancestors.split(',').length==1"
                  size="22"
                  :color="active ? 'primary' : ''"
                >
                  location_city
                </v-icon>
                <v-icon
                  v-if="item.ancestors.split(',').length==2"
                  size="22"
                  :color="active ? 'primary' : ''"
                >
                  domain
                </v-icon>
                <v-icon
                  v-if="item.ancestors.split(',').length==3"
                  size="22"
                  :color="active ? 'primary' : ''"
                >
                  account_balance
                </v-icon>
                <v-icon
                  v-if="item.ancestors.split(',').length>3"
                  size="22"
                  :color="active ? 'primary' : ''"
                >
                  fa-bank
                </v-icon>
                {{ item.deptName }}
              </v-col>
            </v-row>
          </template>
        </v-treeview>
        <v-overlay absolute :value="dataFlag">
          <v-progress-circular indeterminate color="primary" />
        </v-overlay>

      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { deptList } from '@/api/system/dept'

export default {
  name: 'DeptTree',
  model: {
    prop: 'tree',
    event: 'selectNode'
  },
  props: {
    tree: {
      type: String,
      default: null
    },
    selectable: {
      type: Boolean,
      default: false
    },
    openFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      active: [],
      open: [],
      treeTmp: [],
      dataFlag: true,
      search: null,
      caseSensitive: false,
      deptIds: [],
      openAll: false,
      depts: []
    }
  },
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    }

  },
  watch: {
    treeTmp(newVal, oldVal) {
      this.$emit('selectNode', this.treeTmp)
    },
    tree(newVal, oldVal) {
      this.treeTmp = (newVal == null ? [] : newVal)
    },
    open(newVal, oldVal) {
      this.openAll = newVal.length === this.deptIds.length && newVal.every(a => this.deptIds.some(b => a === b)) && this.deptIds.every(_b => newVal.some(_a => _a === _b))
    }
  },
  created() {
    this.getDeptList()
  },

  methods: {
    /**
     * 部门树数据
     */
    getDeptList() {
      deptList().then(res => {
        this.depts = res.data.data
        this.dataFlag = false
        this.opneOrClose()
        if (this.openFlag) {
          this.open = this.deptIds
        } else {
          this.openAll = false
        }
      }).catch(() => {

      })
    },
    selectdItem(item) {
      // 直接等于是引用,dept改变,item会跟着改变...
      const dept = JSON.parse(JSON.stringify(item))
      this.$emit('clickNode', dept)
    },
    opneOrClose() {
      this.recursionDept(this.deptIds, this.depts)
    },
    opneOrCloseAll() {
      if (this.openAll) {
        this.open = []
      } else {
        this.open = this.deptIds
      }
    },
    recursionDept(deptIds, dept) {
      dept.forEach(item => {
        if (item.children) {
          deptIds.push(item.deptId)
          this.recursionDept(deptIds, item.children)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
