<template>
  <v-row no-gutters>
    <v-col cols="12" xs="12">
      <v-select
        v-if="required"
        v-model="value"
        :items="items"
        class="small"
        outlined
        :clearable="clearable"
        :rules="[v => !!v || '请输入状态!']"
        item-text="dictLabel"
        item-value="dictValue"
        label="字典类型"
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
        :clearable="clearable"
        item-text="dictName"
        item-value="dictType"
        label="字典类型"
        hide-details
        :menu-props="{ offsetY: true }"
        @input="dictChange()"
      />
    </v-col>
  </v-row>
</template>

<script>
import { dictTypeList } from '@/api/system/dict'
export default {
  name: 'DictListField',
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
