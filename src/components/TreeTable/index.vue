<template>
  <div class="px-4">
    <v-list-item class="px-2 mb-n5">
      <v-divider />
    </v-list-item>
    <v-list-item>
      <v-list-item-content
        v-for="(header, index) in headers"
        :key="index"
      >
        <v-list-item-title :class="`text-lg-` + header.align">
          <span class="font-weight-bold font-weight-medium">
            {{ header.text }}
          </span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      color="primary"
    />
    <v-list-item v-if="loading">
      <v-list-item-content>
        <v-list-item-title :class="`text-lg-center`">
          <span class="font-weight-bold font-weight-medium">
            加载中
          </span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-treeview
      :search="search"
      :filter="filter"
      :open-all="openAll"
      class="treeTb"
      transition
      :items="items"
      :item-key="itemKey"
      :open.sync="opens"
    >
      <template v-slot:label="{ item ,leaf,open}">
        <v-divider />
        <v-list-item dense>
          <v-list-item-content
            v-for="(header, index) in headers"
            :key="index"
          >
            <v-list-item-title :class="[`text-lg-` + header.align,'pb-1']">
              <span :class="[index===0?'span':'']">
                <v-btn v-if="index===0&&!leaf&&!open" text icon @click="openAndClose(item)">
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-btn>
                <v-btn v-if="index===0&&!leaf&&open" text icon @click="openAndClose(item)">
                  <v-icon>keyboard_arrow_down</v-icon>
                </v-btn>
                <slot :item="item" :name="'item.'+header.value">
                  {{ item[header.value] }}
                </slot>
              </span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </template>
    </v-treeview>
  </div>

</template>

<script>
export default {
  name: 'TreeTable',
  props: {
    items: {
      type: Array,
      default: function() {
        return []
      }
    },
    headers: {
      type: Array,
      default: function() {
        return []
      }
    },
    openAll: {
      type: Boolean,
      default: false
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    filter: {
      type: Function,
      default: null
    },
    search: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      opens: [],
      loading: true
    }
  },
  watch: {
    items(newVal, oldVal) {
      this.loading = false
    }
  },
  methods: {
    openAndClose(item) {
      if (this.opens.find((element) => (element === item[this.itemKey]))) {
        this.opens.splice(this.opens.findIndex(element => element === item[this.itemKey]), 1)
      } else {
        this.opens.push(item[this.itemKey])
      }
    }
  }
}
</script>

<style scoped>
    .treeTb >>> .v-treeview-node {
        margin-left: 0px !important;
    }

    .treeTb >>> .v-treeview-node--leaf>.v-treeview-node__root {
        padding-left: 0px;
        padding-right: 8px;
    }

    .treeTb >>> .v-treeview-node__children .span {
        margin-left: 50px !important;
    }

    .treeTb >>> .v-treeview-node__children .v-treeview-node__children .span {
        margin-left: 100px !important;
    }

    .treeTb >>> .v-treeview-node__children .v-treeview-node__children .v-treeview-node__children .span {
        margin-left: 150px !important;
    }

    .treeTb >>> .v-treeview-node__children .v-treeview-node__children .v-treeview-node__children .v-treeview-node__children .span {
        margin-left: 200px !important;
    }

    .treeTb >>> .v-treeview-node__children .v-treeview-node__children .v-treeview-node__children .v-treeview-node__children .v-treeview-node__children .span {
        margin-left: 250px !important;
    }

    .treeTb >>> .v-treeview-node__toggle.v-icon.v-icon.v-icon--link {
        display: none;
    }

    .treeTb >>> .v-treeview-node__label .v-icon {
        padding-right: 0px;
    }
</style>
