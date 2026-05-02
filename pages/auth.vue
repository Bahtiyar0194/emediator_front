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

onMounted(() => {
  getNonce();
});

async function getNonce() {
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
        description: err?.response.data.message,
        status: err?.response.status,
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
}

async function signWithNCALayer() {
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
}

async function getQR() {
  pending.value = true;
  await $axiosPlugin
    .post("/auth/get_qr")
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
        status: err?.response.status,
      };
      pending.value = false;
      return;
    });
}

async function sendQR(dataURL) {
  alert(nonce.value)
  await $axiosPlugin
    .post(dataURL, {
      signMethod: "CMS_SIGN_ONLY",
      documentsToSign: [
        {
          id: 1,
          meta: [],
          nameEn: "Authentication on portal Emediator.kz",
          nameRu: "Аутентификация на портале Emediator.kz",
          nameKz: "Emediator.kz порталында аутентификация өту",
          document: {
            file: {
              data: nonce.value,
              mime: "",
            },
          },
        },
      ],
    })
    .then((r) => {
      signQR(r.data.signURL);
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message,
        status: err?.response.status,
      };
      pending.value = false;
      return;
    });
}

async function signQR(signURL) {
  pending.value = true;
  await $axiosPlugin
    .get(signURL)
    .then((r) => {
      auth(nonce.value, r.data.documentsToSign[0].document.file.data);
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message,
        status: err?.response.status,
      };
      pending.value = false;
      return;
    });
}

const clearQR = () => {
  authQR.value = null;
};

function reloadPage() {
  window.location.reload();
}
</script>
