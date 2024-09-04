<template>
  <nuxt-link :to="localePath('/auth')">{{ $t('pages.login.title') }}</nuxt-link>
</template>

<script setup>
const { t } = useI18n();

useHead({
  title: t('pages.login.title'),
  meta: [{ name: "description", content: "My amazing site." }],
});
</script>
