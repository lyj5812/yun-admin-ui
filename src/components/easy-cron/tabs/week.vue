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
          <v-flex xs5>
            <v-select
              v-model="valueRange.start"
              :disabled="type!=TYPE_RANGE || disableChoice"
              :items="weekList"
              item-text="k"
              item-value="v"
            />
          </v-flex>
          <v-flex style="margin-top: 35px" xs1>
            至
          </v-flex>
          <v-flex class="input-css" xs5>
            <v-select
              v-model="valueRange.end"
              :disabled="type!=TYPE_RANGE || disableChoice"
              :items="weekList"
              item-text="k"
              item-value="v"
            />
          </v-flex>
        </v-layout>
        <v-layout
          row
          wrap
        >
          <v-flex xs1>
            从
          </v-flex>
          <v-flex style="margin-top: -24px" xs5>
            <v-select
              v-model="valueLoop.start"
              :disabled="type!=TYPE_LOOP || disableChoice"
              :items="weekList"
              item-text="k"
              item-value="v"
            />
          </v-flex>
          <v-flex xs4>
            开始，间隔
          </v-flex>
          <v-flex style="margin-top: -24px" xs2>
            <v-text-field v-model="valueLoop.interval" type="number" :max="maxValue" :min="minValue" :disabled="type!=TYPE_LOOP || disableChoice" />
          </v-flex>
          <v-flex xs1>
            日
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
    >
      <v-flex v-for="item in weekList" :key="item.v" style="margin-top: -35px;" xs4>
        <v-checkbox v-model="valueList" :label="item.k" :disabled="type!=TYPE_SPECIFY || disableChoice" :value="item.v" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import mixin from './mixin'
import { WEEK_MAP_EN, replaceWeekName } from './const.js'

export default {
  name: 'Week',
  mixins: [mixin],
  props: {
    day: {
      type: String,
      default: '*'
    }
  },
  data() {
    return {
      weekList: [
        { k: '星期日', v: 0 },
        { k: '星期一', v: 1 },
        { k: '星期二', v: 2 },
        { k: '星期三', v: 3 },
        { k: '星期四', v: 4 },
        { k: '星期五', v: 5 },
        { k: '星期六', v: 6 }
      ],
      WEEK_MAP_EN
    }
  },
  computed: {
    disableChoice() {
      return (this.day && this.day !== '?') || this.disabled
    }
  },
  watch: {
    value_c(newVal, oldVal) {
      // 如果设置日，那么星期就直接不设置
      this.updateValue()
    },
    day(newVal) {
      // console.info('new day: ' + newVal)
      this.updateValue()
    }
  },
  created() {
    this.DEFAULT_VALUE = '*'
    // 0,7表示周日 1表示周一
    this.minValue = 0
    this.maxValue = 6
    this.valueRange.start = 0
    this.valueRange.end = 6
    this.valueLoop.start = 2
    this.valueLoop.interval = 1
    this.parseProp(this.prop)
  },
  methods: {
    updateValue() {
      this.$emit('change', this.disableChoice ? '?' : this.value_c)
    },
    preProcessProp(c) {
      return replaceWeekName(c)
    }
  }
}
</script>

<style scoped>

.config-list {
  text-align: left;
  margin: 0 10px 10px 10px;
}

.item {
  margin-top: 5px;
}

.tip-info {
  color: #999
}

.choice {
  border: 1px solid transparent;
  padding: 5px 8px;
}

.choice:hover {
  border: 1px solid #2d8cf0;
}

.w80 {
  width: 80px;
}

.ivu-input-number, .ivu-select {
  margin-left: 5px;
  margin-right: 5px;
}

.list {
  margin: 0 20px;
}

.list-check-item {
  padding: 1px 3px;
  width: 4em;
}
</style>
