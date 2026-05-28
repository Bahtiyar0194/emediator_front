<template>
  <div>
    <div class="db__header">
      <div class="w-32 lg:w-56">
        <!-- <img class="w-full" src="~/public/logo.svg"> -->
        <span class="font-medium text-corp sm:text-xl md:text-2xl"
          >E-Mediator</span
        >
      </div>

      <div class="btn-wrap items-center">
        <selectLocale />
        <authUserMenu />
      </div>
    </div>
    <div class="flex">
      <div
        class="db__sidebar__menu"
        @mouseenter="showMenu = true"
        @mouseleave="showMenu = false"
        @click="showMenu = true"
      >
        <roleProvider
          v-for="(item, index) in dashboardMenu"
          :key="index"
          :roles="item.roles"
        >
          <nuxt-link :to="localePath(item.link)">
            <i :class="item.icon"></i>
            <span class="font-medium" :class="{ show: showMenu === true }">{{
              $t(item.title)
            }}</span>
          </nuxt-link>
        </roleProvider>
      </div>
      <div class="db__content">
        <div v-if="hasAccess" class="custom-grid">
          <div class="col-span-12">
            <breadcrumb />
          </div>
          <NuxtPage />
        </div>
        <div v-else class="custom-grid">
          <div class="col-span-12">
            <div class="content-center">
              <i class="pi pi-lock text-6xl mb-2 text-corp"></i>
              <div class="text-center">
                <h4 class="mb-2">{{ $t("errors.page_is_not_available") }}</h4>
                <nuxt-link class="text-corp" :to="localePath('/dashboard')"
                  >{{ $t("pages.dashboard.go_to_dashboard") }}
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import selectLocale from "../components/ui/selectLocale.vue";
import authUserMenu from "../components/authUserMenu.vue";
import { useRoute } from "nuxt/app";
import roleProvider from "../components/ui/roleProvider.vue";
import breadcrumb from "../components/ui/breadcrumb.vue";

const authUser = useSanctumUser();
const menuWrapper = ref(null);
const showMenu = ref(false);

const dashboardMenu = [
  {
    title: "pages.dashboard.title",
    icon: "pi pi-home",
    link: "/dashboard",
    roles: [1, 2, 3, 4],
  },
  {
    title: "pages.users.title",
    icon: "pi pi-users",
    link: "/dashboard/users",
    roles: [1],
  },
];

const route = useRoute();

const hasAccess = computed(() => {
  const currentMenuItem = dashboardMenu.find(
    (item) => item.link === route.fullPath,
  );
  if (currentMenuItem) {
    if (currentMenuItem.roles.includes(authUser.value?.current_role_id)) {
      return true;
    } else {
      return false;
    }
  }
  return true;
});

const handleClickOutside = (event) => {
  // если есть элемент меню и клик был вне его — скрываем меню
  if (menuWrapper.value && !menuWrapper.value.contains(event.target)) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
