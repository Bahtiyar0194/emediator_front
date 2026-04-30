<template>
  <loader
    v-if="pendingPage"
    :className="'full-overlay'"
    :showPendingText="true"
  />
  <div class="col-span-12">
    <div class="custom-grid">
      <div class="col-span-12" v-if="agreements.total > 0">
        <div class="btn-wrap">
          <button class="btn btn-primary" @click="openModal('create')">
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
          <div class="card p-5">
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
                  <td>
                    <b>{{
                      agreement.template_name || agreement.agreement_type_name
                    }}</b>
                  </td>
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
                  <td :class="agreement.contract_status_color">
                    <b> {{ agreement.contract_status_name }}</b>
                  </td>
                  <td :class="agreement.agreement_status_color">
                    <b> {{ agreement.agreement_status_name }}</b>
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
          <p v-if="agreements.total > 0" class="mb-0">
            {{ $t("nothing_was_found_for_your_query") }}
          </p>

          <div v-else class="flex flex-col gap-y-3 items-center py-8 px-4">
            <img width="120px" src="~/public/img/document.svg" />

            <h3 class="mb-0">
              {{ $t("welcome") }}, {{ authUser?.first_name || "пользователь" }}!
            </h3>
            <p class="text-inactive mb-0">
              {{ $t("pages.documents.agreement.empty.title") }}
            </p>

            <button
              class="btn btn-success"
              type="button"
              @click="openModal('create')"
            >
              <i class="pi pi-plus"></i>
              {{ $t("pages.documents.agreement.create") }}
            </button>
          </div>
        </alert>
      </div>
    </div>
  </div>

  <modal
    :show="agreementModalIsVisible"
    :onClose="() => closeModal()"
    :loaderOpacityFull="true"
    :className="'modal-6xl'"
    :showLoader="pendingModal"
    :showPendingText="true"
    :closeOnClickSelf="false"
  >
    <template v-slot:header_content>
      <h4>
        {{
          currentAgreement
            ? currentAgreement.agreement.template_name ||
              currentAgreement.agreement.agreement_type_name
            : ""
        }}
      </h4>
    </template>
    <template v-slot:body_content>
      <template v-if="currentAgreement">
        <div class="custom-grid">
          <tabs :tabs="tabs_data" :activeTabIndex="0" :showTabHeader="true" />
        </div>
      </template>
      <template v-else>
        <div class="p-8"></div>
      </template>
    </template>
  </modal>

  <modal
    :show="modalIsVisible"
    :onClose="() => closeModal()"
    :loaderOpacityFull="true"
    :className="modalClass"
    :showLoader="pendingModal"
    :showPendingText="true"
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
          <form @submit.prevent="saveAgreement" class="mt-2">
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

  <modal
    :show="signModalIsViisible"
    :onClose="() => closeSignModal()"
    :loaderOpacityFull="true"
    :className="'modal-xl'"
    :showLoader="pendingModal"
    :showPendingText="true"
    :closeOnClickSelf="false"
  >
    <template v-slot:header_content>
      <h4>
        {{ $t("pages.documents.agreement.sign") }}
      </h4>
    </template>
    <template v-if="currentAgreement" v-slot:body_content>
      <signButtons
        :mode="'documents'"
        :signError="signError"
        :signQR="signQR"
        :signWithNCALayer="signWithNCALayer"
        :getQR="getQR"
        :clearQR="clearQR"
        :reloadPage="reloadPage"
      />
    </template>
  </modal>

  <modal
    :show="verifySignModalIsViisible"
    :onClose="() => closeVerifySignModal()"
    :loaderOpacityFull="true"
    :className="'modal-xl'"
    :showLoader="pendingModal"
    :showPendingText="true"
    :closeOnClickSelf="false"
  >
    <template v-slot:header_content>
      <h4>
        {{ $t("pages.documents.sign.verify.title_alt") }}
      </h4>
    </template>
    <template v-if="currentAgreement" v-slot:body_content>
      <div class="custom-grid">
        <stepName :num="1" :title="$t('pages.documents.sign.verify.step_1')" />

        <div class="col-span-12">
          <button class="btn btn-primary btn-sm" @click="getCmsFile()">
            <i class="pi pi-download"></i>
            {{ $t("pages.documents.sign.verify.download_file") }}
          </button>
        </div>

        <stepName
          :num="2"
          :title="
            $t('pages.documents.sign.verify.step_2', {
              site: 'https://ezsigner.kz',
            })
          "
        />
        <div class="col-span-12">
          <a
            class="btn btn-primary btn-sm"
            href="https://ezsigner.kz/#!/checkCMS"
            target="_blank"
          >
            <i class="pi pi-external-link"></i>
            {{ $t("pages.documents.sign.verify.open_site") }}
          </a>
        </div>

        <stepName :num="3" :title="$t('pages.documents.sign.verify.step_3')" />
      </div>
    </template>
  </modal>
</template>

<script setup>
import modal from "@/components/ui/modal.vue";
import scrollFadeContainer from "../../components/ui/scrollFadeContainer.vue";
import tabs from "../../components/ui/tabs.vue";
import documentTab from "../../components/documents/tabs/documentTab.vue";
import loader from "../../components/ui/loader.vue";
import alert from "../../components/ui/alert.vue";
import steps from "@/components/ui/steps.vue";
import stepName from "../../components/ui/stepName.vue";
import stickyBox from "../../components/ui/stickyBox.vue";
import pagination from "../../components/ui/pagination.vue";
import sortTableHead from "../../components/ui/sortTableHead.vue";
import userAvatar from "../../components/ui/userAvatar.vue";
import signButtons from "../../components/sign/signButtons.vue";
import { debounceHandler } from "../../utils/debounceHandler";

import partiesForm from "../../components/documents/partiesForm.vue";
import agreementForm from "../../components/documents/agreementForm.vue";
import selectMediator from "../../components/documents/selectMediator.vue";
import previewAgreement from "../../components/documents/previewAgreement.vue";
import { useRouter } from "nuxt/app";

import { NCALayerClient } from "ncalayer-js-client";

const router = useRouter();
const config = useRuntimeConfig();
const { t, localeProperties } = useI18n();
const { $axiosPlugin } = useNuxtApp();
const authUser = useSanctumUser();

const docData = ref(null);
const mode = ref(null);
const docMode = ref(null);
const errors = ref([]);
const modalIsVisible = ref(false);
const signModalIsViisible = ref(false);
const verifySignModalIsViisible = ref(false);
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
const banks = ref([]);
const colors = ref([]);
const mediators = ref([]);

const signedDocument = ref(null);
const signQR = ref(null);
const ncaLayer = ref(new NCALayerClient());
const signError = ref(null);

const sortKey = ref("agreements.created_at"); // Ключ сортировки
const sortDirection = ref("asc"); // Направление сортировки: asc или desc

const scrollBoxCreate = ref(null);

const originalPoints = ref([]); // Оригинал для сброса
const points = ref([]); // Копия для мутации и отправки на бэкенд
const previewDocument = ref([]);

const myTemplates = ref([]);

useHead({
  title: t("pages.dashboard.title"),
  meta: [{ name: "description", content: "My amazing site." }],
});

definePageMeta({
  layout: "dashboard",
  middleware: ["sanctum:auth"],
});

const partyFormData = {
  last_name: null,
  first_name: null,
  given_name: null,
  iin: null,

  data: {
    location_id: null,
    street: null,
    house: null,
    flat: null,

    is_legal: false,
    legal_form_id: null,
    post_type_id: null,
    bin: null,
    company_name: null,
    company_location_id: null,
    company_street: null,
    company_building: null,
    company_cabinet: null,
  },
};

const createParty = () => structuredClone(partyFormData);

const createDocData = () => ({
  agreement_parties: [createParty(), createParty()],
  mediator_id: null,
  agreement_type_id: null,
  custom_template: {
    id: null,
    new: false,
    save: false,
    name: null,
  },
  agreement_data: {},
  contract_data: {
    prepayment: null,
  },
});

const tabs_data = computed(() => [
  {
    name: "contract",
    title: t("pages.documents.contract.title"),
    icon: "pi pi-file",
    component: documentTab,
    props: {
      type: "contract",
      document: currentAgreement.value.contract,
      openModal,
      openSignModal,
      openVerifySignModal,
    },
  },
  {
    name: "agreement",
    title: t("pages.documents.agreement.title"),
    icon: "pi pi-file",
    component: documentTab,
    props: {
      type: "agreement",
      document: currentAgreement.value.agreement,
      openModal,
      openSignModal,
      openVerifySignModal,
    },
  },
]);

const openModal = (action) => {
  mode.value = action;

  switch (action) {
    case "create":
      docData.value = createDocData();
      break;

    case "edit":
      docData.value = {
        agreement_parties: currentAgreement.value.agreement.parties.filter(
          (p) => p.is_mediator === 0,
        ),
        agreement_type_id: currentAgreement.value.agreement.agreement_type_id,
        custom_template: {
          id: currentAgreement.value.agreement.custom_template_id || null,
          new: false,
          save: false,
          name: currentAgreement.value.agreement.template_name || null,
        },
        agreement_data: currentAgreement.value.agreement.data || {},
        contract_data: currentAgreement.value.contract.data,
        mediator_id: currentAgreement.value.agreement.mediator_id,
      };

      if (currentAgreement.value.agreement.points) {
        points.value = [];
        points.value = currentAgreement.value.agreement.points;
      }

      agreementModalIsVisible.value = false;
      break;

    default:
      break;
  }

  modalIsVisible.value = true;
  currentStep.value = 1;
  modalClass.value = documentSteps[0].modalSize;
};

const closeModal = () => {
  pendingModal.value = false;
  errors.value = [];
  modalIsVisible.value = false;
  agreementModalIsVisible.value = false;
  currentAgreement.value = null;

  setTimeout(() => {
    docData.value = null;
    mode.value = null;
    points.value = [];
    points.value = originalPoints.value;
  }, 200);
};

const openSignModal = (mode) => {
  docMode.value = mode;
  signModalIsViisible.value = true;
  agreementModalIsVisible.value = false;
};

const closeSignModal = () => {
  signModalIsViisible.value = false;
  agreementModalIsVisible.value = true;
  signError.value = null;
  signQR.value = null;
  docMode.value = null;
};

const openVerifySignModal = (mode) => {
  docMode.value = mode;
  verifySignModalIsViisible.value = true;
  agreementModalIsVisible.value = false;
};

const closeVerifySignModal = () => {
  verifySignModalIsViisible.value = false;
  agreementModalIsVisible.value = true;
  docMode.value = null;
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
    keyName: "types_of_agreements_lang.agreement_type_name",
    sortType: "alpha",
  },
  {
    title: t("pages.documents.initiator"),
    keyName: "initiator.last_name",
    sortType: "alpha",
  },
  {
    title: t("pages.documents.contract.status"),
    keyName: "contract_status_lang.status_type_name",
    sortType: "alpha",
  },
  {
    title: t("pages.documents.agreement.status"),
    keyName: "agreement_status_lang.status_type_name",
    sortType: "alpha",
  },
  {
    title: t("created_at"),
    keyName: "agreements.created_at",
    sortType: "numeric",
  },
];

const getUserById = async (partyIndex, iin) => {
  if (iin.length === 12) {
    pendingModal.value = true;

    await $axiosPlugin
      .get("/users/get/" + iin)
      .then((res) => {
        pendingModal.value = false;
        if (res.data.user) {
          const user = res.data.user;
          docData.value.agreement_parties[partyIndex].first_name =
            user.first_name;
          docData.value.agreement_parties[partyIndex].last_name =
            user.last_name;
          docData.value.agreement_parties[partyIndex].given_name =
            user.given_name;

          if (user.data) {
            docData.value.agreement_parties[partyIndex].data = user.data;
          }
        }
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
  }
};

const documentSteps = [
  {
    title: t("pages.documents.parties"),
    component: partiesForm,
    props: {
      errors,
      locations,
      legalForms,
      posts,
      subjectTypes,
      docData,
      getUserById,
    },
    modalSize: "modal-6xl",
  },
  {
    title: t("pages.documents.select_mediator"),
    component: selectMediator,
    props: {
      errors,
      mediators,
      docData,
      mode,
    },
    modalSize: "modal-4xl",
  },
  {
    title: t("pages.documents.agreement.form"),
    component: agreementForm,
    props: {
      errors,
      agreementTypes,
      docData,
      mode,
    },
    modalSize: "modal-6xl",
  },
  {
    title: t("pages.documents.agreement.preview"),
    component: previewAgreement,
    modalSize: "modal-4xl",
  },
];

const currentStep = ref(1);

const backToStep = (step) => {
  currentStep.value = step;
  modalClass.value = documentSteps[step - 1].modalSize;
  pendingModal.value = true;

  setTimeout(() => {
    pendingModal.value = false;
  }, 500);
};

const getAttributes = async () => {
  await $axiosPlugin
    .get("/agreement/get_attributes")
    .then((res) => {
      locations.value = res.data.locations;
      legalForms.value = res.data.legal_forms;
      posts.value = res.data.posts;
      agreementTypes.value = res.data.agreement_types;
      banks.value = res.data.banks;
      colors.value = res.data.colors;
      mediators.value = res.data.mediators;

      const pointsData = res.data.typical_points;

      originalPoints.value = structuredClone(pointsData);
      points.value = structuredClone(pointsData);
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
      currentAgreement.value = null;
      setTimeout(() => {
        currentAgreement.value = response.data;
        pendingModal.value = false;
      }, 200);
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

const saveAgreement = async () => {
  pendingModal.value = true;

  await $axiosPlugin
    .post("/agreement/save", {
      ...docData.value,
      points: points.value,
      uuid: currentAgreement.value
        ? currentAgreement.value.agreement.uuid
        : null,
      lang: localeProperties.value.code,
      step: currentStep.value,
    })
    .then((res) => {
      errors.value = [];
      if (res.data.step) {
        currentStep.value = res.data.step + 1;
        modalClass.value = documentSteps[res.data.step].modalSize;
        pendingModal.value = false;
        scrollBoxCreate.value.scrollToTop(true);

        if (res.data.preview) {
          previewDocument.value = res.data.preview;
        }
      } else {
        closeModal();
        getAgreements().then(() => {
          if (res.data.uuid) {
            getAgreement(res.data.uuid);
          }
        });
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

const getMyAgreementTemplates = async () => {
  pendingModal.value = true;

  await $axiosPlugin
    .get("/agreement/get_my_templates")
    .then((res) => {
      myTemplates.value = res.data;
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

const selectTemplate = () => {
  pendingModal.value = true;
  setTimeout(() => {
    const template = myTemplates.value.find(
      (t) => docData.value.custom_template.id === t.template_id,
    );

    if (template && template.data) {
      points.value = [];
      points.value = template.data;

      setTimeout(() => {
        pendingModal.value = false;
      }, 500);

      return;
    }

    pendingModal.value = false;
  }, 500);
};

provide("banks", banks);
provide("colors", colors);
provide("previewDocument", previewDocument);
provide("points", points);
provide("myTemplates", myTemplates);
provide("selectTemplate", selectTemplate);
provide("getMyAgreementTemplates", getMyAgreementTemplates);

async function signWithNCALayer() {
  pendingModal.value = true;

  if (!signedDocument.value) {
    try {
      await ncaLayer.value.connect();
    } catch (err) {
      signError.value = {
        message: t("errors.failed_to_connect_ncalayer"),
        description: err.toString(),
        status: null,
      };
      pendingModal.value = false;
      return;
    }
  }

  let base64EncodedSignature;

  const response = await fetch(
    config.public.apiBase +
      "/agreement/get_file/" +
      docMode.value +
      "/original/" +
      currentAgreement.value[docMode.value].uuid,
  );

  const result = await response.json();

  try {
    base64EncodedSignature = await ncaLayer.value.basicsSignCMS(
      NCALayerClient.basicsStorageAll,
      result.data, // здесь поддерживаются String | ArrayBuffer | Blob | File, строки интерпретируются как Base64
      NCALayerClient.basicsCMSParamsDetached,
      NCALayerClient.basicsSignerSignAny, // здесь используется ключ подписания
    );
  } catch (err) {
    if (err.canceledByUser) {
      signError.value = {
        message: t("errors.canceled_by_user"),
        description: err.toString(),
        status: null,
      };
    } else {
      signError.value = {
        message: "Error",
        description: err.toString(),
        status: null,
      };
    }
    pendingModal.value = false;
  }

  sign(base64EncodedSignature[0] || base64EncodedSignature);
}

async function getQR() {
  pendingModal.value = true;
  await $axiosPlugin
    .post("/auth/get_qr")
    .then((res) => {
      if (res.data.message) {
        signError.value = {
          message: t("errors.server_error"),
          description: res.data.message,
          status: res.status,
        };
        return;
      }

      sendQR(res.data.dataURL);

      signQR.value = res.data;
      pendingModal.value = false;
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message,
        status: err?.response.status,
      };
      pendingModal.value = false;
      return;
    });
}

async function sendQR(dataURL) {
  const response = await fetch(
    config.public.apiBase +
      "/agreement/get_file/" +
      docMode.value +
      "/original/" +
      currentAgreement.value[docMode.value].uuid,
  );
  const result = await response.json();

  const agreement_name =
    currentAgreement.value.agreement.template_name ||
    currentAgreement.value.agreement.agreement_type_name;

  await $axiosPlugin
    .post(dataURL, {
      signMethod: "CMS_SIGN_ONLY",
      documentsToSign: [
        {
          id: 2,
          meta: [],
          nameEn: agreement_name,
          nameRu: agreement_name,
          nameKz: agreement_name,
          document: {
            file: {
              data: result.data,
              mime: "@file/pdf",
            },
          },
        },
      ],
    })
    .then((r) => {
      signWithQR(r.data.signURL);
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message,
        status: err?.response.status,
      };
      pendingModal.value = false;
      return;
    });
}

async function signWithQR(signURL) {
  pendingModal.value = true;
  await $axiosPlugin
    .get(signURL)
    .then((r) => {
      sign(r.data.documentsToSign[0].document.file.data);
    })
    .catch((err) => {
      signError.value = {
        message: t("errors.server_error"),
        description: err?.response.data.message,
        status: err?.response.status,
      };
      pendingModal.value = false;
      return;
    });
}

async function sign(signature) {
  await $axiosPlugin
    .post("/agreement/sign/" + currentAgreement.value.agreement.uuid, {
      lang: localeProperties.value.code,
      mode: docMode.value,
      signature: signature,
    })
    .then((res) => {
      closeSignModal();
      getAgreement(currentAgreement.value.agreement.uuid);
      signedDocument.value = currentAgreement.value.agreement.uuid;
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
}

const getCmsFile = async () => {
  pendingModal.value = true;

  try {
    const res = await $axiosPlugin.get(
      "/agreement/cms/" +
        docMode.value +
        "/" +
        currentAgreement.value.agreement.uuid,
      {
        responseType: "blob",
      },
    );

    const blob = new Blob([res.data], {
      type: "application/pkcs7-mime",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = currentAgreement.value[docMode.value].uuid + ".cms";
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
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
  } finally {
    pendingModal.value = false;
  }
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

const debounceAgreements = debounceHandler(() => getAgreements(), 1000);
const debounceReset = debounceHandler(() => resetAgreementSearchFilter(), 500);

onMounted(() => {
  getAttributes();
  getAgreements().then(() => {
    pendingPage.value = false;
  });
});

const clearQR = () => {
  signQR.value = null;
};

function reloadPage() {
  window.location.reload();
}
</script>
