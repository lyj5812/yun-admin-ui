<template>
  <v-card>
    <v-layout row wrap>
      <v-flex xs7>
        <v-tabs v-model="tabs">
          <v-tabs-slider color="yellow" />
          <v-tab href="#s">
            秒
          </v-tab>
          <v-tab href="#m">
            分
          </v-tab>
          <v-tab href="#h">
            时
          </v-tab>
          <v-tab href="#d">
            日
          </v-tab>
          <v-tab href="#mo">
            月
          </v-tab>
          <v-tab href="#w">
            周
          </v-tab>
          <v-tab href="#y">
            年
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs">
          <v-tab-item
            value="s"
          >
            <second-ui v-model="second" :disabled="disabled" />
          </v-tab-item>
          <v-tab-item
            value="m"
          >
            <minute-ui v-model="minute" :disabled="disabled" />
          </v-tab-item>
          <v-tab-item
            value="h"
          >
            <hour-ui v-model="hour" :disabled="disabled" />
          </v-tab-item>
          <v-tab-item
            value="d"
          >
            <day-ui v-model="day" :week="week" :disabled="disabled" />
          </v-tab-item>
          <v-tab-item
            value="mo"
          >
            <month-ui v-model="month" :disabled="disabled" />
          </v-tab-item>
          <v-tab-item
            value="w"
          >
            <week-ui v-model="week" :day="day" :disabled="disabled" />
          </v-tab-item>
          <v-tab-item
            value="y"
          >
            <year-ui v-model="year" :disabled="disabled" />
          </v-tab-item>
        </v-tabs-items>
      </v-flex>
      <v-flex xs5>
        <v-layout row wrap>
          <v-flex xs12>
            <v-data-table
              :items="tableData"
              class="elevation-1"
              hide-actions
              hide-headers
            >
              <template v-slot:items="props">
                <td>{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.value }}</td>
              </template>
            </v-data-table>
          </v-flex>
          <v-flex xs12>
            <v-textarea
              outline
              name="input-7-4"
              label="最近五次执行"
              disabled
              :value="preTimeList"
            />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import SecondUi from './tabs/second'
import MinuteUi from './tabs/minute'
import HourUi from './tabs/hour'
import DayUi from './tabs/day'
import WeekUi from './tabs/week'
import MonthUi from './tabs/month'
import YearUi from './tabs/year'
import CronParser from 'cron-parser'
import dateFormat from './format-date'
import { debounce } from 'debounce'

export default {
  name: 'EasyCron',
  model: {
    prop: 'cronValue',
    event: 'change'
  },
  props: {
    cronValue: {
      type: String,
      default: ''
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
      curtab: '',
      second: '*',
      minute: '*',
      hour: '*',
      day: '*',
      month: '*',
      week: '?',
      year: '*',
      startTime: new Date(),
      preTimeList: '执行预览，会忽略年份参数',
      tabs: null,
      columns: [{ title: ' ', width: '80', key: 'name' }, { title: ' ', key: 'value' }]
    }
  },
  computed: {
    tableData() {
      const c = [
        { name: '秒', value: this.second },
        { name: '分', value: this.minute },
        { name: '时', value: this.hour },
        { name: '日', value: this.day },
        { name: '月', value: this.month },
        { name: '周', value: this.week }
      ]
      return this.hideYear ? c.concat({ name: '表达式', value: this.cronValue_c })
        : c.concat(
          { name: '年', value: this.year },
          { name: '表达式', value: this.cronValue_c },
          { name: '表达式(不含年)', value: this.cronValue_c2 }
        )
    },
    cronValue_c() {
      const result = []
      result.push(this.second ? this.second : '*')
      result.push(this.minute ? this.minute : '*')
      result.push(this.hour ? this.hour : '*')
      result.push(this.day ? this.day : '*')
      result.push(this.month ? this.month : '*')
      result.push(this.week ? this.week : '?')
      if (!this.hideYear) result.push(this.year ? this.year : '*')
      return result.join(' ')
    },
    cronValue_c2() {
      return this.cronValue_c.split(' ').slice(0, 6).join(' ')
    }
  },
  watch: {
    cronValue(newVal, oldVal) {
      if (newVal === this.cronValue_c) {
        // console.info('same cron value: ' + newVal)
        return
      }
      this.formatValue()
    },
    cronValue_c(newVal, oldVal) {
      this.calTriggerList()
      this.$emit('change', newVal)
    },
    exeStartTime(newVal, oldVal) {
      this.calStartTime()
    },
    startTime(newVal, oldVal) {
      this.calTriggerList()
    }
  },
  methods: {
    formatValue() {
      // console.info(this.cronValue)
      if (!this.cronValue) return
      const values = this.cronValue.split(' ').filter(item => !!item)
      if (!values || values.length <= 0) return
      this.second = values[0]
      if (values.length > 1) this.minute = values[1]
      if (values.length > 2) this.hour = values[2]
      if (values.length > 3) this.day = values[3]
      if (values.length > 4) this.month = values[4]
      if (values.length > 5) this.week = values[5]
      if (values.length > 6) this.year = values[6]
    },
    calTriggerList: debounce(function() {
      // 设置了回调函数
      if (this.remote) {
        this.remote(this.cronValue_c2, +this.startTime, v => { this.preTimeList = v })
        return
      }
      // 去掉年份参数
      const e = this.cronValue_c2
      const format = 'yyyy-MM-dd hh:mm:ss'
      const options = {
        currentDate: dateFormat(this.startTime, format)
      }
      // console.info(options)
      const iter = CronParser.parseExpression(e, options)
      const result = []
      for (let i = 0; i < 5; i++) {
        result.push(dateFormat(new Date(iter.next()), format))
      }
      this.preTimeList = result.length > 0 ? result.join('\n') : '无执行时间'
    }, 500),
    calStartTime() {
      if (!this.exeStartTime) {
        this.startTime = new Date()
        return
      }
      try {
        this.startTime = new Date(this.exeStartTime)
      } catch (e) {
        this.startTime = new Date()
      }
    }
  },
  components: {
    SecondUi,
    MinuteUi,
    HourUi,
    DayUi,
    WeekUi,
    MonthUi,
    YearUi
  },
  created() {
    this.formatValue()
    this.calStartTime()
  }
}
</script>

<style scoped>

</style>
