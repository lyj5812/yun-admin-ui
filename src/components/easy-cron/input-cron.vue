<template>
  <v-layout
    row
    wrap
  >
    <v-text-field
      v-model="editCronValue"
      :rules="validator"
      label="Cron表达式"
      :disabled="disabled"
    >
      <template v-slot:append-outer>
        <v-layout
          row
          wrap
        >
          <v-flex
            xs12
            md12
          >
            <v-btn outline small :disabled="disabled" color="indigo" @click="showConfigDlg">
              <v-icon>edit</v-icon>配置</v-btn>
          </v-flex>
        </v-layout>
      </template>
    </v-text-field>
    <v-dialog v-model="show" :max-width="`${width+50}`">
      <easy-cron
        v-model="editCronValue"
        :style="`width: ${width}px`"
        :exe-start-time="exeStartTime"
        :hide-year="hideYear"
        :remote="remote"
      />
    </v-dialog>
  </v-layout>
</template>

<script>
import EasyCron from './index'
import CronValidator from './validator'
export default {
  name: 'InputCron',
  components: {
    EasyCron
  },
  model: {
    prop: 'cronValue',
    event: 'change'
  },
  props: {
    cronValue: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 700
    },
    placeholder: {
      type: String,
      default: '请输入cron表达式'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    exeStartTime: {
      type: [Number, String, Object],
      default: 0
    },
    hideYear: {
      type: Boolean,
      default: false
    },
    remote: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      editCronValue: this.cronValue,
      validator: [false || '请输入'],
      show: false
    }
  },
  watch: {
    cronValue(newVal, oldVal) {
      if (newVal === this.editCronValue) {
        return
      }
      this.editCronValue = newVal
    },
    editCronValue(newVal, oldVal) {
      this.validator = CronValidator(newVal)
      this.$emit('change', newVal)
    }
  },
  methods: {
    showConfigDlg() {
      if (!this.disabled) {
        this.show = true
      }
      console.log(CronValidator(this.editCronValue))
    }
  }
}
</script>

<style scoped>
</style>
