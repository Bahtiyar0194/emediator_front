<template>
  <div class="py-8" v-if="pending">
    <loader
      :className="'overlay !relative'"
      :showPendingText="true"
      :pendingText="$t('pages.documents.view.loading')"
    />
  </div>
  <div v-if="pdfData" class="custom-grid">
    <div class="col-span-12 lg:col-span-8">
      <client-only>
        <div class="border-inactive !border-2 rounded-xl overflow-hidden">
          <scrollFadeContainer :maxHeight="500" :fadeSize="80">
            <VuePdfEmbed :source="pdfData" />
          </scrollFadeContainer>
        </div>
      </client-only>
    </div>
    <div class="col-span-12 lg:col-span-4">
      <div class="custom-grid">
        <div class="col-span-12">
          <p class="text-inactive">
            {{ $t("pages.documents.parties") }}:
            <b>{{ props.document.parties.length }}</b>
          </p>
          <ul class="list-group nowrap">
            <template
              v-for="(party, partyIndex) in props.document.parties"
              :key="partyIndex"
            >
              <userSignCard :party="party" :partyIndex="partyIndex" />
            </template>
          </ul>
        </div>
        <div class="col-span-12">
          <div class="btn-wrap">
            <button
              v-if="canSign()"
              class="btn btn-success"
              @click="props.openSignModal(props.type)"
            >
              <i class="pi pi-check"></i>
              {{ $t("pages.documents.sign." + props.type) }}
            </button>

            <button
              class="btn btn-success"
              v-if="canVerify()"
              @click="props.openVerifySignModal(props.type)"
            >
              <i class="pi pi-verified"></i>
              {{ $t("pages.documents.sign.verify.title") }}
            </button>
            <!-- <button
              class="btn btn-success"
              @click="
                openFile(
                  config.public.apiBase +
                    '/document/get_file/' +
                    props.document.uuid,
                )
              "
            >
              <i class="pi pi-file-pdf"></i>

              {{ $t("pages.documents.agreement.open") }}
            </button> -->

            <button
              v-if="canEdit()"
              class="btn btn-light"
              @click="props.openModal('edit')"
            >
              <i class="pi pi-pencil"></i>
              {{ $t("edit") }}
            </button>

            <button class="btn btn-light" @click="getPdfFile('blob')">
              <i class="pi pi-file-pdf"></i>
              {{ $t("download_pdf") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import userSignCard from "../userSignCard.vue";
import scrollFadeContainer from "../../ui/scrollFadeContainer.vue";
import VuePdfEmbed from "vue-pdf-embed";
import loader from "../../ui/loader.vue";

const { $axiosPlugin } = useNuxtApp();
const config = useRuntimeConfig();
const authUser = useSanctumUser();
const pdfData = ref(null);
const pending = ref(true);

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  document: {
    type: Object,
    required: true,
  },
  openModal: {
    type: Function,
    required: true,
  },
  openSignModal: {
    type: Function,
    required: true,
  },
  openVerifySignModal: {
    type: Function,
    required: true,
  },
});

const canSign = () =>
  props.document.parties.some(
    (p) => p.iin === authUser.value.iin && !p.sigex_sign_id,
  );

const canVerify = () => {
  return !props.document.parties.find((p) => p.sigex_sign_id === null);
};

const canEdit = () => {
  return props.document.parties.some((p) => !p.sigex_sign_id);
};

const getPdfFile = async (type) => {
  try {
    if (type === "arraybuffer") {
      pending.value = true;
    }

    const response = await $axiosPlugin.get(
      config.public.apiBase +
        "/document/get_file/" +
        props.type +
        "/signed/" +
        props.document.uuid,
      {
        responseType: type,
      },
    );

    if (type === "arraybuffer") {
      if (response.data) {
        setTimeout(() => {
          pdfData.value = response.data;
          pending.value = false;
        }, 1000);
      }
    }

    if (type === "blob") {
      const blob = response.data;
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = props.document.uuid + ".pdf";
      a.click();

      // Чистим за собой
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    pending.value = false;
  }
};

onMounted(() => {
  getPdfFile("arraybuffer");
});

onBeforeUnmount(() => {
  pdfData.value = null;
});
</script>
