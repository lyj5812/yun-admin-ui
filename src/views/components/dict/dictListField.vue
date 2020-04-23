<template>
  <v-select
    v-model="value"
    :items="items"
    class="small"
    outlined
    :clearable="clearable"
    item-text="dictName"
    item-value="dictType"
    label="字典类型"
    v-bind="$attrs"
    hide-details
    :menu-props="{ offsetY: true }"
    @input="dictChange()"
  />
</template>

<script>
import { dictTypeList } from '@/api/system/dict'
export default {
  name: 'DictListField',
  inheritAttrs: false,
  model: {
    prop: 'dictType',
    event: 'selected'
  },
  props: {
    dictType: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      items: [],
      value: null
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.$emit('selected', this.value)
    },
    dictType(newVal, oldVal) {
      this.value = newVal
    }
  },
  created() {
    this.value = this.dictType
    this.getDictTypeList()
  },
  methods: {
    getDictTypeList() {
      dictTypeList().then(res => {
        this.items = res.data.data
      })
    },
    dictChange() {
      this.$emit('selected', this.value)
    }
  }
}
</script>

<style scoped>

</style>
