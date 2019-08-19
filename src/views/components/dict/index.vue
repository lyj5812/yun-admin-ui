<template>
  <v-layout>
    <v-flex xs12>
      <v-select
        v-model="value"
        :items="items"
        class="small"
        outlined
        clearable
        item-text="dictLabel"
        item-value="dictValue"
        :label="dictName"
        hide-details
        :menu-props="{ offsetY: true }"
        @input="dictChange()"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { dictDataList, dictType } from '@/api/system/dict'
export default {
  name: 'Dict',
  model: {
    prop: 'dictValue',
    event: 'selected'
  },
  props: {
    dictValue: null,
    dictType: null
  },
  data() {
    return {
      items: [],
      dictName: null,
      value: null
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.$emit('selected', this.value)
    },
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
      dictDataList(this.dictType).then(res => {
        this.items = res.data.data
      })
    },
    getDictType() {
      dictType(this.dictType).then(res => {
        this.dictName = res.data.data.dictName
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
