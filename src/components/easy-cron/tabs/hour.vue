<template>
  <v-container fluid>
    <v-layout
      row
      wrap
    >
      <v-flex xs3>
        <v-radio-group v-model="type">
          <v-radio
            label="每时"
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
            时 至
          </v-flex>
          <v-flex class="input-css" xs3>
            <v-text-field v-model="valueRange.end" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_RANGE || disabled" />
          </v-flex>
          <v-flex style="margin-top: 55px" xs2>
            时
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
            时开始，间隔
          </v-flex>
          <v-flex style="margin-top: -24px" xs2>
            <v-text-field v-model="valueLoop.interval" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_LOOP || disabled" />
          </v-flex>
          <v-flex xs2>
            时
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
    >
      <v-flex v-for="i in maxValue+1" :key="`key-${i-1}`" style="margin-top: -35px;" xs2>
        <v-checkbox v-model="valueList" :label="(i-1).toString()" :disabled="type!=TYPE_SPECIFY || disabled" :value="i-1" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import mixin from './mixin'

export default {
  name: 'Minute',
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
    this.minValue = 0
    this.maxValue = 23
    this.valueRange.start = 0
    this.valueRange.end = 23
    this.valueLoop.start = 0
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
