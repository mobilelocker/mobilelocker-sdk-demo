<template>
  <v-container fluid
               class="pa-0">
    <header class="iva-topbar">
      <div class="iva-topbar__inner">
        <RouterLink :to="{ name: 'mirf' }"
                    class="iva-topbar__brand">
          <img src="@/assets/mobilelocker_logo.svg"
               alt="MobileLocker"
               class="iva-topbar__logo"/>
          <span class="iva-topbar__divider"/>
          <span class="iva-topbar__title">
            IVA / SDK Demo
          </span>
        </RouterLink>
        <div class="iva-topbar__right">
          <span v-if="user"
                class="iva-topbar__user">
            <FontAwesomeIcon icon="user"
                             class="me-2"/>
            {{ user.name }}
          </span>
        </div>
      </div>
    </header>
    <v-main class="iva-main">
      <router-view/>
    </v-main>
  </v-container>
</template>

<script>
import {mapState} from 'pinia'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {useAppStore} from '@/stores/app.js'

export default {
  components: {FontAwesomeIcon},
  computed: {
    ...mapState(useAppStore, ['user']),
  },
}
</script>

<style scoped>
.iva-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid hsl(220, 13%, 91%);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
}

.iva-topbar__inner {
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.iva-topbar__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
}

.iva-topbar__logo { height: 38px; width: auto; display: block; }

.iva-topbar__divider {
  width: 1px;
  height: 24px;
  background: hsl(220, 13%, 85%);
  border-radius: 1px;
}

.iva-topbar__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: hsl(220, 9%, 38%);
  letter-spacing: -0.01em;
}

.iva-topbar__right { display: flex; align-items: center; gap: 12px; }

.iva-topbar__user {
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(220, 9%, 38%);
  letter-spacing: -0.01em;
}

.iva-main { padding-top: 60px !important; }

@media (max-width: 640px) {
  .iva-topbar__logo { height: 30px; }
}
</style>
