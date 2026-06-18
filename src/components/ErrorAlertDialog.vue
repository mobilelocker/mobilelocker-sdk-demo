<template>
  <v-dialog v-model="isOpen"
            aria-labelledby="error-dialog-title"
            aria-modal="true"
            max-width="600px"
            role="alertdialog">
    <v-card>
      <v-card-title id="error-dialog-title"
                    class="d-flex align-center">
        Error
      </v-card-title>
      <v-divider/>
      <v-card-text>
        <div>
          {{ errorMessage }}
        </div>
        <div v-if="showDetails && hasErrors"
             class="mt-4">
          <div class="text-subtitle-2 font-weight-bold mb-3">
            Validation Details
          </div>
          <div v-for="(messages, field) in errorDetails"
               :key="field" class="mb-3">
            <div class="text-caption font-weight-bold text-uppercase text-primary mb-1">
              {{ field }}
            </div>
            <div v-for="(message, index) in messages"
                 :key="index"
                 class="text-body-2 mb-2">
              <span v-if="messages.length > 1"
                    class="font-weight-bold text-error me-1">
                {{ index + 1 }}.
              </span>
              {{ message }}
            </div>
          </div>
        </div>
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-spacer/>
        <v-btn color="primary"
               variant="text"
               @click.prevent="closeDialog">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
  },
  emits: ['closed'],
  data() {
    return {isOpen: false}
  },
  computed: {
    errorMessage() {
      if (!this.error) return 'Unknown error'
      return this.error.response?.data?.message || this.error.message || String(this.error) || 'Unknown error'
    },
    errorDetails() {
      return this.error?.response?.data?.errors || this.error?.errors || {}
    },
    hasErrors() {
      return Object.keys(this.errorDetails).length > 0
    },
  },
  watch: {
    error() {
      this.isOpen = !!this.error
    },
    isOpen(value) {
      if (!value) this.$emit('closed')
    },
  },
  methods: {
    closeDialog() {
      this.isOpen = false
    },
  },
}
</script>
