<template>
  <stepName
    :num="2"
    :title="$t('pages.documents.attributes.basis_for_issuing_loan.title')"
  />

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-money-bill"></i>
      <input v-model="amountOfDebt" v-digits-only placeholder=" " />
      <label :class="{ 'label-error': getError('amount_of_debt') }">
        {{
          getError("amount_of_debt") ||
          $t("pages.documents.attributes.amount_of_debt.title")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border select active label-active">
      <i class="pi pi-file"></i>
      <select v-model="docData.agreement_data.basis_for_issuing_loan">
        <option disabled :value="null">
          {{ $t("pages.documents.attributes.basis_for_issuing_loan.select") }}
        </option>
        <option v-for="option in basis" :key="option" :value="option">
          {{
            $t(
              `${
                "pages.documents.attributes.basis_for_issuing_loan.basis." +
                option +
                ".title"
              }`,
            )
          }}
        </option>
      </select>
      <label :class="{ 'label-error': getError('basis_for_issuing_loan') }">
        {{
          getError("basis_for_issuing_loan") ||
          $t("pages.documents.attributes.basis_for_issuing_loan.title")
        }}
      </label>
    </div>
  </div>

  <div
    v-if="docData.agreement_data.basis_for_issuing_loan === 'receipt'"
    class="col-span-12"
  >
    <div class="form-group-border active">
      <i class="pi pi-calendar"></i>
      <input
        v-model="docData.agreement_data.receipt_date"
        type="date"
        placeholder=" "
      />
      <label :class="{ 'label-error': getError('receipt_date') }">
        {{
          getError("receipt_date") ||
          $t(
            "pages.documents.attributes.basis_for_issuing_loan.basis.receipt.date",
          )
        }}
      </label>
    </div>
  </div>

  <div
    v-else-if="docData.agreement_data.basis_for_issuing_loan === 'contract'"
    class="col-span-12"
  >
    <div class="custom-grid">
      <div class="col-span-12 lg:col-span-6">
        <div class="form-group-border active">
          <i class="pi pi-hashtag"></i>
          <input
            v-model="docData.agreement_data.contract_num"
            type="number"
            placeholder=" "
          />
          <label :class="{ 'label-error': getError('contract_num') }">
            {{
              getError("contract_num") ||
              $t(
                "pages.documents.attributes.basis_for_issuing_loan.basis.contract.number",
              )
            }}
          </label>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-6">
        <div class="form-group-border active">
          <i class="pi pi-calendar"></i>
          <input
            v-model="docData.agreement_data.contract_date"
            type="date"
            placeholder=" "
          />
          <label :class="{ 'label-error': getError('contract_date') }">
            {{
              getError("contract_date") ||
              $t(
                "pages.documents.attributes.basis_for_issuing_loan.basis.contract.date",
              )
            }}
          </label>
        </div>
      </div>
    </div>
  </div>

  <div v-if="docData.agreement_data.basis_for_issuing_loan" class="col-span-12">
    <div class="custom-grid">
      <stepName
        :num="3"
        :title="$t('pages.documents.attributes.loan.repayment_terms')"
      />

      <div class="col-span-12 lg:col-span-6">
        <div class="form-group-border active">
          <i class="pi pi-calendar"></i>
          <input
            v-model="docData.agreement_data.repayment_start_date"
            type="date"
            placeholder=" "
          />
          <label :class="{ 'label-error': getError('repayment_start_date') }">
            {{
              getError("repayment_start_date") ||
              $t("pages.documents.attributes.loan.repayment_start_date")
            }}
          </label>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-6">
        <div class="form-group-border active">
          <i class="pi pi-calendar-clock"></i>
          <input
            v-model="docData.agreement_data.repayment_period"
            type="number"
            placeholder=" "
          />
          <label :class="{ 'label-error': getError('repayment_period') }">
            {{
              getError("repayment_period") ||
              $t("pages.documents.attributes.loan.repayment_period")
            }}
          </label>
        </div>
      </div>

      <stepName
        :num="4"
        :title="$t('pages.documents.attributes.loan.lender.details.title')"
      />

      <div class="col-span-12 lg:col-span-4">
        <div class="form-group-border active">
          <i class="pi pi-building-columns"></i>
          <input
            v-model="docData.agreement_data.bank_name"
            type="text"
            placeholder=" "
          />
          <label
            :class="{
              'label-error': errors.bank_name,
            }"
          >
            {{
              errors.bank_name
                ? errors.bank_name[0]
                : $t("pages.documents.attributes.loan.lender.details.bank_name")
            }}
          </label>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4">
        <div class="form-group-border active">
          <i class="pi pi-credit-card"></i>
          <input
            v-model="docData.agreement_data.iik"
            type="text"
            placeholder=" "
          />
          <label
            :class="{
              'label-error': errors.iik,
            }"
          >
            {{
              errors.iik
                ? errors.iik[0]
                : $t("pages.documents.attributes.loan.lender.details.iik")
            }}
          </label>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-4">
        <div class="form-group-border active">
          <i class="pi pi-credit-card"></i>
          <input
            v-model="docData.agreement_data.bik"
            type="text"
            placeholder=" "
          />
          <label
            :class="{
              'label-error': errors.bik,
            }"
          >
            {{
              errors.bik
                ? errors.bik[0]
                : $t("pages.documents.attributes.loan.lender.details.bik")
            }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import stepName from "../../ui/stepName.vue";

const props = defineProps({
  errors: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  docData: {
    type: Object,
    required: true,
  },
});

const { errors, mode, docData } = toRefs(props);

const { getError } = useAgreementFormErrors(errors, "agreement_data");

const fields = {
  amount_of_debt: null,
  basis_for_issuing_loan: null,
  receipt_date: null,
  contract_num: null,
  contract_date: null,
  repayment_start_date: null,
  repayment_period: null,
  bank_name: null,
  iik: null,
  bik: null,
};

const basis = ["receipt", "contract"];

const amountOfDebt = useNumberMask(
  docData.value.agreement_data,
  "amount_of_debt",
);

onMounted(() => {
  if (mode.value === "create") {
    Object.entries(fields).forEach(([key, value]) => {
      docData.value.agreement_data[key] = value;
    });
  }
});

onBeforeUnmount(() => {
  docData.value.agreement_data = {};
});
</script>
