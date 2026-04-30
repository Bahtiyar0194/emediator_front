<template>
  <div class="custom-grid">
    <stepName :num="1" :title="$t('pages.documents.select_agreement_type')" />

    <div
      v-for="(level, index) in agreementTypeSelections"
      :key="index"
      class="col-span-12"
      :class="getAgreementTypeColumnClass(agreementTypeSelections.length)"
    >
      <div class="form-group-border select active label-active">
        <i class="pi pi-file"></i>
        <select
          v-model="level.selectedId"
          @change="onSelectAgreementType(index)"
        >
          <option disabled value="">
            {{ $t("form.select_an_agreement_type") }}
          </option>
          <option
            v-for="option in level.options"
            :key="option.agreement_type_id"
            :value="option.agreement_type_id"
          >
            {{ option.agreement_type_name }}
          </option>
        </select>
        <label
          :class="{
            'label-error':
              errors.agreement_type_id &&
              index === agreementTypeSelections.length - 1,
          }"
        >
          {{ $t("form.select_an_agreement_type") }}
        </label>
      </div>
    </div>

    <component :is="currentComponent" v-bind="modalProps" />
  </div>
</template>
<script setup>
import { useAgreementTypeSelect } from "../../composables/useAgreementTypeSelect";
import stepName from "../ui/stepName.vue";
const props = defineProps({
  errors: {
    type: Object,
    required: true,
  },
  agreementTypes: {
    type: Object,
    required: true,
  },
  docData: {
    type: Object,
    required: true,
  },
  mode: {
    type: Object,
    required: true
  }
});

const { errors, agreementTypes, docData, mode } = toRefs(props);

const getAgreementTypeColumnClass = (selectionCount) => {
  if (selectionCount <= 1) {
    return "lg:col-span-12";
  }

  if (selectionCount === 2) {
    return "lg:col-span-6";
  }

  if (selectionCount === 3) {
    return "lg:col-span-4";
  }

  return "lg:col-span-3";
};

const {
  selections: agreementTypeSelections,
  currentComponent,
  modalProps,
  init,
  onSelect: onSelectAgreementType,
} = useAgreementTypeSelect({
  treeRef: agreementTypes,
  modeRef: mode,
  modelRef: docData,
  errorsRef: errors,
});

watch(
  () => agreementTypes.value,
  () => {
    init();
  },
  { immediate: true },
);
</script>
