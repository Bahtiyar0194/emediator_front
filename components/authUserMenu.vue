<template>
  <dropdownMenu :dropdownArrow="true">
    <template v-slot:btn_content>
      <div class="flex items-center gap-x-1 sm:gap-x-1.5">
        <userAvatar
          v-if="authUser"
          :padding="0.5"
          :className="'w-8 h-8'"
          :user="authUser"
        />
        <div v-if="authUser" class="hidden sm:block text-left">
          <span class="font-medium">{{
            authUser?.first_name.charAt(0).toUpperCase() +
            authUser?.first_name.slice(1).toLowerCase()
          }}</span>
          <p class="text-inactive mb-0 -mt-0.5 text-[10px]">
            {{ authUser.current_role_name }}
          </p>
        </div>
      </div>
    </template>

    <template v-if="authUser" v-slot:menu_content>
      <li v-if="authUser.roles.length > 1">
        <div>
          <p class="mb-2.5">{{ $t("pages.users.user_mode") }}:</p>

          <div
            v-for="role in authUser.roles"
            :key="role.role_type_id"
            class="mt-1.5"
          >
            <label class="custom-radio">
              <input
                type="radio"
                @change="changeUserMode(role.role_type_id)"
                :checked="authUser.current_role_id == role.role_type_id"
                name="user_mode"
              />
              <span>{{ role.user_role_type_name }}</span>
            </label>
          </div>
        </div>
      </li>
      <li>
        <button @click="logout()">
          <i class="pi pi-user"></i>
          {{ $t("pages.profile.title") }}
        </button>
      </li>
      <li>
        <button @click="logout()">
          <i class="pi pi-sign-out"></i>
          {{ $t("pages.auth.sign_out") }}
        </button>
      </li>
    </template>
  </dropdownMenu>
</template>
<script setup>
import { useRouter } from "nuxt/app";
import dropdownMenu from "./ui/dropdownMenu.vue";
import userAvatar from "./ui/userAvatar.vue";

const authUser = useSanctumUser();
const { $axiosPlugin } = useNuxtApp();
const { logout, refreshIdentity } = useSanctumAuth();
const router = useRouter();

const changeUserMode = async (role_type_id) => {
  await $axiosPlugin
    .post("auth/change_mode/" + role_type_id)
    .then((response) => {
      refreshIdentity();
    })
    .catch((err) => {
      if (err.response) {
        router.push({
          path: "/error",
          query: {
            status: err.response.status,
            message: err.response.data.message,
            url: err.request.responseURL,
          },
        });
      } else {
        router.push("/error");
      }
    });
};
</script>
