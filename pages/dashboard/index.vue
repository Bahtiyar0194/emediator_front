<template>
    <p>{{ $t('welcome') }} {{ user?.name }}</p>
    <button @click="logout()" class="btn btn-outline-primary">{{ $t('pages.login.sign_out') }}</button>
</template>

<script setup>
const { t } = useI18n();
const user = useSanctumUser();
const { logout } = useSanctumAuth();

useHead({
    title: t('pages.dashboard.title'),
    meta: [{ name: "description", content: "My amazing site." }],
});

definePageMeta({
    layout: "dashboard",
    middleware: ['sanctum:auth']
});
</script>