<template>
  <v-list class="px-4">
    <v-divider />
    <v-list-item>
      <v-list-item-content class="ml-5">
        <v-list-item-title>
          <span class="font-weight-bold font-weight-medium">
            {{ headers[0].text }}
          </span>
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item style="min-width: calc(100% - 185px);position: absolute;right: 0px;">
        <v-list-item-content
          v-for="(header, index) in headers"
          v-show="index>0"
          :key="index"
        >
          <v-list-item-title :class="[`text-lg-` + header.align ]">
            <span class="font-weight-bold font-weight-medium">
              {{ header.text }}
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item>
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      height="2"
      color="primary"
    />
    <v-list-item v-if="loading">
      <v-list-item-content>
        <v-list-item-title class="text-lg-center">
          <span class="font-weight-bold font-weight-medium">
            加载中
          </span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-treeview
      ref="treeView"
      class="treeTb"
      transition
      :items="items"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-slot:prepend="{item}">
        <v-list-item dense>
          <v-list-item-content>
            <v-list-item-title :class="['pb-1 text-lg-center']">
              {{ item[headers[0].value] }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:label="{ item}">
        <v-list-item dense>
          <v-list-item-content
            v-for="(header, index) in headers"
            v-show="index>0"
            :key="index"
          >
            <v-list-item-title :class="['pb-1',`text-lg-` + header.align]">
              <slot :item="item" :name="'item.'+header.value">
                {{ item[header.value] }}
              </slot>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-treeview>
  </v-list>
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
    }
  },
  data() {
    return {
      loading: true
    }
  },
  watch: {
    items(newVal, oldVal) {
      this.loading = false
    }
  },
  methods: {
    updateAll(openAll) {
      this.$refs.treeView.updateAll(openAll)
    }
  }
}
</script>

<style scoped>
    .treeTb >>> .v-treeview-node__root {
        border-top: 1px solid #0000001f;
        border-bottom: 1px solid #0000001f;
        border-bottom-width: 0px;
    }

    .treeTb >>> .v-treeview-node__label {
        min-width: calc(100% - 185px);
        position: absolute;
        right: 0px;
    }
</style>
