<template>
  <div class="custom-grid">
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
                :partyTypeName="
                  party.is_mediator === 1
                    ? $t('pages.documents.mediator')
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
              class="btn btn-outline-success"
              @click="props.openSignModal(props.type)"
            >
              <i class="pi pi-check"></i>
              {{ $t("pages.documents.sign." + props.type) }}
            </button>

            <button
              class="btn btn-outline-success"
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
                    '/agreement/get_file/' +
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
    <div class="col-span-12 lg:col-span-8">
      <iframe
        :src="
          config.public.apiBase +
          '/agreement/get_file/' +
          props.type +
          '/signed/' +
          props.document.uuid
        "
        width="100%"
        height="500px"
      />
    </div>
  </div>
</template>

<script setup>
import userSignCard from "../userSignCard.vue";

const config = useRuntimeConfig();
const authUser = useSanctumUser();

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
</script>
