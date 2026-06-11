<template>
  <template v-if="currentDocument">
    <template v-if="pdfData">
      <div class="p-4 lg:p-6">
        <div class="custom-grid">
          <div class="col-span-12 lg:col-span-8">
            <div class="card">
              <div class="card-header border-b-inactive">
                <div class="title-wrap items-center mb-4">
                  <h3>{{ $t("pages.documents.view.title") }}</h3>
                  <selectLocale />
                </div>
              </div>
              <client-only>
                <scrollFadeContainer
                  :maxHeight="600"
                  :fadeSize="80"
                >
                  <VuePdfEmbed :source="pdfData" />
                </scrollFadeContainer>
              </client-only>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-4">
              <ul class="list-group !px-6 !py-4">
                <li>
                  <p class="text-inactive text-xl mb-0">
                    {{ $t("pages.documents.parties") }}:
                    <b>{{ currentDocument.parties.length }}</b>
                  </p>
                </li>
                <template
                  v-for="(party, partyIndex) in currentDocument.parties"
                  :key="partyIndex"
                >
                  <userSignCard
                    :partyName="`${party.last_name} ${party.first_name} ${party.given_name || ''}`"
                    :iin="party.iin"
                    :partyTypeName="
                      party.is_mediator === 1
                        ? $t('pages.documents.mediator.title')
                        : $t('pages.documents.party_' + (partyIndex + 1))
                    "
                    :signId="party.sigex_sign_id"
                    :signedAt="party.signed_at"
                  />
                </template>
              </ul>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="h-screen w-full flex items-center justify-center relative">
        <div class="custom-container">
          <div class="custom-grid">
            <div class="col-span-12 lg:col-span-4 lg:col-start-5">
              <div class="card">
                <loader
                  v-if="pending"
                  :className="'overlay'"
                  :showPendingText="true"
                  :pendingText="$t('pages.documents.view.loading')"
                />
                <div class="card-header">
                  <div class="title-wrap items-center">
                    <h3>{{ $t("pages.documents.view.title") }}</h3>
                    <selectLocale />
                  </div>
                </div>
                <div class="card-body">
                  <p
                    v-if="errorStatus === 403 && authUser.user_id"
                    class="text-danger font-medium mb-0"
                  >
                    {{ $t("pages.documents.view.access_denied") }}
                  </p>
                  <template v-else>
                    <div class="flex flex-col gap-y-4 items-center">
                      <p class="text-center mb-0">
                        {{ $t("pages.documents.view.description") }}
                      </p>
                      <nuxt-link
                        class="btn btn-primary"
                        :to="`/auth?redirect=/document?q=${uuid}`"
                      >
                        <i class="pi pi-sign-in"></i
                        >{{ $t("pages.auth.title") }}</nuxt-link
                      >
                    </div>
                    <div class="flex justify-center items-center relative my-6">
                      <span class="bg-active z-10 px-2">{{ $t("or") }}</span>
                      <hr class="absolute w-full" />
                    </div>

                    <div class="flex flex-col gap-y-4">
                      <p
                        class="text-center mb-0"
                        :class="errorStatus ? 'text-danger' : ''"
                      >
                        {{
                          $t(
                            errorStatus === 401
                              ? "form.phone.last4.required"
                              : errorStatus === 403
                                ? "form.phone.last4.not_found"
                                : errorStatus === 429
                                  ? "errors.statuses.status_429"
                                  : "",
                          )
                        }}
                      </p>

                      <div class="flex gap-x-2 gap-y-4">
                        <div class="form-group-border active w-full">
                          <i class="pi pi-mobile"></i>
                          <input v-mask="'####'" v-model="lastFourNumber" />
                          <label>{{ $t("form.phone.last4.title") }}</label>
                        </div>

                        <button class="btn btn-primary" @click="getPdfFile()">
                          <i class="pi pi-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </template>
  <loader v-else :className="'full-overlay'" :showPendingText="true" />
</template>

<script setup>
import { useRoute } from "vue-router";
import { useRouter } from "nuxt/app";
import selectLocale from "../components/ui/selectLocale.vue";
import loader from "../components/ui/loader.vue";
import scrollFadeContainer from "../components/ui/scrollFadeContainer.vue";
import userSignCard from "../components/documents/userSignCard.vue";
import { onMounted } from "vue";
import VuePdfEmbed from "vue-pdf-embed";

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const { $axiosPlugin } = useNuxtApp();
const { t, localeProperties } = useI18n();

const authUser = useSanctumUser();
const uuid = route.query.q;
const lastFourNumber = ref("");
const currentDocument = ref(null);
const pdfData = ref(null);
const errorStatus = ref(null);
const pending = ref(true);

useHead({
  title: t("pages.documents.view.title"),
  meta: [{ name: "description", content: t("site.description") }],
});

const getDocument = async () => {
  await $axiosPlugin
    .get("document/get/" + uuid)
    .then((response) => {
      currentDocument.value = response.data;
      getPdfFile();
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

const getPdfFile = async () => {
  try {
    pending.value = true;
    const response = await $axiosPlugin.get(
      config.public.apiBase +
        "/document/get_file/" +
        currentDocument.value.type +
        "/signed/" +
        uuid +
        "?phone=" +
        lastFourNumber.value,
      {
        responseType: "arraybuffer",
      },
    );

    pdfData.value = response.data;
  } catch (error) {
    pending.value = false;
    if (error.response.status) {
      errorStatus.value = error.response.status;
    }
  }
};

onMounted(() => {
  getDocument();
});

onBeforeUnmount(() => {
  pdfData.value = null;
});
</script>
