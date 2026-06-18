<template>
  <v-app>
    <div v-if="initializing"
         class="d-flex align-center justify-center"
         style="height: 100vh;">
      <v-progress-circular color="primary"
                           indeterminate
                           size="64"/>
    </div>
    <template v-else>
      <RouterView/>
      <ToastSnackbar/>
    </template>
  </v-app>
</template>

<script>
import {mapState} from 'pinia'
import ToastSnackbar from '@/components/ToastSnackbar.vue'
import {useAppStore} from '@/stores/app.js'

export default {
  name: 'App',
  components: {ToastSnackbar},
  computed: {
    ...mapState(useAppStore, ['initializing']),
  },
  async created() {
    const store = useAppStore()
    store.error = null
    try {
      await store.initStore()
    } catch (error) {
      store.error = error?.message ?? 'An unexpected error occurred. Please try again.'
      await this.$router.replace({name: 'app_error'})
    }
  },
}
</script>

<style>
*, *::before, *::after {
  touch-action: manipulation;
}
</style>
