<template>
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

      <div v-if="mode === 'create'" class="col-span-12">
        <div class="custom-grid">
          <div class="col-span-12">
            <label class="custom-checkbox">
              <input type="checkbox" v-model="docData.custom_template.save" />
              <span>{{
                $t("pages.documents.agreement.custom_template.save")
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
    </div>
  </div>
</template>

<script setup>
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

const itemRefs = ref({});

provide("itemRefs", itemRefs);
</script>
