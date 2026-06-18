<template>
  <v-alert v-if="error && !dismissed"
           class="mb-0"
           :closable="dismissable"
           type="error"
           @click:close="onDismiss">
    {{ error.response?.data?.message || error.message || error || 'Unknown error' }}
    <div v-if="showDetails && hasErrors"
         class="mt-2">
      <div v-for="(messages, field) in errorDetails"
           :key="field">
        <div class="font-weight-bold">
          {{ field }}:
        </div>
        <div v-for="(message, index) in messages"
             :key="index"
             class="ml-3">
          {{ message }}
        </div>
      </div>
    </div>
  </v-alert>
</template>

<script>
export default {
  props: {
    error: {
      type: [Error, Object, String],
      required: false,
    },
    showDetails: {
      type: Boolean,
      default: false,
    },
    dismissable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {dismissed: false}
  },
  computed: {
    errorDetails() {
      return this.error?.response?.data?.errors || this.error?.errors || {}
    },
    hasErrors() {
      return Object.keys(this.errorDetails).length > 0
    },
  },
  watch: {
    error() {
      this.dismissed = false
    },
  },
  methods: {
    onDismiss() {
      this.dismissed = true
    },
  },
}
</script>
