export default function scrollOnFocusMixin (refName, appBarHeight = 80) {
  const capitalized = refName.charAt(0).toUpperCase() + refName.slice(1)
  const focusedKey = `${refName}Focused`
  const focusMethod = `on${capitalized}Focus`
  const blurMethod = `on${capitalized}Blur`

  return {
    data () {
      return { [focusedKey]: false }
    },
    methods: {
      [focusMethod] () {
        this[focusedKey] = true
        this.$nextTick(() => {
          setTimeout(() => {
            const el = this.$refs[refName]?.$el
            if (!el) return
            const top = el.getBoundingClientRect().top + window.scrollY - appBarHeight
            window.scrollTo({ behavior: 'smooth', top })
          }, 100)
        })
      },
      [blurMethod] () {
        setTimeout(() => { this[focusedKey] = false }, 300)
      },
    },
  }
}
