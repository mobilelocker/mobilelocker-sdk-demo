<template>
  <div id="pageTitle"
       class="PageTitle"
       :style="$vuetify.display.xs ? 'margin: -12px -12px 8px -12px;' : 'margin: -12px -12px 16px -12px;'">
    <div v-if="$slots.breadcrumb"
         class="d-md-flex justify-md-space-between align-md-center px-4 py-2">
      <span class="text-body-2 text-medium-emphasis d-flex align-center ga-1">
        <slot name="breadcrumb"/>
      </span>
    </div>
    <div class="d-md-flex justify-md-space-between align-md-center px-4"
         :class="[$slots.breadcrumb ? 'pt-0' : ($vuetify.display.xs ? 'pt-2' : 'pt-4'), !$slots.subtitle ? ($vuetify.display.xs ? 'pb-2' : 'pb-4') : '']">
      <div :class="[$vuetify.display.xs ? 'text-h5' : 'text-h4', 'd-flex align-center']">
        <slot name="icon">
          <v-icon v-if="icon"
                  color="primary"
                  :icon="icon"
                  start/>
        </slot>
        <slot/>
      </div>
      <div class="d-md-flex justify-md-space-between align-md-center"
           style="gap: 8px;">
        <slot name="buttons"/>
      </div>
    </div>
    <div v-if="$slots.subtitle"
         class="d-md-flex justify-md-space-between align-md-center px-4"
         :class="$slots['subtitle-meta'] ? 'pb-2' : 'pb-4'">
      <slot name="subtitle"/>
    </div>
    <div v-if="$slots['subtitle-meta']"
         class="d-md-flex justify-md-space-between align-md-center px-4 pb-4">
      <slot name="subtitle-meta"/>
    </div>
    <v-divider class="mt-4"
               style="opacity: 0.3;"/>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: false,
    },
  },
}
</script>
