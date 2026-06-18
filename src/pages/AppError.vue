<template>
  <v-container>
    <v-alert type="error" class="mt-8">
      {{ error || 'An unexpected error occurred.' }}
    </v-alert>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app.js'

export default {
  name: 'AppError',
  computed: {
    ...mapState(useAppStore, ['error']),
  },
}
</script>
