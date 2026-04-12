<template>
  <div class="custom-grid">
    <div class="col-span-12">
      <div class="form-group-border select active label-active">
        <i class="pi pi-id-card"></i>
        <select v-model.number="docData.mediator_id">
          <option disabled :value="null">
            {{ $t("pages.documents.select_mediator_alt") }}
          </option>
          <option
            v-for="option in mediators"
            :key="option.user_id"
            :value="option.user_id"
          >
            {{ option.last_name }} {{ option.first_name }}
            {{ option.given_name }} ({{ option.association_name_full }})
          </option>
        </select>
        <label
          :class="{
            'label-error': errors['mediator_id'],
          }"
        >
          {{
            errors["mediator_id"]
              ? $t("pages.documents.select_mediator_alt")
              : $t("pages.documents.mediator")
          }}
        </label>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6">
      <div class="form-group-border active">
        <i class="pi pi-money-bill"></i>
        <input v-model="prePayment" v-digits-only placeholder=" " />
        <label :class="{ 'label-error': getError('prepayment') }">
          {{ getError("prepayment") || $t("pages.documents.contract.prepayment") }}
        </label>
      </div>
    </div>

    <div class="col-span-12 lg:col-span-6">
      <div class="form-group-border active">
        <i class="pi pi-money-bill"></i>
        <input v-model="award" v-digits-only placeholder=" " />
        <label :class="{ 'label-error': getError('award') }">
          {{ getError("award") || $t("pages.documents.contract.award") }}
        </label>
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  errors: {
    type: Object,
    required: true,
  },
  mediators: {
    type: Object,
    required: true,
  },
  docData: {
    type: Object,
    required: true,
  },
  mode: {
    type: Object,
    required: true,
  },
});

const { errors, mediators, docData, mode } = toRefs(props);

const { getError } = useAgreementFormErrors(errors, "contract_data");

const prePayment = useNumberMask(docData.value.contract_data, "prepayment");
const award = useNumberMask(docData.value.contract_data, "award");
</script>
