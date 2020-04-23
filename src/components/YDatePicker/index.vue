<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template #activator="{}">
      <v-text-field
        v-model="dateText"
        v-bind="$attrs"
        :class="fieldClass"
        @click="menu=true"
        @click:clear="clearDates"
      />
    </template>
    <v-date-picker v-model="dates" :day-format="date => new Date(date).getDate()" :range="range" :multiple="multiple" :first-day-of-week="firstDayOfWeek" v-bind="$attrs" @input="dateChange">
      <v-row v-if="showTime" style="max-width:250px" no-gutters>
        <v-col cols="4">
          <v-select
            :items="Array.from({length:24}, (v,k) => (Array(2).join('0') + k).slice(-2))"
            dense
            class="ma-2"
            label="时"
          />
        </v-col>
        <v-col cols="4">
          <v-select
            :items="Array.from({length:60}, (v,k) => (Array(2).join('0') + k).slice(-2))"
            dense
            class="ma-2"
            label="分"
          />
        </v-col>
        <v-col cols="4">
          <v-select
            :items="Array.from({length:60}, (v,k) => (Array(2).join('0') + k).slice(-2))"
            dense
            class="ma-2"
            label="秒"
          />
        </v-col>
      </v-row>
      <slot />
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'YDatePicker',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    range: {
      type: Boolean,
      default: false
    },
    firstDayOfWeek: {
      type: Number,
      default: 1
    },
    multiple: {
      type: Boolean,
      default: false
    },
    showTime: {
      type: Boolean,
      default: false
    },
    fieldClass: {
      type: String,
      default: ''
    },
    value: {
      type: null,
      default: null
    }
  },
  data() {
    return {
      dates: this.range || this.multiple ? [] : null,
      hour: '00',
      minute: '00',
      second: '00',
      menu: false
    }
  },
  computed: {
    dateText: {
      get() {
        if (this.range) {
          return this.dates ? this.dates.join(' ~ ') : ''
        } else if (this.multiple) {
          return this.dates ? this.dates.join(' , ') : ''
        } else {
          return this.dates || ''
        }
      },
      set(value) {
        return value
      }
    }
  },
  watch: {
    menu(val) {
      if (!val && this.range && this.dates.length < 2) {
        this.dates = []
        this.$message.error('请选择时间范围！')
      }
    }
  },
  created() {
    this.dates = this.value
  },
  methods: {
    dateChange(e) {
      if (this.multiple || this.range) {
        e.sort(function(a, b) {
          return (new Date(a.replace(/-/g, '/'))).getTime() - (new Date(b.replace(/-/g, '/'))).getTime()
        })
        e = e.map((item) => {
          return item + ' 00:00:00'
        })
        this.$emit('change', this.range && e.length < 2 ? [] : e)
      } else {
        this.$emit('change', e + ' 00:00:00')
      }
    },
    clearDates() {
      if (this.multiple || this.range) {
        this.dates = []
        this.$emit('change', [])
      } else {
        this.dates = null
        this.$emit('change', null)
      }
    }
  }
}
</script>

<style scoped>

</style>
