<template>
  <div class="iva-form">
    <div class="iva-form__header">
      <h2 class="iva-form__title">CRM</h2>
      <p class="iva-form__subtitle">
        Browse accounts, contacts, leads, and more — manage current customers and run SOQL queries.
      </p>
    </div>
    <div class="iva-form__divider"/>

    <div class="crm-tabs">
      <button v-for="tab in tabs"
              :key="tab.key"
              class="crm-tab"
              :class="{'crm-tab--active': activeTab === tab.key}"
              @click="activeTab = tab.key">
        {{ tab.label }}
      </button>
    </div>

    <!-- ══ LOOKUP ══ -->
    <div v-if="activeTab === 'lookup'">
      <div class="crm-pills">
        <button v-for="e in entities"
                :key="e.key"
                class="crm-pill"
                :class="{'crm-pill--active': entityKey === e.key}"
                @click="selectEntity(e.key)">
          {{ e.label }}s
        </button>
      </div>

      <div class="crm-row">
        <button class="crm-btn" :disabled="listLoading" @click="listAll">
          <FontAwesomeIcon :icon="listLoading ? 'arrows-rotate' : 'list'" :class="{spin: listLoading}"/>
          List
        </button>
        <code class="crm-footnote">crm.{{ currentEntity.listMethod }}()</code>
      </div>
      <div class="crm-row" style="margin-top: 8px;">
        <input v-model="entityId"
               class="crm-input"
               placeholder="ID"
               @keydown.enter="getById"/>
        <button class="crm-btn" :disabled="!entityId || getLoading" @click="getById">
          <FontAwesomeIcon :icon="getLoading ? 'arrows-rotate' : 'arrow-right'" :class="{spin: getLoading}"/>
          Get
        </button>
        <code class="crm-footnote">crm.{{ currentEntity.getMethod }}(id)</code>
      </div>

      <template v-if="listResult !== null">
        <div class="crm-result-hdr">
          <span>{{ listResult.length }} result{{ listResult.length !== 1 ? 's' : '' }}</span>
          <button class="crm-clear" @click="listResult = null">Clear</button>
        </div>
        <div v-if="listResult.length === 0" class="crm-empty">No results</div>
        <div v-else class="crm-list">
          <div v-for="(item, i) in listResult"
               :key="item.Id || item.id || i"
               class="crm-card"
               :class="{'crm-card--open': openedItems[`l${i}`]}">
            <button class="crm-card__hdr" type="button" @click="toggle(`l${i}`)">
              <span class="crm-card__name">{{ item.Name || item.name || item.Id || item.id || '—' }}</span>
              <span v-if="item.Id || item.id" class="crm-card__sub">{{ item.Id || item.id }}</span>
              <FontAwesomeIcon :icon="openedItems[`l${i}`] ? 'chevron-up' : 'chevron-down'" class="crm-card__chevron"/>
            </button>
            <div v-if="openedItems[`l${i}`]" class="crm-card__json">
              <pre class="crm-pre">{{ JSON.stringify(item, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </template>

      <template v-if="getResult !== null">
        <div class="crm-result-hdr">
          <span>Single result</span>
          <button class="crm-clear" @click="getResult = null">Clear</button>
        </div>
        <pre class="crm-pre">{{ JSON.stringify(getResult, null, 2) }}</pre>
      </template>
    </div>

    <!-- ══ CUSTOMERS ══ -->
    <div v-if="activeTab === 'customers'">
      <div class="crm-section-label">Current & recent</div>
      <div class="crm-row">
        <button class="crm-btn" :disabled="currentLoading" @click="getCurrent">
          Get Current
        </button>
        <code class="crm-footnote">crm.getCurrentCustomers()</code>
        <button class="crm-btn" :disabled="recentLoading" @click="getRecent" style="margin-left: 4px;">
          Get Recent
        </button>
        <code class="crm-footnote">crm.getRecentCustomers()</code>
      </div>

      <div v-if="customers !== null" style="margin-top: 10px;">
        <div v-if="customers.length === 0" class="crm-empty">No customers</div>
        <div v-else class="crm-list">
          <div v-for="c in customers"
               :key="c.Id || c.id || c"
               class="crm-card">
            <div class="crm-card__hdr" style="cursor: default;">
              <span class="crm-card__name">{{ c.Name || c.name || c.Id || c.id || c }}</span>
              <span v-if="c.Id || c.id" class="crm-card__sub">{{ c.Id || c.id }}</span>
              <button class="crm-remove" @click="removeCurrent(c.Id || c.id || c)">
                <FontAwesomeIcon icon="xmark"/>
              </button>
            </div>
          </div>
        </div>
        <button v-if="customers.length > 0"
                class="crm-btn crm-btn--danger"
                style="margin-top: 10px;"
                @click="clearCurrent">
          Clear all
        </button>
        <code class="crm-footnote" style="display:block;margin-top:5px;">crm.clearCurrentCustomers()</code>
      </div>

      <div class="crm-section-label" style="margin-top: 20px;">Add / check</div>
      <div class="crm-row">
        <input v-model="customerId" class="crm-input" placeholder="Customer ID" style="max-width: 200px;"/>
      </div>
      <div class="crm-row" style="margin-top: 8px;">
        <button class="crm-btn" :disabled="!customerId" @click="addCurrent">
          <FontAwesomeIcon icon="plus"/> Add
        </button>
        <code class="crm-footnote">crm.addCurrentCustomer(id)</code>
        <button class="crm-btn" :disabled="!customerId" @click="checkIsCurrent" style="margin-left: 4px;">
          Is current?
        </button>
        <code class="crm-footnote">crm.isCurrentCustomer(id)</code>
        <span v-if="isCurrentResult !== null"
              class="crm-badge"
              :class="isCurrentResult ? 'crm-badge--true' : 'crm-badge--false'">
          {{ isCurrentResult }}
        </span>
      </div>

      <div class="crm-section-label" style="margin-top: 20px;">Picker & sync</div>
      <div class="crm-row">
        <button class="crm-btn" @click="openPicker">
          <FontAwesomeIcon icon="hand-pointer"/> Open Picker
        </button>
        <code class="crm-footnote">crm.openCustomerPicker()</code>
        <span v-if="pickerStatus" class="crm-status">{{ pickerStatus }}</span>
      </div>
      <div class="crm-row" style="margin-top: 8px;">
        <button class="crm-btn" :disabled="refreshLoading" @click="refreshCrm">
          <FontAwesomeIcon icon="arrows-rotate" :class="{spin: refreshLoading}"/>
          Refresh
        </button>
        <code class="crm-footnote">crm.refresh()</code>
        <span v-if="refreshStatus" class="crm-status">{{ refreshStatus }}</span>
      </div>
    </div>

    <!-- ══ QUERY ══ -->
    <div v-if="activeTab === 'query'">
      <div class="crm-section-label">SOQL</div>
      <textarea v-model="soql"
                class="crm-soql"
                rows="3"
                placeholder="SELECT Id, Name FROM Account LIMIT 10"/>
      <div class="crm-row" style="margin-top: 10px;">
        <button class="crm-btn crm-btn--primary"
                :disabled="!soql.trim() || queryLoading"
                @click="runQuery">
          <FontAwesomeIcon :icon="queryLoading ? 'arrows-rotate' : 'play'" :class="{spin: queryLoading}"/>
          Execute
        </button>
        <code class="crm-footnote">crm.query(soql)</code>
      </div>
      <template v-if="queryResult !== null">
        <div class="crm-result-hdr" style="margin-top: 14px;">
          <span>Result</span>
          <button class="crm-clear" @click="queryResult = null">Clear</button>
        </div>
        <pre class="crm-pre">{{ JSON.stringify(queryResult, null, 2) }}</pre>
      </template>
    </div>
  </div>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

const ENTITIES = [
  {key: 'accounts',  label: 'Account',  listMethod: 'getAccounts',  getMethod: 'getAccount'},
  {key: 'contacts',  label: 'Contact',  listMethod: 'getContacts',  getMethod: 'getContact'},
  {key: 'leads',     label: 'Lead',     listMethod: 'getLeads',     getMethod: 'getLead'},
  {key: 'users',     label: 'User',     listMethod: 'getUsers',     getMethod: 'getUser'},
  {key: 'addresses', label: 'Address',  listMethod: 'getAddresses', getMethod: 'getAddress'},
]

export default {
  name: 'Crm',
  components: {FontAwesomeIcon},

  data() {
    return {
      activeTab: 'lookup',
      tabs: [
        {key: 'lookup',    label: 'Lookup'},
        {key: 'customers', label: 'Customers'},
        {key: 'query',     label: 'Query'},
      ],
      entities: ENTITIES,
      entityKey: 'accounts',
      entityId: '',
      listLoading: false,
      getLoading: false,
      listResult: null,
      getResult: null,
      openedItems: {},

      customers: null,
      currentLoading: false,
      recentLoading: false,
      customerId: '',
      isCurrentResult: null,
      pickerStatus: null,
      refreshLoading: false,
      refreshStatus: null,

      soql: 'SELECT Id, Name FROM Account LIMIT 10',
      queryLoading: false,
      queryResult: null,
    }
  },

  computed: {
    currentEntity() {
      return ENTITIES.find(e => e.key === this.entityKey) ?? ENTITIES[0]
    },
  },

  methods: {
    selectEntity(key) {
      this.entityKey  = key
      this.entityId   = ''
      this.listResult = null
      this.getResult  = null
      this.openedItems = {}
    },

    toggle(key) {
      this.openedItems = {...this.openedItems, [key]: !this.openedItems[key]}
    },

    async listAll() {
      this.listLoading = true
      this.listResult  = null
      this.openedItems = {}
      try {
        this.listResult = await this.$ml.crm[this.currentEntity.listMethod]()
      } catch {
        this.listResult = []
      } finally {
        this.listLoading = false
      }
    },

    async getById() {
      if (!this.entityId) return
      this.getLoading = true
      this.getResult  = null
      try {
        this.getResult = await this.$ml.crm[this.currentEntity.getMethod](this.entityId)
      } catch {
        this.getResult = null
      } finally {
        this.getLoading = false
      }
    },

    async getCurrent() {
      this.currentLoading = true
      try {
        this.customers = await this.$ml.crm.getCurrentCustomers()
      } catch {
        this.customers = []
      } finally {
        this.currentLoading = false
      }
    },

    async getRecent() {
      this.recentLoading = true
      try {
        this.customers = await this.$ml.crm.getRecentCustomers()
      } catch {
        this.customers = []
      } finally {
        this.recentLoading = false
      }
    },

    async addCurrent() {
      if (!this.customerId) return
      try {
        await this.$ml.crm.addCurrentCustomer(this.customerId)
        await this.getCurrent()
      } catch { /* ignore */ }
    },

    async removeCurrent(id) {
      try {
        await this.$ml.crm.removeCurrentCustomer(id)
        await this.getCurrent()
      } catch { /* ignore */ }
    },

    async clearCurrent() {
      try {
        await this.$ml.crm.clearCurrentCustomers()
        this.customers = []
      } catch { /* ignore */ }
    },

    async checkIsCurrent() {
      if (!this.customerId) return
      try {
        this.isCurrentResult = await this.$ml.crm.isCurrentCustomer(this.customerId)
      } catch {
        this.isCurrentResult = null
      }
    },

    async openPicker() {
      this.pickerStatus = null
      try {
        const result = await this.$ml.crm.openCustomerPicker()
        this.pickerStatus = result?.status ?? 'done'
        if (result?.status === 'selected') await this.getCurrent()
      } catch {
        this.pickerStatus = 'error'
      }
    },

    async refreshCrm() {
      this.refreshLoading = true
      this.refreshStatus  = null
      try {
        const result = await this.$ml.crm.refresh()
        this.refreshStatus = result?.status ?? 'done'
      } catch {
        this.refreshStatus = 'error'
      } finally {
        this.refreshLoading = false
      }
    },

    async runQuery() {
      this.queryLoading = true
      this.queryResult  = null
      try {
        this.queryResult = await this.$ml.crm.query(this.soql)
      } catch (e) {
        this.queryResult = {error: e?.message ?? 'Query failed'}
      } finally {
        this.queryLoading = false
      }
    },
  },
}
</script>

<style scoped>
/* ── Tabs ── */
.crm-tabs {
  display: flex;
  border-bottom: 1px solid hsl(220, 13%, 91%);
  margin-bottom: 20px;
}

.crm-tab {
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

.crm-tab:hover { color: hsl(220, 9%, 22%); }

.crm-tab--active {
  color: hsl(220, 9%, 16%);
  border-bottom-color: hsl(220, 70%, 52%);
}

/* ── Entity segmented control ── */
.crm-pills {
  display: flex;
  gap: 2px;
  background: hsl(220, 14%, 93%);
  border-radius: 8px;
  padding: 3px;
  margin-bottom: 16px;
  width: fit-content;
}

.crm-pill {
  border: none;
  border-radius: 6px;
  padding: 5px 12px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: rgba(0, 0, 0, 0.45);
  transition: all 0.12s;
  white-space: nowrap;
}

.crm-pill--active {
  background: white;
  color: rgba(0, 0, 0, 0.82);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* ── Layout ── */
.crm-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.crm-section-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: hsl(220, 9%, 58%);
  margin-bottom: 10px;
}

/* ── Buttons ── */
.crm-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 7px;
  border: 1px solid hsl(220, 13%, 86%);
  background: white;
  font-size: 0.8125rem;
  font-weight: 500;
  color: hsl(220, 9%, 22%);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.12s, border-color 0.12s;
}

.crm-btn:hover:not(:disabled) {
  background: hsl(220, 14%, 95%);
  border-color: hsl(220, 13%, 74%);
}

.crm-btn:disabled { opacity: 0.45; cursor: default; }

.crm-btn--primary {
  background: rgb(var(--v-theme-primary));
  border-color: transparent;
  color: white;
}

.crm-btn--primary:hover:not(:disabled) {
  filter: brightness(1.07);
  background: rgb(var(--v-theme-primary));
}

.crm-btn--danger {
  border-color: hsl(0, 60%, 87%);
  color: hsl(0, 55%, 40%);
}

.crm-btn--danger:hover:not(:disabled) { background: hsl(0, 65%, 97%); }

/* ── Input ── */
.crm-input {
  border: 1px solid hsl(220, 13%, 86%);
  border-radius: 7px;
  padding: 7px 11px;
  font-size: 0.8125rem;
  font-family: inherit;
  background: white;
  color: hsl(220, 9%, 14%);
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
  min-width: 0;
  width: 140px;
  -webkit-user-select: text !important;
  user-select: text !important;
}

.crm-input:focus {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 3px rgba(9, 170, 234, 0.1);
}

.crm-input::placeholder { color: hsl(220, 9%, 65%); }

/* ── Footnote ── */
.crm-footnote {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.65rem;
  color: hsl(220, 9%, 62%);
  letter-spacing: 0.01em;
}

/* ── Status ── */
.crm-status {
  font-size: 0.75rem;
  color: hsl(220, 9%, 48%);
  font-family: 'SF Mono', 'Fira Code', monospace;
}

/* ── Result header ── */
.crm-result-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.35);
}

.crm-clear {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.38);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.1s;
  text-transform: none;
  letter-spacing: 0;
}

.crm-clear:hover { color: rgba(0, 0, 0, 0.7); }

/* ── Result list / cards ── */
.crm-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 14px;
}

.crm-card {
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 8px;
  background: white;
  overflow: hidden;
  transition: border-color 0.1s;
}

.crm-card--open { border-color: hsl(220, 13%, 82%); }

.crm-card__hdr {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 13px;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  transition: background 0.1s;
}

.crm-card__hdr:hover { background: hsl(220, 14%, 99%); }

.crm-card__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: hsl(220, 9%, 16%);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.crm-card__sub {
  font-size: 0.6875rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: hsl(220, 9%, 60%);
  flex-shrink: 0;
}

.crm-card__chevron {
  font-size: 0.625rem;
  color: rgba(0, 0, 0, 0.28);
  flex-shrink: 0;
}

.crm-card__json {
  border-top: 1px solid hsl(220, 13%, 91%);
  background: hsl(222, 20%, 14%);
  padding: 12px 14px;
}

/* ── Code pre block ── */
.crm-pre {
  margin: 0;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  line-height: 1.65;
  color: hsl(210, 30%, 84%);
  white-space: pre;
  overflow-x: auto;
  max-height: 280px;
  overflow-y: auto;
  background: hsl(222, 20%, 14%);
  border-radius: 6px;
  padding: 12px 14px;
}

.crm-card__json .crm-pre {
  background: transparent;
  border-radius: 0;
  padding: 0;
}

/* ── Empty ── */
.crm-empty {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 62%);
  padding: 10px 0;
}

/* ── Customer remove button ── */
.crm-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: hsl(220, 9%, 72%);
  font-size: 0.7rem;
  padding: 2px 4px;
  flex-shrink: 0;
  margin-left: auto;
  transition: color 0.12s;
}

.crm-remove:hover { color: hsl(0, 60%, 52%); }

/* ── Badge ── */
.crm-badge {
  font-size: 0.625rem;
  font-weight: 700;
  font-family: 'SF Mono', 'Fira Code', monospace;
  padding: 2px 7px;
  border-radius: 99px;
}

.crm-badge--true  { background: hsl(145, 55%, 88%); color: hsl(145, 55%, 30%); }
.crm-badge--false { background: hsl(220, 13%, 92%); color: hsl(220, 9%, 55%); }

/* ── SOQL textarea ── */
.crm-soql {
  width: 100%;
  border: 1px solid hsl(220, 13%, 86%);
  border-radius: 7px;
  padding: 10px 12px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 0.8125rem;
  color: hsl(220, 9%, 14%);
  background: white;
  resize: vertical;
  outline: none;
  line-height: 1.6;
  transition: border-color 0.12s, box-shadow 0.12s;
  -webkit-user-select: text !important;
  user-select: text !important;
  box-sizing: border-box;
}

.crm-soql:focus {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 3px rgba(9, 170, 234, 0.1);
}

/* ── Spin ── */
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spin { animation: spin 0.7s linear infinite; }
</style>
