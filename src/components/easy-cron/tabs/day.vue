<template>
  <v-container fluid>
    <v-layout
      row
      wrap
    >
      <v-flex xs4>
        <v-radio-group v-model="type">
          <v-radio
            label="不设置"
            :disabled="disableChoice"
            value="TYPE_NOT_SET"
          />
          <v-radio
            label="每日"
            :disabled="disableChoice"
            value="TYPE_EVERY"
          />
          <v-radio
            label="区间"
            value="TYPE_RANGE"
            :disabled="disableChoice"
          />

          <v-radio
            label="循环"
            value="TYPE_LOOP"
            :disabled="disableChoice"
          />
          <v-radio
            label="工作日"
            value="TYPE_WORK"
            :disabled="disableChoice"
          />
          <v-radio
            label="最后一日"
            value="TYPE_LAST"
            :disabled="disableChoice"
          />
          <v-radio
            label="指定"
            value="TYPE_SPECIFY"
            :disabled="disableChoice"
          />
        </v-radio-group>
      </v-flex>
      <v-flex xs8>
        <v-layout
          row
          wrap
        >
          <v-flex style="margin-top: 22px" xs12>
            日和周只能设置其中之一
          </v-flex>
        </v-layout>
        <v-layout
          row
          wrap
        >
          <v-flex style="margin-top: 35px" xs1>
            从
          </v-flex>
          <v-flex class="input-css" xs3>
            <v-text-field v-model="valueRange.start" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_RANGE || disableChoice" />
          </v-flex>
          <v-flex style="margin-top: 35px" xs3>
            日 至
          </v-flex>
          <v-flex class="input-css" xs3>
            <v-text-field v-model="valueRange.end" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_RANGE || disableChoice" />
          </v-flex>
          <v-flex style="margin-top: 35px" xs2>
            日
          </v-flex>
        </v-layout>
        <v-layout
          row
          wrap
        >
          <v-flex xs1>
            从
          </v-flex>
          <v-flex style="margin-top: -24px" xs2>
            <v-text-field v-model="valueLoop.start" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_LOOP || disableChoice" />
          </v-flex>
          <v-flex xs5>
            日开始，间隔
          </v-flex>
          <v-flex style="margin-top: -24px" xs2>
            <v-text-field v-model="valueLoop.interval" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_LOOP || disableChoice" />
          </v-flex>
          <v-flex xs2>
            日
          </v-flex>
        </v-layout>

        <v-layout
          row
          wrap
        >
          <v-flex xs2>
            本月
          </v-flex>
          <v-flex style="margin-top: -24px" xs3>
            <v-text-field v-model="valueWork" type="number" :disabled="type!=TYPE_WORK || disableChoice" :max="maxValue" :min="minValue" />
          </v-flex>
          <v-flex xs7>
            日，最近的工作日
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
    >
      <v-flex v-for="i in maxValue" :key="`key-${i}`" style="margin-top: -35px;" xs2>
        <v-checkbox v-model="valueList" :label="i.toString()" :disabled="type!=TYPE_SPECIFY || disableChoice" :value="i" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'Day',
  mixins: [mixin],
  props: {
    week: {
      type: String,
      default: '?'
    }
  },
  data() {
    return {}
  },
  computed: {
    disableChoice() {
      return (this.week && this.week !== '?') || this.disabled
    }
  },
  watch: {
    value_c(newVal, oldVal) {
      // 数值变化
      this.updateValue()
    },
    week(newVal, oldVal) {
      // console.info('new week: ' + newVal)
      this.updateValue()
    }
  },
  created() {
    this.DEFAULT_VALUE = '*'
    this.minValue = 1
    this.maxValue = 31
    this.valueRange.start = 1
    this.valueRange.end = 31
    this.valueLoop.start = 1
    this.valueLoop.interval = 1
    this.parseProp(this.prop)
  },
  methods: {
    updateValue() {
      this.$emit('change', this.disableChoice ? '?' : this.value_c)
    }
  }
}
</script>

<style scoped>
  .input-css{
    margin-top: 10px;
  }
</style>
