<template>
  <v-row no-gutters>
    <v-col cols="12" xs="12">
      <v-select
        v-if="required"
        v-model="value"
        :items="items"
        class="small"
        outlined
        clearable
        :rules="[v => !!v || '请输入状态!']"
        item-text="dictLabel"
        item-value="dictValue"
        :label="dictName"
        hide-details
        :menu-props="{ offsetY: true }"
        @input="dictChange()"
      >
        <template #prepend>
          <small class="red-text my-4">*</small>
        </template>
      </v-select>
      <v-select
        v-else
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
    </v-col>
  </v-row>
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
    dictValue: {
      type: String,
      default: null
    },
    dictType: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
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
