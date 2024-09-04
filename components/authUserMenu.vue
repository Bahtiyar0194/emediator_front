<template>
    <dropdownMenu>
        <template v-slot:btn_content>
            <div class="flex items-center gap-1">
                <userAvatar :padding="0.5" :className="'w-8 h-8'" />
                <span class="font-medium hidden capitalize sm:block">{{ user?.first_name.charAt(0).toUpperCase() + user?.first_name.slice(1).toLowerCase() }}</span>
            </div>
        </template>

        <template v-slot:menu_content>
            <li>
                <button @click="logout()">
                    <i class="pi pi-user"></i>
                    {{ $t('pages.profile.title') }}
                </button>
            </li>
            <li>
                <button @click="logout()">
                    <i class="pi pi-sign-out"></i>
                    {{ $t('pages.login.sign_out') }}
                </button>
            </li>
        </template>
    </dropdownMenu>
</template>
<script setup>
import dropdownMenu from "./ui/dropdownMenu.vue";
import userAvatar from "./ui/userAvatar.vue";

const user = useSanctumUser();
const { logout, refreshIdentity } = useSanctumAuth();
const { t } = useI18n();

</script>