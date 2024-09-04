<template>
    <loader v-if="pending" className="overlay" />
    <div class="card-header">
        <div class="title-wrap items-center">
            <h3>{{ $t('pages.login.title') }}</h3>
            <selectLocale />
        </div>
    </div>
    <div class="card-body">
        <div v-if="!error">
            <div v-if="authQR">
                <p v-if="localeProperties.code === 'ru'" class="font-medium">Отсканируйте этот QR код с помощью
                    приложений <a href="https://egov.kz/cms/ru/information/mobile/mobile_application"
                        target="_blank">eGov Mobile или
                        eGov Business</a></p>
                <p v-if="localeProperties.code === 'kk'" class="font-medium"><a
                        href="https://egov.kz/cms/ru/information/mobile/mobile_application" target="_blank">eGov Mobile
                        немесе eGov Business</a> қосымшасы арқылы осы QR-кодты сканерлеп алыңыз</p>
                <img class="m-auto w-1/3" :src="'data:image/png;base64,' + authQR.qrCode" />

                <div>
                    <div class="flex justify-center items-center relative my-4">
                        <span class="bg-active z-10 px-2">{{ $t('or') }}</span>
                        <hr class="absolute w-full" />
                    </div>

                    <p class="font-medium">{{ $t('pages.login.select_links.title') }}</p>

                    <div class="flex flex-col gap-2">
                        <a class="btn btn-sm btn-outline-primary" :href="authQR.eGovMobileLaunchLink">{{
        $t('pages.login.select_links.item_1') }}</a>
                        <a class="btn btn-sm btn-outline-primary" :href="authQR.eGovBusinessLaunchLink">{{
        $t('pages.login.select_links.item_2') }}</a>
                        <button class="btn btn-sm btn-light" @click="authQR = null">{{ $t('back') }}</button>
                    </div>
                </div>
            </div>
            <div v-else>
                <button class="card p-4 flex flex-col justify-center items-center w-full"
                    @click="getAuthUserData(nonce)">
                    <img width="90px" src="/img/auth/ncalayer-banner.png" />
                    <span class="font-medium">{{ $t('pages.login.sign_with_ncalayer') }}</span>
                    <span class="text-xs">({{ $t('pages.login.sign_with_ncalayer_description') }})</span>
                </button>

                <div class="flex justify-center items-center relative my-4">
                    <span class="bg-active z-10 px-2">{{ $t('or') }}</span>
                    <hr class="absolute w-full" />
                </div>

                <button class="card p-4 flex flex-col justify-center items-center w-full" @click="getQR()">
                    <img width="60px" src="/img/auth/qrcode.svg" />
                    <span class="font-medium">{{ $t('pages.login.sign_with_qr_code') }}</span>
                    <span class="text-xs">({{ $t('pages.login.sign_with_qr_code_description') }})</span>
                </button>
            </div>

        </div>

        <div v-else>
            <p class="font-medium text-danger">{{ error.message }}</p>
            <p>{{ error.description }}</p>
            <button @click="reloadPage" class="btn btn-outline-primary">{{ $t('restart') }}</button>
        </div>
    </div>
</template>

<script setup>
import { NCALayerClient } from "ncalayer-js-client";
import loader from "../components/ui/loader.vue";
import selectLocale from "../components/ui/selectLocale.vue";

const { t, localeProperties } = useI18n();
const { $axiosPlugin } = useNuxtApp();
const { login } = useSanctumAuth();

const authQR = ref(null);
const nonce = ref(null);
const pending = ref(true);
const error = ref(null);
const ncaLayer = ref(new NCALayerClient());

useHead({
    title: t('pages.login.title'),
    meta: [{ name: "description", content: "My amazing site." }],
});

definePageMeta({
    layout: "auth",
    middleware: ['sanctum:guest']
});

onMounted(() => {
    getToken();
})

async function getToken() {
    await $axiosPlugin.post('/auth/get_token').then((res) => {
        if (res.data.message) {
            error.value = {
                message: t('errors.signature_was_not_accept'),
                description: res.data.message,
                status: res.status
            };
            return;
        }
        nonce.value = res.data.nonce;
    }).catch((err) => {
        error.value = {
            message: t('errors.server_error'),
            description: err?.response.data.message,
            status: err?.response.status
        };
    });

    pending.value = false;
}

async function auth(nonce, signature) {
    try {
        await login({
            lang: localeProperties.value.code,
            sigex: {
                nonce: nonce,
                signature: signature,
                external: true
            }
        })
    } catch (err) {
        if (err.response.status) {
            error.value = {
                message: t('errors.server_error'),
                description: err.response.data.message,
                status: err.response.status
            };
            pending.value = false;
        }
    }
}

async function getAuthUserData(nonce) {
    pending.value = true;
    try {
        await ncaLayer.value.connect();
    }
    catch (err) {
        error.value = {
            message: t('errors.failed_to_connect_ncalayer'),
            description: err.toString(),
            status: null
        };
        pending.value = false;
        return;
    }

    let base64EncodedSignature;
    try {
        base64EncodedSignature = await ncaLayer.value.basicsSignCMS(
            NCALayerClient.basicsStorageAll,
            nonce, // здесь поддерживаются String | ArrayBuffer | Blob | File, строки интерпретируются как Base64
            NCALayerClient.basicsCMSParamsDetached,
            NCALayerClient.basicsSignerAuthAny, // здесь используется ключ авторизации
            localeProperties.value.code
        );
    } catch (err) {
        if (err.canceledByUser) {
            error.value = {
                message: t('errors.canceled_by_user'),
                description: err.toString(),
                status: null
            };
        }
        pending.value = false;
    }

    auth(nonce, base64EncodedSignature);
}

async function getQR() {
    pending.value = true;
    await $axiosPlugin.post('/auth/get_qr').then((res) => {
        if (res.data.message) {
            error.value = {
                message: t('errors.server_error'),
                description: res.data.message,
                status: res.status
            };
            return;
        }

        sendQR(res.data.dataURL);

        authQR.value = res.data;
        pending.value = false;
    }).catch((err) => {
        error.value = {
            message: t('errors.server_error'),
            description: err?.response.data.message,
            status: err?.response.status
        };
        pending.value = false;
        return;
    });
}

async function sendQR(dataURL) {
    await $axiosPlugin.post(dataURL, {
        signMethod: "CMS_SIGN_ONLY",
        documentsToSign: [{
            id: 1,
            meta: [],
            nameEn: "Блок случайных данных для аутентификации",
            nameRu: "Блок случайных данных для аутентификации",
            nameKz: "Блок случайных данных для аутентификации",
            document: {
                file: {
                    data: nonce.value,
                    mime: ""
                }
            }
        }]
    }).then((r) => {
        signQR(r.data.signURL);
    }).catch((err) => {
        error.value = {
            message: t('errors.server_error'),
            description: err?.response.data.message,
            status: err?.response.status
        };
        pending.value = false;
        return;
    });
}

async function signQR(signURL) {
    pending.value = true;
    await $axiosPlugin.get(signURL).then((r) => {
        auth(nonce.value, r.data.documentsToSign[0].document.file.data);
    }).catch((err) => {
        error.value = {
            message: t('errors.server_error'),
            description: err?.response.data.message,
            status: err?.response.status
        };
        pending.value = false;
        return;
    });
}

function reloadPage() {
    window.location.reload();
}
</script>