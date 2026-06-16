<template>
  <stepName
    :num="2"
    :title="$t('pages.documents.attributes.alimony_data.children.title')"
  />

  <template v-if="docData.agreement_data.children">
    <div
      v-for="(child, index) in docData.agreement_data.children"
      :key="index"
      class="col-span-12"
    >
      <div class="custom-grid">
        <div
          v-if="docData.agreement_data.children.length > 1"
          class="col-span-12"
        >
          <div class="flex flex-wrap gap-2 items-center">
            <p class="mb-0 font-medium">
              {{ $t("pages.documents.attributes.alimony_data.children.child") }}
              #{{ index + 1 }}
            </p>

            <button
              v-if="index > 0"
              type="button"
              @click="removeChild(index)"
              class="btn btn-sm btn-outline-danger"
            >
              <i class="pi pi-trash"></i>
              {{ $t("delete") }}
            </button>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-user"></i>
            <input type="text" v-model="child.last_name" placeholder=" " />
            <label
              :class="{
                'label-error':
                  errors[`agreement_data.children.${index}.${'last_name'}`],
              }"
            >
              {{
                errors[`agreement_data.children.${index}.${"last_name"}`]?.[0]
                  ? $t("form.last_name.required")
                  : $t("form.last_name.title")
              }}
            </label>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-user"></i>
            <input type="text" v-model="child.first_name" placeholder=" " />
            <label
              :class="{
                'label-error':
                  errors[`agreement_data.children.${index}.${'first_name'}`],
              }"
            >
              {{
                errors[`agreement_data.children.${index}.${"first_name"}`]?.[0]
                  ? $t("form.name.required")
                  : $t("form.name.title")
              }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-user"></i>
            <input type="text" v-model="child.given_name" placeholder=" " />
            <label
              :class="{
                'label-error':
                  errors[`agreement_data.children.${index}.${'given_name'}`],
              }"
            >
              {{
                errors[`agreement_data.children.${index}.${"given_name"}`]?.[0]
                  ? $t("form.given_name.required")
                  : $t("form.given_name.title")
              }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active w-full">
            <i class="pi pi-calendar"></i>
            <input type="date" v-model="child.birth_date" placeholder=" " />
            <label
              :class="{
                'label-error':
                  errors[`agreement_data.children.${index}.${'birth_date'}`],
              }"
            >
              {{
                errors[`agreement_data.children.${index}.${"birth_date"}`]?.[0]
                  ? $t("form.birth_date.required")
                  : $t("form.birth_date.title")
              }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-12">
      <button type="button" @click="addChild" class="btn btn-sm btn-success">
        <i class="pi pi-user-plus"></i>
        {{ $t("pages.documents.attributes.alimony_data.children.add") }}
      </button>
    </div>
  </template>

  <stepName :num="3" :title="$t('pages.documents.payment_data')" />

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-money-bill"></i>
      <input
        v-model="monthlyAmount"
        type="text"
        placeholder=" "
      />
      <label
        :class="{
          'label-error': errors['agreement_data.monthly_amount'],
        }"
      >
        {{
          errors["agreement_data.monthly_amount"]
            ? errors["agreement_data.monthly_amount"][0]
            : $t("pages.documents.monthly.amount.title")
        }}
      </label>
    </div>
  </div>

  <div class="col-span-12 lg:col-span-6">
    <div class="form-group-border active">
      <i class="pi pi-calendar"></i>
      <input
        v-model="docData.agreement_data.start_payment_date"
        type="date"
        placeholder=" "
      />
      <label :class="{ 'label-error': getError('start_payment_date') }">
        {{
          getError("start_payment_date") ||
          $t("pages.documents.start_payment_date.title")
        }}
      </label>
    </div>
  </div>
</template>

<script setup>
import stepName from "../../ui/stepName.vue";
import { onBeforeUnmount, onMounted } from "vue";

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

const monthlyAmount = useNumberMask(
  docData.value.agreement_data,
  "monthly_amount",
);

const fields = {
  monthly_amount: null,
  start_payment_date: null,
};

const createChild = () => ({
  last_name: null,
  first_name: null,
  given_name: null,
  birth_date: null,
});

const addChild = () => {
  docData.value.agreement_data.children.push(createChild());
};

const removeChild = (index) => {
  docData.value.agreement_data.children.splice(index, 1);
};

onMounted(() => {
  if (mode.value === "create") {
    Object.entries(fields).forEach(([key, value]) => {
      docData.value.agreement_data[key] = value;
    });
  }

  if (!docData.value.agreement_data.children) {
    docData.value.agreement_data.children = [];
    docData.value.agreement_data.children.push(createChild());
  }
});

onBeforeUnmount(() => {
  docData.value.agreement_data = {};
});
</script>
