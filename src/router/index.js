import {setupLayouts} from 'virtual:generated-layouts'
import {createRouter, createWebHashHistory} from 'vue-router'
import AppError from '@/pages/AppError.vue'
import Home from '@/pages/Home.vue'

const routes = [
    {
        path: '/error',
        name: 'app_error',
        component: AppError,
    },
    {
        path: '/',
        redirect: '/mljs'
    },
    {
        path: '/mljs',
        name: 'mljs',
        component: Home,
    },
    {
        path: '/mirf',
        name: 'mirf',
        component: Home,
    },
    {
        path: '/scanner',
        name: 'scanner',
        component: Home,
    },
    {
        path: '/search',
        name: 'search',
        component: Home,
    },
    {
        path: '/events',
        name: 'events',
        component: Home,
    },
    {
        path: '/kazaamax',
        name: 'kazaamax',
        component: Home,
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/mljs',
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: setupLayouts(routes),
})

router.onError((err, to) => {
    if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
        if (localStorage.getItem('vuetify:dynamic-reload')) {
        } else {
            localStorage.setItem('vuetify:dynamic-reload', 'true')
            location.assign(to.fullPath)
        }
    }
})

router.isReady().then(() => {
    localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
