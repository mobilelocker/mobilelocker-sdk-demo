<template>
  <div class="iva-form">
    <div class="iva-form__header">
      <h2 class="iva-form__title">
        Medical Information Request
      </h2>
      <p class="iva-form__subtitle">
        Submit a medical inquiry on behalf of a healthcare professional.
      </p>
    </div>
    <div class="iva-form__divider"/>
    <v-alert class="my-4"
             type="info"
             color="primary"
             density="compact">
      This demo form will email the captured data to your mobilelocker user email.
    </v-alert>
    <v-alert v-if="submitted"
             class="my-4"
             type="success"
             density="compact">
      Your request has been submitted successfully.
    </v-alert>
    <v-form v-if="!submitted"
            ref="form"
            @submit.prevent="submit">
      <div class="iva-form__body">
        <div class="iva-form__row">
          <div class="field">
            <label class="field__label">
              First Name
              <span class="field__req">
                *
              </span>
            </label>
            <v-text-field v-model="form.firstName"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.required]"/>
          </div>
          <div class="field">
            <label class="field__label">
              Last Name
              <span class="field__req">
                *
              </span>
            </label>
            <v-text-field v-model="form.lastName"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.required]"/>
          </div>
        </div>
        <div class="iva-form__row">
          <div class="field">
            <label class="field__label">
              Specialty
              <span class="field__req">
                *
              </span>
            </label>
            <v-select v-model="form.specialty"
                      :items="specialties"
                      variant="outlined"
                      density="compact"
                      placeholder="Select specialty"
                      :rules="[rules.required]"/>
          </div>
          <div class="field">
            <label class="field__label">
              NPI Number
            </label>
            <v-text-field v-model="form.npi"
                          variant="outlined"
                          density="compact"
                          :rules="[rules.npi]"/>
          </div>
        </div>
        <div class="field">
          <label class="field__label">
            Product / Drug
            <span class="field__req">
              *
            </span>
          </label>
          <v-select v-model="form.product"
                    :items="products"
                    variant="outlined"
                    density="compact"
                    placeholder="Select product"
                    :rules="[rules.required]"/>
        </div>
        <div class="field">
          <label class="field__label">
            Medical Question
            <span class="field__req">
              *
            </span>
          </label>
          <v-textarea v-model="form.question"
                      variant="outlined"
                      density="compact"
                      rows="4"
                      :rules="[rules.required]"/>
        </div>
        <div class="iva-form__row">
          <div class="field">
            <label class="field__label">
              Contact Email
              <span class="field__req">
                *
              </span>
            </label>
            <v-text-field v-model="form.email"
                          variant="outlined"
                          density="compact"
                          type="email"
                          :rules="[rules.required, rules.email]"/>
          </div>
          <div class="field">
            <label class="field__label">
              Contact Phone
            </label>
            <v-text-field v-model="form.phone"
                          variant="outlined"
                          density="compact"
                          type="tel"
                          :rules="[rules.usPhone]"/>
          </div>
        </div>
      </div>
      <div class="iva-form__footer">
        <v-btn type="submit"
               color="primary"
               variant="flat"
               :loading="loading"
               class="iva-form__submit">
          Submit Request
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import rules from '@/services/validationService.js'

export default {
  name: 'MirfForm',
  data() {
    return {
      rules,
      loading: false,
      submitted: false,
      form: {
        firstName: '',
        lastName: '',
        specialty: null,
        npi: '',
        product: null,
        question: '',
        email: '',
        phone: '',
      },
      specialties: [
        'Cardiology', 'Dermatology', 'Endocrinology', 'Family Medicine',
        'Gastroenterology', 'Internal Medicine', 'Neurology', 'Oncology',
        'Orthopedic Surgery', 'Psychiatry', 'Pulmonology', 'Rheumatology',
      ],
      products: ['Product A', 'Product B', 'Product C'],
    }
  },
  created() {
    this.$ml.log.debug('Test loging from sdk.')
  },
  methods: {
    async submit() {
      const {valid} = await this.$refs.form.validate()
      if (!valid) return
      this.loading = true
      try {
        this.$ml.data.submitForm('mirf', this.form)
        this.submitted = true
      } catch (error) {
        // submission failure handled silently
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
