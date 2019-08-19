<template>
  <v-container fluid>
    <v-layout
      row
      wrap
    >
      <v-flex xs3>
        <v-radio-group v-model="type">
          <v-radio
            label="每年"
            :disabled="disabled"
            value="TYPE_EVERY"
          />
          <v-radio
            label="区间"
            value="TYPE_RANGE"
            :disabled="disabled"
          />
          <v-radio
            label="循环"
            value="TYPE_LOOP"
            :disabled="disabled"
          />
        </v-radio-group>
      </v-flex>
      <v-flex xs9>
        <v-layout
          row
          wrap
        >
          <v-flex style="margin-top: 55px" xs1>
            从
          </v-flex>
          <v-flex class="input-css" xs3>
            <v-text-field v-model="valueRange.start" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_RANGE || disabled" />
          </v-flex>
          <v-flex style="margin-top: 55px" xs3>
            年 至
          </v-flex>
          <v-flex class="input-css" xs3>
            <v-text-field v-model="valueRange.end" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_RANGE || disabled" />
          </v-flex>
          <v-flex style="margin-top: 55px" xs2>
            年
          </v-flex>
        </v-layout>
        <v-layout
          row
          wrap
        >
          <v-flex xs1>
            从
          </v-flex>
          <v-flex style="margin-top: -24px" xs3>
            <v-text-field v-model="valueLoop.start" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_LOOP || disabled" />
          </v-flex>
          <v-flex xs5>
            年开始，间隔
          </v-flex>
          <v-flex style="margin-top: -24px" xs1>
            <v-text-field v-model="valueLoop.interval" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_LOOP || disabled" />
          </v-flex>
          <v-flex xs2>
            年
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'Year',
  mixins: [mixin],
  data() {
    return {}
  },
  watch: {
    value_c(newVal, oldVal) {
      // console.info('change:' + newVal)
      this.$emit('change', newVal)
    }
  },
  created() {
    const nowYear = (new Date()).getFullYear()
    this.DEFAULT_VALUE = '*'
    this.minValue = 0
    this.maxValue = 0
    this.valueRange.start = nowYear
    this.valueRange.end = nowYear + 100
    this.valueLoop.start = nowYear
    this.valueLoop.interval = 1
    // console.info('created')
    this.parseProp(this.prop)
  }
}
</script>

<style scoped>
  .input-css{
    margin-top: 30px;
  }
</style>
