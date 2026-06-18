import router from '@/router'
import pinia from '@/stores'
import autofill from './autofill'
import FontAwesomeIcon from './fontawesome'
import vuetify from './vuetify'
import mobilelocker from './mobilelocker'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(autofill)
    .use(mobilelocker)
    .component('FontAwesomeIcon', FontAwesomeIcon)
}
