<template>
  <div class="iva-form">
    <div class="iva-form__header">
      <h2 class="iva-form__title">
        Scanner
      </h2>
      <p class="iva-form__subtitle">
        Scan business cards via the device camera.
      </p>
    </div>
    <div class="iva-form__divider"/>
    <div v-if="!loading && isApp"
         class="iva-form__body">
      <transition name="swap"
                  mode="out-in">
        <div v-if="bizcard.result && bizcard.result.status === 'success' && bizcard.result.businessCard"
             key="detail"
             class="bc-detail">
          <div class="bc-detail__toolbar">
            <button class="bc-detail__back"
                    @click="bizcard.result = null">
              <FontAwesomeIcon icon="chevron-left"/>
              <span>
                Scan another
              </span>
            </button>
            <span v-if="card.verified"
                  class="bc-detail__verified">
              <FontAwesomeIcon icon="circle-check"/>
              Verified
            </span>
          </div>
          <div v-if="card.image_front_url || card.image_back_url"
               class="bc-images">
            <img v-if="card.image_front_url"
                 :src="card.image_front_url"
                 alt="Front"
                 class="bc-image"/>
            <img v-if="card.image_back_url"
                 :src="card.image_back_url"
                 alt="Back"
                 class="bc-image bc-image--back"/>
          </div>
          <div class="bc-identity">
            <div class="bc-identity__avatar">
              {{ initials }}
            </div>
            <div class="bc-identity__info">
              <h3 class="bc-identity__name">
                {{ card.name || [card.first_name, card.last_name].filter(Boolean).join(' ') || '—' }}
              </h3>
              <p v-if="card.job_title || card.title"
                 class="bc-identity__title">
                {{ card.job_title || card.title }}
              </p>
              <p v-if="card.company"
                 class="bc-identity__company">
                <FontAwesomeIcon icon="building"
                                 class="bc-identity__company-icon"/>
                {{ card.company }}
              </p>
            </div>
          </div>
          <div class="bc-section">
            <div class="bc-section__label">
              Contact
            </div>
            <div class="bc-rows">
              <a v-if="card.email"
                 :href="`mailto:${card.email}`"
                 class="bc-row bc-row--link">
                <div class="bc-row__icon-wrap bc-row__icon-wrap--blue">
                  <FontAwesomeIcon icon="at"/>
                </div>
                <div class="bc-row__content">
                  <span class="bc-row__label">
                    Email
                  </span>
                  <span class="bc-row__value">
                    {{ card.email }}
                  </span>
                </div>
                <FontAwesomeIcon icon="arrow-up-right-from-square"
                                 class="bc-row__external"/>
              </a>
              <a v-if="card.phone"
                 :href="`tel:${card.phone}`"
                 class="bc-row bc-row--link">
                <div class="bc-row__icon-wrap bc-row__icon-wrap--green">
                  <FontAwesomeIcon icon="phone-volume"/>
                </div>
                <div class="bc-row__content">
                  <span class="bc-row__label">
                    Phone
                  </span>
                  <span class="bc-row__value">
                    {{ card.phone }}
                  </span>
                </div>
                <FontAwesomeIcon icon="arrow-up-right-from-square"
                                 class="bc-row__external"/>
              </a>
              <a v-if="card.website"
                 :href="card.website"
                 target="_blank"
                 rel="noopener"
                 class="bc-row bc-row--link">
                <div class="bc-row__icon-wrap bc-row__icon-wrap--purple">
                  <FontAwesomeIcon icon="arrow-up-right-from-square"/>
                </div>
                <div class="bc-row__content">
                  <span class="bc-row__label">
                    Website
                  </span>
                  <span class="bc-row__value">
                    {{ card.website }}
                  </span>
                </div>
                <FontAwesomeIcon icon="arrow-up-right-from-square"
                                 class="bc-row__external"/>
              </a>
            </div>
          </div>
          <div v-if="hasAddress"
               class="bc-section">
            <div class="bc-section__label">
              Address
            </div>
            <div class="bc-rows">
              <div class="bc-row">
                <div class="bc-row__icon-wrap bc-row__icon-wrap--orange">
                  <FontAwesomeIcon icon="location-dot"/>
                </div>
                <div class="bc-row__content">
                  <span v-if="card.address1"
                        class="bc-row__value">
                    {{ card.address1 }}
                  </span>
                  <span v-if="card.address2"
                        class="bc-row__value">
                    {{ card.address2 }}
                  </span>
                  <span v-if="cityLine"
                        class="bc-row__value">
                    {{ cityLine }}
                  </span>
                  <span v-if="!card.address1 && card.address"
                        class="bc-row__value">
                    {{ card.address }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="card.note"
               class="bc-section">
            <div class="bc-section__label">
              Note
            </div>
            <div class="bc-note">
              {{ card.note }}
            </div>
          </div>
          <div v-if="card.crm_id"
               class="bc-section">
            <div class="bc-section__label">
              CRM
            </div>
            <div class="bc-rows">
              <div class="bc-row">
                <div class="bc-row__icon-wrap bc-row__icon-wrap--grey">
                  <FontAwesomeIcon icon="user"/>
                </div>
                <div class="bc-row__content">
                  <span class="bc-row__label">
                    {{ card.crm_object_type || 'Record' }}
                  </span>
                  <span class="bc-row__value">
                    {{ card.crm_id }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="bc-meta">
            <span v-if="card.source"
                  class="bc-meta__chip">
              {{ card.source }}
            </span>
            <span v-if="card.created_at"
                  class="bc-meta__chip">
              {{ formatDate(card.created_at) }}
            </span>
            <span v-if="card.id"
                  class="bc-meta__chip bc-meta__chip--mono">
              {{ card.id }}
            </span>
          </div>
        </div>
        <div v-else
             key="scan"
             class="scanner-panel">
          <div v-if="bizcard.result && bizcard.result.status !== 'success'"
               class="scanner-status"
               :class="`scanner-status--${bizcard.result.status}`">
            <FontAwesomeIcon :icon="statusIcon(bizcard.result.status)"/>
            <span>
              {{ statusLabel(bizcard.result.status) }}
            </span>
            <button @click="bizcard.result = null">
              <FontAwesomeIcon icon="xmark"/>
            </button>
          </div>
          <div class="scanner-layout">
            <div class="scanner-layout__main">
              <button class="scanner-btn"
                      :disabled="bizcard.scanning"
                      @click="scanBizcard">
                <span v-if="!bizcard.scanning"
                      class="scanner-btn__content">
                  <div class="scanner-btn__icon-wrap">
                    <FontAwesomeIcon icon="id-card"
                                     class="scanner-btn__icon"/>
                  </div>
                  <span class="scanner-btn__label">
                    Scan Business Card
                  </span>
                  <span class="scanner-btn__hint">
                    Opens device camera
                  </span>
                </span>
                <span v-else
                      class="scanner-btn__content">
                  <v-progress-circular indeterminate
                                       size="32"
                                       width="2"
                                       color="rgba(255,255,255,0.7)"/>
                  <span class="scanner-btn__label">
                    Scanning...
                  </span>
                </span>
              </button>
            </div>
            <div class="scanner-layout__side">
              <div class="scanner-info-block">
                <div class="scanner-info-block__title">
                  What gets captured
                </div>
                <ul class="scanner-info-list">
                  <li>
                    <FontAwesomeIcon icon="user"/>
                    Name &amp; job title
                  </li>
                  <li>
                    <FontAwesomeIcon icon="building"/>
                    Company
                  </li>
                  <li>
                    <FontAwesomeIcon icon="at"/>
                    Email address
                  </li>
                  <li>
                    <FontAwesomeIcon icon="phone-volume"/>
                    Phone number
                  </li>
                  <li>
                    <FontAwesomeIcon icon="location-dot"/>
                    Address
                  </li>
                  <li>
                    <FontAwesomeIcon icon="image"/>
                    Card image
                  </li>
                </ul>
              </div>
              <div class="scanner-info-block">
                <div class="scanner-info-block__title">
                  SDK method
                </div>
                <code class="scanner-info-code">
                  this.$ml.scanner
                  <br>
                  .scanBusinessCard()
                </code>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div v-else-if="loading">
      <v-progress-circular indeterminate/>
    </div>
    <AppRequired v-else/>
  </div>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import AppRequired from '@/components/AppRequired.vue'

export default {
  name: 'Scanner',
  components: {
    AppRequired,
    FontAwesomeIcon,
  },

  data() {
    return {
      loading: false,
      bizcard: {
        scanning: false,
        result:   null,
      },
    }
  },

  computed: {
    isApp() {
      return this.$ml.isApp()
    },

    card() {
      return this.bizcard.result?.businessCard ?? {}
    },

    initials() {
      const first = this.card.first_name?.[0] ?? ''
      const last = this.card.last_name?.[0] ?? ''
      return (first + last).toUpperCase() || '?'
    },

    hasAddress() {
      const c = this.card
      return c.address1 || c.address2 || c.city || c.address
    },

    cityLine() {
      const c = this.card
      return [c.city, c.state, c.zip, c.country].filter(Boolean).join(', ')
    },
  },

  methods: {
    async scanBizcard() {
      this.bizcard.scanning = true
      this.bizcard.result = null
      try {
        this.bizcard.result = await this.$ml.scanner.scanBusinessCard()
      } catch {
        this.bizcard.result = {status: 'failed'}
      } finally {
        this.bizcard.scanning = false
      }
    },

    statusIcon(s) {
      return {
        cancelled: 'circle-xmark',
        failed:    'triangle-exclamation',
      }[s] ?? 'circle'
    },

    statusLabel(s) {
      return {
        cancelled: 'Scan cancelled',
        failed:    'Scan failed — try again',
      }[s] ?? s
    },

    formatDate(iso) {
      if (!iso) return ''
      try {
        return new Date(iso).toLocaleDateString(undefined, {
          month: 'short',
          day:   'numeric',
          year:  'numeric',
        })
      } catch {
        return iso
      }
    },
  },
}
</script>

<style scoped>
.scanner-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.scanner-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.scanner-status span {
  flex: 1;
}

.scanner-status button {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.45;
  font-size: 0.75rem;
  color: inherit;
  padding: 2px 4px;
  border-radius: 3px;
  transition: opacity 0.1s;
}

.scanner-status button:hover {
  opacity: 1;
}

.scanner-status--cancelled {
  background: hsl(220, 13%, 96%);
  color: hsl(220, 9%, 45%);
  border: 1px solid hsl(220, 13%, 89%);
}

.scanner-status--failed {
  background: hsl(0, 65%, 97%);
  color: hsl(0, 55%, 40%);
  border: 1px solid hsl(0, 60%, 87%);
}

.scanner-layout {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 20px;
  align-items: start;
}

.scanner-btn {
  width: 100%;
  height: 100%;
  min-height: 220px;
  border: none;
  border-radius: 12px;
  background: hsl(222, 32%, 18%);
  cursor: pointer;
  transition: filter 0.15s, transform 0.12s;
  box-shadow: 0 4px 16px hsla(222, 32%, 10%, 0.25);
}

.scanner-btn:hover:not(:disabled) {
  filter: brightness(1.12);
  transform: translateY(-2px);
}

.scanner-btn:active:not(:disabled) {
  transform: translateY(0);
  filter: brightness(0.95);
}

.scanner-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.scanner-btn__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #fff;
}

.scanner-btn__icon-wrap {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-btn__icon {
  font-size: 1.625rem;
  opacity: 0.9;
}

.scanner-btn__label {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.scanner-btn__hint {
  font-size: 0.75rem;
  opacity: 0.45;
  letter-spacing: 0.01em;
}

.scanner-layout__side {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scanner-info-block {
  background: hsl(220, 14%, 98%);
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 10px;
  padding: 14px;
}

.scanner-info-block__title {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: hsl(220, 9%, 58%);
  margin-bottom: 10px;
}

.scanner-info-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.scanner-info-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: hsl(220, 9%, 32%);
}

.scanner-info-list li svg {
  width: 12px;
  color: hsl(220, 9%, 65%);
  flex-shrink: 0;
}

.scanner-info-code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: hsl(222, 47%, 40%);
  line-height: 1.7;
  display: block;
}

.bc-detail {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 480px;
}

.bc-detail__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bc-detail__back {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  color: hsl(220, 9%, 50%);
  padding: 4px 0;
  transition: color 0.1s;
}

.bc-detail__back:hover {
  color: hsl(220, 9%, 22%);
}

.bc-detail__verified {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  color: hsl(145, 50%, 36%);
  background: hsl(145, 55%, 94%);
  padding: 3px 10px;
  border-radius: 99px;
  border: 1px solid hsl(145, 50%, 82%);
}

.bc-images {
  display: flex;
  gap: 10px;
}

.bc-image {
  flex: 1;
  border-radius: 8px;
  border: 1px solid hsl(220, 13%, 90%);
  object-fit: cover;
  max-height: 120px;
  background: hsl(220, 14%, 96%);
}

.bc-image--back {
  opacity: 0.85;
}

.bc-identity {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px;
  background: hsl(220, 14%, 98%);
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 12px;
}

.bc-identity__avatar {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: hsl(222, 25%, 20%);
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.04em;
}

.bc-identity__info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.bc-identity__name {
  font-size: 1.0625rem;
  font-weight: 700;
  color: hsl(220, 9%, 12%);
  margin: 0;
  line-height: 1.2;
}

.bc-identity__title {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 40%);
  margin: 0;
}

.bc-identity__company {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: hsl(220, 9%, 30%);
  margin: 2px 0 0;
}

.bc-identity__company-icon {
  font-size: 0.6875rem;
  opacity: 0.6;
}

.bc-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bc-section__label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: hsl(220, 9%, 58%);
}

.bc-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bc-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid hsl(220, 13%, 92%);
  background: hsl(220, 14%, 98.5%);
  text-decoration: none;
  color: inherit;
  transition: background 0.1s, border-color 0.1s;
}

.bc-row--link:hover {
  background: hsl(220, 14%, 96%);
  border-color: hsl(220, 13%, 87%);
}

.bc-row__icon-wrap {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  flex-shrink: 0;
}

.bc-row__icon-wrap--blue   { background: hsl(214, 80%, 93%); color: hsl(214, 70%, 42%); }
.bc-row__icon-wrap--green  { background: hsl(145, 55%, 91%); color: hsl(145, 50%, 34%); }
.bc-row__icon-wrap--purple { background: hsl(265, 55%, 93%); color: hsl(265, 50%, 48%); }
.bc-row__icon-wrap--orange { background: hsl(33, 70%, 91%);  color: hsl(33, 60%, 38%);  }
.bc-row__icon-wrap--grey   { background: hsl(220, 13%, 92%); color: hsl(220, 9%, 48%);  }

.bc-row__content {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.bc-row__label {
  font-size: 0.6875rem;
  color: hsl(220, 9%, 58%);
  line-height: 1;
}

.bc-row__value {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 16%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.bc-row__external {
  font-size: 0.625rem;
  color: hsl(220, 9%, 72%);
  flex-shrink: 0;
}

.bc-note {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 30%);
  background: hsl(50, 50%, 97%);
  border: 1px solid hsl(50, 30%, 88%);
  border-radius: 8px;
  padding: 10px 12px;
  line-height: 1.5;
}

.bc-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 4px;
}

.bc-meta__chip {
  font-size: 0.6875rem;
  background: hsl(220, 13%, 93%);
  color: hsl(220, 9%, 52%);
  padding: 3px 8px;
  border-radius: 99px;
  border: 1px solid hsl(220, 13%, 88%);
}

.bc-meta__chip--mono {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.625rem;
}

.swap-enter-active, .swap-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.swap-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.swap-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

@media (max-width: 640px) {
  .bc-detail { max-width: 100%; }
}
</style>
