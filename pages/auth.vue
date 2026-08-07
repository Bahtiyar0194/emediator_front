<template>
  <loader v-if="pending" className="overlay" />
  <div class="card-header">
    <div class="title-wrap items-center">
      <h3>{{ $t("pages.auth.title") }}</h3>
      <selectLocale />
    </div>
  </div>
  <div class="card-body">
    <signButtons
      :mode="'auth'"
      :signError="signError"
      :signQR="authQR"
      :signWithNCALayer="signWithNCALayer"
      :getQR="getQR"
      :clearQR="clearQR"
      :reloadPage="reloadPage"
    />
  </div>
</template>

<script setup>
import { NCALayerClient } from "ncalayer-js-client";
import loader from "../components/ui/loader.vue";
import selectLocale from "../components/ui/selectLocale.vue";
import signButtons from "../components/sign/signButtons.vue";
import { useRoute } from "nuxt/app";
import { onMounted } from "vue";

const route = useRoute();

const { t, localeProperties } = useI18n();
const { $axiosPlugin } = useNuxtApp();
const { login } = useSanctumAuth();

const authQR = ref(null);
const nonce = ref(null);
const pending = ref(true);
const signError = ref(null);
const ncaLayer = ref(new NCALayerClient());

useHead({
  title: t("pages.auth.title"),
  meta: [{ name: "description", content: t("site.description") }],
});

definePageMeta({
  layout: "auth",
  middleware: ["sanctum:guest"],
});

const getNonce = async () => {
  pending.value = true;

  await $axiosPlugin
    .post("/auth/get_token")
    .then((res) => {
      if (res.data.message) {
        signError.value = {
          message: t("errors.signature_was_not_accept"),
          description: res.data.message,
          status: res.status,
        };
        return;
      }
      nonce.value = res.data.nonce;
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message || err?.message,
        status: null,
      };
    })
    .finally(() => {
      pending.value = false;
    });
};

const auth = async (nonce, signature) => {
  try {
    await login({
      lang: localeProperties.value.code,
      sigex: {
        nonce: nonce,
        signature: signature,
        external: true,
      },
    }).then(() => {
      const sanctumToken = useCookie("sanctum.token.cookie");

      if (sanctumToken.value) {
        $axiosPlugin.defaults.headers.common["Authorization"] =
          "Bearer " + sanctumToken.value;
      }
    });
  } catch (err) {
    if (err.response.status) {
      signError.value = {
        message: t("errors.server_error"),
        description: err.response.data.message,
        status: err.response.status,
      };
      pending.value = false;
    }
  }
};

const signWithNCALayer = async () => {
  pending.value = true;
  try {
    await ncaLayer.value.connect();
  } catch (err) {
    signError.value = {
      message: t("errors.failed_to_connect_ncalayer"),
      description: err.toString(),
      status: null,
    };
    pending.value = false;
    return;
  }

  let base64EncodedSignature;
  try {
    base64EncodedSignature = await ncaLayer.value.basicsSignCMS(
      NCALayerClient.basicsStorageAll,
      nonce.value, // здесь поддерживаются String | ArrayBuffer | Blob | File, строки интерпретируются как Base64
      NCALayerClient.basicsCMSParamsDetached,
      NCALayerClient.basicsSignerAuthAny, // здесь используется ключ авторизации
    );
  } catch (err) {
    if (err.canceledByUser) {
      signError.value = {
        message: t("errors.canceled_by_user"),
        description: err.toString(),
        status: null,
      };
    } else {
      signError.value = {
        message: "Error",
        description: err.toString(),
        status: null,
      };
    }
    pending.value = false;
  }

  auth(nonce.value, base64EncodedSignature[0] || base64EncodedSignature);
};

const getQR = async () => {
  pending.value = true;
  await $axiosPlugin
    .post("/auth/get_qr", {
      data: nonce.value,
    })
    .then((res) => {
      if (res.data.message) {
        signError.value = {
          message: t("errors.server_error"),
          description: res.data.message,
          status: res.status,
        };
        return;
      }

      sendQR(res.data.dataURL);

      authQR.value = res.data;
      pending.value = false;
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message,
        code: err?.response.data.code,
        status: err?.response.status,
      };
      pending.value = false;
      return;
    });
};

const sendQR = async (dataURL) => {
  await $axiosPlugin
    .post("/auth/send_qr", {
      url: dataURL,
      data: nonce.value,
      title: {
        nameEn: "Authentication on portal Emediator.kz",
        nameRu: "Вход в личный кабинет на портале Emediator.kz",
        nameKz: "Emediator.kz порталындағы жеке кабинетке өту",
      },
    })
    .then((res) => {
      if (res.data.url) {
        signQR(res.data.url);
      }
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message,
        code: err?.response.data.code,
        status: err?.response.status,
      };
      pending.value = false;
      return;
    });
};

const signQR = async (signURL) => {
  pending.value = true;

  await $axiosPlugin
    .post("/auth/sign_qr", {
      url: signURL,
      data: nonce.value,
      lang: localeProperties.value.code,
    })
    .then((res) => {
      if (res.data.message) {
        signError.value = {
          message: t("errors.server_error"),
          description: res.data.message,
          status: res.status,
        };
        return;
      }

      if (res.data.token) {
        const sanctumToken = useCookie("sanctum.token.cookie");

        sanctumToken.value = res.data.token;

        if (sanctumToken.value) {
          $axiosPlugin.defaults.headers.common["Authorization"] =
            "Bearer " + sanctumToken.value;

          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 300);
        }
      }
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message,
        code: err?.response.data.code,
        status: err?.response.status,
      };
      pending.value = false;
      return;
    });
};

const clearQR = () => {
  authQR.value = null;
  getNonce();
};

const reloadPage = () => {
  window.location.href = "/auth";
};

const authByToken = async (token) => {
  pending.value = true;

  await $axiosPlugin
    .post("/auth/by_token", {
      token: token,
      lang: localeProperties.value.code,
    })
    .then((res) => {
      if (res.data.message) {
        signError.value = {
          message: t("errors.server_error"),
          description: res.data.message,
          status: res.status,
        };
        return;
      }

      if (res.data.token) {
        const sanctumToken = useCookie("sanctum.token.cookie");

        sanctumToken.value = res.data.token;

        if (sanctumToken.value) {
          $axiosPlugin.defaults.headers.common["Authorization"] =
            "Bearer " + sanctumToken.value;

          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 300);
        }
      }
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message,
        code: err?.response.data.code,
        status: err?.response.status,
      };
      pending.value = false;
      return;
    });
};

onMounted(() => {
  if (route.query.t) {
    authByToken(route.query.t);
  } else {
    getNonce();
  }
});
</script>
