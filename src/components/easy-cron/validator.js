import CronParser from 'cron-parser'
import { replaceWeekName } from './tabs/const'

export default (value) => {
  let result = [true || '请输入']
  // 没填写就不校验
  if (!value) {
    result = [false || '请输入']
    return result
  }
  const values = value.split(' ').filter(item => !!item)
  if (values.length > 7) {
    result = [false || 'cron表达式最多7项']
    return result
  }
  // 检查第7项
  if (values.length > 6) {
    const year = replaceWeekName(values[6])
    if (year !== '*' && year !== '?') {
      let yearValues = []
      if (year.indexOf('-') >= 0) {
        yearValues = year.split('-')
      } else if (year.indexOf('/')) {
        yearValues = year.split('/')
      } else {
        yearValues = [year]
      }
      // console.info(yearValues)
      // 判断是否都是数字
      const checkYear = yearValues.some(item => isNaN(item))
      if (checkYear) {
        result = [false || 'cron表达式参数[年]错误:' + year]
        return result
      }
    }
  }

  // 取其中的前六项
  const e = values.slice(0, 6).join(' ')
  try {
    const iter = CronParser.parseExpression(e)
    iter.next()
  } catch (e) {
    result = [false || 'cron表达式错误:' + e]
    return result
  }
  return result
}
