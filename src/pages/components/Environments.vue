<template>
  <div class="iva-form">
    <div class="iva-form__header">
      <h2 class="iva-form__title">
        Mobile Locker Javascript SDK Demo
      </h2>
      <p class="iva-form__subtitle">
        Runtime context detected by the MobileLocker SDK.
      </p>
    </div>
    <div class="iva-form__divider"/>
    <div class="iva-form__body">
      <div class="http-info-card"
           :class="`env-banner--${currentEnv}`">
        <div class="http-info-card__header">
          <FontAwesomeIcon :icon="currentEnvIcon"
                           class="http-info-card__icon"/>
          <span class="http-info-card__title">
            {{ currentEnvLabel }}
          </span>
        </div>
        <p class="http-info-card__body">
          {{ currentEnvMessage }}
        </p>
      </div>
      <div class="env-tabs">
        <button v-for="tab in tabs"
                :key="tab.key"
                class="env-tab"
                :class="{ 'env-tab--active': activeTab === tab.key }"
                @click="activeTab = tab.key">
          {{ tab.label }}
        </button>
      </div>
      <div v-if="activeTab === 'runtime'">
        <div class="http-info-card">
          <div class="http-info-card__header">
            <FontAwesomeIcon icon="microchip"
                             class="http-info-card__icon"/>
            <span class="http-info-card__title">Runtime Context</span>
          </div>
          <p class="http-info-card__body">
            SDK flags, network status, device permissions, and hardware info detected for the current runtime
            environment.
          </p>
        </div>
        <div class="env-columns">
          <div class="env-col">
            <div class="env-section-label">
              SDK flags
            </div>
            <div class="env-grid">
              <div v-for="flag in flagList"
                   :key="flag.key"
                   class="env-flag"
                   :class="{ 'env-flag--active': flag.value }">
                <FontAwesomeIcon :icon="flag.value ? 'circle-check' : 'circle'"
                                 class="env-flag__icon"/>
                <code class="env-flag__name">
                  {{ flag.key }}()
                </code>
                <span class="env-flag__badge"
                      :class="flag.value ? 'badge--true' : 'badge--false'">
                {{ flag.value ? 'true' : 'false' }}
              </span>
              </div>
            </div>
          </div>
          <div class="env-col">
            <div class="env-section-label">
              Network
            </div>
            <div class="env-grid">
              <div class="env-flag"
                   :class="{ 'env-flag--active': network && network.connected }">
                <FontAwesomeIcon :icon="network && network.connected ? 'wifi' : 'circle-xmark'"
                                 class="env-flag__icon"/>
                <div class="env-flag__info">
                  <code class="env-flag__name">
                    network.getStatus()
                  </code>
                  <span class="env-flag__desc">
                  {{ network ? (network.connected ? `Connected · ${network.type}` : 'No connection') : 'Loading…' }}
                </span>
                </div>
              </div>
            </div>
            <div class="env-section-label env-section-label--spaced">
              Permissions
            </div>
            <div class="env-grid">
              <div v-for="perm in permissionList"
                   :key="perm.key"
                   class="env-flag"
                   :class="{ 'env-flag--active': perm.granted }">
                <FontAwesomeIcon :icon="perm.icon"
                                 class="env-flag__icon"/>
                <div class="env-flag__info">
                  <code class="env-flag__name">
                    {{ perm.label }}
                  </code>
                  <span class="env-flag__desc">
                  {{ perm.status }}
                </span>
                </div>
                <span class="env-flag__badge"
                      :class="permBadgeClass(perm.status)">
                {{ perm.status }}
              </span>
              </div>
            </div>
          </div>
        </div>
        <div class="env-section-label env-section-label--spaced">
          Device
        </div>
        <div v-if="deviceInfo"
             class="env-device-grid">
          <div v-for="row in deviceInfoRows"
               :key="row.key"
               class="env-device-row">
            <code class="env-device-key">
              {{ row.key }}
            </code>
            <span class="env-device-val">
            {{ row.value }}
          </span>
          </div>
        </div>
        <div v-else
             class="env-device-empty">
          <FontAwesomeIcon icon="laptop-mobile"
                           class="env-device-empty__icon"/>
          <span>
          device.getInfo() — iOS app only
        </span>
        </div>
        <div class="env-section-label env-section-label--spaced">
          UI utilities
        </div>
        <div class="env-ui-row">
          <v-btn variant="outlined"
                 density="compact"
                 size="small"
                 @click="showToolbar">
            <FontAwesomeIcon icon="bars" style="margin-right: 6px; font-size: 0.75rem;"/>
            Show Toolbar
          </v-btn>
          <code class="env-device-key">ui.showToolbar()</code>
          <span v-if="uiToolbarCalled"
                style="display:inline-flex;align-items:center;gap:5px;font-size:0.75rem;font-weight:600;color:hsl(145,50%,36%);">
            <FontAwesomeIcon icon="circle-check"/> called
          </span>
        </div>
      </div>
      <div v-if="activeTab === 'http'"
           class="env-tab-panel">
        <div class="http-info-card">
          <div class="http-info-card__header">
            <FontAwesomeIcon icon="arrow-right-arrow-left"
                             class="http-info-card__icon"/>
            <span class="http-info-card__title">
              HTTP Requests
            </span>
          </div>
          <p class="http-info-card__body">
            Make cross-origin HTTP requests. In the iOS app, requests are proxied through the native layer to avoid
            CORS
            restrictions.
          </p>
        </div>
        <div class="field">
          <label class="field__label">
            Request URL
            <span class="field__req">
              *
            </span>
          </label>
          <v-text-field v-model="requestURL"
                        variant="outlined"
                        density="compact"
                        placeholder="https://fake-json-api.mock.beeceptor.com/users"
                        hide-details/>
        </div>
        <div class="field">
          <label class="field__label">
            Method
            <span class="field__req">
              *
            </span>
          </label>
          <div class="http-method-group">
            <button v-for="method in httpMethods"
                    :key="method.value"
                    type="button"
                    class="http-method-option"
                    :class="{ 'http-method-option--active': requestMethod === method.value }"
                    @click="requestMethod = method.value">
              <span class="http-method-option__dot"/>
              <code class="http-method-option__label">
                {{ method.value }}
              </code>
              <span class="http-method-option__desc">
                {{ method.desc }}
              </span>
            </button>
          </div>
        </div>
        <div class="iva-form__footer">
          <v-btn color="primary"
                 variant="flat"
                 :loading="loading"
                 :disabled="!requestURL || !requestMethod"
                 @click="requestMethod === 'GET' ? makeGetRequest() : makePostRequest()">
            Send Request
          </v-btn>
        </div>

        <div v-if="requestError" class="http-response http-response--error">
          <div class="env-section-label">
            Error
          </div>
          <pre class="http-response__body">
            {{ requestError }}
          </pre>
        </div>
        <div v-if="response" class="http-response">
          <div class="env-section-label">
            Response
          </div>
          <pre class="http-response__body">
            {{ JSON.stringify(response, null, 2) }}
          </pre>
        </div>
      </div>
      <div v-if="activeTab === 'storage'"
           class="env-tab-panel">
        <div class="http-info-card">
          <div class="http-info-card__header">
            <FontAwesomeIcon icon="database"
                             class="http-info-card__icon"/>
            <span class="http-info-card__title">
              Local Storage
            </span>
          </div>
          <p class="http-info-card__body">
            A localForage-compatible key-value store backed by native app storage, immune to the port-collision data
            loss problem in WKWebView. On iOS 5.3.0+ reads and writes go through the native layer. On CDN, Electron,
            and
            older iOS versions it falls back automatically to IndexedDB.
          </p>
        </div>

        <div class="iva-form__row">
          <div class="field"
               style="flex: 1">
            <label class="field__label">
              Key
            </label>
            <v-text-field v-model="storageKey"
                          variant="outlined"
                          density="compact"
                          placeholder="my-key"
                          hide-details/>
          </div>
          <div class="field"
               style="flex: 2">
            <label class="field__label">
              Value
            </label>
            <v-text-field v-model="storageValue"
                          variant="outlined"
                          density="compact"
                          placeholder='"hello" or {"theme":"dark"}'
                          hide-details/>
          </div>
        </div>
        <div class="iva-form__footer"
             style="margin-bottom: 20px">
          <v-btn color="primary"
                 variant="flat"
                 :loading="storageLoading"
                 :disabled="!storageKey || storageValue === ''"
                 @click="storageSetItem">
            Set Item
          </v-btn>
        </div>

        <div class="env-section-label env-section-label--spaced">
          Store contents
          <span v-if="storageItems.length"
                class="storage-count">
            {{ storageItems.length }}
          </span>
        </div>
        <p class="storage-persist-hint">
          To verify persistence, refresh the page or close and reopen the IVA in the browser or iOS app.
        </p>

        <div v-if="storageItems.length"
             class="storage-grid">
          <div v-for="item in storageItems"
               :key="item.key"
               class="storage-row">
            <code class="storage-row__key">
              {{ item.key }}
            </code>
            <span class="storage-row__value">
              {{ item.display }}
            </span>
            <button class="storage-row__remove"
                    @click="storageRemoveItem(item.key)">
              <FontAwesomeIcon icon="xmark"/>
            </button>
          </div>
        </div>
        <div v-else class="env-device-empty">
          <FontAwesomeIcon icon="inbox"
                           class="env-device-empty__icon"/>
          <span>
            No items in store
          </span>
        </div>

        <div v-if="storageItems.length"
             class="storage-clear-row">
          <v-btn variant="outlined"
                 color="error"
                 density="compact"
                 size="small"
                 :loading="storageLoading"
                 @click="storageClear">
            Clear all
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

export default {
  name: 'Environments',
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      activeTab: 'runtime',
      tabs: [
        {
          key: 'runtime',
          label: 'Runtime',
        },
        {
          key: 'http',
          label: 'HTTP',
        },
        {
          key: 'storage',
          label: 'Storage',
        },
      ],
      network: null,
      deviceInfo: null,
      loading: false,
      requestURL: '',
      requestMethod: null,
      requestError: null,
      response: null,
      httpMethods: [
        {
          value: 'GET',
          desc: 'Retrieve data from the endpoint',
        },
        {
          value: 'POST',
          desc: 'Send data to the endpoint',
        },
      ],
      storageKey: '',
      storageValue: '',
      storageItems: [],
      storageLoading: false,
      permissions: {
        camera: null,
        microphone: null,
        photoLibrary: null,
        location: null,
        bluetooth: null,
        biometric: null,
      },
      uiToolbarCalled: false,
    }
  },
  async created() {
    this.network = await this.$ml.network.getStatus()
    const deviceResult = await Promise.allSettled([this.$ml.device.get()])
    if (deviceResult[0].status === 'fulfilled') this.deviceInfo = deviceResult[0].value
    const [camera, microphone, photoLibrary, location, bluetooth, biometric] = await Promise.allSettled([
      this.$ml.permissions.camera(),
      this.$ml.permissions.microphone(),
      this.$ml.permissions.photoLibrary(),
      this.$ml.permissions.location(),
      this.$ml.permissions.bluetooth(),
      this.$ml.permissions.biometric(),
    ]);

    const val = r => r.status === 'fulfilled' ? r.value : null
    this.permissions.camera = val(camera)
    this.permissions.microphone = val(microphone)
    this.permissions.photoLibrary = val(photoLibrary)
    this.permissions.location = val(location)
    this.permissions.bluetooth = val(bluetooth)
    this.permissions.biometric = val(biometric)
  },
  watch: {
    activeTab(tab) {
      if (tab === 'storage') this.storageRefresh()
    },
  },
  computed: {
    flags() {
      return {
        isMobileLocker: this.$ml.isMobileLocker(),
        isApp: this.$ml.isApp(),
        isIOS: this.$ml.isIOS(),
        isElectron: this.$ml.isElectron(),
        isCDN: this.$ml.isCDN(),
      }
    },

    flagList() {
      return [
        {
          key: 'isMobileLocker',
          value: this.flags.isMobileLocker,
        },
        {
          key: 'isApp',
          value: this.flags.isApp,
        },
        {
          key: 'isIOS',
          value: this.flags.isIOS,
        },
        {
          key: 'isElectron',
          value: this.flags.isElectron,
        },
        {
          key: 'isCDN',
          value: this.flags.isCDN,
        },
      ]
    },

    permissionList() {
      const p = this.permissions
      const entry = (key, label, icon, raw) => ({
        key,
        label,
        icon,
        status: raw?.status ?? 'not_determined',
        granted: raw?.granted ?? raw?.available ?? false,
      })
      return [
        entry('camera', 'camera', 'camera', p.camera),
        entry('microphone', 'microphone', 'microphone', p.microphone),
        entry('photoLibrary', 'photo-library', 'image', p.photoLibrary),
        entry('location', 'location', 'location-dot', p.location),
        entry('bluetooth', 'bluetooth', 'bluetooth', p.bluetooth),
        entry('biometric', 'biometric', 'fingerprint',
            p.biometric ? {
              status: p.biometric.available ? 'available' : 'unavailable',
              granted: p.biometric.available,
            } : null
        ),
      ]
    },

    deviceInfoRows() {
      if (!this.deviceInfo) return []
      return Object.entries(this.deviceInfo).map(([key, value]) => ({
        key,
        value: value ?? '—',
      }))
    },

    currentEnv() {
      if (this.flags.isIOS) return 'ios'
      if (this.flags.isElectron) return 'electron'
      if (this.flags.isCDN) return 'cdn'
      return 'desktop'
    },

    currentEnvIcon() {
      return {
        ios: 'mobile-screen-button',
        electron: 'display',
        cdn: 'arrow-up-right-from-square',
        desktop: 'laptop-mobile',
      }[this.currentEnv]
    },

    currentEnvLabel() {
      return {
        ios: 'iOS / iPadOS App',
        electron: 'Electron (Windows) App',
        cdn: 'CDN Presentation',
        desktop: 'Desktop Browser',
      }[this.currentEnv]
    },

    currentEnvMessage() {
      return {
        ios: 'isIOS() and isApp() are true. Permissions and network reflect the device state.',
        electron: 'isElectron() and isApp() are true. Permissions and network reflect the device state.',
        cdn: 'isCDN() is true. Content is served from a CDN presentation URL.',
        desktop: 'Outside the MobileLocker runtime — all SDK flags are false. Network reflects navigator.onLine; permissions return not_determined.',
      }[this.currentEnv]
    },
  },
  methods: {
    async storageRefresh() {
      const items = []
      await this.$ml.localforage.iterate((value, key) => {
        const display = typeof value === 'object' && value !== null
            ? JSON.stringify(value)
            : String(value)
        items.push({key, value, display})
      })
      this.storageItems = items
    },
    async storageSetItem() {
      this.storageLoading = true
      try {
        let parsed
        try {
          parsed = JSON.parse(this.storageValue)
        } catch {
          parsed = this.storageValue
        }
        await this.$ml.localforage.setItem(this.storageKey, parsed)
        this.storageKey = ''
        this.storageValue = ''
        await this.storageRefresh()
      } finally {
        this.storageLoading = false
      }
    },
    async storageRemoveItem(key) {
      this.storageLoading = true
      try {
        await this.$ml.localforage.removeItem(key)
        await this.storageRefresh()
      } finally {
        this.storageLoading = false
      }
    },
    async storageClear() {
      this.storageLoading = true
      try {
        await this.$ml.localforage.clear()
        this.storageItems = []
      } finally {
        this.storageLoading = false
      }
    },
    async makeGetRequest() {
      this.response = null
      this.requestError = null
      try {
        this.loading = true
        this.response = await this.$ml.http.get(this.requestURL)
      } catch (error) {
        this.requestError = error?.message ?? String(error)
      } finally {
        this.loading = false
      }
    },
    async makePostRequest() {
      this.response = null
      this.requestError = null
      try {
        this.loading = true
        this.response = await this.$ml.http.post(this.requestURL)
      } catch (error) {
        this.requestError = error?.message ?? String(error)
      } finally {
        this.loading = false
      }
    },
    permBadgeClass(status) {
      return {
        'badge--true': status === 'granted' || status === 'available',
        'badge--denied': status === 'denied' || status === 'unavailable',
        'badge--false': status === 'not_determined' || status === 'restricted',
      }
    },
    showToolbar() {
      this.$ml.ui.showToolbar()
      this.uiToolbarCalled = true
      setTimeout(() => { this.uiToolbarCalled = false }, 2500)
    },
  },
}
</script>

<style scoped>
/* ── Info card (shared across all tabs + env banner) ── */
.http-info-card {
  padding: 13px 15px;
  border-radius: 8px;
  border: 1px solid hsl(210, 70%, 88%);
  background: hsl(210, 100%, 97%);
  margin-bottom: 20px;
}

.http-info-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.http-info-card__icon {
  font-size: 0.75rem;
  color: hsl(210, 80%, 50%);
  flex-shrink: 0;
}

.http-info-card__title {
  font-size: 0.8rem;
  font-weight: 600;
  color: hsl(210, 60%, 28%);
}

.http-info-card__body {
  font-size: 0.75rem;
  color: hsl(210, 30%, 42%);
  line-height: 1.6;
  margin: 0;
}

.http-info-card__body code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.7rem;
  background: hsl(210, 60%, 91%);
  color: hsl(210, 60%, 30%);
  padding: 1px 5px;
  border-radius: 3px;
}

/* ── Environment banner color overrides ── */
.env-banner--desktop {
  background: hsl(220, 14%, 97%);
  border-color: hsl(220, 13%, 91%);
}

.env-banner--desktop .http-info-card__icon {
  color: hsl(220, 9%, 50%);
}

.env-banner--desktop .http-info-card__title {
  color: hsl(220, 9%, 22%);
}

.env-banner--desktop .http-info-card__body {
  color: hsl(220, 9%, 48%);
}

.env-banner--ios {
  background: hsl(210, 100%, 97%);
  border-color: hsl(210, 80%, 85%);
}

.env-banner--electron {
  background: hsl(265, 60%, 97%);
  border-color: hsl(265, 50%, 85%);
}

.env-banner--electron .http-info-card__icon,
.env-banner--electron .http-info-card__title {
  color: hsl(265, 55%, 45%);
}

.env-banner--electron .http-info-card__body {
  color: hsl(265, 20%, 45%);
}

.env-banner--cdn {
  background: hsl(150, 60%, 96%);
  border-color: hsl(150, 50%, 82%);
}

.env-banner--cdn .http-info-card__icon,
.env-banner--cdn .http-info-card__title {
  color: hsl(150, 50%, 34%);
}

.env-banner--cdn .http-info-card__body {
  color: hsl(150, 20%, 40%);
}

/* ── Tabs ── */
.env-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid hsl(220, 13%, 91%);
  margin-bottom: 20px;
}

.env-tab {
  padding: 8px 14px;
  font-size: 0.75rem;
  font-weight: 600;
  color: hsl(220, 9%, 58%);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  letter-spacing: 0.01em;
  transition: color 0.15s, border-color 0.15s;
}

.env-tab:hover {
  color: hsl(220, 9%, 22%);
}

.env-tab--active {
  color: hsl(220, 9%, 16%);
  border-bottom-color: hsl(220, 70%, 52%);
}

.env-tab-panel {
  min-height: 80px;
}

/* ── Two-column layout ── */
.env-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

/* ── Section label ── */
.env-section-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: hsl(220, 9%, 58%);
  margin-bottom: 8px;
}

.env-section-label--spaced {
  margin-top: 16px;
}

/* ── Flag rows ── */
.env-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.env-flag {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 11px;
  border-radius: 6px;
  border: 1px solid hsl(220, 13%, 92%);
  background: hsl(220, 14%, 98%);
}

.env-flag--active {
  border-color: hsl(145, 55%, 78%);
  background: hsl(145, 60%, 97%);
}

.env-flag__icon {
  font-size: 0.8125rem;
  flex-shrink: 0;
  width: 13px;
  color: hsl(220, 9%, 72%);
}

.env-flag--active .env-flag__icon {
  color: hsl(145, 55%, 40%);
}

.env-flag__name {
  font-size: 0.75rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: hsl(220, 9%, 22%);
  flex: 1;
}

.env-flag__info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.env-flag__desc {
  font-size: 0.6875rem;
  color: hsl(220, 9%, 58%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── Badges ── */
.env-flag__badge {
  font-size: 0.625rem;
  font-weight: 700;
  font-family: 'SF Mono', 'Fira Code', monospace;
  padding: 2px 7px;
  border-radius: 99px;
  flex-shrink: 0;
  white-space: nowrap;
}

.badge--true {
  background: hsl(145, 55%, 88%);
  color: hsl(145, 55%, 30%);
}

.badge--false {
  background: hsl(220, 13%, 92%);
  color: hsl(220, 9%, 55%);
}

.badge--denied {
  background: hsl(0, 70%, 93%);
  color: hsl(0, 60%, 40%);
}

/* ── Device info ── */
.env-device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 5px;
  margin-top: 2px;
}

.env-device-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 11px;
  border-radius: 6px;
  border: 1px solid hsl(220, 13%, 92%);
  background: hsl(220, 14%, 98%);
}

.env-device-key {
  font-size: 0.75rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: hsl(220, 9%, 48%);
  flex-shrink: 0;
}

.env-device-val {
  font-size: 0.75rem;
  color: hsl(220, 9%, 22%);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.env-device-empty {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px dashed hsl(220, 13%, 88%);
  color: hsl(220, 9%, 62%);
  font-size: 0.75rem;
  margin-top: 2px;
}

.env-device-empty__icon {
  font-size: 0.8125rem;
}

/* ── HTTP tab ── */
.field {
  margin-bottom: 16px;
}

.field__label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: hsl(220, 9%, 58%);
  margin-bottom: 6px;
}

.field__req {
  color: hsl(0, 70%, 55%);
  margin-left: 2px;
}

.http-method-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.http-method-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid hsl(220, 13%, 92%);
  background: hsl(220, 14%, 98%);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.12s, background 0.12s;
}

.http-method-option:hover {
  border-color: hsl(220, 13%, 82%);
  background: hsl(220, 14%, 96%);
}

.http-method-option--active {
  border-color: hsl(210, 80%, 75%);
  background: hsl(210, 100%, 97%);
}

.http-method-option__dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid hsl(220, 13%, 78%);
  flex-shrink: 0;
  transition: border-color 0.12s, background 0.12s;
}

.http-method-option--active .http-method-option__dot {
  border-color: hsl(210, 80%, 52%);
  background: hsl(210, 80%, 52%);
  box-shadow: inset 0 0 0 2px hsl(210, 100%, 97%);
}

.http-method-option__label {
  font-size: 0.75rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-weight: 600;
  color: hsl(220, 9%, 22%);
  width: 34px;
}

.http-method-option__desc {
  font-size: 0.6875rem;
  color: hsl(220, 9%, 58%);
}

.http-response {
  margin-top: 20px;
}

.http-response--error .env-section-label {
  color: hsl(0, 60%, 50%);
}

.http-response__body {
  font-size: 0.7rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  background: hsl(220, 14%, 97%);
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 6px;
  padding: 12px 14px;
  margin: 0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  color: hsl(220, 9%, 22%);
  max-height: 260px;
  overflow-y: auto;
}

.http-response--error .http-response__body {
  background: hsl(0, 70%, 98%);
  border-color: hsl(0, 70%, 88%);
  color: hsl(0, 60%, 38%);
}

/* ── Storage tab ── */
.storage-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 700;
  background: hsl(220, 13%, 86%);
  color: hsl(220, 9%, 42%);
  border-radius: 99px;
  padding: 1px 6px;
  margin-left: 6px;
  vertical-align: middle;
  letter-spacing: 0;
}

.storage-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 2px;
}

.storage-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 11px;
  border-radius: 6px;
  border: 1px solid hsl(220, 13%, 92%);
  background: hsl(220, 14%, 98%);
}

.storage-row__key {
  font-size: 0.75rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: hsl(220, 9%, 32%);
  font-weight: 600;
  flex-shrink: 0;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.storage-row__value {
  font-size: 0.7rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: hsl(220, 9%, 55%);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.storage-row__remove {
  background: none;
  border: none;
  cursor: pointer;
  color: hsl(220, 9%, 72%);
  font-size: 0.7rem;
  padding: 2px 4px;
  flex-shrink: 0;
  transition: color 0.12s;
}

.storage-row__remove:hover {
  color: hsl(0, 60%, 52%);
}

.storage-persist-hint {
  font-size: 0.7rem;
  color: hsl(220, 9%, 62%);
  margin: 4px 0 10px;
  font-style: italic;
}

.storage-clear-row {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

/* ── UI utilities ── */
.env-ui-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 2px;
}

@media (max-width: 640px) {
  .env-columns {
    grid-template-columns: 1fr;
  }
}
</style>