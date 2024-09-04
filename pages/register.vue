<template>
  <div v-if="authUser">
    <p>Имя: <b>{{ authUser.subjectStructure[0][0].value }}</b></p>
    <p>ИИН: <b>{{ authUser.userId }}</b></p>
    <div v-if="signed">
      Документ <a v-bind:href="`data:application/octet-stream;base64,${base64Data}`" target="_blank"
        v-bind:download="documentTitle">{{ documentTitle }}</a> успешно подписан.

        <button @click="getDocument(sigexId)">Получить подписи</button>
    </div>
    <div v-else>
      <button @click="makePDF()">Make PDF</button>
      <button v-if="base64Data" @click="signAndSend()">Sign</button>
    </div>
  </div>
  <button v-else @click="auth()">Авторизация</button>

</template>

<script setup>
import { NCALayerClient } from "ncalayer-js-client";
const { t } = useI18n();

useHead({
  title: t('welcome'),
  meta: [{ name: "description", content: "My amazing site." }],
});

definePageMeta({
  layout: "auth",
});

const { $pdfMake } = useNuxtApp();

const document = ref(null);
const documentTitle = ref('Example document.pdf');
const documentDescription = ref('Example document description');


const authUser = ref(null);
const error = ref(null);
const connecting = ref(true);
const ncaLayerNotAvailable = ref(false);
const ncaLayer = ref(new NCALayerClient());

const sigexId = ref(null);
const sigexURL = ref("https://sigex.kz/api");

const awaitingSignature = ref(false);
const signed = ref(false);
const base64Data = ref(null);

onMounted(async () => {
  try {
    await ncaLayer.value.connect();
    connecting.value = false;
  }
  catch (err) {
    ncaLayerNotAvailable.value = true;
    alert('Не удалось подключиться к NCALayer:' + err.toString());
    return;
  }
})

async function auth() {
  await $fetch(sigexURL.value + '/auth', {
    method: "POST",
    body: {},
  })
    .then((res) => {
      if (res.message) {
        error.value = {
          message: 'Сервер не принял подпись',
          description: res.message,
        };
        return;
      }

      getAuthUserData(res.nonce);
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getAuthUserData(nonce) {
  let base64EncodedSignature;
  try {
    base64EncodedSignature = await ncaLayer.value.basicsSignCMS(
      NCALayerClient.basicsStorageAll,
      nonce, // здесь поддерживаются String | ArrayBuffer | Blob | File, строки интерпретируются как Base64
      NCALayerClient.basicsCMSParamsDetached,
      NCALayerClient.basicsSignerAuthAny // здесь используется ключ авторизации
    );
  } catch (err) {
    if (err.canceledByUser) {
      alert("Действие отменено пользователем.");
    }
    return;
  }

  await $fetch(sigexURL.value + '/auth', {
    method: "POST",
    body: {
      nonce: nonce,
      signature: base64EncodedSignature,
      external: true
    },
  })
    .then((res) => {
      authUser.value = res;
      console.log(res)
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getDocument(documentId) {
  await $fetch(sigexURL.value + '/' + documentId, {
    method: "GET"
  }).then((res) => {
    console.log(res)
  }).catch((err) => {
    console.log(err);
  });
}

async function makePDF() {
  const docDefinition = {
    watermark: {
      text: "Watermark",
      color: "red",
      opacity: 0.1,
      bold: false,
      italics: false,
      angle: 45,
    },
    content: [
      {
        text: "Document title",
        fontSize: 20,
        bold: true,
        alignment: "center",
        margin: [0, 0, 0, 20],
      },
      { text: "Document description", fontSize: 15, margin: [0, 0, 0, 20] },
    ],
    pageMargins: [20, 40, 20, 40],
  };

  base64Data.value = await new Promise((resolve) => {
    $pdfMake.createPdf(docDefinition).getBase64(resolve);
  });

  $pdfMake.createPdf(docDefinition).open();
}

async function signAndSend() {
  let base64EncodedSignature;
  try {
    base64EncodedSignature = await ncaLayer.value.basicsSignCMS(
      NCALayerClient.basicsStorageAll,
      base64Data.value, // здесь поддерживаются String | ArrayBuffer | Blob | File, строки интерпретируются как Base64
      NCALayerClient.basicsCMSParamsDetached,
      NCALayerClient.basicsSignerSignAny // здесь используется ключ для подписания
    );
  } catch (err) {
    if (err.canceledByUser) {
      alert("Действие отменено пользователем.");
    }
    return;
  }

  await $fetch(sigexURL.value, {
    method: "POST",
    body: {
      title: documentTitle.value,
      description: documentDescription.value,
      signType: "cms",
      signature: base64EncodedSignature,
      emailNotifications: {
        to: ["bahtiyar_0194@mail.ru", "bahtiyar0194@gmail.com"],
        doNotAttachDocument: false,
      },
      settings: {
        private: false,
        signaturesLimit: 2,
        switchToPrivateAfterLimitReached: false,
        unique: ["iin"],
        strictSignersRequirements: true,
        sequentialSignersRequirements: false,
        signersRequirements: [
          {
            iin: "IIN970803400548",
          },
          {
            iin: "IIN940601352065",
          },
        ],
        publicDuringPreregistration: false,
        documentAccess: [],
        forceArchive: false,
      },
    },
  })
    .then((res) => {
      if (res.message) {
        error.value = {
          message: 'Сервер не принял подпись',
          description: res.message,
        };
        return;
      }

      sigexId.value = res.documentId;
      sendSignData();
    })
    .catch((err) => {
      console.log(err);
    });
}

async function sendSignData() {
  const dataToSend = Uint8Array.from(atob(base64Data.value), c => c.charCodeAt(0)).buffer;

  await $fetch(sigexURL.value + '/' + sigexId.value + '/data',
    {
      method: "POST",
      headers: { 'Content-Type': 'application/octet-stream' },
      body: dataToSend
    })
    .then((res) => {
      if (res.message) {
        error.value = {
          message: 'Сервер не принял подпись (проблема с проверкой подписанных данных)',
          description: res.message,
        };
        return;
      }

      awaitingSignature.value = false;
      signed.value = true;

      const titleParts = documentTitle.value.split('.');
      if (titleParts.length === 1) {
        documentTitle.value = documentTitle.value + '-SigexId' + sigexId.value;
      }
      else {
        const extension = titleParts.pop();
        documentTitle.value = titleParts.join('.') + '-SigexId' + sigexId.value + '.' + extension;
      }
    })
    .catch((err) => {
      console.log(err);
    })
}
</script>