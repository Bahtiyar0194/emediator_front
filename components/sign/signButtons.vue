<template>
  <template v-if="signError">
    <p class="font-medium text-danger">{{ signError.message }}</p>
    <p>{{ signError.description }}</p>
    <button @click="props.reloadPage" class="btn btn-outline-primary">
      <i class="pi pi-refresh"></i>
      {{ $t("restart") }}
    </button>
  </template>

  <template v-else>
    <div v-if="signQR">
      <button class="btn btn-light mb-4" @click="props.clearQR">
        <i class="pi pi-arrow-left"></i>
        {{ $t("back") }}
      </button>

      <p class="font-medium">
        <template v-if="localeProperties.code === 'ru'">
          Отсканируйте этот QR код с помощью приложений
          <a
            href="https://egov.kz/cms/ru/information/mobile/mobile_application"
            target="_blank"
            >eGov Mobile или eGov Business</a
          >
        </template>

        <template v-if="localeProperties.code === 'kk'">
          <a
            href="https://egov.kz/cms/ru/information/mobile/mobile_application"
            target="_blank"
            >eGov Mobile немесе eGov Business</a
          >
          қосымшасы арқылы осы QR-кодты сканерлеп алыңыз
        </template>
      </p>

      <img
        class="m-auto w-1/3"
        :src="'data:image/png;base64,' + signQR.qrCode"
      />

      <div>
        <div class="flex justify-center items-center relative my-6">
          <span class="bg-inactive z-10 px-2">{{ $t("or") }}</span>
          <hr class="absolute w-full" />
        </div>

        <p class="font-medium">{{ $t("pages.auth.select_links.title") }}</p>

        <div class="flex flex-col gap-2">
          <a
            class="btn btn-sm btn-primary"
            :href="signQR.eGovMobileLaunchLink"
            >{{ $t("pages.auth.select_links.item_1") }}</a
          >
          <a
            class="btn btn-sm btn-primary"
            :href="signQR.eGovBusinessLaunchLink"
            >{{ $t("pages.auth.select_links.item_2") }}</a
          >
        </div>
      </div>
    </div>
    <div v-else>
      <button
        class="card p-4 flex flex-col justify-center items-center w-full"
        @click="props.signWithNCALayer"
      >
        <img width="90px" src="/img/auth/ncalayer-banner.png" />
        <span class="font-medium">{{
          $t("pages." + props.mode + ".sign.sign_with_ncalayer")
        }}</span>
        <span class="text-xs"
          >({{ $t("pages.auth.sign.sign_with_ncalayer_description") }})</span
        >
      </button>

      <div class="flex justify-center items-center relative my-6">
        <span class="bg-inactive z-10 px-2">{{ $t("or") }}</span>
        <hr class="absolute w-full" />
      </div>

      <button
        class="card p-4 flex flex-col justify-center items-center w-full"
        @click="props.getQR"
      >
        <img width="60px" src="/img/auth/qrcode.svg" />
        <span class="font-medium">{{
          $t("pages." + props.mode + ".sign.sign_with_qr_code")
        }}</span>
        <span class="text-xs"
          >({{ $t("pages.auth.sign.sign_with_qr_code_description") }})</span
        >
      </button>
    </div>
  </template>
</template>

<script setup>
const { localeProperties } = useI18n();

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
  signError: {
    required: true,
  },
  signQR: {
    required: true,
  },
  signWithNCALayer: {
    type: Function,
    required: true,
  },
  getQR: {
    type: Function,
    required: true,
  },
  clearQR: {
    type: Function,
    required: true,
  },
  reloadPage: {
    type: Function,
    required: true,
  },
});

const { signError, signQR } = toRefs(props);
</script>
