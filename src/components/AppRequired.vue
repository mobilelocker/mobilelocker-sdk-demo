<template>
  <div class="search-unavailable">
    <div class="search-unavailable__icon-wrap">
      <img src="@/assets/app_icon.png"
           alt="Mobile Locker"
           class="search-unavailable__app-icon"/>
    </div>
    <p class="search-unavailable__title">
      App required
    </p>
    <p class="search-unavailable__body">
      This feature is only available within the Mobile Locker app.
    </p>
  </div>
</template>
<script>
export default {}
</script>
<style>
.search-unavailable__icon-wrap {
  width: 64px;
  height: 64px;
  margin-bottom: 4px;
}

.search-unavailable__app-icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  display: block;
}

.search-unavailable__title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: hsl(220, 9%, 22%);
  margin: 0;
}

.search-unavailable__body {
  font-size: 0.8125rem;
  color: hsl(220, 9%, 58%);
  margin: 0;
  max-width: 280px;
  line-height: 1.5;
}

.search-unavailable {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 56px 24px;
  text-align: center;
}

</style>