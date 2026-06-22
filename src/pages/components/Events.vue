<template>
  <div class="iva-form">
    <div class="iva-form__header">
      <h2 class="iva-form__title">
        Events
      </h2>
      <p class="iva-form__subtitle">
        Browse medical congresses by day, week, or month.
      </p>
    </div>
    <div class="iva-form__divider"/>
    <div v-if="loading" class="d-flex justify-center"
         style="padding: 64px 0;">
      <v-progress-circular indeterminate
                           color="primary"/>
    </div>
    <AppRequired v-else-if="!isApp"/>
    <template v-else>
      <div class="d-flex align-center flex-wrap mb-4"
           style="gap: 10px; justify-content: space-between;">
        <div class="pa-1" style="background: hsl(220, 14%, 92%); border-radius: 10px; display: inline-flex; gap: 3px;">
          <button v-for="v in views"
                  :key="v.value"
                  @click="viewMode = v.value"
                  :style="{
                border: 'none', cursor: 'pointer', padding: '6px 16px', borderRadius: '7px',
                fontSize: '0.8125rem', fontWeight: viewMode === v.value ? '600' : '500',
                color: viewMode === v.value ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.45)',
                background: viewMode === v.value ? 'white' : 'transparent',
                boxShadow: viewMode === v.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }">{{ v.label }}
          </button>
        </div>
        <button class="test-toggle"
                @click="showTestEvents = !showTestEvents">
          <span class="test-toggle__box"
                :class="{ 'test-toggle__box--checked': showTestEvents }"/>
          <span class="test-toggle__label">
            Show test events
          </span>
        </button>
      </div>
      <div class="d-flex align-center mb-3"
           style="gap: 6px;">
        <v-btn variant="text"
               density="compact"
               size="small"
               @click="navigate(-1)">
          <FontAwesomeIcon icon="chevron-left"/>
        </v-btn>
        <span style="flex: 1; text-align: center; font-size: 0.9375rem; font-weight: 600; letter-spacing: -0.01em;">
          {{ periodLabel }}
        </span>
        <v-btn variant="text"
               density="compact"
               size="small"
               @click="navigate(1)">
          <FontAwesomeIcon icon="chevron-right"/>
        </v-btn>
        <v-btn variant="outlined"
               density="compact"
               size="small"
               @click="goToday"
               style="font-size: 0.75rem; letter-spacing: 0; margin-left: 4px;">
          Today
        </v-btn>
      </div>
      <div v-if="viewMode === 'month'"
           class="cal-grid">
        <div class="cal-dow-header">
          <div v-for="d in DOW"
               :key="d">{{ d }}
          </div>
        </div>
        <div class="cal-month">
          <div v-for="(day, i) in calendarDays"
               :key="i"
               class="cal-month__cell"
               :class="{ 'cal-month__cell--faded': !isSameMonth(day), 'cal-month__cell--today': isToday(day) }">
            <span class="cal-month__num">
              {{ day.getDate() }}
            </span>
            <div class="cal-month__events">
              <template v-for="(ev, ei) in eventsOnDay(day)"
                        :key="ev.id || ei">
                <div v-if="ei < 2"
                     class="cal-chip"
                     @click.stop="openEvent(ev)">
                  {{ ev.name || ev.title || 'Event' }}
                </div>
                <div v-else-if="ei === 2"
                     class="cal-chip cal-chip--more"
                     @click.stop="goToDay(day)">
                  +
                  {{ eventsOnDay(day).length - 2 }}
                  more
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="viewMode === 'week'"
           class="cal-week">
        <div v-for="(day, i) in calendarDays"
             :key="i" class="cal-week__col">
          <div class="cal-week__col-header"
               :class="{ 'cal-week__col-header--today': isToday(day) }">
            <span class="cal-week__dow">
              {{ DOW[i] }}
            </span>
            <span class="cal-week__num">
              {{ day.getDate() }}
            </span>
          </div>
          <div class="cal-week__events">
            <div v-for="(ev, ei) in eventsOnDay(day)"
                 :key="ev.id || ei"
                 class="cal-week__event"
                 @click="openEvent(ev)">
              <span class="cal-week__event-name">
                {{ ev.name || ev.title || 'Event' }}
              </span>
              <span v-if="ev.location || ev.city"
                    class="cal-week__event-loc">
                {{ ev.location || ev.city }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <div v-if="eventsOnDay(calendarDays[0]).length === 0"
             class="cal-empty">
          <FontAwesomeIcon icon="calendar-xmark"
                           class="cal-empty__icon"/>
          <p class="cal-empty__title">
            No events
          </p>
          <p class="cal-empty__text">
            Nothing scheduled for this day.
          </p>
        </div>
        <div v-else
             class="events-list">
          <div v-for="ev in eventsOnDay(calendarDays[0])"
               :key="ev.id"
               class="event-card"
               @click="openEvent(ev)">
            <div class="event-card__main">
              <span class="event-card__name">
                {{ ev.name || ev.title || ev.id }}
              </span>
              <span v-if="ev.status"
                    class="event-card__status">
                {{ ev.status }}
              </span>
            </div>
            <div class="event-card__meta">
              <span v-if="_parseDate(ev)">
                <FontAwesomeIcon icon="calendar"
                                 class="event-card__icon"/>
                {{ _formatEventDate(ev) }}
              </span>
              <span v-if="ev.location || ev.city">
                <FontAwesomeIcon icon="location-dot"
                                 class="event-card__icon"/>
                {{ [ev.location, ev.city].filter(Boolean).join(', ') }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <div v-if="events && events.length === 0"
           class="cal-empty mt-4">
        <FontAwesomeIcon icon="calendar-xmark"
                         class="cal-empty__icon"/>
        <p class="cal-empty__title">
          No events found
        </p>
        <p class="cal-empty__text">
          There are no congresses available in your account.
        </p>
      </div>
    </template>
    <v-dialog v-model="dialog"
              max-width="600"
              scrollable
              @after-leave="resetDialog">
      <v-card v-if="selectedEvent" rounded="xl">
        <div class="dlg-header">
          <div class="dlg-header__avatar">
            <FontAwesomeIcon icon="calendar"/>
          </div>
          <div class="dlg-header__info">
            <h3 class="dlg-header__title">
              {{ selectedEvent.name || selectedEvent.title }}
            </h3>
            <div class="dlg-header__meta">
              <span v-if="_parseDate(selectedEvent)">
                <FontAwesomeIcon icon="calendar"
                                 style="margin-right: 4px; opacity: 0.5;"/>
                {{ _formatEventDate(selectedEvent) }}
              </span>
              <span v-if="selectedEvent.location || selectedEvent.city">
                <FontAwesomeIcon icon="location-dot"
                                 style="margin-right: 4px; opacity: 0.5;"/>
                {{ [selectedEvent.location, selectedEvent.city].filter(Boolean).join(', ') }}
              </span>
              <span v-if="selectedEvent.status"
                    class="dlg-header__badge">
                {{ selectedEvent.status }}
              </span>
            </div>
          </div>
          <v-btn icon
                 variant="text"
                 density="compact"
                 @click="dialog = false">
            <FontAwesomeIcon icon="xmark"/>
          </v-btn>
        </div>
        <v-divider/>
        <div class="dlg-tabs">
          <div class="pa-1"
               style="background: hsl(220, 14%, 92%); border-radius: 10px; display: inline-flex; gap: 3px;">
            <button v-for="t in dialogTabs" :key="t.value" @click="onTabChange(t.value)"
                    :style="{
                  border: 'none', cursor: 'pointer', padding: '6px 14px', borderRadius: '7px',
                  fontSize: '0.8125rem', fontWeight: dialogTab === t.value ? '600' : '500',
                  color: dialogTab === t.value ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.45)',
                  background: dialogTab === t.value ? 'white' : 'transparent',
                  boxShadow: dialogTab === t.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px',
                }">
              <FontAwesomeIcon :icon="t.icon"
                               style="font-size: 0.75rem;"/>
              {{ t.label }}
            </button>
          </div>
        </div>
        <v-divider/>
        <v-card-text class="dlg-body">
          <template v-if="dialogTab === 'attendees'">
            <v-text-field v-model="attendeeSearch"
                          placeholder="Search attendees…"
                          variant="outlined"
                          density="compact"
                          hide-details prepend-inner-icon="mdi-magnify"
                          class="mb-3"
                          clearable/>
            <div v-if="attendeesLoading" class="dlg-loading">
              <v-progress-circular indeterminate
                                   color="primary"
                                   size="28"/>
            </div>
            <div v-else-if="!attendees || attendees.length === 0"
                 class="dlg-empty">
              <FontAwesomeIcon icon="users"
                               class="dlg-empty__icon"/>
              <p class="dlg-empty__title">
                No attendees
              </p>
              <p class="dlg-empty__text">
                No attendees found for this event.
              </p>
            </div>
            <div v-else
                 class="person-list">
              <div v-for="a in pagedAttendees"
                   :key="a.id || a.npi"
                   class="person-row">
                <div class="person-row__avatar">
                  {{ personInitials(a) }}
                </div>
                <div class="person-row__info">
                  <span class="person-row__name">
                    {{ a.name || [a.first_name, a.last_name].filter(Boolean).join(' ') || '—' }}
                  </span>
                  <span class="person-row__sub">
                    {{ [a.title || a.designation, a.company_name].filter(Boolean).join(' · ') }}
                  </span>
                  <span v-if="a.specialty" class="person-row__tag">
                    {{ a.specialty }}
                  </span>
                </div>
                <div v-if="a.npi"
                     class="person-row__npi">
                  NPI {{ a.npi }}
                </div>
              </div>
              <p v-if="filteredAttendees.length === 0"
                 class="dlg-empty__text"
                 style="text-align: center; padding: 16px 0;">
                No attendees match "{{ attendeeSearch }}"
              </p>
            </div>
            <div v-if="attendeeTotalPages > 1"
                 class="dlg-pagination">
              <button class="dlg-pagination__btn"
                      :disabled="attendeePage === 1" @click="attendeePage--">
                <FontAwesomeIcon icon="chevron-left"/>
              </button>
              <span class="dlg-pagination__label">
                {{ attendeePage }} / {{ attendeeTotalPages }}
              </span>
              <button class="dlg-pagination__btn"
                      :disabled="attendeePage === attendeeTotalPages"
                      @click="attendeePage++">
                <FontAwesomeIcon icon="chevron-right"/>
              </button>
            </div>
          </template>
          <template v-else-if="dialogTab === 'scanned'">
            <div v-if="businessCardsLoading"
                 class="dlg-loading">
              <v-progress-circular indeterminate
                                   color="primary"
                                   size="28"/>
            </div>
            <div v-else-if="!businessCards || businessCards.length === 0"
                 class="dlg-empty">
              <FontAwesomeIcon icon="id-card"
                               class="dlg-empty__icon"/>
              <p class="dlg-empty__title">
                No scanned badges
              </p>
              <p class="dlg-empty__text">
                No badges have been scanned for this event yet.
              </p>
            </div>
            <div v-else
                 class="person-list">
              <div v-for="bc in pagedBusinessCards"
                   :key="bc.id"
                   class="person-row">
                <div class="person-row__avatar">
                  {{ personInitials(bc) }}
                </div>
                <div class="person-row__info">
                  <span class="person-row__name">
                    {{ bc.name || [bc.first_name, bc.last_name].filter(Boolean).join(' ') || '—' }}
                  </span>
                  <span class="person-row__sub">
                    {{ [bc.title || bc.job_title, bc.company || bc.company_name].filter(Boolean).join(' · ') }}
                  </span>
                </div>
                <div v-if="bc.email"
                     class="person-row__npi">
                  {{ bc.email }}
                </div>
              </div>
            </div>
            <div v-if="bcTotalPages > 1"
                 class="dlg-pagination">
              <button class="dlg-pagination__btn"
                      :disabled="bcPage === 1"
                      @click="bcPage--">
                <FontAwesomeIcon icon="chevron-left"/>
              </button>
              <span class="dlg-pagination__label">
                {{ bcPage }} / {{ bcTotalPages }}
              </span>
              <button class="dlg-pagination__btn"
                      :disabled="bcPage === bcTotalPages"
                      @click="bcPage++">
                <FontAwesomeIcon icon="chevron-right"/>
              </button>
            </div>
          </template>
          <template v-else-if="dialogTab === 'scan'">
            <transition name="dlg-swap"
                        mode="out-in">
              <div v-if="scan.result && scan.result.status === 'success'"
                   key="result"
                   class="scan-result">
                <div class="bc-identity">
                  <div class="bc-identity__avatar">
                    {{ scanInitials }}
                  </div>
                  <div class="bc-identity__info">
                    <h3 class="bc-identity__name">
                      {{ scanCard.name || [scanCard.first_name, scanCard.last_name].filter(Boolean).join(' ') || '—' }}
                    </h3>
                    <p v-if="scanCard.job_title || scanCard.title || scanCard.designation"
                       class="bc-identity__title">
                      {{ scanCard.job_title || scanCard.title || scanCard.designation }}
                    </p>
                    <p v-if="scanCard.company || scanCard.company_name"
                       class="bc-identity__company">
                      {{ scanCard.company || scanCard.company_name }}
                    </p>
                    <p v-if="scanCard.email"
                       class="bc-identity__title">{{ scanCard.email }}</p>
                  </div>
                </div>
                <v-alert type="success"
                         density="compact"
                         variant="tonal"
                         class="mt-2">
                  Lead captured successfully.
                </v-alert>
                <div class="scan-result__actions">
                  <v-btn variant="outlined"
                         @click="scan.result = null">
                    <FontAwesomeIcon icon="barcode"
                                     style="margin-right: 8px;"/>
                    Scan another
                  </v-btn>
                </div>
              </div>

              <div v-else key="idle"
                   class="scan-idle">
                <div v-if="scan.result && scan.result.status !== 'success'"
                     class="scan-status"
                     :class="`scan-status--${scan.result.status}`">
                  <FontAwesomeIcon
                      :icon="scan.result.status === 'cancelled' ? 'circle-xmark' : 'triangle-exclamation'"/>
                  <span>
                    {{ scan.result.status === 'cancelled' ? 'Scan cancelled' : 'Scan failed — try again' }}
                  </span>
                  <button @click="scan.result = null">
                    <FontAwesomeIcon icon="xmark"/>
                  </button>
                </div>
                <button class="scanner-btn"
                        :disabled="scan.scanning"
                        @click="scanBadge">
                  <span class="scanner-btn__content">
                    <template v-if="!scan.scanning">
                      <div class="scanner-btn__icon-wrap">
                        <FontAwesomeIcon icon="barcode"
                                         class="scanner-btn__icon"/>
                      </div>
                      <span class="scanner-btn__label">
                        Scan Badge
                      </span>
                      <span class="scanner-btn__hint">
                        Opens device camera
                      </span>
                    </template>
                    <template v-else>
                      <v-progress-circular indeterminate
                                           size="32"
                                           width="2"
                                           color="rgba(255,255,255,0.7)"/>
                      <span class="scanner-btn__label">
                        Scanning…
                      </span>
                    </template>
                  </span>
                </button>
              </div>
            </transition>
          </template>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import AppRequired from '@/components/AppRequired.vue'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default {
  name: 'Events',
  components: {
    AppRequired,
    FontAwesomeIcon,
  },

  data() {
    return {
      events: null,
      loading: false,
      viewMode: 'month',
      currentDate: new Date(),
      showTestEvents: false,
      DOW,
      views: [
        {
          value: 'month',
          label: 'Month',
        },
        {
          value: 'week',
          label: 'Week',
        },
        {
          value: 'day',
          label: 'Day',
        },
      ],
      dialog: false,
      selectedEvent: null,
      dialogTab: 'attendees',
      dialogTabs: [
        {
          value: 'attendees',
          label: 'Attendees',
          icon: 'users',
        },
        {
          value: 'scanned',
          label: 'Scanned Badges',
          icon: 'id-card',
        },
        {
          value: 'scan',
          label: 'Scan Badge',
          icon: 'barcode',
        },
      ],
      attendees: null,
      attendeesLoading: false,
      attendeesLoaded: false,
      attendeeSearch: '',
      attendeePage: 1,
      attendeePageSize: 10,
      businessCards: null,
      businessCardsLoading: false,
      businessCardsLoaded: false,
      bcPage: 1,
      bcPageSize: 10,
      scan: {
        scanning: false,
        result: null,
      },
    }
  },
  async created() {
    await this.fetchEvents()

  },

  watch: {
    attendeeSearch() {
      this.attendeePage = 1
    },
  },

  computed: {
    isApp() {
      return this.$ml.isApp()
    },
    visibleEvents() {
      if (!this.events) return []
      return this.showTestEvents ? this.events : this.events.filter(e => !e.is_test_event)
    },
    calendarDays() {
      const d = this.currentDate
      if (this.viewMode === 'day') return [new Date(d.getFullYear(), d.getMonth(), d.getDate())]
      const anchor = this.viewMode === 'week' ? d : new Date(d.getFullYear(), d.getMonth(), 1)
      const start = this._startOfWeek(anchor)
      return Array.from({length: this.viewMode === 'week' ? 7 : 42}, (_, i) => this._addDays(start, i))
    },
    periodLabel() {
      const d = this.currentDate
      if (this.viewMode === 'day') {
        return d.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})
      }
      if (this.viewMode === 'week') {
        const s = this._startOfWeek(d)
        const e = this._addDays(s, 6)
        return `${s.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })} – ${e.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`
      }
      return d.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
    },
    pagedAttendees() {
      const start = (this.attendeePage - 1) * this.attendeePageSize
      return this.filteredAttendees.slice(start, start + this.attendeePageSize)
    },
    attendeeTotalPages() {
      return Math.ceil(this.filteredAttendees.length / this.attendeePageSize)
    },
    pagedBusinessCards() {
      const start = (this.bcPage - 1) * this.bcPageSize
      return (this.businessCards || []).slice(start, start + this.bcPageSize)
    },
    bcTotalPages() {
      return Math.ceil((this.businessCards || []).length / this.bcPageSize)
    },
    filteredAttendees() {
      if (!this.attendees) return []
      const q = (this.attendeeSearch || '').toLowerCase().trim()
      if (!q) return this.attendees
      return this.attendees.filter(a => {
        const name = (a.name || [a.first_name, a.last_name].filter(Boolean).join(' ')).toLowerCase()
        return name.includes(q) || (a.specialty || '').toLowerCase().includes(q) ||
            (a.company_name || '').toLowerCase().includes(q)
      })
    },
    scanCard() {
      return this.scan.result?.attendee ?? {}
    },
    scanInitials() {
      return this.personInitials(this.scanCard)
    },
  },

  methods: {
    async fetchEvents() {
      this.loading = true
      try {
        this.events = await this.$ml.congresses.list()
      } catch {
        this.events = []
      } finally {
        this.loading = false
      }
    },
    navigate(dir) {
      const d = new Date(this.currentDate)
      if (this.viewMode === 'day') d.setDate(d.getDate() + dir)
      else if (this.viewMode === 'week') d.setDate(d.getDate() + dir * 7)
      else d.setMonth(d.getMonth() + dir)
      this.currentDate = d
    },
    goToday() {
      this.currentDate = new Date()
    },
    goToDay(day) {
      this.currentDate = new Date(day)
      this.viewMode = 'day'
    },
    eventsOnDay(day) {
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0)
      const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59)
      return this.visibleEvents.filter(e => {
        const start = this._parseDate(e)
        if (!start) return false
        const endRaw = e.end_at || e.end_date || e.ends_at
        const end = endRaw ? new Date(endRaw) : start
        return start <= dayEnd && end >= dayStart
      })
    },
    isSameMonth(day) {
      return day.getMonth() === this.currentDate.getMonth() &&
          day.getFullYear() === this.currentDate.getFullYear()
    },
    isToday(day) {
      return this._sameDay(day, new Date())
    },

    // Dialog
    openEvent(event) {
      this.selectedEvent = event
      this.dialogTab = 'attendees'
      this.dialog = true
      this.loadAttendees()
    },
    resetDialog() {
      this.selectedEvent = null
      this.attendees = null
      this.attendeesLoaded = false
      this.attendeeSearch = ''
      this.businessCards = null
      this.businessCardsLoaded = false
      this.scan = {scanning: false, result: null}
      this.attendeePage = 1
      this.bcPage = 1
    },
    onTabChange(tab) {
      this.dialogTab = tab
      if (tab === 'attendees' && !this.attendeesLoaded) this.loadAttendees()
      if (tab === 'scanned' && !this.businessCardsLoaded) this.loadBusinessCards()
    },
    async loadAttendees() {
      if (this.attendeesLoaded || !this.selectedEvent?.id) return
      this.attendeesLoading = true
      try {
        this.attendees = await this.$ml.congresses.getAttendees(this.selectedEvent.id)
        this.attendeesLoaded = true
      } catch {
        this.attendees = []
      } finally {
        this.attendeesLoading = false
      }
    },
    async loadBusinessCards() {
      if (this.businessCardsLoaded || !this.selectedEvent?.id) return
      this.businessCardsLoading = true
      try {
        this.businessCards = await this.$ml.congresses.getBusinessCards(this.selectedEvent.id)
        this.businessCardsLoaded = true;
      } catch {
        this.businessCards = []
      } finally {
        this.businessCardsLoading = false
      }
    },
    async scanBadge() {
      this.scan.scanning = true
      this.scan.result = null
      try {
        this.scan.result = await this.$ml.scanner.scanBadge(this.selectedEvent.id)
        this.$ml.analytics.logEvent('scanner', 'scan_badge', '/events', {
          event_id: this.selectedEvent?.id,
          status: this.scan.result?.status,
        })
      } catch {
        this.scan.result = {status: 'failed'}
      } finally {
        this.scan.scanning = false
      }
    },
    personInitials(person) {
      const f = person?.first_name?.[0] ?? person?.name?.[0] ?? ''
      const l = person?.last_name?.[0] ?? ''
      return (f + l).toUpperCase() || '?'
    },
    _parseDate(event) {
      const raw = event.start_at || event.start_date || event.date || event.starts_at
      return raw ? new Date(raw) : null
    },
    _formatEventDate(event) {
      const start = this._parseDate(event)
      if (!start) return null
      const endRaw = event.end_at || event.end_date || event.ends_at
      const end = endRaw ? new Date(endRaw) : null
      const fmt = d => d.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
      if (end && !this._sameDay(start, end)) return `${fmt(start)} – ${fmt(end)}`
      return fmt(start)
    },
    _sameDay(a, b) {
      return a.getFullYear() === b.getFullYear() &&
          a.getMonth() === b.getMonth() &&
          a.getDate() === b.getDate()
    },
    _startOfWeek(date) {
      const d = new Date(date)
      d.setDate(d.getDate() - d.getDay())
      d.setHours(0, 0, 0, 0)
      return d
    },
    _addDays(date, n) {
      const d = new Date(date)
      d.setDate(d.getDate() + n)
      return d
    },
  },
}
</script>

<style scoped>
.cal-grid {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.cal-dow-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: hsl(220, 14%, 97%);
}

.cal-dow-header > div {
  padding: 8px 4px;
  text-align: center;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.4);
}

.cal-month {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(0, 0, 0, 0.07);
}

.cal-month__cell {
  background: #ffffff;
  min-height: 90px;
  padding: 6px 8px;
}

.cal-month__cell--faded {
  background: hsl(220, 14%, 98%);
}

.cal-month__cell--faded .cal-month__num {
  color: rgba(0, 0, 0, 0.2);
}

.cal-month__num {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-bottom: 3px;
}

.cal-month__cell--today .cal-month__num {
  background: rgb(var(--v-theme-primary));
  color: white;
  border-radius: 50%;
}

.cal-month__events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cal-chip {
  font-size: 0.625rem;
  font-weight: 500;
  padding: 2px 5px;
  border-radius: 4px;
  background: hsl(222, 47%, 91%);
  color: hsl(222, 47%, 28%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  cursor: pointer;
  transition: background 0.1s;
}

.cal-chip:hover {
  background: hsl(222, 47%, 85%);
}

.cal-chip--more {
  background: transparent;
  color: rgba(0, 0, 0, 0.38);
  padding-left: 0;
}

.cal-chip--more:hover {
  background: transparent;
  color: rgba(0, 0, 0, 0.6);
}

.cal-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.cal-week__col {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
  min-height: 140px;
}

.cal-week__col-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  background: hsl(220, 14%, 97%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  gap: 2px;
}

.cal-week__col-header--today {
  background: rgb(var(--v-theme-primary));
}

.cal-week__col-header--today .cal-week__dow,
.cal-week__col-header--today .cal-week__num {
  color: white;
}

.cal-week__dow {
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.4);
}

.cal-week__num {
  font-size: 0.9375rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.8);
  line-height: 1;
}

.cal-week__events {
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cal-week__event {
  padding: 4px 6px;
  border-radius: 5px;
  background: hsl(222, 47%, 93%);
  display: flex;
  flex-direction: column;
  gap: 1px;
  cursor: pointer;
  transition: background 0.1s;
}

.cal-week__event:hover {
  background: hsl(222, 47%, 87%);
}

.cal-week__event-name {
  font-size: 0.625rem;
  font-weight: 600;
  color: hsl(222, 47%, 25%);
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cal-week__event-loc {
  font-size: 0.5625rem;
  color: hsl(222, 47%, 42%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.event-card {
  padding: 14px 16px;
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 8px;
  background: hsl(220, 14%, 99%);
  cursor: pointer;
  transition: border-color 0.1s, box-shadow 0.1s;
}

.event-card:hover {
  border-color: hsl(220, 13%, 78%);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.event-card__main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.event-card__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(220, 9%, 18%);
  flex: 1;
}

.event-card__status {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(220, 9%, 55%);
  background: hsl(220, 13%, 93%);
  padding: 2px 7px;
  border-radius: 4px;
}

.event-card__meta {
  display: flex;
  gap: 16px;
  margin-top: 6px;
  font-size: 0.8125rem;
  color: hsl(220, 9%, 55%);
}

.event-card__icon {
  margin-right: 5px;
  font-size: 0.75rem;
}

.cal-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 24px;
}

.cal-empty__icon {
  font-size: 2rem;
  color: hsl(220, 9%, 82%);
}

.cal-empty__title {
  font-size: 1rem;
  font-weight: 600;
  color: hsl(220, 9%, 40%);
  margin: 0;
}

.cal-empty__text {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 65%);
  margin: 0;
}

.dlg-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 20px 16px;
}

.dlg-header__avatar {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: hsl(222, 47%, 91%);
  color: hsl(222, 47%, 35%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.dlg-header__info {
  flex: 1;
  min-width: 0;
}

.dlg-header__title {
  font-size: 1rem;
  font-weight: 700;
  color: hsl(220, 9%, 12%);
  margin: 0 0 6px;
  line-height: 1.3;
}

.dlg-header__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 0.8125rem;
  color: hsl(220, 9%, 52%);
  align-items: center;
}

.dlg-header__badge {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: hsl(220, 13%, 93%);
  color: hsl(220, 9%, 48%);
  padding: 2px 8px;
  border-radius: 4px;
}

.dlg-tabs {
  padding: 12px 16px;
  background: white;
}

.dlg-body {
  padding: 16px 20px !important;
  min-height: 320px;
}

.person-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.person-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  background: hsl(220, 14%, 99%);
}

.person-row__avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: hsl(222, 32%, 22%);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.03em;
}

.person-row__info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.person-row__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(220, 9%, 16%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.person-row__sub {
  font-size: 0.75rem;
  color: hsl(220, 9%, 55%);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.person-row__tag {
  font-size: 0.6875rem;
  font-weight: 500;
  color: hsl(222, 47%, 35%);
  background: hsl(222, 47%, 93%);
  padding: 1px 6px;
  border-radius: 4px;
  align-self: flex-start;
}

.person-row__npi {
  font-size: 0.6875rem;
  font-weight: 500;
  color: hsl(220, 9%, 55%);
  background: hsl(220, 13%, 93%);
  padding: 2px 7px;
  border-radius: 4px;
  white-space: nowrap;
  flex-shrink: 0;
}

.dlg-loading {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}

.dlg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 48px 24px;
}

.dlg-empty__icon {
  font-size: 1.75rem;
  color: hsl(220, 9%, 82%);
}

.dlg-empty__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: hsl(220, 9%, 40%);
  margin: 0;
}

.dlg-empty__text {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 60%);
  margin: 0;
}

.scan-idle {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.scan-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.scan-status span {
  flex: 1;
}

.scan-status button {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.45;
  padding: 2px 4px;
}

.scan-status--cancelled {
  background: hsl(220, 13%, 96%);
  color: hsl(220, 9%, 45%);
  border: 1px solid hsl(220, 13%, 89%);
}

.scan-status--failed {
  background: hsl(0, 65%, 97%);
  color: hsl(0, 55%, 40%);
  border: 1px solid hsl(0, 60%, 87%);
}

.scanner-btn {
  width: 100%;
  min-height: 180px;
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
  gap: 10px;
  color: #fff;
}

.scanner-btn__icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-btn__icon {
  font-size: 1.5rem;
  opacity: 0.9;
}

.scanner-btn__label {
  font-size: 0.9375rem;
  font-weight: 700;
}

.scanner-btn__hint {
  font-size: 0.75rem;
  opacity: 0.45;
}

/* Scan result */
.scan-result {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bc-identity {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: hsl(220, 14%, 98%);
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 10px;
}

.bc-identity__avatar {
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: hsl(222, 25%, 20%);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bc-identity__info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.bc-identity__name {
  font-size: 1rem;
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
  font-size: 0.8125rem;
  font-weight: 500;
  color: hsl(220, 9%, 30%);
  margin: 2px 0 0;
}

.scan-result__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.test-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  background: none;
  border: none;
  padding: 0;
}

.test-toggle__box {
  width: 15px;
  height: 15px;
  border: 1.5px solid hsl(220, 13%, 72%);
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.12s, border-color 0.12s;
}

.test-toggle__box::after {
  content: '';
  display: block;
  width: 4px;
  height: 7px;
  border: 1.5px solid white;
  border-top: none;
  border-left: none;
  transform: rotate(45deg) translate(-1px, -1px);
  opacity: 0;
  transition: opacity 0.1s;
}

.test-toggle__box--checked {
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
}

.test-toggle__box--checked::after {
  opacity: 1;
}

.test-toggle__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.55);
  letter-spacing: -0.01em;
}

.test-toggle:hover .test-toggle__box:not(.test-toggle__box--checked) {
  border-color: hsl(220, 13%, 55%);
}

.dlg-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid hsl(220, 13%, 92%);
}

.dlg-pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid hsl(220, 13%, 88%);
  background: white;
  color: hsl(220, 9%, 42%);
  cursor: pointer;
  font-size: 0.625rem;
  transition: background 0.1s;
}

.dlg-pagination__btn:hover:not(:disabled) {
  background: hsl(220, 13%, 95%);
}

.dlg-pagination__btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.dlg-pagination__label {
  font-size: 0.8125rem;
  color: rgba(0, 0, 0, 0.42);
  font-weight: 500;
  min-width: 48px;
  text-align: center;
}

.dlg-swap-enter-active, .dlg-swap-leave-active {
  transition: opacity 0.15s, transform 0.15s;
}

.dlg-swap-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.dlg-swap-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
