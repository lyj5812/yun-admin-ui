<template>
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    :return-value.sync="date"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateValue"
        :label="label"
        :class="className"
        readonly
        clearable
        outlined
        hide-details
        v-on="on"
      />
    </template>
    <v-date-picker v-model="date" color="primary" :range="range" no-title scrollable>
      <v-spacer />
      <v-btn text color="primary" @click="menu = false">关闭</v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(date)">确定</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  name: 'DateField',
  model: {
    prop: 'iconValue',
    event: 'selected'
  },
  props: {
    label: {
      type: String,
      default: '时间'
    },
    range: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: 'chart'
    }
  },
  data() {
    return {
      value: null,
      menu: false,
      date: null
    }
  },
  computed: {
    dateValue: {
      get() {
        if (this.range) {
          if (this.date[0]) {
            return this.date.join(' ~ ')
          } else {
            return null
          }
        } else {
          return this.date
        }
      },
      set(value) {
        if (this.range) {
          if (!value) {
            this.date = ['', '']
            return null
          }
          if (this.date[0]) {
            return this.date.join(' ~ ')
          } else {
            return null
          }
        } else {
          return this.date
        }
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.$emit('selected', this.value)
    }
  },
  created() {
    if (this.range) {
      this.date = ['', '']
    }
  },
  methods: {
  }
}
</script>

