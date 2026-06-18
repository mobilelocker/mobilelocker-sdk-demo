<template>
  <div class="iva-form">
    <div class="iva-form__header">
      <h2 class="iva-form__title">
        Search
      </h2>
      <p class="iva-form__subtitle">
        Query MobileLocker content across customers, presentations, contacts, and more.
      </p>
    </div>
    <div class="iva-form__divider"/>
    <div v-if="loading"
         class="d-flex justify-center"
         style="padding: 48px 0;">
      <v-progress-circular indeterminate
                           color="primary"/>
    </div>
    <AppRequired v-else-if="!isApp"/>
    <template v-else>
      <div class="search-bar"
           :class="{ 'search-bar--focused': focused }">
        <FontAwesomeIcon icon="magnifying-glass"
                         class="search-bar__icon"/>
        <input v-model="searchQuery"
               class="search-bar__input"
               placeholder="Search MobileLocker…"
               @keydown.enter="search"
               @focus="focused = true"
               @blur="focused = false"/>
        <button class="search-bar__btn"
                :disabled="!searchQuery || !searchQuery.trim()"
                @click="search">
          Search
        </button>
      </div>

      <div class="controls-row">
        <div class="controls-row__filters">
          <span class="controls-label">
            Filter
          </span>
          <label v-for="t in types"
                 :key="t.value"
                 class="filter-check">
            <input type="checkbox"
                   :value="t.value"
                   v-model="selectedTypes"
                   class="filter-check__input"/>
            <span class="filter-check__box"/>
            <span class="filter-check__label">
              {{ t.name }}

            </span>
          </label>
        </div>
        <div class="controls-row__limit">
          <span class="controls-label">
            Max results
          </span>
          <div class="limit-pills">
            <button v-for="opt in limitOptions"
                    :key="opt"
                    class="limit-pill"
                    :class="{ 'limit-pill--active': limit === opt }"
                    @click="limit = opt">
              {{ opt }}
            </button>
          </div>
        </div>
      </div>
      <template v-if="results !== null">
        <div class="iva-form__divider"/>
        <div class="results-header">
          <span class="results-header__count">
            {{ totalCount }} result{{ totalCount !== 1 ? 's' : '' }}
          </span>
          <button class="results-header__clear"
                  @click="clearResults">
            Clear
          </button>
        </div>
        <div v-if="results.length === 0"
             class="search-empty">
          <FontAwesomeIcon icon="circle-xmark"
                           class="search-empty__icon"/>
          <p class="search-empty__title">
            Nothing found
          </p>
          <p class="search-empty__text">
            No results matched "{{ lastQuery }}"
          </p>
        </div>
        <div v-else>
          <div class="result-list">
            <div v-for="(result, i) in pagedResults"
                 :key="result.id || i"
                 class="result-card"
                 :class="{ 'result-card--expanded': isExpanded(result, i) }">
              <div class="result-card__header" @click="toggleExpand(result, i)">
                <div class="result-card__main">
                  <span class="result-card__name">
                    {{ result.name || result.title || result.id || '—' }}
                  </span>
                  <span class="result-card__type">
                    {{ result._type }}
                  </span>
                </div>
                <div v-if="result.email || result.company_name || result.title" class="result-card__sub">
                  {{ [result.title, result.company_name, result.email].filter(Boolean).join(' · ') }}
                </div>
                <FontAwesomeIcon :icon="isExpanded(result, i) ? 'chevron-up' : 'chevron-down'"
                                 class="result-card__chevron"/>
              </div>
              <div v-if="isExpanded(result, i)"
                   class="result-card__json">
                <pre class="result-json">
                  {{ formatJson(result) }}
                </pre>
              </div>
            </div>
          </div>

          <div v-if="totalPages > 1"
               class="pagination">
            <button class="pagination__btn"
                    :disabled="currentPage === 1"
                    @click="currentPage--">
              <FontAwesomeIcon icon="chevron-left"/>
            </button>
            <span class="pagination__label">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button class="pagination__btn"
                    :disabled="currentPage === totalPages"
                    @click="currentPage++">
              <FontAwesomeIcon icon="chevron-right"/>
            </button>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import AppRequired from '@/components/AppRequired.vue'

export default {
  name: 'Search',
  components: {AppRequired, FontAwesomeIcon},

  computed: {
    isApp() {
      return this.$ml.isApp()
    },
    totalPages() {
      return Math.ceil((this.results?.length || 0) / this.pageSize)
    },
    pagedResults() {
      const start = (this.currentPage - 1) * this.pageSize
      return (this.results || []).slice(start, start + this.pageSize)
    },
  },

  data() {
    return {
      types: [
        {
          name: 'Customers',
          value: 'customers',
        },
        {
          name: 'Presentations',
          value: 'presentations',
        },
        {
          name: 'Contacts',
          value: 'contacts',
        },
        {
          name: 'Attendees',
          value: 'attendees',
        },
        {
          name: 'Business Cards',
          value: 'business_cards',
        }
      ],
      limitOptions: [10, 25, 50, 100],
      searchQuery: '',
      lastQuery: '',
      loading: false,
      focused: false,
      results: null,
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      expandedIds: [],
      selectedTypes: [],
      limit: 25,
    }
  },

  methods: {
    async search() {
      if (!this.searchQuery || !this.searchQuery.trim()) return
      this.loading = true
      this.lastQuery = this.searchQuery
      this.currentPage = 1
      this.expandedIds = []
      try {
        const response = await this.$ml.search.query(this.searchQuery, {
          types: this.selectedTypes.length ? this.selectedTypes : undefined,
          limit: this.limit,
        })
        this.totalCount = Object.values(response).reduce((sum, g) => sum + (g.total_count || 0), 0)
        this.results = Object.entries(response).flatMap(([type, group]) =>
            (group.results || []).map(item => ({...item, _type: type}))
        ).slice(0, this.limit)
      } catch {
        this.results = []
        this.totalCount = 0
      } finally {
        this.loading = false
      }
    },

    clearResults() {
      this.results = null
      this.totalCount = 0
      this.currentPage = 1
      this.expandedIds = []
    },

    isExpanded(result, index) {
      return this.expandedIds.includes(result.id ?? index)
    },

    toggleExpand(result, index) {
      const key = result.id ?? index
      const idx = this.expandedIds.indexOf(key)
      if (idx === -1) this.expandedIds.push(key)
      else this.expandedIds.splice(idx, 1)
    },

    formatJson(result) {
      const {_type, ...rest} = result
      return JSON.stringify(rest, null, 2)
    },
  },
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  border: 1.5px solid hsl(220, 13%, 88%);
  border-radius: 10px;
  background: white;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
  margin-bottom: 14px;
}

.search-bar--focused {
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.08);
}

.search-bar__icon {
  padding: 0 10px 0 16px;
  color: rgba(0, 0, 0, 0.3);
  font-size: 0.875rem;
  flex-shrink: 0;
}

.search-bar__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.9375rem;
  padding: 13px 0;
  background: transparent;
  color: hsl(220, 9%, 12%);
  min-width: 0;
}

.search-bar__input::placeholder {
  color: rgba(0, 0, 0, 0.3);
}

.search-bar__btn {
  margin: 5px;
  padding: 9px 20px;
  border: none;
  border-radius: 7px;
  background: rgb(var(--v-theme-primary));
  color: white;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.12s;
  flex-shrink: 0;
  letter-spacing: 0.01em;
}

.search-bar__btn:hover:not(:disabled) {
  filter: brightness(1.1);
}

.search-bar__btn:disabled {
  opacity: 0.4;
  cursor: default;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 4px;
}

.controls-row__filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 16px;
}

.controls-row__limit {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.controls-label {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.35);
  white-space: nowrap;
}

.filter-check {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}

.filter-check__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.filter-check__box {
  width: 14px;
  height: 14px;
  border: 1.5px solid hsl(220, 13%, 74%);
  border-radius: 3px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.12s, border-color 0.12s;
}

.filter-check__box::after {
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

.filter-check__input:checked + .filter-check__box {
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
}

.filter-check__input:checked + .filter-check__box::after {
  opacity: 1;
}

.filter-check__label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.55);
  white-space: nowrap;
}

.filter-check:hover .filter-check__box {
  border-color: hsl(220, 13%, 52%);
}

.limit-pills {
  display: flex;
  gap: 2px;
  background: hsl(220, 14%, 93%);
  border-radius: 7px;
  padding: 3px;
}

.limit-pill {
  border: none;
  border-radius: 5px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: rgba(0, 0, 0, 0.45);
  transition: all 0.12s;
}

.limit-pill--active {
  background: white;
  color: rgba(0, 0, 0, 0.82);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.results-header__count {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.35);
}

.results-header__clear {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.4);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.1s;
}

.results-header__clear:hover {
  color: rgba(0, 0, 0, 0.72);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.result-card {
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 8px;
  background: white;
  overflow: hidden;
  transition: border-color 0.1s;
}

.result-card--expanded {
  border-color: hsl(220, 13%, 82%);
}

.result-card__header {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  align-items: center;
  gap: 2px 10px;
  padding: 11px 14px;
  cursor: pointer;
  transition: background 0.1s;
}

.result-card__header:hover {
  background: hsl(220, 14%, 99%);
}

.result-card__main {
  display: flex;
  align-items: center;
  gap: 8px;
  grid-column: 1;
  grid-row: 1;
}

.result-card__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: hsl(220, 9%, 16%);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.result-card__type {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: hsl(220, 9%, 55%);
  background: hsl(220, 13%, 93%);
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
}

.result-card__sub {
  grid-column: 1;
  grid-row: 2;
  font-size: 0.8125rem;
  color: rgba(0, 0, 0, 0.42);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-card__chevron {
  grid-column: 2;
  grid-row: 1 / 3;
  font-size: 0.625rem;
  color: rgba(0, 0, 0, 0.28);
  align-self: center;
  transition: color 0.1s;
}

.result-card__header:hover .result-card__chevron {
  color: rgba(0, 0, 0, 0.5);
}

.result-card__json {
  border-top: 1px solid hsl(220, 13%, 91%);
  background: hsl(222, 20%, 14%);
  padding: 14px 16px;
}

.result-json {
  margin: 0;
  font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.75rem;
  line-height: 1.65;
  color: hsl(210, 30%, 84%);
  white-space: pre;
  overflow-x: auto;
  max-height: 280px;
  overflow-y: auto;
}

.search-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 24px;
}

.search-empty__icon {
  font-size: 2rem;
  color: hsl(220, 9%, 82%);
}

.search-empty__title {
  font-size: 1rem;
  font-weight: 600;
  color: hsl(220, 9%, 40%);
  margin: 0;
}

.search-empty__text {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 65%);
  margin: 0;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid hsl(220, 13%, 92%);
}

.pagination__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid hsl(220, 13%, 88%);
  background: white;
  color: hsl(220, 9%, 42%);
  cursor: pointer;
  font-size: 0.6875rem;
  transition: background 0.1s, border-color 0.1s;
}

.pagination__btn:hover:not(:disabled) {
  background: hsl(220, 13%, 95%);
  border-color: hsl(220, 13%, 78%);
}

.pagination__btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.pagination__label {
  font-size: 0.8125rem;
  color: rgba(0, 0, 0, 0.42);
  font-weight: 500;
  min-width: 90px;
  text-align: center;
}
</style>
