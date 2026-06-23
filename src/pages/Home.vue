<template>
  <v-card :rounded="(isMobile || presenting) ? '0' : 'xl'"
          :elevation="presenting ? '0' : '1'"
          :border="!presenting"
          class="d-flex flex-column overflow-hidden"
          :style="presenting
            ? 'position: fixed; top: 60px; left: 0; right: 0; bottom: env(safe-area-inset-bottom, 0); z-index: 50;'
            : { minHeight: isMobile ? 'calc(100vh - 60px)' : 'calc(100vh - 60px - 32px)' }">
    <div v-if="!isMobile"
         class="d-flex flex-row overflow-hidden"
         style="flex: 1; min-height: 0;">
      <v-sheet v-if="!presenting"
               width="220"
               color="grey-lighten-4"
               style="flex-shrink: 0; border-right: 1px solid rgba(0,0,0,0.07);">
        <v-list nav
                bg-color="transparent"
                class="pa-2 pt-3">
          <v-list-item v-for="tab in tabs"
                       :key="tab.route"
                       :to="{ name: tab.route }"
                       rounded="lg"
                       base-color="gray"
                       color="gray"
                       min-height="50"
                       class="mb-1">
            <template #prepend>
              <FontAwesomeIcon :icon="tab.icon"
                               style="width: 15px; font-size: 0.875rem; margin-right: 14px; opacity: 0.7;"/>
            </template>
            <v-list-item-title
                style="font-size: 0.8125rem; font-weight: 500; letter-spacing: -0.01em; line-height: 1.35;">
              {{ tab.label }}
            </v-list-item-title>
            <v-list-item-subtitle style="font-size: 0.7rem; letter-spacing: 0.01em; line-height: 1.4; opacity: 0.55;">
              {{ tab.desc }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-sheet>
      <v-card-text :style="desktopCardStyle">
        <component :is="activeComponent"
                   v-bind="activeComponentProps"/>
      </v-card-text>
    </div>
    <template v-else>
      <div v-if="!presenting"
           class="ma-2 pa-1"
           style="background: hsl(220, 14%, 92%); border-radius: 12px; overflow-x: auto; flex-shrink: 0;">
        <div class="d-flex" style="gap: 3px;">
          <RouterLink v-for="tab in tabs"
                      :key="tab.route"
                      :to="{ name: tab.route }"
                      custom
                      v-slot="{ navigate }">
            <button @click="navigate"
                    class="d-flex flex-column align-center justify-center"
                    :style="{
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px 6px',
                  borderRadius: '8px',
                  minWidth: '68px',
                  flex: 1,
                  gap: '4px',
                  transition: 'all 0.15s',
                  background: $route.name === tab.route ? 'white' : 'transparent',
                  boxShadow: $route.name === tab.route ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }">
              <FontAwesomeIcon :icon="tab.icon"
                               :style="{
                    fontSize: '1rem',
                    color: $route.name === tab.route ? 'rgb(var(--v-theme-primary))' : 'rgba(0,0,0,0.45)',
                  }"/>
              <span :style="{
                fontSize: '0.6875rem',
                fontWeight: $route.name === tab.route ? '600' : '500',
                color: $route.name === tab.route ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.45)',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }">
                {{ tab.label }}
              </span>
            </button>
          </RouterLink>
        </div>
      </div>
      <v-divider v-if="!presenting"/>
      <v-card-text :style="mobileCardStyle">
        <component :is="activeComponent"
                   v-bind="activeComponentProps"/>
      </v-card-text>
    </template>
    <template v-if="!presenting">
      <v-divider/>
      <div class="d-flex align-center justify-center pa-2">
        <span style="font-size: 0.72rem; color: rgba(0,0,0,0.38);">
          powered by
          <a href="https://mobilelocker.github.io/mobilelocker-javascript-sdk/#domain-reference"
             target="_blank"
             rel="noopener noreferrer"
             style="color: rgba(0,0,0,0.5); font-weight: 500; text-decoration: none;">
            @mobilelocker/javascript-sdk
          </a>
        </span>
      </div>
    </template>
  </v-card>
</template>
<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import MirfForm from './components/MirfForm.vue'
import Kazaamax from './components/Kazaamax.vue'
import Environments from '@/pages/components/Environments.vue'
import Scanner from '@/pages/components/Scanner.vue'
import Search from '@/pages/components/Search.vue'
import Events from '@/pages/components/Events.vue'
import Presentation from '@/pages/components/Presentation.vue'
import Crm from '@/pages/components/Crm.vue'

const ROUTE_COMPONENTS = {
  mirf: MirfForm,
  scanner: Scanner,
  search: Search,
  events: Events,
  kazaamax: Kazaamax,
  mljs: Environments,
  presentation: Presentation,
  crm: Crm,
}

export default {
  name: 'Home',
  components: {
    Scanner,
    Search,
    Events,
    FontAwesomeIcon,
    MirfForm,
    Kazaamax,
    Environments,
    Presentation,
    Crm,
  },
  data() {
    return {
      presenting: false,
      tabs: [
        {
          route: 'mljs',
          label: 'ML JS SDK',
          desc: 'Mobile Locker JS SDK',
          icon: 'laptop-mobile'
        },
        {
          route: 'mirf',
          label: 'MIRF',
          desc: 'Medical Info Request',
          icon: 'id-card'
        },
        {
          route: 'scanner',
          label: 'Scanner',
          desc: 'Scan Business Cards',
          icon: 'barcode'
        },
        {
          route: 'search',
          label: 'Search',
          desc: 'Search Mobile Locker',
          icon: 'magnifying-glass'
        },
        {
          route: 'events',
          label: 'Events',
          desc: 'Medical Congresses',
          icon: 'calendar'
        },
        {
          route: 'kazaamax',
          label: 'Kazaamax',
          desc: 'KZM Clinical',
          icon: 'wand-magic-sparkles'
        },
        {
          route: 'presentation',
          label: 'Presentations',
          desc: 'Browse & share',
          icon: 'chart-line'
        },
        {
          route: 'crm',
          label: 'CRM',
          desc: 'Accounts & contacts',
          icon: 'building'
        },
      ],
    }
  },
  computed: {
    isMobile() {
      return this.$vuetify.display.smAndDown
    },
    isKazaamax() {
      return this.$route.name === 'kazaamax'
    },
    desktopCardStyle() {
      if (this.presenting) {
        return 'flex: 1; min-width: 0; min-height: 0; padding: 0; overflow: hidden; display: flex; flex-direction: column;'
      }
      if (this.isKazaamax) {
        return 'flex: 1; min-width: 0; min-height: 0; padding: 36px 40px; overflow: hidden; display: flex; flex-direction: column;'
      }
      return 'flex: 1; min-width: 0; padding: 36px 40px; overflow-y: auto;'
    },
    mobileCardStyle() {
      if (this.presenting) {
        return 'flex: 1; min-height: 0; padding: 0; overflow: hidden; display: flex; flex-direction: column;'
      }
      if (this.isKazaamax) {
        return 'flex: 1; min-height: 0; padding: 20px 16px; overflow: hidden; display: flex; flex-direction: column;'
      }
      return 'flex: 1; padding: 20px 16px; overflow-y: auto;'
    },
    activeComponent() {
      return ROUTE_COMPONENTS[this.$route.name] ?? null
    },
    activeComponentProps() {
      if (this.$route.name !== 'kazaamax') return {}
      return {
        presenting: this.presenting,
        onPresent: () => {
          this.presenting = true
        },
        onExitPresent: () => {
          this.presenting = false
        },
      }
    },
  },
  mounted() {
    this.$ml.analytics.logEvent('action', 'tap', '/' + this.$route.name)
  },
  watch: {
    '$route.name'(name) {
      if (name !== 'kazaamax') this.presenting = false
      this.$ml.analytics.logEvent('action', 'tap', '/' + name)
    },
  },
}
</script>
