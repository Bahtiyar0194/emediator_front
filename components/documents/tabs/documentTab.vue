<template>
  <div v-if="pdfUrl" class="custom-grid">
    <div class="col-span-12 lg:col-span-8">
      <object
        :data="pdfUrl"
        type="application/pdf"
        width="100%"
        height="500px"
      ></object>
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
              <userSignCard
                :partyName="`${party.last_name} ${party.first_name} ${party.given_name || ''}`"
                :iin="party.iin"
                :partyTypeName="
                  party.is_mediator === 1
                    ? $t('pages.documents.mediator.title')
                    : $t('pages.documents.party_' + (partyIndex + 1))
                "
                :signId="party.sigex_sign_id"
                :signedAt="party.signed_at"
              />
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import userSignCard from "../userSignCard.vue";

const { $axiosPlugin } = useNuxtApp();
const config = useRuntimeConfig();
const authUser = useSanctumUser();
const pdfUrl = ref(null);

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

const getPdfFile = async () => {
  const response = await $axiosPlugin.get(
    config.public.apiBase +
      "/document/get_file/" +
      props.type +
      "/signed/" +
      props.document.uuid,
    {
      responseType: "blob",
    },
  );

  pdfUrl.value = URL.createObjectURL(response.data);
};

onMounted(() => {
  getPdfFile();
});

onBeforeUnmount(() => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value);
    pdfUrl.value = null;
  }
});
</script>
