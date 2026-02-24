import { computed, unref } from 'vue'

export function useNumberMask(target, key = null, options = {}) {
  const {
    locale = 'ru-RU',
    useIntl = true
  } = options

  const formatter = useIntl
    ? new Intl.NumberFormat(locale)
    : null

  return computed({
    get() {
      const value = key ? target[key] : unref(target)
      if (!value) return ''

      const numeric = value.toString().replace(/\D/g, '')

      if (!numeric) return ''

      return useIntl
        ? formatter.format(Number(numeric))
        : numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    },

    set(val) {
      const clean = val.replace(/\D/g, '')

      if (key) {
        target[key] = clean
      } else {
        target.value = clean
      }
    }
  })
}