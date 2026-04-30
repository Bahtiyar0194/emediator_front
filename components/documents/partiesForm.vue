<template>
  <div class="custom-grid">
    <div
      class="col-span-12"
      v-for="(party, partyIndex) in docData.agreement_parties"
      :key="partyIndex"
    >
      <partyForm
        :partyIndex="partyIndex"
        :errors="errors"
        :locations="locations"
        :legalForms="legalForms"
        :posts="posts"
        :subjectTypes="subjectTypes"
        :docData="docData"
        :getUserById="getUserById"
      />
    </div>
  </div>
</template>

<script setup>
import partyForm from "./partyForm.vue";

const props = defineProps({
  errors: {
    type: Object,
    required: true,
  },

  locations: {
    type: Object,
    required: true,
  },

  legalForms: {
    type: Object,
    required: true,
  },

  posts: {
    type: Object,
    required: true,
  },

  subjectTypes: {
    type: Object,
    required: true,
  },

  docData: {
    type: Object,
    required: true,
  },

  getUserById: {
    type: Function,
    required: true,
  },
});

const { errors, locations, legalForms, posts, subjectTypes, docData } =
  toRefs(props);
</script>
