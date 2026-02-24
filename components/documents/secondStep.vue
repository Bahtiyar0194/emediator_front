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
            v-model="docData.is_legal_2"
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
              v-model="docData.last_name_2"
              type="text"
              placeholder=" "
            />
            <label :class="{ 'label-error': errors.last_name_2 }">
              {{
                errors.last_name_2
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
              v-model="docData.first_name_2"
              type="text"
              placeholder=" "
            />
            <label :class="{ 'label-error': errors.first_name_2 }">
              {{
                errors.first_name_2
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
              v-model="docData.given_name_2"
              type="text"
              placeholder=" "
            />
            <label>
              {{ $t("form.given_name.title") }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-user"></i>
            <input
              v-model="docData.iin_2"
              v-mask="'############'"
              placeholder=" "
            />
            <label :class="{ 'label-error': errors.iin_2 }">
              {{
                errors.iin_2 ? $t("form.iin.required") : $t("form.iin.title")
              }}
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
                  errors.location_id_2 &&
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
                <input v-model="docData.street_2" placeholder=" " />
                <label :class="{ 'label-error': errors.street_2 }">
                  {{
                    errors.street_2
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
                  v-model="docData.house_2"
                  type="number"
                  placeholder=" "
                />
                <label :class="{ 'label-error': errors.house_2 }">
                  {{
                    errors.house_2
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
                  v-model="docData.flat_2"
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

    <div v-if="docData.is_legal_2 === true" class="col-span-12">
      <div class="custom-grid">
        <stepName :num="3" :title="$t('legal_entity_data')" />

        <div v-if="legalForms.length > 0" class="col-span-12 lg:col-span-3">
          <div class="form-group-border select active label-active">
            <i class="pi pi-id-card"></i>
            <select v-model.number="docData.legal_form_id_2">
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
                'label-error': errors.legal_form_id_2,
              }"
            >
              {{
                errors.legal_form_id_2
                  ? $t("form.select_legal_form")
                  : $t("form.legal_form")
              }}
            </label>
          </div>
        </div>

        <div v-if="posts.length > 0" class="col-span-12 lg:col-span-3">
          <div class="form-group-border select active label-active">
            <i class="pi pi-id-card"></i>
            <select v-model.number="docData.post_type_id_2">
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
                'label-error': errors.post_type_id_2,
              }"
            >
              {{
                errors.post_type_id_2 ? $t("form.select_post") : $t("form.post")
              }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-id-card"></i>
            <input
              v-model="docData.bin_2"
              v-mask="'############'"
              placeholder=" "
            />
            <label :class="{ 'label-error': errors.bin_2 }">
              {{
                errors.bin_2 ? $t("form.bin.required") : $t("form.bin.title")
              }}
            </label>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div class="form-group-border active">
            <i class="pi pi-file"></i>
            <input
              v-model="docData.company_name_2"
              type="text"
              placeholder=" "
            />
            <label :class="{ 'label-error': errors.company_name_2 }">
              {{
                errors.company_name_2
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
                  errors.company_location_id_2 &&
                  index === companyLocationSelections.length - 1,
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
                <input v-model="docData.company_street_2" placeholder=" " />
                <label :class="{ 'label-error': errors.company_street_2 }">
                  {{
                    errors.company_street_2
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
                  v-model="docData.company_building_2"
                  type="number"
                  placeholder=" "
                />
                <label :class="{ 'label-error': errors.company_building_2 }">
                  {{
                    errors.company_building_2
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
                  v-model="docData.company_cabinet_2"
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

  docData: {
    type: Object,
    required: true,
  },
});

const { errors, locations, legalForms, posts, subjectTypes, docData } =
  toRefs(props);

const {
  selections: locationSelections,
  init: initLocation,
  onSelect: onSelectLocation,
} = useLocationSelect({
  treeRef: locations,
  modelRef: docData,
  modelKey: "location_id_2",
});

const {
  selections: companyLocationSelections,
  init: initCompanyLocation,
  onSelect: onSelectCompanyLocation,
} = useLocationSelect({
  treeRef: locations,
  modelRef: docData,
  modelKey: "company_location_id_2",
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
