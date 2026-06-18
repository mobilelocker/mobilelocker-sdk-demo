import { createVuetify } from 'vuetify'
import { fa } from 'vuetify/lib/iconsets/fa-svg'
import 'vuetify/styles'

const aliases = {
  collapse: 'fas fa-chevron-up',
  complete: 'fas fa-check',
  cancel: 'fas fa-circle-xmark',
  close: 'fas fa-xmark',
  delete: 'fas fa-circle-xmark',
  clear: 'fas fa-circle-xmark',
  success: 'fas fa-circle-check',
  info: 'fas fa-circle-info',
  warning: 'fas fa-exclamation',
  error: 'fas fa-triangle-exclamation',
  prev: 'fas fa-chevron-left',
  next: 'fas fa-chevron-right',
  checkboxOn: 'fas fa-square-check',
  checkboxOff: 'fas fa-square',
  checkboxIndeterminate: 'fas fa-minus-square',
  delimiter: 'fas fa-circle',
  sortAsc: 'fas fa-arrow-up',
  sortDesc: 'fas fa-arrow-down',
  expand: 'fas fa-chevron-down',
  menu: 'fas fa-bars',
  subgroup: 'fas fa-caret-down',
  dropdown: 'fas fa-caret-down',
  radioOn: 'fas fa-circle-dot',
  radioOff: 'fas fa-circle',
  edit: 'fas fa-pen-to-square',
  ratingEmpty: 'fas fa-star',
  ratingFull: 'fas fa-star',
  ratingHalf: 'fas fa-star-half',
  loading: 'fas fa-arrows-rotate',
  first: 'fas fa-backward-step',
  last: 'fas fa-forward-step',
  unfold: 'fas fa-arrows-up-down',
  file: 'fas fa-paperclip',
  plus: 'fas fa-plus',
  minus: 'fas fa-minus',
  calendar: 'fas fa-calendar',
  treeviewCollapse: 'fas fa-caret-down',
  treeviewExpand: 'fas fa-caret-right',
  tableGroupExpand: 'fas fa-chevron-right',
  tableGroupCollapse: 'fas fa-chevron-down',
  eyeDropper: 'fas fa-eye-dropper',
  search: 'fas fa-magnifying-glass',
}

export default createVuetify({
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: { fa },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#09aaea',
        },
      },
    },
  },
})
