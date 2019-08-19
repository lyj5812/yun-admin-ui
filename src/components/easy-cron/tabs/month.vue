<template>
  <v-container fluid>
    <v-layout
      row
      wrap
    >
      <v-flex xs3>
        <v-radio-group v-model="type">
          <v-radio
            label="每月"
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
          <v-radio
            label="指定"
            value="TYPE_SPECIFY"
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
            月 至
          </v-flex>
          <v-flex class="input-css" xs3>
            <v-text-field v-model="valueRange.end" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_RANGE || disabled" />
          </v-flex>
          <v-flex style="margin-top: 55px" xs2>
            月
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
            <v-text-field v-model="valueLoop.start" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_LOOP || disabled" />
          </v-flex>
          <v-flex xs5>
            月开始，间隔
          </v-flex>
          <v-flex style="margin-top: -24px" xs2>
            <v-text-field v-model="valueLoop.interval" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_LOOP || disabled" />
          </v-flex>
          <v-flex xs2>
            月
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
    >
      <v-flex v-for="i in maxValue+1" :key="`key-${i}`" style="margin-top: -35px;" xs2>
        <v-checkbox v-model="valueList" :label="i.toString()" :disabled="type!=TYPE_SPECIFY || disabled" :value="i" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'Month',
  mixins: [mixin],
  data() {
    return {}
  },
  watch: {
    value_c(newVal, oldVal) {
      this.$emit('change', newVal)
    }
  },
  created() {
    this.DEFAULT_VALUE = '*'
    this.minValue = 1
    this.maxValue = 12
    this.valueRange.start = 1
    this.valueRange.end = 12
    this.valueLoop.start = 1
    this.valueLoop.interval = 1
    this.parseProp(this.prop)
  }
}
</script>

<style scoped>
  .input-css{
    margin-top: 24px;
  }
</style>
