<template>
  <stepName :num="2" :title="$t('pages.documents.attributes.car_data.title')" />

  <div class="col-span-12 lg:col-span-4">
    <div class="form-group-border active">
      <i class="pi pi-car"></i>
      <input name="car_brand" type="text" placeholder=" " />
      <label
        :class="{
          'label-error': errors.car_brand,
        }"
      >
        {{
          errors.car_brand
            ? errors.car_brand[0]
            : $t("pages.documents.attributes.car_data.brand")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-4">
    <div class="form-group-border active">
      <i class="pi pi-car"></i>
      <input name="car_model" type="text" placeholder=" " />
      <label
        :class="{
          'label-error': errors.car_model,
        }"
      >
        {{
          errors.car_model
            ? errors.car_model[0]
            : $t("pages.documents.attributes.car_data.model")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-4">
    <div class="form-group-border active">
      <i class="pi pi-hashtag"></i>
      <input
        name="state_registration_number"
        type="text"
        v-mask="'### AAA ##'"
        placeholder=" "
      />
      <label
        :class="{
          'label-error': errors.state_registration_number,
        }"
      >
        {{
          errors.state_registration_number
            ? errors.state_registration_number[0]
            : $t(
                "pages.documents.attributes.car_data.state_registration_number",
              )
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-barcode"></i>
      <input
        name="vin_code"
        type="text"
        v-mask="'XXXXXXXXXXXXXXXXX'"
        placeholder=""
      />
      <label
        :class="{
          'label-error': errors.vin_code,
        }"
      >
        {{
          errors.vin_code
            ? errors.vin_code[0]
            : $t("pages.documents.attributes.car_data.vin_code")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-calendar"></i>
      <input
        name="year_of_release"
        type="text"
        v-mask="'####'"
        placeholder=""
      />
      <label
        :class="{
          'label-error': errors.year_of_release,
        }"
      >
        {{
          errors.year_of_release
            ? errors.year_of_release[0]
            : $t("pages.documents.attributes.car_data.year_of_release")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border select active label-active">
      <i class="pi pi-file"></i>
      <select name="body_color_id">
        <option disabled selected value="">
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
      <label
        :class="{
          'label-error': errors.body_color_id,
        }"
      >
        {{
          errors.body_color_id
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
        name="car_amount"
        type="text"
        placeholder=""
      />
      <label
        :class="{
          'label-error': errors.car_amount,
        }"
      >
        {{
          errors.car_amount
            ? errors.car_amount[0]
            : $t("pages.documents.attributes.car_data.amount")
        }}
      </label>
    </div>
  </div>

  <stepName :num="3" :title="$t('pages.documents.attributes.rent.title')" />

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border select active label-active">
      <i class="pi pi-credit-card"></i>
      <select name="payment_format">
        <option disabled selected value="">
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
          'label-error': errors.payment_format,
        }"
      >
        {{
          errors.payment_format
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
        name="rent_amount"
        type="text"
        placeholder=""
      />
      <label
        :class="{
          'label-error': errors.rent_amount,
        }"
      >
        {{
          errors.rent_amount
            ? errors.rent_amount[0]
            : $t("pages.documents.attributes.rent.amount")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-calendar"></i>
      <input name="rent_start_date" type="date" placeholder=" " />
      <label
        :class="{
          'label-error': errors.rent_start_date,
        }"
      >
        {{
          errors.rent_start_date
            ? errors.rent_start_date[0]
            : $t("pages.documents.attributes.rent.start_date")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-calendar-clock"></i>
      <input name="rent_period" type="number" placeholder=" " />
      <label
        :class="{
          'label-error': errors.rent_period,
        }"
      >
        {{
          errors.rent_period
            ? errors.rent_period[0]
            : $t("pages.documents.attributes.rent.period")
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

const colors = inject("colors", ref([]));

const paymentFormats = ["daily", "monthly"];
</script>
