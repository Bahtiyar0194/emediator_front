<template>
  <loader
    v-if="pendingPage"
    :className="'full-overlay'"
    :showPendingText="true"
  />
  <div class="col-span-12">
    <div class="custom-grid">
      <div class="col-span-12">
        <div class="btn-wrap">
          <button class="btn btn-primary" @click="openAddModal()">
            <i class="pi pi-plus"></i>
            {{ $t("pages.documents.agreement.new") }}
          </button>

          <button @click="showHideAgreementSearchFilter" class="btn btn-light">
            <i class="pi pi-search"></i>
            {{
              searchFilter === true
                ? $t("hide_search_filter")
                : $t("show_search_filter")
            }}
          </button>
        </div>
      </div>

      <div
        class="col-span-12 lg:col-span-3"
        :class="searchFilter ? 'block' : 'hidden'"
      >
        <stickyBox>
          <div class="card p-4">
            <h5>{{ $t("pages.documents.agreement.search_filter") }}</h5>
            <form @submit.prevent="debounceReset" ref="searchFormRef">
              <div class="custom-grid">
                <div class="col-span-12">
                  <div class="form-group-border active">
                    <i class="pi pi-calendar"></i>
                    <input
                      type="date"
                      name="created_at_from"
                      @input="debounceAgreements"
                      placeholder=" "
                    />
                    <label>{{ $t("created_at_from") }}</label>
                  </div>
                </div>

                <div class="col-span-12">
                  <div class="form-group-border active">
                    <i class="pi pi-calendar"></i>
                    <input
                      type="date"
                      name="created_at_to"
                      @input="debounceAgreements"
                      placeholder=" "
                    />
                    <label>{{ $t("created_at_to") }}</label>
                  </div>
                </div>

                <div class="col-span-12">
                  <div class="btn-wrap">
                    <button
                      type="submit"
                      class="btn btn-sm btn-outline-primary"
                    >
                      <i class="pi pi-undo"></i>
                      {{ $t("reset_search_filter") }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </stickyBox>
      </div>

      <div class="col-span-12" :class="searchFilter && 'lg:col-span-9'">
        <template v-if="agreements.data?.length > 0">
          <div class="table table-striped table-sm selectable">
            <loader
              v-if="pending"
              :className="'overlay'"
              :showPendingText="true"
            />
            <table ref="tableRef">
              <thead>
                <tr>
                  <sortTableHead
                    v-for="(head, index) in agreementsTableHeads"
                    :key="index"
                    :title="head.title"
                    :keyName="head.keyName"
                    :sortKey="sortKey"
                    :sortDirection="sortDirection"
                    :sortType="head.sortType"
                    :sortHandler="debounceAgreements"
                    @update:sortKey="sortKey = $event"
                    @update:sortDirection="sortDirection = $event"
                  />
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="agreement in agreements.data"
                  :key="agreement.uuid"
                  @click="getAgreement(agreement.uuid)"
                >
                  <td>{{ agreement.agreement_type_name }}</td>
                  <td>
                    <div class="flex gap-x-2 items-center">
                      <userAvatar
                        :padding="0.5"
                        :className="'w-6 h-6'"
                        :user="{
                          last_name: agreement.initiator_last_name,
                          first_name: agreement.initiator_first_name,
                          avatar: agreement.initiator_avatar,
                        }"
                      />
                      {{ agreement.initiator_last_name }}
                      {{ agreement.initiator_first_name }}
                    </div>
                  </td>
                  <td>
                    <div class="flex gap-x-2 items-center">
                      <userAvatar
                        :padding="0.5"
                        :className="'w-6 h-6'"
                        :user="{
                          last_name: agreement.mediator_last_name,
                          first_name: agreement.mediator_first_name,
                          avatar: agreement.mediator_avatar,
                        }"
                      />
                      {{ agreement.mediator_last_name }}
                      {{ agreement.mediator_first_name }}
                    </div>
                  </td>

                  <td>
                    {{
                      new Date(agreement.created_at).toLocaleString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false, // можно убрать или поставить true, если нужен 12-часовой формат
                      })
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="btn-wrap mt-4">
            <pagination
              :items="agreements"
              :setItems="getAgreements"
              :onSelect="(count) => (perPage = count)"
            />
          </div>
        </template>
        <alert v-else :className="'light'">
          <loader
            v-if="pending"
            :className="'overlay'"
            :showPendingText="true"
          />
          <p class="mb-0">{{ $t("nothing_was_found_for_your_query") }}</p>
        </alert>
      </div>
    </div>
  </div>

  <modal
    :show="agreementModalIsVisible"
    :onClose="() => closeModal('agreement')"
    :loaderOpacityFull="true"
    :className="'modal-xl'"
    :showLoader="pendingModal"
    :closeOnClickSelf="false"
  >
    <template v-slot:header_content>
      <h4>
        {{ currentAgreement ? currentAgreement.agreement_type_name : "" }}
      </h4>
    </template>
    <template v-slot:body_content>
      <div class="btn-wrap">
        <button
          class="btn btn-success"
          @click="
            openFile(
              config.public.apiBase +
                '/agreement/get_file/' +
                currentAgreement.uuid,
            )
          "
        >
          <i class="pi pi-file-pdf"></i>

          {{ $t("pages.documents.agreement.open") }}
        </button>

        <!--Не забудь потом кнопку снизу изолировать-->

        <button class="btn btn-primary" @click="openEditModal()">
          <i class="pi pi-pencil"></i>
          {{ $t("edit") }}
        </button>
      </div>
    </template>
  </modal>

  <modal
    :show="modalIsVisible"
    :onClose="() => closeModal('create')"
    :loaderOpacityFull="true"
    :className="modalClass"
    :showLoader="pendingModal"
    :closeOnClickSelf="false"
  >
    <template v-slot:header_content>
      <h4>
        {{ mode ? $t("pages.documents.agreement." + mode + "_alt") : "" }}
      </h4>
    </template>
    <template v-if="docData" v-slot:body_content>
      <steps :currentStep="currentStep" :steps="documentSteps">
        <scrollFadeContainer
          ref="scrollBoxCreate"
          :maxHeight="500"
          :fadeSize="40"
        >
          <form @submit.prevent="createDocumentSubmit" class="mt-2">
            <div
              v-for="(step, index) in documentSteps"
              :key="index"
              :class="currentStep === index + 1 ? 'block' : 'hidden'"
            >
              <component
                v-if="step.component"
                :is="step.component"
                v-bind="step.props"
              ></component>
            </div>

            <div class="btn-wrap mt-4">
              <button
                v-if="currentStep > 1"
                class="btn btn-light"
                @click="backToStep(currentStep - 1)"
                type="button"
              >
                <i class="pi pi-arrow-left"></i>
                {{ $t("back") }}
              </button>

              <button class="btn btn-primary" type="submit">
                <template v-if="currentStep !== documentSteps.length">
                  <i class="pi pi-arrow-right"></i>
                  {{ $t("continue") }}
                </template>
                <template v-else>
                  <i class="pi pi-check"></i>
                  {{ $t("save") }}
                </template>
              </button>
            </div>
          </form>
        </scrollFadeContainer>
      </steps>
    </template>
  </modal>
</template>

<script setup>
import modal from "@/components/ui/modal.vue";
import scrollFadeContainer from "../../components/ui/scrollFadeContainer.vue";
import loader from "../../components/ui/loader.vue";
import alert from "../../components/ui/alert.vue";
import steps from "@/components/ui/steps.vue";
import stickyBox from "../../components/ui/stickyBox.vue";
import pagination from "../../components/ui/pagination.vue";
import sortTableHead from "../../components/ui/sortTableHead.vue";
import userAvatar from "../../components/ui/userAvatar.vue";
import { debounceHandler } from "../../utils/debounceHandler";

import firstStep from "@/components/documents/firstStep.vue";
import secondStep from "../../components/documents/secondStep.vue";
import thirdStep from "../../components/documents/thirdStep.vue";
import { useRouter } from "nuxt/app";

const router = useRouter();
const config = useRuntimeConfig();
const { t, localeProperties } = useI18n();
const { $axiosPlugin } = useNuxtApp();

const docData = ref(null);
const mode = ref(null);
const errors = ref([]);
const modalIsVisible = ref(false);
const agreementModalIsVisible = ref(false);
const pending = ref(false);
const pendingModal = ref(false);
const pendingPage = ref(true);
const modalClass = ref("modal-lg");
const searchFormRef = ref(null);
const searchFilter = ref(false);
const perPage = ref(10);
const agreements = ref([]);
const currentAgreement = ref(null);
const locations = ref([]);
const legalForms = ref([]);
const posts = ref([]);
const agreementTypes = ref([]);
const colors = ref([]);

const sortKey = ref("agreements.created_at"); // Ключ сортировки
const sortDirection = ref("asc"); // Направление сортировки: asc или desc

const scrollBoxCreate = ref(null);

useHead({
  title: t("pages.dashboard.title"),
  meta: [{ name: "description", content: "My amazing site." }],
});

definePageMeta({
  layout: "dashboard",
  middleware: ["sanctum:auth"],
});

const createDocData = () => ({
  is_legal_1: false,
  is_legal_2: false,

  last_name_1: "Ақтан",
  last_name_2: "Дүйсенғали",

  first_name_1: "Азамат",
  first_name_2: "Алтынай",

  given_name_1: "Бейсенұлы",
  given_name_2: "Қуатқызы",

  iin_1: "111111111111",
  iin_2: "222222222222",

  location_id_1: null,
  location_id_2: null,

  street_1: "Абай",
  street_2: "мкр. Қадыр Мырза-Әлі",

  house_1: 12,
  house_2: 20,

  flat_1: 1,
  flat_2: 2,

  legal_form_id_1: null,
  legal_form_id_2: null,

  post_type_id_1: null,
  post_type_id_2: null,

  bin_1: null,
  bin_2: null,

  company_name_1: null,
  company_name_2: null,

  company_location_id_1: null,
  company_location_id_2: null,

  company_street_id_1: null,
  company_street_id_2: null,

  company_building_id_1: null,
  company_building_id_2: null,

  company_cabinet_id_1: null,
  company_cabinet_id_2: null,

  agreement_type_id: null,
  agreement_data: {},
});

provide("colors", colors);

const openAddModal = () => {
  mode.value = "create";
  docData.value = createDocData();
  modalIsVisible.value = true;
  currentStep.value = 1;
  modalClass.value = documentSteps[0].modalSize;
};

const openEditModal = () => {
  mode.value = "edit";
  docData.value = currentAgreement.value.data;
  modalIsVisible.value = true;
  currentStep.value = 1;
  modalClass.value = documentSteps[0].modalSize;
};

const closeModal = (action) => {
  pendingModal.value = false;
  errors.value = [];
  switch (action) {
    case "create":
      modalIsVisible.value = false;
      getAttributes();
      break;

    case "agreement":
      agreementModalIsVisible.value = false;
      break;

    default:
      break;
  }

  docData.value = null;
  mode.value = null;
};

const subjectTypes = ref([
  {
    title: "natural_person",
    legal: false,
  },
  {
    title: "legal_entity",
    legal: true,
  },
]);

const agreementsTableHeads = [
  {
    title: t("pages.documents.agreement.agreement_type"),
    keyName: "types_of_agreements.agreement_type_name",
    sortType: "alpha",
  },
  {
    title: t("pages.documents.initiator"),
    keyName: "initiator.last_name",
    sortType: "alpha",
  },
  {
    title: t("pages.documents.mediator"),
    keyName: "mediator.last_name",
    sortType: "alpha",
  },
  {
    title: t("created_at"),
    keyName: "agreements.created_at",
    sortType: "numeric",
  },
  // {
  //   title: t("status"),
  //   keyName: "types_of_status_lang.status_type_name",
  //   sortType: "alpha",
  // },
];

const documentSteps = [
  {
    title: t("pages.documents.party_1"),
    component: firstStep,
    props: {
      errors,
      locations,
      legalForms,
      posts,
      subjectTypes,
      docData,
    },
    modalSize: "modal-6xl",
  },
  {
    title: t("pages.documents.party_2"),
    component: secondStep,
    props: {
      errors,
      locations,
      legalForms,
      posts,
      subjectTypes,
      docData,
    },
    modalSize: "modal-6xl",
  },
  {
    title: t("pages.documents.form_agreement"),
    component: thirdStep,
    props: {
      errors,
      agreementTypes,
      docData,
      mode
    },
    modalSize: "modal-6xl",
  },
];

const currentStep = ref(1);

const backToStep = (step) => {
  currentStep.value = step;
  modalClass.value = documentSteps[step - 1].modalSize;
};

const getAttributes = async () => {
  await $axiosPlugin
    .get("/agreement/get_attributes")
    .then((res) => {
      locations.value = res.data.locations;
      legalForms.value = res.data.legal_forms;
      posts.value = res.data.posts;
      agreementTypes.value = res.data.agreement_types;
      colors.value = res.data.colors;
    })
    .catch((err) => {
      if (err.response) {
        router.push({
          path: "/error",
          query: {
            status: err.response.status,
            message: err.response.data.message,
            url: err.request.responseURL,
          },
        });
      } else {
        router.push("/error");
      }
    });
};

const getAgreements = async (url) => {
  pending.value = true;

  const formData = new FormData(searchFormRef.value);
  formData.append("per_page", perPage.value);
  formData.append("sort_key", sortKey.value); // Добавляем ключ сортировки
  formData.append("sort_direction", sortDirection.value); // Добавляем направление сортировки

  if (!url) {
    url = "agreement/get";
  }

  await $axiosPlugin
    .post(url, formData)
    .then((response) => {
      agreements.value = response.data;
      pending.value = false;
    })
    .catch((err) => {
      if (err.response) {
        router.push({
          path: "/error",
          query: {
            status: err.response.status,
            message: err.response.data.message,
            url: err.request.responseURL,
          },
        });
      } else {
        router.push("/error");
      }
    });
};

const getAgreement = async (uuid) => {
  agreementModalIsVisible.value = true;
  pendingModal.value = true;

  await $axiosPlugin
    .post("agreement/get/" + uuid, {
      lang: localeProperties.value.code,
    })
    .then((response) => {
      currentAgreement.value = response.data;
      console.log(currentAgreement.value);
      pendingModal.value = false;
    })
    .catch((err) => {
      if (err.response) {
        router.push({
          path: "/error",
          query: {
            status: err.response.status,
            message: err.response.data.message,
            url: err.request.responseURL,
          },
        });
      } else {
        router.push("/error");
      }
    });
};

const createDocumentSubmit = async () => {
  console.log(docData.value);
  pendingModal.value = true;

  await $axiosPlugin
    .post("/agreement/create", {
      ...docData.value,
      lang: localeProperties.value.code,
      step: currentStep.value,
    })
    .then((res) => {
      errors.value = [];
      if (res.data.step) {
        currentStep.value = res.data.step + 1;
        modalClass.value = documentSteps[res.data.step].modalSize;
        pendingModal.value = false;
      } else {
        closeModal("create");
        getAgreements();
      }
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status == 422) {
          errors.value = err.response.data;
          pendingModal.value = false;
          scrollBoxCreate.value.scrollToTop(true);
        } else {
          router.push({
            path: "/error",
            query: {
              status: err.response.status,
              message: err.response.data.message,
              url: err.request.responseURL,
            },
          });
        }
      } else {
        router.push("/error");
      }
    });
};

const openFile = (url) => {
  window.open(url, "_blank");
};

const showHideAgreementSearchFilter = () => {
  if (searchFilter.value === true) {
    searchFilter.value = false;
    resetAgreementSearchFilter();
  } else {
    searchFilter.value = true;
  }
};

const resetAgreementSearchFilter = () => {
  searchFormRef.value.reset();
  getAgreements();
};

const debounceAgreements = debounceHandler(() => getGroups(), 1000);
const debounceReset = debounceHandler(() => resetAgreementSearchFilter(), 500);

onMounted(() => {
  getAttributes();
  getAgreements().then(() => {
    pendingPage.value = false;
  });
});
</script>
