<template>
  <nuxt-link :to="localePath('/auth')">{{ $t('pages.auth.title') }}</nuxt-link>
</template>

<script setup>
const { t } = useI18n();

useHead({
  title: t('pages.auth.title'),
  meta: [{ name: "description", content: "My amazing site." }],
});

await navigateTo('/dashboard')
</script>
