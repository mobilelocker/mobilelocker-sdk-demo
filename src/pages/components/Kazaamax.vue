<template>
  <div class="kzm"
       :class="{'kzm--presenting': presenting}">
    <div class="kzm__slide-area">
      <transition name="kzm-fade"
                  mode="out-in">

        <!-- SLIDE 0 — Overview -->
        <div v-if="currentSlide === 0"
             key="0"
             class="kzm__slide kzm__slide--brand">
          <div class="kzm__hero-wrap">
            <img src="@/assets/kazaamax.png"
                 class="kzm__hero-img"
                 alt="Kazaamax — Restore. Balance. Vitality."/>
            <div class="kzm__hero-badges">
              <span class="kzm__hero-badge">
                Rx ONLY
              </span>
              <span class="kzm__hero-badge">
                ADVANCED FORMULA · 60 CAPS
              </span>
            </div>
            <div class="kzm__hero-stats-bar">
              <div class="kzm__hstat">
                <span class="kzm__hstat-val">
                  94%
                </span>
                <span class="kzm__hstat-lbl">
                  Satisfaction Rate
                </span>
              </div>
              <div class="kzm__hstat-div"/>
              <div class="kzm__hstat">
                <span class="kzm__hstat-val">
                  2.2×
                </span>
                <span class="kzm__hstat-lbl">
                  Energy vs. Control
                </span>
              </div>
              <div class="kzm__hstat-div"/>
              <div class="kzm__hstat">
                <span class="kzm__hstat-val">
                  847
                </span>
                <span class="kzm__hstat-lbl">
                  Study Participants
                </span>
              </div>
            </div>
          </div>

          <div class="kzm__indication-strip">
            Indicated for moderately to severely active rheumatoid arthritis in adults with an inadequate response or intolerance to ≥1 conventional synthetic DMARD.
          </div>

          <div class="kzm__brand-claims">
            <div class="kzm__claim">
              <div class="kzm__claim-icon">
                <FontAwesomeIcon icon="shield-halved"/>
              </div>
              <div class="kzm__claim-text">
                <div class="kzm__claim-title">
                  Clinically Validated
                </div>
                <div class="kzm__claim-sub">
                  Phase III CLARITY-1 trial
                </div>
              </div>
            </div>
            <div class="kzm__claim">
              <div class="kzm__claim-icon">
                <FontAwesomeIcon icon="flask"/>
              </div>
              <div class="kzm__claim-text">
                <div class="kzm__claim-title">
                  Selective JAK1/STAT3
                </div>
                <div class="kzm__claim-sub">
                  Targeted mechanism of action
                </div>
              </div>
            </div>
            <div class="kzm__claim">
              <div class="kzm__claim-icon">
                <FontAwesomeIcon icon="calendar-check"/>
              </div>
              <div class="kzm__claim-text">
                <div class="kzm__claim-title">
                  Once-Daily Dosing
                </div>
                <div class="kzm__claim-sub">
                  40 mg oral tablet
                </div>
              </div>
            </div>
            <div class="kzm__claim">
              <div class="kzm__claim-icon">
                <FontAwesomeIcon icon="chart-line"/>
              </div>
              <div class="kzm__claim-text">
                <div class="kzm__claim-title">
                  Rapid Onset
                </div>
                <div class="kzm__claim-sub">
                  ACR20 response by Week 2
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SLIDE 1 — Patient Profile (NEW) -->
        <div v-else-if="currentSlide === 1"
             key="1"
             class="kzm__slide">
          <div class="kzm__slide-header">
            <div>
              <h2 class="kzm__slide-title">
                Patient Profile &amp; Indication
              </h2>
              <p class="kzm__slide-sub">
                Appropriate use in moderate-to-severe RA
              </p>
            </div>
            <div class="kzm__trial-chip">
              RA · csDMARD-IR
            </div>
          </div>

          <div class="kzm__profile-indication">
            <p class="kzm__profile-indication-text">
              <strong>Indicated</strong> for moderately to severely active rheumatoid arthritis in adults with an inadequate response or intolerance to ≥1 conventional synthetic DMARD.
            </p>
          </div>

          <div class="kzm__profile-grid">
            <div class="kzm__profile-col">
              <p class="kzm__section-label">Appropriate Patients</p>
              <div class="kzm__profile-item" v-for="item in appropriatePatients" :key="item">
                <FontAwesomeIcon icon="circle-check" class="kzm__profile-icon kzm__profile-icon--green"/>
                <span>{{ item }}</span>
              </div>
            </div>
            <div class="kzm__profile-col">
              <p class="kzm__section-label">Contraindications</p>
              <div class="kzm__profile-item" v-for="item in contraindications" :key="item">
                <FontAwesomeIcon icon="circle-xmark" class="kzm__profile-icon kzm__profile-icon--red"/>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>

          <div class="kzm__profile-pathway">
            <span class="kzm__pathway-label">Prior Treatment Pathway</span>
            <div class="kzm__pathway-steps">
              <div class="kzm__pathway-step">
                <span class="kzm__pathway-step-name">csDMARD</span>
                <span class="kzm__pathway-step-sub">e.g., methotrexate</span>
              </div>
              <div class="kzm__pathway-arrow">
                <FontAwesomeIcon icon="arrow-right"/>
                <span class="kzm__pathway-arrow-label">inadequate response</span>
              </div>
              <div class="kzm__pathway-step kzm__pathway-step--dest">
                <span class="kzm__pathway-step-name">Kazaamax 40mg</span>
                <span class="kzm__pathway-step-sub">Once daily · Rx Only</span>
              </div>
            </div>
          </div>

          <div class="kzm__profile-monitoring">
            <p class="kzm__section-label">Monitoring Requirements</p>
            <div class="kzm__monitoring-grid">
              <div class="kzm__monitoring-item">
                <span class="kzm__monitoring-test">CBC</span>
                <span class="kzm__monitoring-when">At baseline</span>
              </div>
              <div class="kzm__monitoring-item">
                <span class="kzm__monitoring-test">LFTs</span>
                <span class="kzm__monitoring-when">Periodically</span>
              </div>
              <div class="kzm__monitoring-item">
                <span class="kzm__monitoring-test">Lipids</span>
                <span class="kzm__monitoring-when">4–8 weeks</span>
              </div>
              <div class="kzm__monitoring-item">
                <span class="kzm__monitoring-test">TB / HBV</span>
                <span class="kzm__monitoring-when">Screen prior</span>
              </div>
            </div>
          </div>
        </div>

        <!-- SLIDE 2 — Efficacy (was slide 1) -->
        <div v-else-if="currentSlide === 2"
             key="2"
             class="kzm__slide">
          <div class="kzm__slide-header">
            <div>
              <h2 class="kzm__slide-title">
                Phase III CLARITY-1 Efficacy Data
              </h2>
              <p class="kzm__slide-sub">
                52-week, randomized, double-blind, placebo-controlled — n=847
              </p>
            </div>
            <div class="kzm__trial-chip">
              CLARITY-1
            </div>
          </div>
          <div class="kzm__efficacy-grid">
            <div class="kzm__chart-wrap">
              <p class="kzm__section-label">
                ACR Response Rates at Week 12
              </p>
              <div class="kzm__chart">
                <div v-for="row in efficacyRows"
                     :key="row.label"
                     class="kzm__chart-row">
                  <span class="kzm__row-label">
                    {{ row.label }}
                  </span>
                  <div class="kzm__bars">
                    <div class="kzm__bar-track">
                      <div class="kzm__bar kzm__bar--drug"
                           :style="{ width: row.drug + '%' }">
                        <span class="kzm__bar-pct">
                          {{ row.drug }}% <span class="kzm__pval">(p&lt;0.001)</span>
                        </span>
                      </div>
                    </div>
                    <div class="kzm__bar-track">
                      <div class="kzm__bar kzm__bar--placebo"
                           :style="{ width: row.placebo + '%' }">
                        <span class="kzm__bar-pct">
                          {{ row.placebo }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="kzm__legend">
                <span class="kzm__legend-dot kzm__legend-dot--drug"/> Kazaamax 40 mg
                <span class="kzm__legend-dot kzm__legend-dot--placebo"/> Placebo
              </div>

              <div class="kzm__nnt-callout">
                <span class="kzm__nnt-label">NNT</span>
                <span class="kzm__nnt-val">3</span>
                <span class="kzm__nnt-desc">for ACR20 response <span class="kzm__nnt-formula">(1/0.37 ≈ 2.7)</span></span>
              </div>

              <p class="kzm__section-label kzm__section-label--spaced">
                ACR20 Response Over Time
              </p>
              <div v-if="weeklyResponse.length"
                   class="kzm__time-chart">
                <div v-for="pt in weeklyResponse"
                     :key="pt.week"
                     class="kzm__time-col">
                  <div class="kzm__time-col-bars">
                    <div class="kzm__time-b kzm__time-b--drug"
                         :style="{ height: (pt.acr20 * 0.7) + 'px' }"
                         :title="'Kazaamax: ' + pt.acr20 + '%'"/>
                    <div class="kzm__time-b kzm__time-b--placebo"
                         :style="{ height: (pt.placebo_acr20 * 0.7) + 'px' }"
                         :title="'Placebo: ' + pt.placebo_acr20 + '%'"/>
                  </div>
                  <span class="kzm__time-wk">
                    W{{ pt.week }}
                  </span>
                </div>
              </div>
              <div v-else
                   class="kzm__time-chart kzm__time-chart--loading">
                Loading…
              </div>
            </div>

            <div class="kzm__endpoints-wrap">
              <p class="kzm__section-label">
                Secondary Endpoints
              </p>
              <div class="kzm__ep-cards">
                <div v-for="ep in endpoints"
                     :key="ep.label"
                     class="kzm__ep-card">
                  <span class="kzm__ep-val">
                    {{ ep.value }}
                  </span>
                  <span class="kzm__ep-lbl">
                    {{ ep.label }}
                  </span>
                  <span class="kzm__ep-note">
                    {{ ep.note }}
                  </span>
                </div>
              </div>

              <div class="kzm__db-widget">
                <div class="kzm__db-header">
                  <span class="kzm__db-widget-label">
                    kazaamax.sqlite
                  </span>
                  <span class="kzm__db-status-dot"
                        :class="'kzm__db-dot--' + dbStatus"/>
                </div>
                <div v-if="caseStudies.length" class="kzm__db-live">
                  <div class="kzm__db-live-stats">
                    <div class="kzm__db-stat">
                      <span class="kzm__db-stat-val">
                        {{ remissionCount }}/{{ caseStudies.length }}
                      </span>
                      <span class="kzm__db-stat-lbl">
                        remission
                      </span>
                    </div>
                    <div class="kzm__db-stat">
                      <span class="kzm__db-stat-val">
                        {{ avgDas28Reduction }}%
                      </span>
                      <span class="kzm__db-stat-lbl">
                        avg DAS28 ↓
                      </span>
                    </div>
                  </div>
                  <p class="kzm__db-live-note">
                    {{ caseStudies.length }} Case studies loaded from database
                  </p>
                </div>
                <div v-else-if="dbStatus === 'loading'"
                     class="kzm__db-msg">
                  Connecting…
                </div>
                <div v-else
                     class="kzm__db-msg">
                  No data
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SLIDE 3 — Safety (was slide 2) -->
        <div v-else-if="currentSlide === 3"
             key="3"
             class="kzm__slide">
          <div class="kzm__slide-header">
            <div>
              <h2 class="kzm__slide-title">
                Safety &amp; Tolerability
              </h2>
              <p class="kzm__slide-sub">
                Pooled Phase II/III data — n=1,204 patient-years of exposure
              </p>
            </div>
            <div class="kzm__trial-chip kzm__trial-chip--green">
              Well Tolerated
            </div>
          </div>
          <div class="kzm__safety-grid">
            <div class="kzm__ae-table-wrap">
              <table class="kzm__ae-table">
                <thead>
                <tr>
                  <th>
                    Adverse Event (≥5%)
                  </th>
                  <th>
                    Kazaamax (n=423)
                  </th>
                  <th>
                    Placebo (n=424)
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="ae in adverseEvents"
                    :key="ae.name">
                  <td>
                    {{ ae.name }}
                  </td>
                  <td>
                      <span class="kzm__ae-pill"
                            :class="'kzm__ae-pill--' + ae.level">
                        {{ ae.drug }}
                      </span>
                  </td>
                  <td class="kzm__ae-placebo">
                    {{ ae.placebo }}
                  </td>
                </tr>
                </tbody>
              </table>
              <p class="kzm__table-note">
                * Most events Grade 1–2. Discontinuation due to AEs: 4.2% (Kazaamax) vs 3.8% (placebo).
              </p>
            </div>

            <div class="kzm__safety-aside">
              <div class="kzm__tol-card">
                <div class="kzm__tol-ring-wrap">
                  <div class="kzm__tol-ring"/>
                  <div class="kzm__tol-center">
                    <span class="kzm__tol-pct">
                      95.8%
                    </span>
                    <span class="kzm__tol-sub">
                      completed
                    </span>
                  </div>
                </div>
                <p class="kzm__tol-label">
                  52-Week Treatment Completion
                </p>
              </div>

              <div class="kzm__grade-card">
                <p class="kzm__grade-title">
                  AE Grade Distribution
                </p>
                <div class="kzm__grade-row">
                  <span class="kzm__grade-lbl">
                    Grade 1–2
                  </span>
                  <div class="kzm__grade-track">
                    <div class="kzm__grade-bar kzm__grade-bar--low"
                         style="width:88%"/>
                  </div>
                  <span class="kzm__grade-pct">
                    88%
                  </span>
                </div>
                <div class="kzm__grade-row">
                  <span class="kzm__grade-lbl">
                    Grade 3
                  </span>
                  <div class="kzm__grade-track">
                    <div class="kzm__grade-bar kzm__grade-bar--mid"
                         style="width:10%"/>
                  </div>
                  <span class="kzm__grade-pct">
                    10%
                  </span>
                </div>
                <div class="kzm__grade-row">
                  <span class="kzm__grade-lbl">
                    Grade 4
                  </span>
                  <div class="kzm__grade-track">
                    <div class="kzm__grade-bar kzm__grade-bar--high"
                         style="width:2%"/>
                  </div>
                  <span class="kzm__grade-pct">
                    2%
                  </span>
                </div>
                <p class="kzm__grade-note">
                  No malignancy signals vs. placebo
                </p>
              </div>

              <div class="kzm__safety-callout">
                <div class="kzm__safety-callout-row">
                  <FontAwesomeIcon icon="heart-pulse"
                                   class="kzm__safety-callout-icon"/>
                  <div>
                    <div class="kzm__safety-callout-val">
                      0.3%
                    </div>
                    <div class="kzm__safety-callout-lbl">
                      MACE rate (vs 0.4% placebo)
                    </div>
                  </div>
                </div>
                <div class="kzm__safety-callout-row">
                  <FontAwesomeIcon icon="virus-slash"
                                   class="kzm__safety-callout-icon"/>
                  <div>
                    <div class="kzm__safety-callout-val">
                      No signal
                    </div>
                    <div class="kzm__safety-callout-lbl">
                      Malignancy vs. population
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SLIDE 4 — MoA (was slide 3) -->
        <div v-else-if="currentSlide === 4"
             key="4"
             class="kzm__slide">
          <div class="kzm__slide-header">
            <div>
              <h2 class="kzm__slide-title">
                Mechanism of Action
              </h2>
              <p class="kzm__slide-sub">
                Selective JAK1/STAT3 pathway inhibitor
              </p>
            </div>
          </div>
          <div class="kzm__moa-grid">
            <div class="kzm__moa-diagram-wrap">
              <div class="kzm__moa-node kzm__moa-node--receptor">
                <span class="kzm__moa-icon">
                  <FontAwesomeIcon icon="circle-nodes"/>
                </span>
                <span>
                  IL-6R / gp130
                </span>
              </div>
              <div class="kzm__moa-connector"/>
              <div class="kzm__moa-node kzm__moa-node--jak">
                <span class="kzm__moa-icon">
                  <FontAwesomeIcon icon="ban"/>
                </span>
                <span>
                  JAK1
                </span>
                <span class="kzm__moa-tag">
                  BLOCKED
                </span>
              </div>
              <div class="kzm__moa-connector"/>
              <div class="kzm__moa-node kzm__moa-node--stat">
                <span class="kzm__moa-icon">
                  <FontAwesomeIcon icon="ban"/>
                </span>
                <span>
                  STAT3
                </span>
                <span class="kzm__moa-tag">
                  INHIBITED
                </span>
              </div>
              <div class="kzm__moa-connector"/>
              <div class="kzm__moa-node kzm__moa-node--outcome">
                <span class="kzm__moa-icon">
                  <FontAwesomeIcon icon="arrow-down"/>
                </span>
                <span>
                  Pro-Inflammatory Cytokines
                </span>
              </div>
            </div>

            <div class="kzm__moa-right">
              <div class="kzm__moa-points">
                <div v-for="pt in moaPoints"
                     :key="pt.title"
                     class="kzm__moa-point">
                  <div class="kzm__moa-dot"
                       :style="{ background: pt.color }"/>
                  <div class="kzm__moa-text">
                    <p class="kzm__moa-point-title">
                      {{ pt.title }}
                    </p>
                    <p class="kzm__moa-point-body">
                      {{ pt.body }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="kzm__selectivity-card">
                <p class="kzm__selectivity-title">
                  Kinase Selectivity Profile
                </p>
                <div class="kzm__sel-rows">
                  <div v-for="k in kinaseSelectivity"
                       :key="k.name"
                       class="kzm__sel-row">
                    <span class="kzm__sel-name">
                      {{ k.name }}
                    </span>
                    <div class="kzm__sel-track">
                      <div class="kzm__sel-bar"
                           :class="k.primary ? 'kzm__sel-bar--primary' : 'kzm__sel-bar--off'"
                           :style="{ width: k.width + '%' }"/>
                    </div>
                    <span class="kzm__sel-label"
                          :class="k.primary ? 'kzm__sel-label--primary' : ''">
                      {{ k.label }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="kzm__dosing-box">
                <p class="kzm__dosing-title">
                  DOSING
                </p>
                <div class="kzm__dosing-pills">
                  <span class="kzm__dose-pill">
                    40 mg once daily
                  </span>
                  <span class="kzm__dose-pill">
                    With or without food
                  </span>
                  <span class="kzm__dose-pill">
                    20 mg if hepatic impairment
                  </span>
                </div>
                <p class="kzm__dosing-avail">
                  Available as 20 mg &amp; 40 mg film-coated tablets
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- SLIDE 5 — Case Studies (was slide 4) -->
        <div v-else-if="currentSlide === 5"
             key="5"
             class="kzm__slide"
             style="position: relative;">
          <div class="kzm__slide-header">
            <div>
              <h2 class="kzm__slide-title">
                Case Studies
              </h2>
              <p class="kzm__slide-sub">
                De-identified patient profiles from the REACT real-world registry
              </p>
            </div>
            <div class="kzm__db-badge">
              <span class="kzm__db-status-dot"
                    :class="'kzm__db-dot--' + dbStatus"/>
              <span>
                kazaamax.sqlite
              </span>
            </div>
          </div>
          <div v-if="caseStudies.length"
               class="kzm__cases-grid">
            <div v-for="cs in caseStudies"
                 :key="cs.id"
                 class="kzm__case-card"
                 :class="{ 'kzm__case-card--selected': selectedCase && selectedCase.id === cs.id }"
                 @click="selectedCase = cs">
              <div class="kzm__case-header">
                <div class="kzm__case-avatar">
                  {{ cs.initials }}
                </div>
                <div class="kzm__case-meta">
                  <div class="kzm__case-identity">
                    {{ cs.age }}{{ cs.sex }} &middot; {{ cs.disease_duration_yrs }}yr RA
                  </div>
                  <div class="kzm__case-flags">
                    <span v-if="cs.rf_positive"
                          class="kzm__case-flag">
                      RF+
                    </span>
                    <span v-if="cs.anti_ccp_positive"
                          class="kzm__case-flag">
                      anti-CCP+
                    </span>
                    <span v-if="cs.prior_biologics"
                          class="kzm__case-flag kzm__case-flag--warn">
                      Prior bDMARD
                    </span>
                  </div>
                </div>
                <span class="kzm__case-response"
                      :class="'kzm__case-response--' + cs.response_category">
                  {{ das28Badge(cs.response_category) }}
                </span>
              </div>

              <div class="kzm__das-chart">
                <div v-for="tp in caseTimepoints(cs)"
                     :key="tp.label"
                     class="kzm__das-row">
                  <span class="kzm__das-tp">
                    {{ tp.label }}
                  </span>
                  <div class="kzm__das-track">
                    <div class="kzm__das-fill"
                         :style="{ width: das28Width(tp.val), background: das28Color(tp.val) }"/>
                  </div>
                  <span class="kzm__das-val"
                        :style="{ color: das28Color(tp.val) }">
                    {{ tp.val }}
                  </span>
                </div>
              </div>

              <div class="kzm__case-crp">
                <span class="kzm__case-crp-label">
                  CRP:
                </span>
                <span class="kzm__case-crp-val">
                  {{ cs.crp_baseline }} → {{ cs.crp_wk52 }} mg/L
                </span>
              </div>

              <p class="kzm__case-summary">
                {{ cs.summary }}
              </p>
            </div>
          </div>

          <div v-else
               class="kzm__cases-empty">
            <FontAwesomeIcon icon="database"
                             class="kzm__cases-empty-icon"/>
            <span>
              Loading patient data from kazaamax.sqlite…
            </span>
          </div>

          <div v-if="publications.length"
               class="kzm__pubs-strip">
            <span class="kzm__pubs-label">
              Key Evidence
            </span>
            <div class="kzm__pubs-list">
              <div v-for="pub in publications"
                   :key="pub.id"
                   class="kzm__pub-pill"
                   :title="pub.key_finding">
                <span class="kzm__pub-journal">
                  {{ pub.journal }}
                </span>
                <span class="kzm__pub-year">
                  {{ pub.year }}
                </span>
              </div>
            </div>
          </div>

          <!-- Case Detail Overlay -->
          <div v-if="selectedCase"
               class="kzm__case-overlay">
            <div class="kzm__case-overlay-header">
              <div class="kzm__case-avatar kzm__case-avatar--lg">
                {{ selectedCase.initials }}
              </div>
              <div class="kzm__case-meta" style="flex:1;">
                <div class="kzm__case-identity">
                  {{ selectedCase.age }}{{ selectedCase.sex }} &middot; {{ selectedCase.disease_duration_yrs }}yr RA
                </div>
                <div class="kzm__case-flags">
                  <span v-if="selectedCase.rf_positive" class="kzm__case-flag">RF+</span>
                  <span v-if="selectedCase.anti_ccp_positive" class="kzm__case-flag">anti-CCP+</span>
                  <span v-if="selectedCase.prior_biologics" class="kzm__case-flag kzm__case-flag--warn">Prior bDMARD</span>
                </div>
              </div>
              <span class="kzm__case-response"
                    :class="'kzm__case-response--' + selectedCase.response_category">
                {{ das28Badge(selectedCase.response_category) }}
              </span>
              <button class="kzm__case-overlay-close" @click="selectedCase = null">×</button>
            </div>

            <p class="kzm__section-label" style="margin-top:12px;">DAS28 Over Time</p>
            <div class="kzm__das-chart kzm__das-chart--lg">
              <div v-for="tp in caseTimepoints(selectedCase)"
                   :key="tp.label"
                   class="kzm__das-row">
                <span class="kzm__das-tp">{{ tp.label }}</span>
                <div class="kzm__das-track">
                  <div class="kzm__das-fill kzm__das-fill--lg"
                       :style="{ width: das28Width(tp.val), background: das28Color(tp.val) }"/>
                </div>
                <span class="kzm__das-val" :style="{ color: das28Color(tp.val) }">{{ tp.val }}</span>
              </div>
            </div>

            <div class="kzm__case-overlay-crp">
              <span class="kzm__case-crp-label">CRP Trend</span>
              <span class="kzm__case-crp-val">
                {{ selectedCase.crp_baseline }}
                <FontAwesomeIcon icon="arrow-right" style="font-size:0.5rem; opacity:0.5;"/>
                {{ selectedCase.crp_wk52 }} mg/L
              </span>
            </div>

            <div class="kzm__case-overlay-summary">
              {{ selectedCase.summary }}
            </div>

            <div v-if="publications.length" class="kzm__pubs-strip" style="margin-top:8px;">
              <span class="kzm__pubs-label">Key Evidence</span>
              <div class="kzm__pubs-list">
                <div v-for="pub in publications"
                     :key="pub.id"
                     class="kzm__pub-pill"
                     :title="pub.key_finding">
                  <span class="kzm__pub-journal">{{ pub.journal }}</span>
                  <span class="kzm__pub-year">{{ pub.year }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SLIDE 6 — Share (was slide 5) -->
        <div v-else-if="currentSlide === 6"
             key="6"
             class="kzm__slide">
          <div class="kzm__slide-header">
            <div>
              <h2 class="kzm__slide-title">
                Send Clinical Summary
              </h2>
              <p class="kzm__slide-sub">
                Forward this presentation to a colleague or healthcare professional.
              </p>
            </div>
            <FontAwesomeIcon icon="paper-plane"
                             class="kzm__share-header-icon"/>
          </div>

          <div class="kzm__share-grid">
            <div class="kzm__share-preview">
              <p class="kzm__section-label">
                What's included
              </p>
              <ul class="kzm__share-list">
                <li>
                  <FontAwesomeIcon icon="circle-check"
                                   class="kzm__share-check"/>
                  CLARITY-1 Phase III Efficacy Data
                </li>
                <li>
                  <FontAwesomeIcon icon="circle-check"
                                   class="kzm__share-check"/>
                  Safety &amp; Tolerability Profile
                </li>
                <li>
                  <FontAwesomeIcon icon="circle-check"
                                   class="kzm__share-check"/>
                  Mechanism of Action Overview
                </li>
                <li>
                  <FontAwesomeIcon icon="circle-check"
                                   class="kzm__share-check"/>
                  {{ caseStudies.length || 4 }} De-identified Case Studies
                </li>
                <li>
                  <FontAwesomeIcon icon="circle-check"
                                   class="kzm__share-check"/>
                  {{ publications.length || 5 }} Key Clinical Publications
                </li>
              </ul>

              <div class="kzm__share-drug-card">
                <div class="kzm__share-drug-name">
                  Kazaamax 40 mg
                </div>
                <div class="kzm__share-drug-sub">
                  Selective JAK1/STAT3 Inhibitor
                </div>
                <div class="kzm__share-drug-rxcui">
                  Film-coated tablet · Once daily
                </div>
              </div>
            </div>

            <div class="kzm__share-form">
              <div class="kzm__share-field">
                <label class="kzm__share-label">
                  Recipient name
                </label>
                <input v-model="shareRecipientName"
                       type="text"
                       placeholder="Dr. Jane Smith"
                       class="kzm__share-input"/>
              </div>
              <div class="kzm__share-field">
                <label class="kzm__share-label">
                  Recipient email address
                </label>
                <input v-model="shareEmail"
                       type="email"
                       placeholder="colleague@hospital.edu"
                       class="kzm__share-input"/>
              </div>
              <button class="kzm__share-btn"
                      :disabled="!shareEmail || shareSending"
                      @click="sendStudy">
                <FontAwesomeIcon v-if="!shareSending"
                                 icon="paper-plane"/>
                <span>
                  {{ shareSending ? 'Sending…' : 'Send Clinical Summary' }}
                </span>
              </button>
              <div v-if="shareSent"
                   class="kzm__share-success">
                <FontAwesomeIcon icon="circle-check"/>
                Summary sent to {{ shareSentTo?.name }} ({{ shareSentTo?.email }})
              </div>
            </div>
          </div>
        </div>

      </transition>
    </div>

    <nav class="kzm__steps">
      <button v-for="(step, i) in steps"
              :key="i"
              class="kzm__step"
              :class="{
                'kzm__step--done':   i < currentSlide,
                'kzm__step--active': i === currentSlide,
              }"
              @click="currentSlide = i">
        <span class="kzm__step-num">
          {{ i + 1 }}
        </span>
        <span class="kzm__step-label">
          {{ step.label }}
        </span>
      </button>
      <button class="kzm__present-toggle"
              :title="presenting ? 'Exit presentation' : 'Present'"
              @click="togglePresent">
        <FontAwesomeIcon :icon="presenting ? 'compress' : 'expand'"/>
      </button>
    </nav>
  </div>
</template>

<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

export default {
  name: 'KazaamaxIVA',
  components: {FontAwesomeIcon},

  props: {
    presenting: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['present', 'exit-present'],

  data() {
    return {
      currentSlide: 0,
      dbStatus: 'loading',

      caseStudies: [],
      weeklyResponse: [],
      publications: [],

      selectedCase: null,

      shareEmail: '',
      shareRecipientName: '',
      shareSent: false,
      shareSentTo: null,
      shareSending: false,

      steps: [
        {label: 'Overview'},
        {label: 'Patient'},
        {label: 'Efficacy'},
        {label: 'Safety'},
        {label: 'MoA'},
        {label: 'Cases'},
        {label: 'Share'},
      ],

      appropriatePatients: [
        'Inadequate response to ≥1 csDMARD (e.g., methotrexate)',
        'Moderate-to-severe disease activity (DAS28 > 3.2)',
        'Seropositive RA (RF+ or anti-CCP+)',
        'Adult patients (≥18 years)',
        'May be used with or without methotrexate',
      ],

      contraindications: [
        'Active serious infection or sepsis',
        'Active or latent tuberculosis (screen prior)',
        'Severe hepatic impairment (Child-Pugh C)',
        'Pregnancy or planned pregnancy',
        'Known hypersensitivity to kazaalopidine',
      ],

      efficacyRows: [
        {
          label: 'ACR20',
          drug: 68,
          placebo: 31,
        },
        {
          label: 'ACR50',
          drug: 44,
          placebo: 14,
        },
        {
          label: 'ACR70',
          drug: 22,
          placebo: 6,
        },
      ],

      endpoints: [
        {
          value: '−42%',
          label: 'DAS28-CRP Reduction',
          note: 'vs −18% placebo',
        },
        {
          value: '3.1×',
          label: 'MCID Achievement',
          note: 'vs baseline',
        },
        {
          value: '58%',
          label: 'CDAI Remission',
          note: 'at Week 24',
        },
      ],

      adverseEvents: [
        {
          name: 'Upper respiratory infection',
          drug: '12.4%',
          placebo: '11.1%',
          level: 'low',
        },
        {
          name: 'Nasopharyngitis',
          drug: '9.8%',
          placebo: '8.9%',
          level: 'low',
        },
        {
          name: 'Headache',
          drug: '7.3%',
          placebo: '6.6%',
          level: 'low',
        },
        {
          name: 'Nausea',
          drug: '6.1%',
          placebo: '4.2%',
          level: 'mid',
        },
        {
          name: 'Elevated ALT (≥3× ULN)',
          drug: '2.8%',
          placebo: '1.4%',
          level: 'mid',
        },
        {
          name: 'Serious adverse events',
          drug: '4.9%',
          placebo: '5.2%',
          level: 'low',
        },
      ],

      moaPoints: [
        {
          color: '#0057B8',
          title: 'Selective JAK1 Inhibition',
          body: '>40× selectivity over JAK2/JAK3, minimising off-target hematopoietic effects.',
        },
        {
          color: '#00AEEF',
          title: 'STAT3 Pathway Blockade',
          body: 'Prevents nuclear translocation and transcription of IL-6, IL-17, and TNF-α.',
        },
        {
          color: '#43A047',
          title: 'Rapid Onset',
          body: 'ACR20 responses as early as Week 2, sustained through 52 weeks.',
        },
      ],

      kinaseSelectivity: [
        {
          name: 'JAK1',
          width: 100,
          label: 'Primary target',
          primary: true,
        },
        {
          name: 'JAK2',
          width: 2.5,
          label: '40× lower',
          primary: false,
        },
        {
          name: 'JAK3',
          width: 2.5,
          label: '40× lower',
          primary: false,
        },
        {
          name: 'TYK2',
          width: 8,
          label: '12× lower',
          primary: false,
        },
      ],
    }
  },

  computed: {
    inApp() {
      return this.$ml.isApp()
    },

    remissionCount() {
      return this.caseStudies.filter(c => c.response_category === 'remission').length
    },

    avgDas28Reduction() {
      if (!this.caseStudies.length) return 0
      const pct = this.caseStudies.map(c =>
          (c.das28_baseline - c.das28_wk52) / c.das28_baseline * 100
      )
      return Math.round(pct.reduce((a, b) => a + b, 0) / pct.length)
    },
  },

  async created() {
    await this._loadClinicalDb()
  },

  methods: {
    async _loadClinicalDb() {
      try {
        const [cases, timeline, pubs] = await Promise.all([
          this.$ml.database.query('kazaamax.sqlite', 'SELECT * FROM case_studies ORDER BY id'),
          this.$ml.database.query('kazaamax.sqlite', 'SELECT * FROM weekly_response ORDER BY week'),
          this.$ml.database.query('kazaamax.sqlite', 'SELECT * FROM publications ORDER BY year DESC'),
        ])
        this.caseStudies = cases.rows
        this.weeklyResponse = timeline.rows.filter(r => r.week > 0)
        this.publications = pubs.rows
        this.dbStatus = 'ready'
      } catch {
        this.dbStatus = 'error'
      }
    },

    das28Color(val) {
      if (val < 2.6) return '#43A047'
      if (val < 3.2) return '#7CB342'
      if (val < 5.1) return '#FFB300'
      return '#E53935'
    },

    das28Width(val) {
      return (Math.min(val, 8.5) / 8.5 * 100) + '%'
    },

    das28Badge(category) {
      return {
        remission: 'Remission',
        low: 'Low Activity',
        moderate: 'Moderate',
        high: 'High Activity',
      }[category] ?? category
    },

    caseTimepoints(cs) {
      return [
        {
          label: 'BL',
          val: cs.das28_baseline,
        },
        {
          label: 'W12',
          val: cs.das28_wk12,
        },
        {
          label: 'W24',
          val: cs.das28_wk24,
        },
        {
          label: 'W52',
          val: cs.das28_wk52,
        },
      ]
    },

    togglePresent() {
      this.$emit(this.presenting ? 'exit-present' : 'present')
    },

    async sendStudy() {
      if (!this.shareEmail) return
      try {
        this.shareSending = true
        const name = this.shareRecipientName || 'Colleague'
        const email = this.shareEmail
        this.$ml.share.email(
          { name, email },
          'Your IVA/SDK Demo is Ready',
          'This email would contain the presentation with a link to view.'
        )
        this.shareSentTo = { name, email }
        this.shareRecipientName = ''
        this.shareEmail = ''
        this.shareSent = true
      } catch (error) {
        console.log(error)
      } finally {
        this.shareSending = false
      }
    },
  },
}
</script>

<style scoped>
.kzm {
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  min-height: 0;
  flex: 1;
}

.kzm__slide-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.kzm__slide {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 4px 0 12px;
}

/* ── Transitions ── */
.kzm-fade-enter-active,
.kzm-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.kzm-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.kzm-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

/* ─────────────────────────────────────
   SLIDE 0 — Brand
───────────────────────────────────── */
.kzm__slide--brand {
  gap: 12px;
}

.kzm__hero-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 5 / 2;
  border-radius: 10px;
  overflow: hidden;
  background: linear-gradient(135deg, #00C4FF, #0047AB);
  flex-shrink: 0;
}

.kzm__hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 42%;
  display: block;
}

.kzm__hero-badges {
  position: absolute;
  bottom: calc(44px + 10px);
  left: 12px;
  display: flex;
  flex-direction: row;
  gap: 6px;
  flex-wrap: wrap;
}

.kzm__hero-badge {
  display: inline-block;
  background: rgba(0, 20, 80, 0.68);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 3px 9px;
  border-radius: 4px;
}

.kzm__hero-stats-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background: rgba(0, 20, 80, 0.62);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.kzm__hstat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 10px 8px;
}

.kzm__hstat-val {
  font-size: 1.25rem;
  font-weight: 800;
  color: #00AEEF;
  letter-spacing: -0.02em;
  text-shadow: 0 0 12px rgba(0, 174, 239, 0.4);
}

.kzm__hstat-lbl {
  font-size: 0.5625rem;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  white-space: nowrap;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.kzm__hstat-div {
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.12);
  flex-shrink: 0;
}

/* Indication strip */
.kzm__indication-strip {
  background: hsl(210, 60%, 96%);
  border: 1px solid hsl(210, 50%, 88%);
  border-left: 3px solid #0057B8;
  border-radius: 6px;
  padding: 9px 12px;
  font-size: 0.6875rem;
  color: #37474F;
  line-height: 1.55;
}

/* Brand claims bar */
.kzm__brand-claims {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.kzm__claim {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: hsl(220, 14%, 98%);
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 8px;
}

.kzm__claim-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: hsl(214, 80%, 93%);
  color: hsl(214, 70%, 42%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.kzm__claim-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #001859;
  line-height: 1.2;
}

.kzm__claim-sub {
  font-size: 0.625rem;
  color: #78909C;
  margin-top: 2px;
  line-height: 1.3;
}

/* ─────────────────────────────────────
   Shared slide header
───────────────────────────────────── */
.kzm__slide-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.kzm__slide-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #001859;
  letter-spacing: -0.02em;
}

.kzm__slide-sub {
  margin: 3px 0 0;
  font-size: 0.75rem;
  color: #607D8B;
}

.kzm__trial-chip {
  flex-shrink: 0;
  background: #0057B8;
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}

.kzm__trial-chip--green {
  background: #2E7D32;
}

.kzm__section-label {
  margin: 0 0 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #90A4AE;
  text-transform: uppercase;
}

.kzm__section-label--spaced {
  margin-top: 12px;
}

/* ─────────────────────────────────────
   SLIDE 1 — Patient Profile
───────────────────────────────────── */
.kzm__profile-indication {
  background: linear-gradient(135deg, #001859, #0057B8);
  border-radius: 8px;
  padding: 12px 16px;
}

.kzm__profile-indication-text {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.6;
}

.kzm__profile-indication-text strong {
  color: #00AEEF;
}

.kzm__profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.kzm__profile-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kzm__profile-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.6875rem;
  color: #37474F;
  line-height: 1.45;
}

.kzm__profile-icon {
  font-size: 0.75rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.kzm__profile-icon--green {
  color: #43A047;
}

.kzm__profile-icon--red {
  color: #E53935;
}

.kzm__profile-pathway {
  background: hsl(220, 14%, 97%);
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kzm__pathway-label {
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #90A4AE;
}

.kzm__pathway-steps {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kzm__pathway-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: hsl(220, 13%, 92%);
  border-radius: 6px;
  padding: 7px 14px;
  min-width: 90px;
}

.kzm__pathway-step--dest {
  background: #0057B8;
}

.kzm__pathway-step--dest .kzm__pathway-step-name {
  color: #fff;
}

.kzm__pathway-step--dest .kzm__pathway-step-sub {
  color: rgba(255, 255, 255, 0.65);
}

.kzm__pathway-step-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #37474F;
}

.kzm__pathway-step-sub {
  font-size: 0.5rem;
  color: #90A4AE;
}

.kzm__pathway-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: #B0BEC5;
  font-size: 0.75rem;
  flex: 1;
}

.kzm__pathway-arrow-label {
  font-size: 0.4375rem;
  color: #90A4AE;
  text-align: center;
  line-height: 1.3;
}

.kzm__profile-monitoring {
  background: #F8FAFC;
  border: 1px solid #E3EAF2;
  border-radius: 8px;
  padding: 10px 14px;
}

.kzm__monitoring-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 4px;
}

.kzm__monitoring-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  background: #EBF4FF;
  border: 1px solid #C3DCFF;
  border-radius: 6px;
  padding: 8px 6px;
}

.kzm__monitoring-test {
  font-size: 0.75rem;
  font-weight: 800;
  color: #001859;
}

.kzm__monitoring-when {
  font-size: 0.5rem;
  color: #78909C;
  text-align: center;
}

/* ─────────────────────────────────────
   SLIDE 2 — Efficacy
───────────────────────────────────── */
.kzm__efficacy-grid {
  display: flex;
  gap: 20px;
  flex: 1;
}

.kzm__chart-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kzm__endpoints-wrap {
  width: 192px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kzm__chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kzm__chart-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
}

.kzm__row-label {
  width: 44px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #37474F;
  flex-shrink: 0;
}

.kzm__bars {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kzm__bar-track {
  background: #ECEFF1;
  border-radius: 3px;
  height: 20px;
  overflow: visible;
  position: relative;
  display: flex;
  align-items: center;
}

.kzm__bar {
  height: 100%;
  border-radius: 3px;
  position: relative;
  transition: width 0.6s ease;
  min-width: 4px;
}

.kzm__bar--drug {
  background: #0057B8;
}

.kzm__bar--placebo {
  background: #B0BEC5;
}

.kzm__bar-pct {
  position: absolute;
  left: calc(100% + 6px);
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.6875rem;
  font-weight: 700;
  color: #37474F;
  white-space: nowrap;
}

.kzm__pval {
  font-size: 0.5625rem;
  font-weight: 400;
  color: #90A4AE;
  margin-left: 3px;
}

/* NNT callout */
.kzm__nnt-callout {
  display: flex;
  align-items: center;
  gap: 8px;
  background: hsl(210, 60%, 96%);
  border: 1px solid hsl(210, 50%, 88%);
  border-left: 3px solid #00AEEF;
  border-radius: 6px;
  padding: 7px 10px;
  margin-top: 6px;
}

.kzm__nnt-label {
  font-size: 0.5625rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #00AEEF;
  flex-shrink: 0;
}

.kzm__nnt-val {
  font-size: 1.125rem;
  font-weight: 800;
  color: #001859;
  flex-shrink: 0;
}

.kzm__nnt-desc {
  font-size: 0.625rem;
  color: #546E7A;
  line-height: 1.4;
}

.kzm__nnt-formula {
  color: #90A4AE;
}

.kzm__legend {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.6875rem;
  color: #546E7A;
  margin-top: 2px;
}

.kzm__legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 4px;
  vertical-align: middle;
}

.kzm__legend-dot--drug {
  background: #0057B8;
}

.kzm__legend-dot--placebo {
  background: #B0BEC5;
}

/* ACR time chart */
.kzm__time-chart {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 56px;
}

.kzm__time-chart--loading {
  font-size: 0.6875rem;
  color: #90A4AE;
  align-items: center;
}

.kzm__time-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  height: 100%;
  justify-content: flex-end;
}

.kzm__time-col-bars {
  display: flex;
  align-items: flex-end;
  gap: 1px;
  width: 100%;
}

.kzm__time-b {
  flex: 1;
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  transition: height 0.5s ease;
}

.kzm__time-b--drug {
  background: #0057B8;
}

.kzm__time-b--placebo {
  background: #B0BEC5;
}

.kzm__time-wk {
  font-size: 0.5rem;
  color: #90A4AE;
  white-space: nowrap;
  margin-top: 2px;
}

.kzm__ep-cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kzm__ep-card {
  background: #EBF4FF;
  border: 1px solid #C3DCFF;
  border-radius: 6px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.kzm__ep-val {
  font-size: 1rem;
  font-weight: 800;
  color: #001859;
}

.kzm__ep-lbl {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #37474F;
  line-height: 1.3;
}

.kzm__ep-note {
  font-size: 0.5625rem;
  color: #78909C;
}

/* ── DB widget (slide 2) ── */
.kzm__db-widget {
  background: #F8FAFC;
  border: 1px solid #E3EAF2;
  border-radius: 6px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
}

.kzm__db-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.kzm__db-widget-label {
  font-size: 0.5625rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #90A4AE;
  text-transform: uppercase;
}

.kzm__db-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.kzm__db-dot--loading {
  background: #B0BEC5;
}

.kzm__db-dot--ready {
  background: #43A047;
}

.kzm__db-dot--empty {
  background: #FFB300;
}

.kzm__db-dot--error {
  background: #E53935;
}

.kzm__db-live-stats {
  display: flex;
  gap: 8px;
}

.kzm__db-stat {
  flex: 1;
  background: #EBF2FB;
  border-radius: 5px;
  padding: 7px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.kzm__db-stat-val {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #001859;
}

.kzm__db-stat-lbl {
  font-size: 0.5625rem;
  color: #78909C;
  text-align: center;
}

.kzm__db-live-note {
  margin: 0;
  font-size: 0.5625rem;
  color: #90A4AE;
  font-style: italic;
}

.kzm__db-msg {
  font-size: 0.6875rem;
  color: #90A4AE;
  font-style: italic;
}

/* ─────────────────────────────────────
   SLIDE 3 — Safety
───────────────────────────────────── */
.kzm__safety-grid {
  display: flex;
  gap: 20px;
  flex: 1;
  align-items: flex-start;
}

.kzm__ae-table-wrap {
  flex: 1;
  min-width: 0;
}

.kzm__ae-table {
  width: 100%;
  border-collapse: collapse;
}

.kzm__ae-table th {
  background: #001859;
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 7px 10px;
  text-align: left;
}

.kzm__ae-table th:first-child {
  border-radius: 6px 0 0 0;
}

.kzm__ae-table th:last-child {
  border-radius: 0 6px 0 0;
}

.kzm__ae-table td {
  padding: 6px 10px;
  border-bottom: 1px solid #ECEFF1;
  color: #37474F;
  font-size: 0.75rem;
}

.kzm__ae-table tbody tr:nth-child(even) td {
  background: #F8FAFC;
}

.kzm__ae-pill {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 12px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.kzm__ae-pill--low {
  background: #E8F5E9;
  color: #2E7D32;
}

.kzm__ae-pill--mid {
  background: #FFF3E0;
  color: #E65100;
}

.kzm__ae-placebo {
  color: #90A4AE;
}

.kzm__table-note {
  margin: 6px 0 0;
  font-size: 0.625rem;
  color: #78909C;
  line-height: 1.5;
}

.kzm__safety-aside {
  width: 172px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kzm__tol-card {
  background: linear-gradient(135deg, #001859, #0057B8);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.kzm__tol-ring-wrap {
  position: relative;
  width: 72px;
  height: 72px;
}

.kzm__tol-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: conic-gradient(#00AEEF 0% 95.8%, rgba(255, 255, 255, 0.15) 95.8% 100%);
  mask: radial-gradient(circle at center, transparent 55%, black 56%);
  -webkit-mask: radial-gradient(circle at center, transparent 55%, black 56%);
}

.kzm__tol-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.kzm__tol-pct {
  font-size: 0.875rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
}

.kzm__tol-sub {
  font-size: 0.5rem;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.04em;
}

.kzm__tol-label {
  margin: 0;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
  line-height: 1.35;
}

.kzm__grade-card {
  background: #F8FAFC;
  border: 1px solid #E3EAF2;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.kzm__grade-title {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #90A4AE;
  text-transform: uppercase;
}

.kzm__grade-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.kzm__grade-lbl {
  font-size: 0.625rem;
  color: #546E7A;
  width: 48px;
  flex-shrink: 0;
}

.kzm__grade-track {
  flex: 1;
  height: 7px;
  background: #ECEFF1;
  border-radius: 4px;
  overflow: hidden;
}

.kzm__grade-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.kzm__grade-bar--low {
  background: #43A047;
}

.kzm__grade-bar--mid {
  background: #FFB300;
}

.kzm__grade-bar--high {
  background: #E53935;
}

.kzm__grade-pct {
  font-size: 0.625rem;
  font-weight: 700;
  color: #37474F;
  width: 26px;
  text-align: right;
  flex-shrink: 0;
}

.kzm__grade-note {
  margin: 0;
  font-size: 0.5625rem;
  color: #90A4AE;
  line-height: 1.4;
  border-top: 1px solid #ECEFF1;
  padding-top: 5px;
}

/* Safety callout cards */
.kzm__safety-callout {
  background: #F8FAFC;
  border: 1px solid #E3EAF2;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kzm__safety-callout-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kzm__safety-callout-icon {
  font-size: 0.75rem;
  color: #0057B8;
  flex-shrink: 0;
  width: 14px;
}

.kzm__safety-callout-val {
  font-size: 0.75rem;
  font-weight: 700;
  color: #001859;
}

.kzm__safety-callout-lbl {
  font-size: 0.5625rem;
  color: #78909C;
}

/* ─────────────────────────────────────
   SLIDE 4 — Mechanism of Action
───────────────────────────────────── */
.kzm__moa-grid {
  display: flex;
  gap: 20px;
  flex: 1;
  align-items: stretch;
}

.kzm__moa-diagram-wrap {
  width: 180px;
  flex-shrink: 0;
  background: linear-gradient(170deg, #001859 0%, #0057B8 60%, #00AEEF 100%);
  border-radius: 10px;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
}

.kzm__moa-node {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 10px;
  border-radius: 7px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
}

.kzm__moa-node--receptor {
  background: rgba(255, 255, 255, 0.12);
}

.kzm__moa-node--jak {
  background: rgba(220, 60, 60, 0.5);
}

.kzm__moa-node--stat {
  background: rgba(220, 140, 0, 0.5);
}

.kzm__moa-node--outcome {
  background: rgba(255, 255, 255, 0.15);
  font-size: 0.6875rem;
}

.kzm__moa-icon {
  font-size: 0.9375rem;
  flex-shrink: 0;
  opacity: 0.8;
}

.kzm__moa-tag {
  margin-left: auto;
  font-size: 0.4375rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 4px;
  border-radius: 3px;
}

.kzm__moa-connector {
  width: 2px;
  height: 12px;
  background: rgba(255, 255, 255, 0.25);
  align-self: center;
  margin: 2px 0;
}

.kzm__moa-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kzm__moa-points {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kzm__moa-point {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.kzm__moa-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.kzm__moa-text {
}

.kzm__moa-point-title {
  margin: 0 0 2px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #001859;
}

.kzm__moa-point-body {
  margin: 0;
  font-size: 0.6875rem;
  color: #546E7A;
  line-height: 1.5;
}

/* Kinase selectivity */
.kzm__selectivity-card {
  background: #F8FAFC;
  border: 1px solid #E3EAF2;
  border-radius: 8px;
  padding: 10px 12px;
}

.kzm__selectivity-title {
  margin: 0 0 8px;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #90A4AE;
  text-transform: uppercase;
}

.kzm__sel-rows {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kzm__sel-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kzm__sel-name {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #37474F;
  width: 36px;
  flex-shrink: 0;
}

.kzm__sel-track {
  flex: 1;
  height: 7px;
  background: #ECEFF1;
  border-radius: 4px;
  overflow: hidden;
}

.kzm__sel-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.kzm__sel-bar--primary {
  background: #0057B8;
}

.kzm__sel-bar--off {
  background: #B0BEC5;
}

.kzm__sel-label {
  font-size: 0.5625rem;
  color: #90A4AE;
  white-space: nowrap;
  width: 68px;
  flex-shrink: 0;
  text-align: right;
}

.kzm__sel-label--primary {
  color: #0057B8;
  font-weight: 700;
}

/* Dosing box */
.kzm__dosing-box {
  background: #001859;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.kzm__dosing-title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #00AEEF;
}

.kzm__dosing-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.kzm__dose-pill {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.kzm__dosing-avail {
  margin: 0;
  font-size: 0.5625rem;
  color: rgba(255, 255, 255, 0.45);
}

/* ─────────────────────────────────────
   SLIDE 5 — Case Studies
───────────────────────────────────── */
.kzm__db-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #F8FAFC;
  border: 1px solid #E3EAF2;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 0.5625rem;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: #78909C;
  white-space: nowrap;
}

.kzm__cases-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  flex: 1;
}

.kzm__case-card {
  background: hsl(220, 14%, 98.5%);
  border: 1px solid hsl(220, 13%, 91%);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  cursor: pointer;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.kzm__case-card:hover {
  box-shadow: 0 4px 14px rgba(0, 24, 89, 0.1);
  transform: translateY(-1px);
}

.kzm__case-card--selected {
  border-color: #0057B8;
  box-shadow: 0 0 0 2px rgba(0, 87, 184, 0.15);
}

.kzm__case-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.kzm__case-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: hsl(222, 25%, 20%);
  color: #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.kzm__case-avatar--lg {
  width: 44px;
  height: 44px;
  font-size: 0.8125rem;
}

.kzm__case-meta {
  flex: 1;
  min-width: 0;
}

.kzm__case-identity {
  font-size: 0.75rem;
  font-weight: 600;
  color: #001859;
  line-height: 1.2;
}

.kzm__case-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin-top: 4px;
}

.kzm__case-flag {
  font-size: 0.5rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  background: hsl(220, 13%, 92%);
  color: hsl(220, 9%, 45%);
  letter-spacing: 0.03em;
}

.kzm__case-flag--warn {
  background: hsl(33, 70%, 92%);
  color: hsl(33, 60%, 38%);
}

.kzm__case-response {
  flex-shrink: 0;
  font-size: 0.5625rem;
  font-weight: 700;
  padding: 3px 7px;
  border-radius: 99px;
  white-space: nowrap;
}

.kzm__case-response--remission {
  background: #E8F5E9;
  color: #2E7D32;
}

.kzm__case-response--low {
  background: #F1F8E9;
  color: #558B2F;
}

.kzm__case-response--moderate {
  background: #FFF3E0;
  color: #E65100;
}

.kzm__case-response--high {
  background: #FFEBEE;
  color: #C62828;
}

/* DAS28 chart */
.kzm__das-chart {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kzm__das-chart--lg .kzm__das-track {
  height: 16px;
}

.kzm__das-chart--lg .kzm__das-fill {
  height: 16px;
}

.kzm__das-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.kzm__das-tp {
  font-size: 0.5625rem;
  font-weight: 700;
  color: #90A4AE;
  width: 22px;
  flex-shrink: 0;
}

.kzm__das-track {
  flex: 1;
  height: 10px;
  background: #ECEFF1;
  border-radius: 3px;
  overflow: hidden;
}

.kzm__das-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
  min-width: 3px;
}

.kzm__das-val {
  font-size: 0.5625rem;
  font-weight: 700;
  width: 22px;
  text-align: right;
  flex-shrink: 0;
}

.kzm__case-crp {
  font-size: 0.5625rem;
  color: #78909C;
}

.kzm__case-crp-label {
  font-weight: 700;
  color: #90A4AE;
}

.kzm__case-crp-val {
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.kzm__case-summary {
  margin: 0;
  font-size: 0.6875rem;
  color: #546E7A;
  line-height: 1.5;
  flex: 1;
}

.kzm__cases-empty {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: 1px dashed hsl(220, 13%, 88%);
  border-radius: 8px;
  color: hsl(220, 9%, 62%);
  font-size: 0.8125rem;
}

.kzm__cases-empty-icon {
  font-size: 1.25rem;
  opacity: 0.4;
}

/* Case overlay */
.kzm__case-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 24, 89, 0.15);
  border: 1px solid hsl(220, 13%, 88%);
}

.kzm__case-overlay-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.kzm__case-overlay-close {
  margin-left: auto;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid hsl(220, 13%, 88%);
  background: hsl(220, 14%, 96%);
  color: #546E7A;
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.kzm__case-overlay-close:hover {
  background: #FFEBEE;
  color: #C62828;
  border-color: #FFCDD2;
}

.kzm__case-overlay-crp {
  display: flex;
  align-items: center;
  gap: 8px;
  background: hsl(210, 60%, 96%);
  border: 1px solid hsl(210, 50%, 88%);
  border-radius: 6px;
  padding: 7px 10px;
  margin-top: 8px;
  font-size: 0.6875rem;
}

.kzm__case-overlay-summary {
  background: hsl(210, 60%, 97%);
  border: 1px solid hsl(210, 40%, 90%);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 0.6875rem;
  color: #37474F;
  line-height: 1.6;
  margin-top: 8px;
}

/* Publications strip */
.kzm__pubs-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 4px;
  flex-wrap: wrap;
}

.kzm__pubs-label {
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #90A4AE;
  white-space: nowrap;
}

.kzm__pubs-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.kzm__pub-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  background: hsl(220, 14%, 95%);
  border: 1px solid hsl(220, 13%, 89%);
  border-radius: 99px;
  padding: 3px 9px;
  cursor: default;
}

.kzm__pub-journal {
  font-size: 0.5625rem;
  font-weight: 600;
  color: #37474F;
}

.kzm__pub-year {
  font-size: 0.5rem;
  color: #90A4AE;
}

/* ─────────────────────────────────────
   SLIDE 6 — Share
───────────────────────────────────── */
.kzm__share-header-icon {
  font-size: 1.5rem;
  color: #0057B8;
  opacity: 0.5;
  flex-shrink: 0;
}

.kzm__share-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  flex: 1;
}

.kzm__share-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.kzm__share-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: hsl(220, 9%, 32%);
}

.kzm__share-check {
  color: #43A047;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.kzm__share-drug-card {
  margin-top: 16px;
  background: linear-gradient(135deg, #001859, #0057B8);
  border-radius: 8px;
  padding: 14px;
}

.kzm__share-drug-name {
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
}

.kzm__share-drug-sub {
  font-size: 0.6875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 3px;
}

.kzm__share-drug-rxcui {
  font-size: 0.5625rem;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 6px;
  letter-spacing: 0.03em;
}

.kzm__share-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.kzm__share-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.kzm__share-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: hsl(220, 9%, 30%);
}

.kzm__share-optional {
  font-weight: 400;
  color: hsl(220, 9%, 62%);
  margin-left: 4px;
  font-size: 0.6875rem;
}

.kzm__share-input {
  font-family: inherit;
  font-size: 0.875rem;
  padding: 9px 12px;
  border: 1px solid hsl(220, 13%, 87%);
  border-radius: 7px;
  outline: none;
  color: hsl(220, 9%, 16%);
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
  box-sizing: border-box;
}

.kzm__share-input:focus {
  border-color: #0057B8;
  box-shadow: 0 0 0 3px rgba(0, 87, 184, 0.1);
}

.kzm__share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: #0057B8;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}

.kzm__share-btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.kzm__share-btn:not(:disabled):hover {
  background: #0045A0;
}

.kzm__share-success {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #2E7D32;
  background: #E8F5E9;
  border: 1px solid #C8E6C9;
  border-radius: 6px;
  padding: 8px 12px;
}

/* ─────────────────────────────────────
   Bottom Rectangular Navigation
───────────────────────────────────── */
.kzm__steps {
  display: flex;
  height: 40px;
  flex-shrink: 0;
  margin-top: 4px;
  margin-left: -40px;
  margin-right: -40px;
  margin-bottom: -36px;
  border-top: 1px solid hsl(220, 13%, 91%);
  overflow: hidden;
}

.kzm__step {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  border-right: 1px solid hsl(220, 13%, 91%);
  cursor: pointer;
  font-family: inherit;
  background: hsl(220, 14%, 96%);
  color: hsl(220, 9%, 55%);
  padding: 0 8px;
  transition: background 0.15s, color 0.15s, box-shadow 0.15s;
  box-shadow: inset 0 2px 0 transparent;
  white-space: nowrap;
}

.kzm__present-toggle {
  flex-shrink: 0;
  width: 40px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-left: 1px solid hsl(220, 13%, 91%);
  background: hsl(220, 14%, 96%);
  color: hsl(220, 9%, 55%);
  cursor: pointer;
  font-size: 0.6875rem;
  transition: background 0.15s, color 0.15s;
}

.kzm__present-toggle:hover {
  background: hsl(220, 14%, 92%);
  color: hsl(220, 9%, 30%);
}

.kzm--presenting .kzm__present-toggle {
  background: #fff;
  color: #0057B8;
  box-shadow: inset 0 2px 0 #0057B8;
}

.kzm--presenting {
  padding: 20px 28px 0;
}

.kzm--presenting .kzm__steps {
  margin-left: -28px;
  margin-right: -28px;
  margin-bottom: 0;
}

.kzm__step:hover:not(.kzm__step--active) {
  background: hsl(220, 14%, 92%);
  color: hsl(220, 9%, 30%);
}

.kzm__step--done {
  background: hsl(210, 80%, 97%);
  color: #0057B8;
  box-shadow: inset 0 2px 0 #00AEEF;
}

.kzm__step--done:hover {
  background: hsl(210, 80%, 94%);
}

.kzm__step--active {
  background: #fff;
  color: #001859;
  box-shadow: inset 0 2px 0 #0057B8;
  cursor: default;
}

.kzm__step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  font-size: 0.5625rem;
  font-weight: 800;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.07);
  color: inherit;
}

.kzm__step--done .kzm__step-num,
.kzm__step--active .kzm__step-num {
  background: rgba(0, 87, 184, 0.1);
}

.kzm__step-label {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

/* ── Responsive ── */
@media (max-width: 700px) {
  .kzm__steps {
    margin-left: -16px;
    margin-right: -16px;
    margin-bottom: -20px;
    height: 36px;
  }

  .kzm--presenting {
    padding: 12px 16px 0;
  }

  .kzm--presenting .kzm__steps {
    margin-left: -16px;
    margin-right: -16px;
    margin-bottom: 0;
  }

  .kzm__efficacy-grid,
  .kzm__safety-grid,
  .kzm__moa-grid,
  .kzm__share-grid {
    flex-direction: column;
  }

  .kzm__endpoints-wrap,
  .kzm__safety-aside,
  .kzm__moa-diagram-wrap {
    width: 100%;
  }

  .kzm__cases-grid {
    grid-template-columns: 1fr;
  }

  .kzm__brand-claims {
    grid-template-columns: 1fr 1fr;
  }

  .kzm__profile-grid {
    grid-template-columns: 1fr;
  }

  .kzm__monitoring-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .kzm__step-label {
    display: none;
  }
}
</style>
