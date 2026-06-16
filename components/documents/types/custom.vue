<template>
  <div class="col-span-12">
    <div
      v-if="myTemplates.length"
      class="form-group-border select active label-active"
    >
      <i class="pi pi-file"></i>
      <select v-model="docData.custom_template.id" @change="selectTemplate()">
        <option disabled selected :value="null">
          {{ $t("pages.documents.agreement.custom_template.select") }}
        </option>

        <option
          v-for="option in myTemplates"
          :key="option.template_id"
          :value="option.template_id"
        >
          {{ option.template_name }}
        </option>
      </select>
      <label
        :class="{
          'label-error': errors['custom_template.id'],
        }"
      >
        {{
          errors["custom_template.id"]?.[0]
            ? $t("pages.documents.agreement.custom_template.select")
            : $t("template")
        }}
      </label>
    </div>

    <div
      v-else-if="
        myTemplates.length === 0 && docData.custom_template.new === false
      "
      class="card p-6"
    >
      <div class="flex flex-col items-center gap-2">
        <div class="text-center select-none">
          <p class="mb-0">
            <b>{{
              $t("pages.documents.agreement.custom_template.empty.title")
            }}</b>
          </p>
          <p
            class="mb-0"
            :class="errors['custom_template.id'] ? 'text-danger' : ''"
          >
            {{
              $t("pages.documents.agreement.custom_template.empty.description")
            }}
          </p>
        </div>

        <button class="btn btn-success" type="button" @click="addTemplate()">
          <i class="pi pi-plus"></i>
          {{ $t("pages.documents.agreement.custom_template.add") }}
        </button>
      </div>
    </div>
  </div>

  <template
    v-if="docData.custom_template.id || docData.custom_template.new === true"
  >
    <stepName :num="2" :title="$t('pages.documents.agreement.form')" />

    <div
      v-if="previewDocument"
      class="col-span-12"
      v-html="sanitize(previewDocument)"
    ></div>

    <div class="col-span-12" v-if="points.length">
      <div class="custom-grid">
        <div class="col-span-12">
          <textEditorToolbar />
          <TransitionGroup
            tag="ul"
            class="list-group nowrap"
            :move="{ transition: { duration: 0.3 } }"
          >
            <pointItem
              v-for="(point, i) in points"
              :key="point.point_id"
              :node="point"
              :index="i"
              :parentList="points"
              :path="[i]"
            />
          </TransitionGroup>
        </div>

        <div v-if="docData.custom_template.new === false" class="col-span-12">
          <label class="custom-checkbox">
            <input type="checkbox" v-model="docData.custom_template.save" />
            <span>{{
              $t("pages.documents.agreement.custom_template.save_changes")
            }}</span>
          </label>
        </div>

        <div v-if="docData.custom_template.save === true" class="col-span-12">
          <div class="form-group-border active">
            <i class="pi pi-file"></i>
            <input
              v-model="docData.custom_template.name"
              type="text"
              placeholder=" "
            />
            <label
              :class="{
                'label-error': errors['custom_template.name'],
              }"
            >
              {{
                errors["custom_template.name"]
                  ? errors["custom_template.name"][0]
                  : $t("pages.documents.agreement.custom_template.name")
              }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted } from "vue";
import { sanitize } from "../../../utils/sanitize";
import pointItem from "../pointItem.vue";
import stepName from "../../ui/stepName.vue";
import textEditorToolbar from "../../ui/textEditorToolbar.vue";

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

const previewDocument = inject("previewDocument", ref([]));
const points = inject("points", ref([]));
const myTemplates = inject("myTemplates");
const selectTemplate = inject("selectTemplate");
const getMyAgreementTemplates = inject("getMyAgreementTemplates");

const itemRefs = ref({});

provide("itemRefs", itemRefs);

const addTemplate = () => {
  docData.value.custom_template.new = true;
  docData.value.custom_template.save = true;
};

onMounted(() => {
  getMyAgreementTemplates();
});

onBeforeUnmount(() => {
  docData.value.custom_template.id = null;
});
</script>
