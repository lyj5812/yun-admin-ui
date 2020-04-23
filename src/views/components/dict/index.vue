<template>
  <v-select
    v-model="value"
    :items="items"
    v-bind="$attrs"
    item-text="dictLabel"
    item-value="dictValue"
    :label="dictName"
    :menu-props="{ offsetY: true }"
    v-on="$listeners"
  />
</template>

<script>
import { dictDataList, dictType } from '@/api/system/dict'
export default {
  name: 'Dict',
  inheritAttrs: false,
  props: {
    dictValue: {
      type: String,
      default: null
    },
    dictType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      items: [],
      dictName: null,
      value: null
    }
  },
  watch: {
    dictValue(newVal, oldVal) {
      this.value = newVal
    }
  },
  created() {
    this.value = this.dictValue
    this.getDictDataList()
    this.getDictType()
  },
  methods: {
    getDictDataList() {
      dictDataList({ dictType: this.dictType }).then(res => {
        this.items = res.data.data
      })
    },
    getDictType() {
      dictType(this.dictType).then(res => {
        this.dictName = res.data.data.dictName
      })
    }
  }
}
</script>

<style scoped>

</style>
