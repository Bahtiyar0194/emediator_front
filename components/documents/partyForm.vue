<template>
  <div class="custom-grid">
    <stepName :num="1" :title="$t('subject_type')" />

    <div class="col-span-12">
      <div class="btn-wrap">
        <label
          v-for="(type, typeIndex) in subjectTypes"
          :key="typeIndex"
          class="custom-radio-button"
        >
          <input
            type="radio"
            v-model="docData.agreement_parties[props.partyIndex].data.is_legal"
            :value="type.legal"
          />
          <span><i class="pi pi-check"></i> {{ $t(type.title) }}</span>
        </label>
      </div>
    </div>

    <stepName :num="2" :title="$t('personal_data')" />

    <div class="col-span-12">
      <div class="custom-grid">
        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-user"></i>
            <input
              v-model="docData.agreement_parties[props.partyIndex].iin"
              v-mask="'############'"
              @change="props.getUserById(props.partyIndex, $event.target.value)"
              placeholder=" "
            />
            <label
              :class="{
                'label-error': errors[`agreement_parties.${props.partyIndex}.iin`],
              }"
            >
              {{
                errors[`agreement_parties.${props.partyIndex}.iin`]
                  ? $t("form.iin.required")
                  : $t("form.iin.title")
              }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-user"></i>
            <input
              v-model="docData.agreement_parties[props.partyIndex].last_name"
              type="text"
              placeholder=" "
            />
            <label
              :class="{
                'label-error': errors[`agreement_parties.${props.partyIndex}.last_name`],
              }"
            >
              {{
                errors[`agreement_parties.${props.partyIndex}.last_name`]
                  ? $t("form.last_name.required")
                  : $t("form.last_name.title")
              }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-user"></i>
            <input
              v-model="docData.agreement_parties[props.partyIndex].first_name"
              type="text"
              placeholder=" "
            />
            <label
              :class="{
                'label-error': errors[`agreement_parties.${props.partyIndex}.first_name`],
              }"
            >
              {{
                errors[`agreement_parties.${props.partyIndex}.first_name`]
                  ? $t("form.name.required")
                  : $t("form.name.title")
              }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-user"></i>
            <input
              v-model="docData.agreement_parties[props.partyIndex].given_name"
              type="text"
              placeholder=" "
            />
            <label>
              {{ $t("form.given_name.title") }}
            </label>
          </div>
        </div>

        <div
          v-for="(level, index) in locationSelections"
          :key="index"
          class="col-span-12"
          :class="'lg:col-span-' + 12 / locationSelections.length"
        >
          <div class="form-group-border select active label-active">
            <i class="pi pi-map-marker"></i>

            <select
              v-model="level.selectedId"
              @change="onSelectLocation(index)"
            >
              <option disabled value="">
                {{ $t("form.select_a_point") }}
              </option>

              <option
                v-for="option in level.options"
                :key="option.location_id"
                :value="option.location_id"
              >
                {{ option.location_name }}
              </option>
            </select>

            <label
              :class="{
                'label-error':
                  errors[`agreement_parties.${props.partyIndex}.data.location_id`] &&
                  index === locationSelections.length - 1,
              }"
            >
              {{ $t("form.select_a_point") }}
            </label>
          </div>
        </div>

        <div class="col-span-12">
          <div class="custom-grid">
            <div class="col-span-12 lg:col-span-4">
              <div class="form-group-border active">
                <i class="bi bi-signpost-split"></i>
                <input
                  v-model="docData.agreement_parties[props.partyIndex].data.street"
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error':
                      errors[`agreement_parties.${props.partyIndex}.data.street`],
                  }"
                >
                  {{
                    errors[`agreement_parties.${props.partyIndex}.data.street`]
                      ? $t("form.street.required")
                      : $t("form.street.title")
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-4">
              <div class="form-group-border active">
                <i class="pi pi-home"></i>
                <input
                  v-model="docData.agreement_parties[props.partyIndex].data.house"
                  type="number"
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error':
                      errors[`agreement_parties.${props.partyIndex}.data.house`],
                  }"
                >
                  {{
                    errors[`agreement_parties.${props.partyIndex}.data.house`]
                      ? $t("form.house.required")
                      : $t("form.house.title")
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-4">
              <div class="form-group-border active">
                <i class="bi bi-door-open"></i>
                <input
                  v-model="docData.agreement_parties[props.partyIndex].data.flat"
                  type="number"
                  placeholder=" "
                />
                <label>
                  {{ $t("form.flat") }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="docData.agreement_parties[props.partyIndex].data.is_legal === true"
      class="col-span-12"
    >
      <div class="custom-grid">
        <stepName :num="3" :title="$t('legal_entity_data')" />

        <div v-if="legalForms.length > 0" class="col-span-12 lg:col-span-3">
          <div class="form-group-border select active label-active">
            <i class="pi pi-id-card"></i>
            <select
              v-model.number="
                docData.agreement_parties[props.partyIndex].data.legal_form_id
              "
            >
              <option disabled :value="null">
                {{ $t("form.select_legal_form") }}
              </option>
              <option
                v-for="option in legalForms"
                :key="option.legal_form_id"
                :value="option.legal_form_id"
              >
                {{ option.legal_form_name }}
              </option>
            </select>
            <label
              :class="{
                'label-error':
                  errors[`agreement_parties.${props.partyIndex}.data.legal_form_id`],
              }"
            >
              {{
                errors[`agreement_parties.${props.partyIndex}.data.legal_form_id`]
                  ? $t("form.select_legal_form")
                  : $t("form.legal_form")
              }}
            </label>
          </div>
        </div>

        <div v-if="posts.length > 0" class="col-span-12 lg:col-span-3">
          <div class="form-group-border select active label-active">
            <i class="pi pi-id-card"></i>
            <select
              v-model.number="
                docData.agreement_parties[props.partyIndex].data.post_type_id
              "
            >
              <option disabled :value="null">
                {{ $t("form.select_post") }}
              </option>
              <option
                v-for="option in posts"
                :key="option.post_type_id"
                :value="option.post_type_id"
              >
                {{ option.post_type_name }}
              </option>
            </select>
            <label
              :class="{
                'label-error':
                  errors[`agreement_parties.${props.partyIndex}.data.post_type_id`],
              }"
            >
              {{
                errors[`agreement_parties.${props.partyIndex}.data.post_type_id`]
                  ? $t("form.select_post")
                  : $t("form.post")
              }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-id-card"></i>
            <input
              v-model="docData.agreement_parties[props.partyIndex].data.bin"
              v-mask="'############'"
              placeholder=" "
            />
            <label
              :class="{
                'label-error': errors[`agreement_parties.${props.partyIndex}.data.bin`],
              }"
            >
              {{
                errors[`agreement_parties.${props.partyIndex}.data.bin`]
                  ? $t("form.bin.required")
                  : $t("form.bin.title")
              }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-file"></i>
            <input
              v-model="docData.agreement_parties[props.partyIndex].data.company_name"
              type="text"
              placeholder=" "
            />
            <label
              :class="{
                'label-error':
                  errors[`agreement_parties.${props.partyIndex}.data.company_name`],
              }"
            >
              {{
                errors[`agreement_parties.${props.partyIndex}.data.company_name`]
                  ? $t("form.company_name.required")
                  : $t("form.company_name.title")
              }}
            </label>
          </div>
        </div>

        <div
          v-for="(level, index) in companyLocationSelections"
          :key="index"
          class="col-span-12"
          :class="'lg:col-span-' + 12 / companyLocationSelections.length"
        >
          <div class="form-group-border select active label-active">
            <i class="pi pi-map-marker"></i>
            <select
              v-model="level.selectedId"
              @change="onSelectCompanyLocation(index)"
            >
              <option disabled value="">
                {{ $t("form.select_a_point") }}
              </option>
              <option
                v-for="option in level.options"
                :key="option.location_id"
                :value="option.location_id"
              >
                {{ option.location_name }}
              </option>
            </select>
            <label
              :class="{
                'label-error':
                  errors[
                    `agreement_parties.${props.partyIndex}.data.company_location_id`
                  ] && index === companyLocationSelections.length - 1,
              }"
            >
              {{ $t("form.select_a_point") }}
            </label>
          </div>
        </div>

        <div class="col-span-12">
          <div class="custom-grid">
            <div class="col-span-12 lg:col-span-4">
              <div class="form-group-border active">
                <i class="bi bi-signpost-split"></i>
                <input
                  v-model="
                    docData.agreement_parties[props.partyIndex].data.company_street
                  "
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error':
                      errors[`agreement_parties.${props.partyIndex}.data.company_street`],
                  }"
                >
                  {{
                    errors[`agreement_parties.${props.partyIndex}.data.company_street`]
                      ? $t("form.street.required")
                      : $t("form.street.title")
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-4">
              <div class="form-group-border active">
                <i class="pi pi-building"></i>
                <input
                  v-model="
                    docData.agreement_parties[props.partyIndex].data.company_building
                  "
                  type="number"
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error':
                      errors[
                        `agreement_parties.${props.partyIndex}.data.company_building`
                      ],
                  }"
                >
                  {{
                    errors[`agreement_parties.${props.partyIndex}.data.company_building`]
                      ? $t("form.building.required")
                      : $t("form.building.title")
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-4">
              <div class="form-group-border active">
                <i class="bi bi-door-open"></i>
                <input
                  v-model="
                    docData.agreement_parties[props.partyIndex].data.company_cabinet
                  "
                  type="number"
                  placeholder=" "
                />
                <label>
                  {{ $t("form.cabinet") }}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useLocationSelect } from "../../composables/useLocationSelect";
import stepName from "../ui/stepName.vue";

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

  partyIndex: {
    type: Number,
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

const locationModel = computed({
  get: () => docData.value.agreement_parties[props.partyIndex].data.location_id,
  set: (val) => {
    docData.value.agreement_parties[props.partyIndex].data.location_id = val;
  },
});

const companyLocationModel = computed({
  get: () => docData.value.agreement_parties[props.partyIndex].data.company_location_id,
  set: (val) => {
    docData.value.agreement_parties[props.partyIndex].data.company_location_id = val;
  },
});

const {
  selections: locationSelections,
  init: initLocation,
  onSelect: onSelectLocation,
} = useLocationSelect({
  treeRef: locations,
  modelRef: locationModel,
});

const {
  selections: companyLocationSelections,
  init: initCompanyLocation,
  onSelect: onSelectCompanyLocation,
} = useLocationSelect({
  treeRef: locations,
  modelRef: companyLocationModel,
});

watch(
  () => locations.value,
  () => {
    initLocation();
    initCompanyLocation();
  },
  { immediate: true },
);
</script>
