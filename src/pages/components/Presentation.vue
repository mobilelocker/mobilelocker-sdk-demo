<template>
  <div class="iva-form">
    <div class="iva-form__header">
      <h2 class="iva-form__title">Presentations</h2>
      <p class="iva-form__subtitle">
        Browse, download, open, and share presentations from the MobileLocker library.
      </p>
    </div>
    <div class="iva-form__divider"/>

    <!-- ── Tab bar ── -->
    <div class="env-tabs">
      <button v-for="tab in tabs"
              :key="tab.key"
              class="env-tab"
              :class="{ 'env-tab--active': activeTab === tab.key }"
              @click="switchTab(tab.key)">
        {{ tab.label }}
      </button>
    </div>

    <!-- ══════════════════════════════════
         LIBRARY TAB
    ══════════════════════════════════ -->
    <div v-if="activeTab === 'library'" class="env-tab-panel">

      <!-- Empty / CTA state -->
      <div v-if="!presentations && !loadingAll" class="lib-cta">
        <div class="lib-cta__inner">
          <div class="lib-cta__icon-wrap">
            <FontAwesomeIcon icon="chart-line" class="lib-cta__icon"/>
          </div>
          <h3 class="lib-cta__heading">Your presentation library</h3>
          <p class="lib-cta__body">
            Fetch all presentations available to this user — with thumbnails,
            download status, type, and share capabilities.
          </p>
          <button class="lib-cta__btn" @click="loadAll">
            <FontAwesomeIcon icon="arrows-rotate"/>
            Load presentations
          </button>
          <span class="lib-sdk-footnote">presentation.getAll()</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-else-if="loadingAll" class="lib-loading">
        <v-progress-circular indeterminate size="32" width="2" color="primary"/>
        <span class="lib-loading__label">Fetching library…</span>
      </div>

      <!-- Loaded state -->
      <template v-else-if="presentations">
        <!-- Library header row -->
        <div class="lib-header">
          <span class="lib-header__count">
            {{ presentations.length }} presentation{{ presentations.length !== 1 ? 's' : '' }}
          </span>
          <div class="lib-header__actions">
            <button class="lib-icon-btn" :disabled="loadingAll" @click="loadAll" title="Refresh">
              <FontAwesomeIcon icon="arrows-rotate" :class="{ spin: loadingAll }"/>
            </button>
          </div>
        </div>

        <!-- Empty library -->
        <div v-if="presentations.length === 0" class="lib-empty">
          <FontAwesomeIcon icon="circle-xmark" class="lib-empty__icon"/>
          <p>No presentations found in this library.</p>
        </div>

        <!-- Card grid -->
        <div v-else class="lib-grid">
          <button v-for="pres in presentations"
                  :key="pres.id"
                  type="button"
                  class="lib-card"
                  :class="{ 'lib-card--open': selectedPres && selectedPres.id === pres.id }"
                  @click="selectPres(pres)">

            <!-- Thumbnail -->
            <div class="lib-card__thumb" :class="thumbClass(pres)">
              <img v-if="pres.thumbnail_url"
                   :src="pres.thumbnail_url"
                   :alt="pres.name"
                   class="lib-card__thumb-img"
                   loading="lazy"/>
              <div v-else class="lib-card__thumb-placeholder">
                <FontAwesomeIcon :icon="typeIcon(pres.type)" class="lib-card__thumb-icon"/>
              </div>
              <div class="lib-card__thumb-badges">
                <span v-if="pres.installed" class="lib-badge lib-badge--installed">
                  <FontAwesomeIcon icon="circle-check"/> Installed
                </span>
                <span v-else-if="pres.status" class="lib-badge lib-badge--status">
                  {{ pres.status }}
                </span>
              </div>
              <div v-if="pres.is_featured" class="lib-card__featured">
                <FontAwesomeIcon icon="star"/>
              </div>
            </div>

            <!-- Card body -->
            <div class="lib-card__body">
              <div class="lib-card__name">{{ pres.name || '—' }}</div>
              <div class="lib-card__meta">
                <span v-if="pres.type" class="lib-type-chip">{{ pres.type }}</span>
                <span class="lib-card__id">ID {{ pres.id }}</span>
              </div>
            </div>
          </button>
        </div>

        <!-- Detail dialog -->
        <v-dialog v-model="dialog" max-width="520" scrollable>
          <v-card v-if="selectedPres" rounded="lg">
            <!-- Dialog thumbnail header -->
            <div class="dlg-thumb" :class="thumbClass(selectedPres)">
              <img v-if="selectedPres.thumbnail_url"
                   :src="selectedPres.thumbnail_url"
                   :alt="selectedPres.name"
                   class="dlg-thumb__img"/>
              <div v-else class="dlg-thumb__placeholder">
                <FontAwesomeIcon :icon="typeIcon(selectedPres.type)" class="dlg-thumb__icon"/>
              </div>
              <div class="dlg-thumb__badges">
                <span v-if="selectedPres.installed" class="lib-badge lib-badge--installed">
                  <FontAwesomeIcon icon="circle-check"/> Installed
                </span>
                <span v-else-if="selectedPres.status" class="lib-badge lib-badge--status">
                  {{ selectedPres.status }}
                </span>
                <span v-if="selectedPres.is_featured" class="lib-badge lib-badge--featured">
                  <FontAwesomeIcon icon="star"/> Featured
                </span>
              </div>
            </div>

            <v-card-text class="dlg-body">
              <!-- Name + type -->
              <div class="dlg-title-row">
                <h3 class="dlg-title">{{ selectedPres.name || '—' }}</h3>
                <span v-if="selectedPres.type" class="lib-type-chip">{{ selectedPres.type }}</span>
              </div>

              <p v-if="selectedPres.description" class="dlg-desc">
                {{ selectedPres.description }}
              </p>

              <!-- Metadata rows -->
              <div class="dlg-meta">
                <div class="dlg-meta__row">
                  <code class="dlg-meta__key">id</code>
                  <span class="dlg-meta__val">{{ selectedPres.id }}</span>
                </div>
                <div v-if="selectedPres.slug" class="dlg-meta__row">
                  <code class="dlg-meta__key">slug</code>
                  <span class="dlg-meta__val">{{ selectedPres.slug }}</span>
                </div>
                <div v-if="selectedPres.locale" class="dlg-meta__row">
                  <code class="dlg-meta__key">locale</code>
                  <span class="dlg-meta__val">{{ selectedPres.locale }}</span>
                </div>
                <div v-if="selectedPres.expires_at" class="dlg-meta__row">
                  <code class="dlg-meta__key">expires_at</code>
                  <span class="dlg-meta__val">{{ selectedPres.expires_at }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="dlg-actions">
                <div class="lib-drawer__action">
                  <button class="lib-action-btn lib-action-btn--primary"
                          :disabled="downloading === selectedPres.id"
                          @click="downloadPres(selectedPres)">
                    <FontAwesomeIcon :icon="downloading === selectedPres.id ? 'arrows-rotate' : 'arrow-down'"
                                     :class="{ spin: downloading === selectedPres.id }"/>
                    {{ downloading === selectedPres.id ? 'Downloading…' : 'Download' }}
                  </button>
                  <span class="lib-sdk-footnote">presentation.download({{ selectedPres.id }})</span>
                </div>

                <div class="lib-drawer__action">
                  <button class="lib-action-btn" @click="openById(selectedPres)">
                    <FontAwesomeIcon icon="arrow-up-right-from-square"/>
                    Open
                  </button>
                  <span class="lib-sdk-footnote">presentation.openByID({{ selectedPres.id }})</span>
                </div>
              </div>

              <!-- UI: media viewer -->
              <div class="env-section-label" style="margin-top: 14px; margin-bottom: 10px;">
                Media viewer <code class="pres-label-method">ui</code>
              </div>
              <div class="dlg-ui-grid">
                <div class="dlg-ui-cell">
                  <input v-model="uiPdfPath"
                         class="shr-input dlg-ui-input"
                         placeholder="local/path/to/file.pdf"
                         @click.stop/>
                  <div class="lib-drawer__action">
                    <button class="lib-action-btn"
                            :disabled="!uiPdfPath"
                            @click="openAsPdf">
                      <FontAwesomeIcon icon="file-medical"/>
                      Open PDF
                    </button>
                    <span class="lib-sdk-footnote">ui.openPDF(path, title)</span>
                  </div>
                  <span v-if="uiPdfCalled"
                        style="display:inline-flex;align-items:center;gap:5px;font-size:0.75rem;font-weight:600;color:hsl(145,50%,36%);">
                    <FontAwesomeIcon icon="circle-check"/> called
                  </span>
                </div>
                <div class="dlg-ui-cell">
                  <input v-model="uiVideoPath"
                         class="shr-input dlg-ui-input"
                         placeholder="local/path/to/video.mp4"
                         @click.stop/>
                  <div class="lib-drawer__action">
                    <button class="lib-action-btn"
                            :disabled="!uiVideoPath"
                            @click="openAsVideo">
                      <FontAwesomeIcon icon="forward-step"/>
                      Open Video
                    </button>
                    <span class="lib-sdk-footnote">ui.openVideo(path)</span>
                  </div>
                  <span v-if="uiVideoResult"
                        :style="{color: uiVideoResult.error ? 'hsl(0,55%,40%)' : 'hsl(145,50%,36%)'}"
                        style="display:inline-flex;align-items:center;gap:5px;font-size:0.75rem;font-weight:600;">
                    <FontAwesomeIcon :icon="uiVideoResult.error ? 'triangle-exclamation' : 'circle-check'"/>
                    {{ uiVideoResult.error || 'opened' }}
                  </span>
                </div>
              </div>

              <!-- Feedback -->
              <div v-if="downloadResults[selectedPres.id]"
                   class="lib-drawer__result mt-3"
                   :class="downloadResults[selectedPres.id].error ? 'lib-result--error' : 'lib-result--ok'">
                <FontAwesomeIcon :icon="downloadResults[selectedPres.id].error ? 'triangle-exclamation' : 'circle-check'"/>
                <span v-if="downloadResults[selectedPres.id].error">{{ downloadResults[selectedPres.id].error }}</span>
                <span v-else>Downloaded · <code>{{ downloadResults[selectedPres.id].status }}</code></span>
              </div>
              <div v-if="openedId === selectedPres.id" class="lib-drawer__result lib-result--ok mt-3">
                <FontAwesomeIcon icon="circle-check"/>
                <span>Opened</span>
              </div>
            </v-card-text>

            <v-card-actions class="dlg-footer">
              <v-spacer/>
              <v-btn variant="text" @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </template>
    </div>

    <!-- ══════════════════════════════════
         CURRENT TAB
    ══════════════════════════════════ -->
    <div v-if="activeTab === 'current'" class="env-tab-panel">

      <div v-if="loadingCurrent" class="lib-loading">
        <v-progress-circular indeterminate size="28" width="2" color="primary"/>
        <span class="lib-loading__label">Loading current presentation…</span>
      </div>

      <template v-else>
        <!-- Current presentation card -->
        <div v-if="currentPres" class="cur-card">
          <div class="cur-card__thumb" :class="thumbClass(currentPres)">
            <img v-if="currentPres.thumbnail_url"
                 :src="currentPres.thumbnail_url"
                 :alt="currentPres.name"
                 class="cur-card__thumb-img"/>
            <div v-else class="cur-card__thumb-placeholder">
              <FontAwesomeIcon :icon="typeIcon(currentPres.type)" class="cur-card__thumb-icon"/>
            </div>
          </div>
          <div class="cur-card__body">
            <div class="cur-card__header-row">
              <h3 class="cur-card__name">{{ currentPres.name || '—' }}</h3>
              <span v-if="currentPres.type" class="lib-type-chip">{{ currentPres.type }}</span>
            </div>
            <div class="cur-card__rows">
              <div v-for="row in currentPresRows" :key="row.key" class="cur-card__row">
                <code class="cur-card__key">{{ row.key }}</code>
                <span class="cur-card__val">{{ row.value }}</span>
              </div>
            </div>
            <span class="lib-sdk-footnote" style="margin-top: 10px; display: block;">presentation.get()</span>
          </div>
        </div>

        <div v-else class="lib-empty" style="padding: 36px 0;">
          <FontAwesomeIcon icon="circle-xmark" class="lib-empty__icon"/>
          <p>No active presentation — <code style="font-family: monospace; font-size: 0.75rem;">presentation.get()</code> returned null.</p>
        </div>

        <!-- Lifecycle actions -->
        <div class="cur-actions">
          <div class="env-section-label">Lifecycle actions</div>

          <div class="cur-actions__row">
            <div class="cur-action-cell">
              <button class="lib-action-btn" @click="reloadPres">
                <FontAwesomeIcon icon="arrows-rotate"/>
                Reload
              </button>
              <span class="lib-sdk-footnote">presentation.reload()</span>
              <transition name="fade-in">
                <span v-if="reloadCalled" class="cur-confirm">
                  <FontAwesomeIcon icon="circle-check"/> called
                </span>
              </transition>
            </div>

            <div class="cur-action-cell">
              <button class="lib-action-btn lib-action-btn--danger" @click="closePres">
                <FontAwesomeIcon icon="xmark"/>
                Close
              </button>
              <span class="lib-sdk-footnote">presentation.close()</span>
              <transition name="fade-in">
                <span v-if="closeCalled" class="cur-confirm">
                  <FontAwesomeIcon icon="circle-check"/> called
                </span>
              </transition>
            </div>
          </div>
        </div>

        <!-- Device events -->
        <div class="cur-events">
          <div class="env-section-label" style="margin-bottom: 10px;">
            Device events
            <code class="pres-label-method">presentation.getDeviceEvents()</code>
          </div>

          <div v-if="loadingEvents" class="lib-loading lib-loading--inline">
            <v-progress-circular indeterminate size="18" width="2" color="primary"/>
          </div>
          <div v-else-if="deviceEvents && deviceEvents.length > 0" class="cur-event-list">
            <div v-for="(evt, i) in deviceEvents" :key="i" class="cur-event-row">
              <FontAwesomeIcon icon="calendar" class="cur-event-row__icon"/>
              <code class="cur-event-row__json">{{ JSON.stringify(evt) }}</code>
            </div>
          </div>
          <div v-else-if="deviceEvents" class="lib-empty lib-empty--sm">
            <p>No device events for this presentation.</p>
          </div>
        </div>
      </template>
    </div>

    <!-- ══════════════════════════════════
         SHARE TAB
    ══════════════════════════════════ -->
    <div v-if="activeTab === 'share'" class="env-tab-panel">

      <!-- Notification level -->
      <div class="shr-section">
        <div class="env-section-label" style="margin-bottom: 12px;">
          Notification level
          <code class="pres-label-method">notificationLevels</code>
        </div>
        <div class="shr-notify-grid">
          <button v-for="level in notifyLevels"
                  :key="level.value"
                  class="shr-notify-btn"
                  :class="{ 'shr-notify-btn--active': notifyLevel === level.value }"
                  @click="notifyLevel = level.value">
            <code class="shr-notify-btn__const">{{ level.const }}</code>
            <span class="shr-notify-btn__label">{{ level.label }}</span>
          </button>
        </div>
      </div>

      <!-- Recipients -->
      <div class="shr-section">
        <div class="env-section-label" style="margin-bottom: 12px;">Recipients</div>
        <div class="shr-recipients">
          <div v-for="(r, i) in recipients" :key="i" class="shr-recipient-row">
            <input v-model="recipients[i].name"
                   class="shr-input shr-input--name"
                   placeholder="Name (optional)"/>
            <input v-model="recipients[i].email"
                   class="shr-input shr-input--email"
                   type="email"
                   placeholder="email@example.com"/>
            <button class="shr-remove-btn" @click="removeRecipient(i)" title="Remove">
              <FontAwesomeIcon icon="xmark"/>
            </button>
          </div>
          <button class="shr-add-btn" @click="addRecipient">
            <FontAwesomeIcon icon="plus"/>
            Add recipient
          </button>
        </div>
      </div>

      <!-- Send reminders -->
      <div class="shr-section shr-section--row">
        <label class="shr-reminder-row">
          <input v-model="sendReminders" type="checkbox" class="shr-reminder-check"/>
          <span class="shr-reminder-label">Send reminders</span>
        </label>
      </div>

      <!-- Send action -->
      <div class="shr-section shr-footer">
        <div class="shr-footer__action">
          <button class="shr-send-btn"
                  :disabled="!hasValidRecipient || shareSent"
                  @click="sharePresentation">
            <FontAwesomeIcon icon="paper-plane"/>
            {{ shareSent ? 'Shared' : 'Share Presentation' }}
          </button>
          <span class="lib-sdk-footnote">
            share.presentation(recipients, {{ notifyLevel }})
          </span>
        </div>
        <transition name="fade-in">
          <div v-if="shareSent" class="lib-confirm-banner lib-confirm-banner--mt">
            <FontAwesomeIcon icon="circle-check"/>
            Shared with {{ recipients.filter(r => r.email).length }}
            recipient{{ recipients.filter(r => r.email).length !== 1 ? 's' : '' }} · level {{ notifyLevel }}
          </div>
        </transition>
      </div>

    </div>
  </div>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

const TYPE_CLASSES = {
  pdf:   'thumb--pdf',
  video: 'thumb--video',
  html:  'thumb--html',
}

const TYPE_ICONS = {
  pdf:   'file-medical',
  video: 'forward-step',
  html:  'laptop-mobile',
}

export default {
  name: 'Presentation',
  components: {FontAwesomeIcon},

  data() {
    return {
      activeTab: 'library',
      tabs: [
        {key: 'library', label: 'Library'},
        {key: 'current', label: 'Current'},
        {key: 'share',   label: 'Share'},
      ],

      // library
      presentations:   null,
      loadingAll:      false,
      expandedId:      null,
      dialog:          false,
      downloading:     null,
      downloadResults: {},
      openedId:        null,
      selectedPres:    null,
      uiPdfPath:       '',
      uiVideoPath:     '',
      uiPdfCalled:     false,
      uiVideoResult:   null,

      // current
      currentPres:     null,
      loadingCurrent:  false,
      deviceEvents:    null,
      loadingEvents:   false,
      reloadCalled:    false,
      closeCalled:     false,

      // share
      notifyLevel:    0,
      recipients:     [{name: '', email: ''}],
      sendReminders:  false,
      shareSent:      false,

      notifyLevels: [
        {const: 'NOTIFY_NONE',    value: 0, label: 'None'},
        {const: 'NOTIFY_FIRST',   value: 1, label: 'First open'},
        {const: 'NOTIFY_EVERY',   value: 2, label: 'Every open'},
        {const: 'NOTIFY_WEEKLY',  value: 3, label: 'Weekly'},
        {const: 'NOTIFY_MONTHLY', value: 4, label: 'Monthly'},
      ],
    }
  },

  computed: {
    currentPresRows() {
      if (!this.currentPres) return []
      const p = this.currentPres
      return [
        {key: 'id',          value: p.id            ?? null},
        {key: 'slug',        value: p.slug          ?? null},
        {key: 'status',      value: p.status        ?? null},
        {key: 'installed',   value: p.installed != null ? String(p.installed) : null},
        {key: 'locale',      value: p.locale        ?? null},
        {key: 'expires_at',  value: p.expires_at    ?? null},
      ].filter(r => r.value !== null && r.value !== '')
    },
    hasValidRecipient() {
      return this.recipients.some(r => r.email && r.email.includes('@'))
    },
  },

  methods: {
    switchTab(key) {
      this.activeTab = key
      if (key === 'current' && !this.currentPres && !this.loadingCurrent) {
        this.loadCurrent()
      }
    },

    thumbClass(pres) {
      return TYPE_CLASSES[pres?.type] ?? 'thumb--default'
    },

    typeIcon(type) {
      return TYPE_ICONS[type] ?? 'bars'
    },

    async loadAll() {
      this.loadingAll = true
      this.downloadResults = {}
      this.selectedPres = null
      this.dialog       = false
      try {
        this.presentations = this.presentations
          ? await this.$ml.presentation.refresh()
          : await this.$ml.presentation.getAll()
        this.$ml.analytics.logEvent('presentation', 'load_library', '/presentation', {
          count: this.presentations?.length,
        })
      } catch {
        this.presentations = []
      } finally {
        this.loadingAll = false
      }
    },

    selectPres(pres) {
      this.selectedPres  = pres
      this.openedId      = null
      this.dialog        = true
      this.uiPdfPath     = pres.type === 'pdf'   ? (pres.slug || pres.name || '') : ''
      this.uiVideoPath   = pres.type === 'video' ? (pres.slug || pres.name || '') : ''
      this.uiPdfCalled   = false
      this.uiVideoResult = null
    },

    async downloadPres(pres) {
      this.downloading = pres.id
      try {
        const result = await this.$ml.presentation.download(pres.id)
        this.downloadResults = {
          ...this.downloadResults,
          [pres.id]: {status: result?.status ?? 'ok'},
        }
        this.$ml.analytics.logEvent('presentation', 'download', '/presentation', {
          id: pres.id, status: result?.status,
        })
      } catch (err) {
        this.downloadResults = {
          ...this.downloadResults,
          [pres.id]: {error: err?.message ?? 'Download failed'},
        }
      } finally {
        this.downloading = null
      }
    },

    openById(pres) {
      this.$ml.presentation.openByID(pres.id)
      this.openedId = pres.id
      this.$ml.analytics.logEvent('presentation', 'open', '/presentation', {id: pres.id})
    },

    async loadCurrent() {
      this.loadingCurrent = true
      this.loadingEvents  = true
      try {
        this.currentPres = await this.$ml.presentation.get()
      } catch {
        this.currentPres = null
      } finally {
        this.loadingCurrent = false
      }
      try {
        this.deviceEvents = await this.$ml.presentation.getDeviceEvents()
      } catch {
        this.deviceEvents = []
      } finally {
        this.loadingEvents = false
      }
    },

    reloadPres() {
      this.$ml.presentation.reload()
      this.reloadCalled = true
      setTimeout(() => { this.reloadCalled = false }, 2500)
    },

    closePres() {
      this.$ml.presentation.close()
      this.closeCalled = true
      setTimeout(() => { this.closeCalled = false }, 2500)
    },

    addRecipient() {
      this.recipients.push({name: '', email: ''})
    },

    removeRecipient(i) {
      if (this.recipients.length === 1) {
        this.recipients[0] = {name: '', email: ''}
      } else {
        this.recipients.splice(i, 1)
      }
    },

    openAsPdf() {
      this.$ml.ui.openPDF(this.uiPdfPath, this.selectedPres?.name || 'Document')
      this.uiPdfCalled = true
      setTimeout(() => { this.uiPdfCalled = false }, 2500)
    },

    async openAsVideo() {
      try {
        this.uiVideoResult = await this.$ml.ui.openVideo(this.uiVideoPath)
      } catch (e) {
        this.uiVideoResult = {error: e?.message ?? 'Failed to open video'}
      }
    },

    sharePresentation() {
      const valid = this.recipients
        .filter(r => r.email && r.email.includes('@'))
        .map(r => r.name ? {name: r.name, email: r.email} : {email: r.email})
      if (!valid.length) return
      this.$ml.share.presentation(valid, this.notifyLevel, this.sendReminders)
      this.$ml.analytics.logEvent('share', 'presentation', '/presentation', {
        recipient_count: valid.length, notify_level: this.notifyLevel,
      })
      this.shareSent = true
      setTimeout(() => { this.shareSent = false }, 3000)
    },
  },
}
</script>

<style scoped>
/* ─────────────────────────────────────────
   Tab bar (local copy — env-tabs is scoped to Environments.vue)
───────────────────────────────────────── */
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

.env-tab:hover { color: hsl(220, 9%, 22%); }

.env-tab--active {
  color: hsl(220, 9%, 16%);
  border-bottom-color: hsl(220, 70%, 52%);
}

.env-tab-panel { min-height: 80px; }

.env-section-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: hsl(220, 9%, 58%);
  margin-bottom: 8px;
}

.env-section-label--spaced { margin-top: 16px; }

/* ─────────────────────────────────────────
   Shared SDK footnote (method hint)
───────────────────────────────────────── */
.lib-sdk-footnote {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.65rem;
  color: hsl(220, 9%, 62%);
  letter-spacing: 0.01em;
  display: inline-block;
}

/* ─────────────────────────────────────────
   Loading state
───────────────────────────────────────── */
.lib-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 52px 0;
}

.lib-loading--inline {
  flex-direction: row;
  padding: 16px 0;
  justify-content: flex-start;
}

.lib-loading__label {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 55%);
}

/* ─────────────────────────────────────────
   Empty / CTA
───────────────────────────────────────── */
.lib-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0 8px;
}

.lib-cta__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  max-width: 360px;
}

.lib-cta__icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: hsl(220, 14%, 94%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lib-cta__icon {
  font-size: 1.625rem;
  color: hsl(220, 9%, 52%);
}

.lib-cta__heading {
  font-size: 1rem;
  font-weight: 700;
  color: hsl(220, 9%, 14%);
  margin: 0;
  letter-spacing: -0.02em;
}

.lib-cta__body {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 52%);
  line-height: 1.6;
  margin: 0;
}

.lib-cta__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  border-radius: 9px;
  border: none;
  background: rgb(var(--v-theme-primary));
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: filter 0.12s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(9, 170, 234, 0.28);
}

.lib-cta__btn:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.lib-cta__btn:active {
  transform: translateY(0);
}

.lib-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 24px;
  text-align: center;
}

.lib-empty--sm { padding: 16px 0; }

.lib-empty__icon {
  font-size: 1.75rem;
  color: hsl(220, 9%, 82%);
}

.lib-empty p {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 55%);
  margin: 0;
}

/* ─────────────────────────────────────────
   Library header (loaded state)
───────────────────────────────────────── */
.lib-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.lib-header__count {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: hsl(220, 9%, 55%);
}

.lib-header__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.lib-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1px solid hsl(220, 13%, 88%);
  background: white;
  color: hsl(220, 9%, 45%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
}

.lib-icon-btn:hover:not(:disabled) {
  background: hsl(220, 14%, 95%);
  border-color: hsl(220, 13%, 74%);
  color: hsl(220, 9%, 22%);
}

.lib-icon-btn:disabled { opacity: 0.4; cursor: default; }

/* ─────────────────────────────────────────
   Card grid
───────────────────────────────────────── */
.lib-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 8px;
}

.lib-card {
  /* button reset */
  appearance: none;
  -webkit-appearance: none;
  padding: 0;
  margin: 0;
  text-align: left;
  font: inherit;
  /* card styles */
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 10px;
  background: white;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.lib-card:hover {
  border-color: hsl(220, 13%, 78%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.lib-card--open {
  border-color: hsl(220, 50%, 72%);
  box-shadow: 0 2px 12px rgba(9, 100, 200, 0.10);
}

/* Thumbnail */
.lib-card__thumb {
  aspect-ratio: 16 / 9;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.thumb--html    { background: linear-gradient(135deg, hsl(210, 80%, 22%) 0%, hsl(210, 65%, 38%) 100%); }
.thumb--pdf     { background: linear-gradient(135deg, hsl(4,  70%, 28%) 0%, hsl(4,  60%, 44%) 100%); }
.thumb--video   { background: linear-gradient(135deg, hsl(265, 55%, 24%) 0%, hsl(265, 45%, 42%) 100%); }
.thumb--default { background: linear-gradient(135deg, hsl(222, 32%, 18%) 0%, hsl(222, 25%, 30%) 100%); }

.lib-card__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.2s;
}

.lib-card:hover .lib-card__thumb-img {
  transform: scale(1.02);
}

.lib-card__thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lib-card__thumb-icon {
  font-size: 1.75rem;
  color: rgba(255, 255, 255, 0.25);
}

.lib-card__thumb-badges {
  position: absolute;
  bottom: 7px;
  left: 7px;
  display: flex;
  gap: 5px;
}

.lib-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  backdrop-filter: blur(6px);
}

.lib-badge--installed {
  background: rgba(50, 200, 100, 0.85);
  color: white;
}

.lib-badge--status {
  background: rgba(0, 0, 0, 0.45);
  color: rgba(255, 255, 255, 0.9);
}

.lib-card__featured {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: rgba(255, 200, 50, 0.9);
  color: hsl(42, 80%, 28%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  backdrop-filter: blur(4px);
}

/* Card body */
.lib-card__body {
  padding: 10px 12px 12px;
  cursor: pointer;
}

.lib-card__name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: hsl(220, 9%, 14%);
  line-height: 1.35;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lib-card__meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.lib-type-chip {
  font-size: 0.5625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 2px 6px;
  border-radius: 4px;
  background: hsl(220, 14%, 92%);
  color: hsl(220, 9%, 45%);
}

.lib-card__id {
  font-size: 0.6875rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: hsl(220, 9%, 62%);
}

/* Detail panel — full-width, below the grid */
.lib-detail-panel {
  margin-top: 12px;
  border: 1px solid hsl(220, 50%, 80%);
  border-radius: 10px;
  background: hsl(220, 14%, 98.5%);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.lib-detail-panel__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.lib-detail-panel__title-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.lib-detail-panel__thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lib-detail-panel__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.lib-detail-panel__thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lib-detail-panel__thumb-icon {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.3);
}

.lib-detail-panel__meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;
}

.lib-detail-panel__name {
  font-size: 0.9375rem;
  font-weight: 700;
  color: hsl(220, 9%, 12%);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.lib-detail-panel__sub {
  display: flex;
  align-items: center;
  gap: 7px;
}

.lib-detail-panel__desc {
  font-size: 0.75rem;
  color: hsl(220, 9%, 48%);
  line-height: 1.55;
  margin: 4px 0 0;
}

.lib-detail-panel__close {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid hsl(220, 13%, 88%);
  background: white;
  color: hsl(220, 9%, 52%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
  transition: background 0.1s, color 0.1s;
}

.lib-detail-panel__close:hover {
  background: hsl(220, 14%, 93%);
  color: hsl(220, 9%, 22%);
}

.lib-detail-panel__actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  padding-top: 2px;
  border-top: 1px solid hsl(220, 13%, 91%);
}

.lib-drawer__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.lib-drawer__action {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.lib-drawer__result {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.lib-drawer__result code {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.6875rem;
}

.lib-result--ok {
  background: hsl(145, 55%, 94%);
  border: 1px solid hsl(145, 50%, 82%);
  color: hsl(145, 50%, 30%);
}

.lib-result--error {
  background: hsl(0, 65%, 97%);
  border: 1px solid hsl(0, 60%, 87%);
  color: hsl(0, 55%, 40%);
}

/* ─────────────────────────────────────────
   Detail dialog
───────────────────────────────────────── */
.lib-badge--featured {
  background: rgba(255, 200, 50, 0.88);
  color: hsl(42, 80%, 28%);
}

.dlg-thumb {
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.dlg-thumb__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.dlg-thumb__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dlg-thumb__icon {
  font-size: 3rem;
  color: rgba(255, 255, 255, 0.22);
}

.dlg-thumb__badges {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.dlg-body {
  padding: 16px 20px !important;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.dlg-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.dlg-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: hsl(220, 9%, 12%);
  margin: 0;
  letter-spacing: -0.02em;
  flex: 1;
  min-width: 0;
}

.dlg-desc {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 48%);
  line-height: 1.6;
  margin: 0 0 14px;
}

.dlg-meta {
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.dlg-meta__row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 7px 12px;
  border-bottom: 1px solid hsl(220, 13%, 93%);
}

.dlg-meta__row:last-child { border-bottom: none; }

.dlg-meta__key {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.6875rem;
  color: hsl(220, 9%, 55%);
  min-width: 80px;
  flex-shrink: 0;
}

.dlg-meta__val {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 22%);
  word-break: break-all;
}

.dlg-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.dlg-footer {
  padding: 8px 16px !important;
  border-top: 1px solid hsl(220, 13%, 92%);
}

.mt-3 { margin-top: 12px; }

.dlg-ui-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 4px;
}

.dlg-ui-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.dlg-ui-input {
  flex: 1;
  min-width: 120px;
  max-width: 200px;
}

/* Action buttons (shared across tabs) */
.lib-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 7px;
  border: 1px solid hsl(220, 13%, 86%);
  background: white;
  font-size: 0.8125rem;
  font-weight: 600;
  color: hsl(220, 9%, 22%);
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: background 0.12s, border-color 0.12s;
  white-space: nowrap;
}

.lib-action-btn:hover:not(:disabled) {
  background: hsl(220, 14%, 95%);
  border-color: hsl(220, 13%, 74%);
}

.lib-action-btn:disabled { opacity: 0.5; cursor: default; }

.lib-action-btn--primary {
  background: rgb(var(--v-theme-primary));
  border-color: transparent;
  color: white;
}

.lib-action-btn--primary:hover:not(:disabled) {
  filter: brightness(1.08);
  background: rgb(var(--v-theme-primary));
}

.lib-action-btn--danger {
  border-color: hsl(0, 60%, 87%);
  color: hsl(0, 55%, 40%);
}

.lib-action-btn--danger:hover:not(:disabled) {
  background: hsl(0, 65%, 97%);
}

/* Confirm banner */
.lib-confirm-banner {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 7px;
  background: hsl(145, 55%, 94%);
  border: 1px solid hsl(145, 50%, 82%);
  color: hsl(145, 50%, 30%);
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.lib-confirm-banner--mt { margin-top: 14px; margin-bottom: 0; }


/* ─────────────────────────────────────────
   CURRENT TAB
───────────────────────────────────────── */
.cur-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 20px;
  align-items: start;
  background: hsl(220, 14%, 98.5%);
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 28px;
}

.cur-card__thumb {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cur-card__thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cur-card__thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cur-card__thumb-icon {
  font-size: 2rem;
  color: rgba(255, 255, 255, 0.25);
}

.cur-card__body {
  padding: 18px 18px 18px 0;
  display: flex;
  flex-direction: column;
}

.cur-card__header-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}

.cur-card__name {
  font-size: 1rem;
  font-weight: 700;
  color: hsl(220, 9%, 12%);
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.25;
  flex: 1;
  min-width: 0;
}

.cur-card__rows {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cur-card__row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.cur-card__key {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.6875rem;
  color: hsl(220, 9%, 55%);
  min-width: 86px;
  flex-shrink: 0;
}

.cur-card__val {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 22%);
  word-break: break-all;
}

.cur-actions {
  margin-bottom: 28px;
}

.cur-actions__row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.cur-action-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cur-confirm {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  color: hsl(145, 50%, 36%);
}

.cur-events { /* section container */ }

.cur-event-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cur-event-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px 11px;
  background: hsl(220, 14%, 97%);
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 7px;
}

.cur-event-row__icon {
  font-size: 0.75rem;
  color: hsl(220, 9%, 62%);
  margin-top: 2px;
  flex-shrink: 0;
}

.cur-event-row__json {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.6875rem;
  color: hsl(220, 9%, 30%);
  line-height: 1.55;
  word-break: break-all;
  white-space: pre-wrap;
}

.pres-label-method {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.6rem;
  color: hsl(222, 47%, 45%);
  background: hsl(222, 60%, 96%);
  padding: 1px 5px;
  border-radius: 3px;
  margin-left: 6px;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}

/* ─────────────────────────────────────────
   SHARE TAB
───────────────────────────────────────── */
.shr-section {
  margin-bottom: 24px;
}

.shr-section--row {
  margin-bottom: 20px;
}

.shr-footer {
  padding-top: 20px;
  border-top: 1px solid hsl(220, 13%, 91%);
  margin-bottom: 0;
}

.shr-footer__action {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.shr-notify-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.shr-notify-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border-radius: 9px;
  border: 1.5px solid hsl(220, 13%, 88%);
  background: white;
  cursor: pointer;
  min-width: 86px;
  transition: border-color 0.12s, background 0.12s, box-shadow 0.12s;
}

.shr-notify-btn:hover {
  border-color: hsl(220, 13%, 70%);
  background: hsl(220, 14%, 97%);
}

.shr-notify-btn--active {
  border-color: rgb(var(--v-theme-primary));
  background: hsl(200, 90%, 97%);
  box-shadow: 0 0 0 3px rgba(9, 170, 234, 0.10);
}

.shr-notify-btn__const {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.6rem;
  color: hsl(222, 47%, 42%);
  line-height: 1;
  white-space: nowrap;
}

.shr-notify-btn--active .shr-notify-btn__const {
  color: hsl(200, 90%, 30%);
}

.shr-notify-btn__label {
  font-size: 0.6875rem;
  font-weight: 500;
  color: hsl(220, 9%, 45%);
  white-space: nowrap;
}

.shr-recipients {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shr-recipient-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.shr-input {
  border: 1px solid hsl(220, 13%, 86%);
  border-radius: 7px;
  padding: 9px 11px;
  font-size: 0.8125rem;
  font-family: inherit;
  background: white;
  color: hsl(220, 9%, 14%);
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
  -webkit-user-select: text !important;
  user-select: text !important;
}

.shr-input:focus {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 3px rgba(9, 170, 234, 0.10);
}

.shr-input::placeholder { color: hsl(220, 9%, 65%); }

.shr-input--name  { width: 140px; flex-shrink: 0; }
.shr-input--email { flex: 1; min-width: 0; }

.shr-remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: 1px solid hsl(220, 13%, 88%);
  background: white;
  color: hsl(220, 9%, 55%);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
  transition: background 0.1s, border-color 0.1s;
}

.shr-remove-btn:hover {
  background: hsl(0, 65%, 97%);
  border-color: hsl(0, 60%, 87%);
  color: hsl(0, 55%, 40%);
}

.shr-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 13px;
  border-radius: 7px;
  border: 1.5px dashed hsl(220, 13%, 80%);
  background: transparent;
  font-size: 0.8rem;
  font-weight: 500;
  color: hsl(220, 9%, 52%);
  cursor: pointer;
  align-self: flex-start;
  transition: border-color 0.12s, color 0.12s;
}

.shr-add-btn:hover {
  border-color: hsl(220, 13%, 55%);
  color: hsl(220, 9%, 28%);
}

.shr-reminder-row {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
}

.shr-reminder-check {
  width: 15px;
  height: 15px;
  accent-color: rgb(var(--v-theme-primary));
  cursor: pointer;
  flex-shrink: 0;
}

.shr-reminder-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: hsl(220, 9%, 30%);
}

.shr-send-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 8px;
  border: none;
  background: rgb(var(--v-theme-primary));
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: -0.01em;
  transition: filter 0.12s, transform 0.1s;
  box-shadow: 0 2px 8px rgba(9, 170, 234, 0.25);
}

.shr-send-btn:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.shr-send-btn:disabled { opacity: 0.45; cursor: default; box-shadow: none; }

/* ─────────────────────────────────────────
   Transitions
───────────────────────────────────────── */
.drawer-enter-active, .drawer-leave-active {
  transition: opacity 0.15s, transform 0.15s;
  transform-origin: top;
}

.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
  transform: scaleY(0.94);
}

.fade-in-enter-active { transition: opacity 0.2s; }
.fade-in-enter-from   { opacity: 0; }
.fade-in-leave-active { transition: opacity 0.15s; }
.fade-in-leave-to     { opacity: 0; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spin { animation: spin 0.7s linear infinite; }

/* ─────────────────────────────────────────
   Responsive
───────────────────────────────────────── */
@media (max-width: 860px) {
  .lib-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .lib-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  .cur-card { grid-template-columns: 1fr; }
  .cur-card__body { padding: 14px; }
  .shr-input--name { width: 100px; }
  .shr-notify-btn { min-width: 72px; padding: 8px 10px; }
  .lib-drawer__actions { flex-direction: column; }
}
</style>
