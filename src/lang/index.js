import Vue from 'vue'
import VueI18n from 'vue-i18n'
import localStorage from '@/utils/localStorage'
import enLocale from './en'
import zhLocale from './zh'
import esLocale from './es'
import jaLocale from './ja'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale
  },
  zh: {
    ...zhLocale
  },
  es: {
    ...esLocale
  },
  ja: {
    ...jaLocale
  }
}
export function getLanguage() {
  const chooseLanguage = localStorage.get('language')
  if (chooseLanguage) return chooseLanguage

  // if has not choose language
  const language = (navigator.language || navigator.browserLanguage).toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }
  return 'en'
}
const i18n = new VueI18n({
  // set locale
  // options: en | zh | es
  locale: getLanguage(),
  // set locale messages
  messages
})

export default i18n
