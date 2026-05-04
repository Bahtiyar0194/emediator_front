<template>
  <loader
    :className="'full-overlay'"
    :showPendingText="true"
    :pendingText="$t('pages.auth.sign_out.please_wait')"
  />
</template>
<script setup>
import loader from '../components/ui/loader.vue';
const { t } = useI18n();
const { $axiosPlugin } = useNuxtApp();
const { logout } = useSanctumAuth();

useHead({
  title: t("pages.logout.title"),
  meta: [{ name: "description", content: "Logout" }],
});

definePageMeta({
  layout: "default",
  middleware: ["sanctum:auth"],
});

const handleLogout = () => {
  logout().then(() => {
    $axiosPlugin.defaults.headers.common["Authorization"] = null;
  });
};

onMounted(() => {
  handleLogout();
});
</script>
