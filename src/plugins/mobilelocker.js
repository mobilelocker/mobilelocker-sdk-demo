import mobilelocker, { isApp, isIOS, isElectron, isCDN, isMobileLocker } from '@mobilelocker/javascript-sdk'

export default {
  install(app) {
    app.config.globalProperties.$ml = mobilelocker
    app.config.globalProperties.$mlIs = { isApp, isIOS, isElectron, isCDN, isMobileLocker }
  },
}
