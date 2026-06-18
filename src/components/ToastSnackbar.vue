<template>
  <v-snackbar v-model="toast.visible"
              :color="toast.color"
              location="bottom center"
              :timeout="toast.timeout"
              timer>
    {{ toast.message }}
    <template #actions="{ isActive }">
      <v-btn variant="text"
             @click="isActive.value = false">
        Dismiss
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import {useToastStore} from '@/stores/toast.js'

export default {
  setup() {
    return {toast: useToastStore()}
  },
}
</script>
