import {createApp} from 'vue'
import {registerPlugins} from '@/plugins'
import router from '@/router'
import App from './App.vue'

const app = createApp(App)

registerPlugins(app)

router.isReady().then(() => {
    app.mount('#app')
})
