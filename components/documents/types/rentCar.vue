<template>
  <stepName :num="2" :title="$t('pages.documents.attributes.car_data.title')" />

  <div class="col-span-12 lg:col-span-4">
    <div class="form-group-border active">
      <i class="pi pi-car"></i>
      <input
        v-model="docData.agreement_data.car_brand"
        type="text"
        placeholder=" "
      />
      <label :class="{ 'label-error': getError('car_brand') }">
        {{
          getError("car_brand") ||
          $t("pages.documents.attributes.car_data.brand")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-4">
    <div class="form-group-border active">
      <i class="pi pi-car"></i>
      <input
        v-model="docData.agreement_data.car_model"
        type="text"
        placeholder=" "
      />
      <label :class="{ 'label-error': getError('car_model') }">
        {{
          getError("car_model") ||
          $t("pages.documents.attributes.car_data.model")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-4">
    <div class="form-group-border active">
      <i class="pi pi-hashtag"></i>
      <input
        v-model="docData.agreement_data.state_registration_number"
        type="text"
        placeholder=" "
      />
      <label :class="{ 'label-error': getError('state_registration_number') }">
        {{
          getError("state_registration_number") ||
          $t("pages.documents.attributes.car_data.state_registration_number")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-barcode"></i>
      <input
        v-model="docData.agreement_data.vin_code"
        type="text"
        v-mask="'XXXXXXXXXXXXXXXXX'"
        placeholder=""
      />
      <label :class="{ 'label-error': getError('vin_code') }">
        {{
          getError("vin_code") ||
          $t("pages.documents.attributes.car_data.vin_code")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-calendar"></i>
      <input
        v-model="docData.agreement_data.year_of_release"
        type="text"
        v-mask="'####'"
        placeholder=""
      />
      <label :class="{ 'label-error': getError('year_of_release') }">
        {{
          getError("year_of_release") ||
          $t("pages.documents.attributes.car_data.year_of_release")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border select active label-active">
      <i class="pi pi-file"></i>
      <select v-model="docData.agreement_data.body_color_id">
        <option disabled :value="null">
          {{ $t("pages.documents.attributes.car_data.body_color.select") }}
        </option>
        <option
          v-for="option in colors"
          :key="option.color_id"
          :value="option.color_id"
        >
          {{ option.color_name }}
        </option>
      </select>
      <label :class="{ 'label-error': getError('body_color_id') }">
        {{
          getError("body_color_id")
            ? $t("pages.documents.attributes.car_data.body_color.select")
            : $t("pages.documents.attributes.car_data.body_color.title")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-credit-card"></i>
      <input
        v-model="carAmount"
        type="text"
        placeholder=""
      />
      <label
        :class="{
          'label-error': getError('car_amount'),
        }"
      >
        {{
          getError("car_amount") ||
          $t("pages.documents.attributes.car_data.amount")
        }}
      </label>
    </div>
  </div>

  <stepName :num="3" :title="$t('pages.documents.attributes.rent.title')" />

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border select active label-active">
      <i class="pi pi-credit-card"></i>
      <select v-model="docData.agreement_data.payment_format">
        <option disabled :value="null">
          {{ $t("pages.documents.attributes.rent.payment_format.select") }}
        </option>
        <option v-for="option in paymentFormats" :key="option" :value="option">
          {{
            $t(
              "pages.documents.attributes.rent.payment_format." +
                option +
                ".title",
            )
          }}
        </option>
      </select>
      <label
        :class="{
          'label-error': getError('payment_format'),
        }"
      >
        {{
          getError("payment_format")
            ? $t("pages.documents.attributes.rent.payment_format.select")
            : $t("pages.documents.attributes.rent.payment_format.title")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-credit-card"></i>
      <input
        v-model="rentAmount"
        type="text"
        placeholder=""
      />
      <label
        :class="{
          'label-error': getError('rent_amount'),
        }"
      >
        {{
          getError("rent_amount") ||
          $t("pages.documents.attributes.rent.amount")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-calendar"></i>
      <input
        v-model="docData.agreement_data.rent_start_date"
        type="date"
        placeholder=" "
      />
      <label
        :class="{
          'label-error': getError('rent_start_date'),
        }"
      >
        {{
          getError("rent_start_date") ||
          $t("pages.documents.attributes.rent.start_date")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-calendar-clock"></i>
      <input
        v-model="docData.agreement_data.rent_period"
        type="number"
        placeholder=" "
      />
      <label
        :class="{
          'label-error': getError('rent_period'),
        }"
      >
        {{
          getError("rent_period") ||
          $t("pages.documents.attributes.rent.period")
        }}
      </label>
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
  car_brand: null,
  car_model: null,
  state_registration_number: null,
  vin_code: null,
  year_of_release: null,
  body_color_id: null,
  car_amount: null,
  payment_format: null,
  rent_amount: null,
  rent_start_date: null,
  rent_period: null,
};

const colors = inject("colors", ref([]));

const paymentFormats = ["daily", "monthly"];

const carAmount = useNumberMask(
  docData.value.agreement_data,
  "car_amount",
);

const rentAmount = useNumberMask(
  docData.value.agreement_data,
  "rent_amount",
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
