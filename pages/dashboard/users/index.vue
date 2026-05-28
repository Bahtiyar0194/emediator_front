<template>
  <div class="col-span-12">
    <div class="custom-grid">
      <div class="col-span-12">
        <div class="btn-wrap">
          <button @click="showHideUserSearchFilter" class="btn btn-light">
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
            <h5>{{ $t("pages.users.search_filter") }}</h5>
            <form @submit.prevent="debounceReset" ref="searchFormRef">
              <div class="custom-grid">
                <div class="col-span-12">
                  <div class="form-group-border active">
                    <i class="pi pi-user"></i>
                    <input
                      type="text"
                      name="user"
                      placeholder=" "
                      @input="debounceUsers"
                    />
                    <label
                      >{{ $t("form.last_name.title") }},
                      {{ $t("form.name.title") }}</label
                    >
                  </div>
                </div>

                <div class="col-span-12">
                  <div class="form-group-border active">
                    <i class="pi pi-hashtag"></i>
                    <input
                      type="number"
                      name="iin"
                      placeholder=" "
                      @input="debounceUsers"
                    />
                    <label>{{ $t("form.iin.title") }}</label>
                  </div>
                </div>

                <div class="col-span-12">
                  <div class="form-group-border active">
                    <i class="pi pi-at"></i>
                    <input
                      type="text"
                      name="email"
                      placeholder=" "
                      @input="debounceUsers"
                    />
                    <label>{{ $t("form.email") }}</label>
                  </div>
                </div>

                <div class="col-span-12">
                  <div class="form-group-border active">
                    <i class="pi pi-mobile"></i>
                    <input
                      v-mask="'+7 (###) ###-####'"
                      name="phone"
                      placeholder=" "
                      @input="debounceUsers"
                    />
                    <label>{{ $t("form.phone.title") }}</label>
                  </div>
                </div>

                <div class="col-span-12">
                  <multipleSelect
                    :className="'form-group-border select active label-active'"
                    :icon="'pi pi-hourglass'"
                    :label="$t('pages.users.user_status')"
                    :items="attributes.user_statuses"
                    :optionName="'statuses[]'"
                    :optionValue="'status_type_id'"
                    :optionLabel="'status_type_name'"
                    :onChange="debounceUsers"
                  />
                </div>

                <div class="col-span-12">
                  <multipleSelect
                    :className="'form-group-border select active label-active'"
                    :icon="'pi pi-id-card'"
                    :label="$t('pages.users.user_role')"
                    :items="attributes.user_roles"
                    :optionName="'roles[]'"
                    :optionValue="'role_type_id'"
                    :optionLabel="'user_role_type_name'"
                    :onChange="debounceUsers"
                  />
                </div>

                <div class="col-span-12">
                  <div class="form-group-border active">
                    <i class="pi pi-calendar"></i>
                    <input
                      type="date"
                      name="created_at_from"
                      @input="debounceUsers"
                      placeholder=" "
                    />
                    <label>{{ $t("registered_at_from") }}</label>
                  </div>
                </div>

                <div class="col-span-12">
                  <div class="form-group-border active">
                    <i class="pi pi-calendar"></i>
                    <input
                      type="date"
                      name="created_at_to"
                      @input="debounceUsers"
                      placeholder=" "
                    />
                    <label>{{ $t("registered_at_to") }}</label>
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
        <template v-if="users.data?.length > 0">
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
                    v-for="(head, index) in userTableHeads"
                    :key="index"
                    :title="head.title"
                    :keyName="head.keyName"
                    :sortKey="sortKey"
                    :sortDirection="sortDirection"
                    :sortType="head.sortType"
                    :sortHandler="debounceUsers"
                    @update:sortKey="sortKey = $event"
                    @update:sortDirection="sortDirection = $event"
                  />
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="user in users.data"
                  :key="user.user_id"
                  @click="getUser(user.user_id)"
                >
                  <td>
                    <div class="flex gap-x-2 items-center">
                      <userAvatar
                        :padding="0.5"
                        :className="'w-6 h-6'"
                        :user="user"
                      />
                      {{ user.last_name }} {{ user.first_name }}
                    </div>
                  </td>
                  <td>{{ user.iin }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone }}</td>
                  <td>{{ new Date(user.created_at).toLocaleString() }}</td>
                  <td :class="user.status_color">
                    {{ user.status_type_name }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="btn-wrap mt-4">
            <pagination
              :items="users"
              :setItems="getUsers"
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
    :show="userModalIsVisible"
    :onClose="() => (userModalIsVisible = false)"
    :className="'modal-lg'"
    :showLoader="pendingUser"
    :closeOnClickSelf="true"
  >
    <template v-slot:header_content>
      <h4>{{ $t("pages.users.user_info") }}</h4>
    </template>
    <template v-if="user" v-slot:body_content>
      <div class="flex flex-col gap-x-4 gap-y-4 whitespace-nowrap">
        <div class="flex gap-4">
          <userAvatar :user="user" :className="'w-12 h-12 text-2xl'" />
          <div class="flex flex-col gap-y-4">
            <h4 class="mb-0">{{ user.last_name }} {{ user.first_name }}</h4>
            <span
              ><span class="text-inactive">{{ $t("form.email") }}: </span>
              <b v-if="user.data.email">{{ user.data.email }}</b></span
            >
            <span
              ><span class="text-inactive">{{ $t("form.phone.title") }}: </span>
              <b v-if="user.data.phone">{{ user.data.phone }}</b></span
            >
          </div>
        </div>
        <div class="flex flex-col gap-y-4">
          <div v-if="user.roles?.length > 1">
            <p class="text-inactive mb-2">{{ $t("pages.users.user_role") }}:</p>
            <div class="flex flex-wrap gap-2">
              <div
                v-for="role in user.available_roles"
                :key="role.role_type_id"
                class="badge badge-light"
              >
                <i class="pi pi-user mr-0.5 -mt-1"></i>
                {{ role.user_role_type_name }}
              </div>
            </div>
          </div>

          <div class="btn-wrap">
            <roleProvider :roles="[1, 2, 3]">
              <button @click="getEditUser" class="btn btn-outline-primary">
                <i class="pi pi-user-edit"></i>
                {{ $t("edit") }}
              </button>
            </roleProvider>
          </div>
        </div>
      </div>
    </template>
  </modal>

  <modal
    :show="editModalIsVisible"
    :onClose="() => (editModalIsVisible = false)"
    :className="mediatorIsSelected ? 'modal-2xl' : 'modal-lg'"
    :showLoader="pendingEdit"
    :closeOnClickSelf="false"
  >
    <template v-slot:header_content>
      <h4>{{ $t("pages.users.edit_user_title") }}</h4>
    </template>
    <template v-if="user" v-slot:body_content>
      <form class="mt-2" @submit.prevent="editUserSubmit()">
        <div class="custom-grid">
          <div
            class="col-span-12"
            :class="mediatorIsSelected ? 'lg:col-span-6' : ''"
          >
            <div class="form-group-border active">
              <i class="pi pi-user"></i>
              <input
                autoComplete="edit-first-name"
                v-model="user.first_name"
                type="text"
                placeholder=" "
              />
              <label :class="{ 'label-error': errors.first_name }">
                {{
                  errors.first_name
                    ? errors.first_name[0]
                    : $t("form.name.title")
                }}
              </label>
            </div>
          </div>
          <div
            class="col-span-12"
            :class="mediatorIsSelected ? 'lg:col-span-6' : ''"
          >
            <div class="form-group-border active">
              <i class="pi pi-user"></i>
              <input
                autoComplete="edit-last-name"
                v-model="user.last_name"
                type="text"
                placeholder=" "
              />
              <label :class="{ 'label-error': errors.last_name }">
                {{
                  errors.last_name
                    ? errors.last_name[0]
                    : $t("form.last_name.title")
                }}
              </label>
            </div>
          </div>

          <div
            v-for="(level, index) in locationSelections"
            :key="index"
            class="col-span-12"
            :class="getSelectionColumnClass(locationSelections.length)"
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
                    errors['data.location.id'] &&
                    index === locationSelections.length - 1,
                }"
              >
                {{ $t("form.select_a_point") }}
              </label>
            </div>
          </div>

          <div
            v-if="
              user.data &&
              user.data.location &&
              user.data.location.is_district === true
            "
            class="col-span-12"
          >
            <div class="form-group-border active">
              <i class="pi pi-map-marker"></i>
              <input v-model="user.data.location.village" placeholder=" " />
              <label
                :class="{
                  'label-error': errors['data.location.village'],
                }"
              >
                {{
                  errors["data.location.village"]
                    ? $t("form.village.required")
                    : $t("form.village.title")
                }}
              </label>
            </div>
          </div>

          <div
            class="col-span-12"
            :class="mediatorIsSelected ? 'lg:col-span-6' : ''"
          >
            <div class="form-group-border active">
              <i class="pi pi-at"></i>
              <input
                autoComplete="new-email"
                v-model="user.data.email"
                type="text"
                placeholder=" "
              />
              <label :class="{ 'label-error': errors['data.email'] }">
                {{
                  errors["data.email"]
                    ? errors["data.email"][0]
                    : $t("form.email")
                }}
              </label>
            </div>
          </div>

          <div
            class="col-span-12"
            :class="mediatorIsSelected ? 'lg:col-span-6' : ''"
          >
            <div class="form-group-border active">
              <i class="pi pi-mobile"></i>
              <input
                autoComplete="new-phone"
                v-model="user.data.phone"
                v-mask="'+7 (###) ###-####'"
                placeholder=" "
              />
              <label :class="{ 'label-error': errors['data.phone'] }">
                {{
                  errors["data.phone"]
                    ? errors["data.phone"][0]
                    : $t("form.phone.title")
                }}
              </label>
            </div>
          </div>

          <template v-if="mediatorIsSelected">
            <div class="col-span-12">
              <b>{{ $t("pages.documents.mediator.data") }}</b>
            </div>
            <div class="col-span-12">
              <div class="form-group-border active">
                <i class="pi pi-building-columns"></i>
                <input
                  autoComplete="new-association-name-short"
                  v-model="user.mediator.association_name_short"
                  type="text"
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error': errors['mediator.association_name_short'],
                  }"
                >
                  {{
                    errors["mediator.association_name_short"]
                      ? $t(
                          "pages.documents.mediator.association_name_short.required",
                        )
                      : $t(
                          "pages.documents.mediator.association_name_short.title",
                        )
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12">
              <div class="form-group-border active">
                <i class="pi pi-building-columns"></i>
                <input
                  autoComplete="new-association-name-full"
                  v-model="user.mediator.association_name_full"
                  type="text"
                  placeholder=" "
                />
                <label
                  :class="{
                    'label-error': errors['mediator.association_name_full'],
                  }"
                >
                  {{
                    errors["mediator.association_name_full"]
                      ? $t(
                          "pages.documents.mediator.association_name_full.required",
                        )
                      : $t(
                          "pages.documents.mediator.association_name_full.title",
                        )
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-6">
              <div class="form-group-border active">
                <i class="pi pi-hashtag"></i>
                <input
                  autoComplete="new-cert_num"
                  v-model="user.mediator.cert_num"
                  type="text"
                  placeholder=" "
                />
                <label :class="{ 'label-error': errors['mediator.cert_num'] }">
                  {{
                    errors["mediator.cert_num"]
                      ? $t("pages.documents.mediator.cert_num.required")
                      : $t("pages.documents.mediator.cert_num.title")
                  }}
                </label>
              </div>
            </div>

            <div class="col-span-12 lg:col-span-6">
              <div class="form-group-border active">
                <i class="pi pi-calendar-clock"></i>
                <input
                  autoComplete="new-cert_date"
                  v-model="user.mediator.cert_date"
                  type="date"
                  placeholder=" "
                />
                <label :class="{ 'label-error': errors['mediator.cert_date'] }">
                  {{
                    errors["mediator.cert_date"]
                      ? $t("pages.documents.mediator.cert_date.required")
                      : $t("pages.documents.mediator.cert_date.title")
                  }}
                </label>
              </div>
            </div>
          </template>

          <div class="col-span-12" v-if="roles.length">
            <label
              class="label-focus"
              :class="errors.roles_count && 'danger'"
              >{{
                errors.roles_count
                  ? errors.roles_count[0]
                  : $t("pages.users.user_role")
              }}</label
            >

            <div class="flex flex-wrap gap-3 mt-2">
              <label
                v-for="role in roles"
                :key="role.role_type_id"
                class="custom-radio-checkbox"
              >
                <input
                  class="edit_role_input"
                  v-model="role.selected"
                  :value="role.role_type_id"
                  type="checkbox"
                  :checked="role.selected"
                />
                <span>{{ role.user_role_type_name }}</span>
              </label>
            </div>
          </div>
        </div>

        <button class="btn btn-primary mt-4" type="submit">
          <i class="pi pi-check"></i>
          {{ $t("continue") }}
        </button>
      </form>
    </template>
  </modal>
</template>

<script setup>
import { useRouter } from "nuxt/app";
import { useLocationSelect } from "../../../composables/useLocationSelect";
import { createDataCollection } from "../../../utils/partyFormData";
import modal from "../../../components/ui/modal.vue";
import loader from "../../../components/ui/loader.vue";
import alert from "../../../components/ui/alert.vue";
import userAvatar from "../../../components/ui/userAvatar.vue";
import stickyBox from "../../../components/ui/stickyBox.vue";
import pagination from "../../../components/ui/pagination.vue";
import { debounceHandler } from "../../../utils/debounceHandler";
import roleProvider from "../../../components/ui/roleProvider.vue";
import multipleSelect from "../../../components/ui/multipleSelect.vue";
import sortTableHead from "../../../components/ui/sortTableHead.vue";

const router = useRouter();
const errors = ref([]);
const { $axiosPlugin } = useNuxtApp();
const { t, localeProperties } = useI18n();
const pending = ref(true);
const pendingInvite = ref(false);
const pendingUser = ref(false);
const pendingEdit = ref(false);
const tableRef = ref(null);
const searchFormRef = ref(null);
const searchFilter = ref(false);
const perPage = ref(10);
const authUser = useSanctumUser();
const { refreshIdentity } = useSanctumAuth();
const users = ref([]);
const user = ref(null);
const roles = ref([]);
const attributes = ref([]);

const userModalIsVisible = ref(false);
const editModalIsVisible = ref(false);

const sortKey = ref("users.created_at"); // Ключ сортировки
const sortDirection = ref("asc"); // Направление сортировки: asc или desc

useHead({
  title: t("pages.users.title"),
  meta: [{ name: "description", content: t("site.description") }],
});

definePageMeta({
  layout: "dashboard",
  middleware: ["sanctum:auth"],
});

const userTableHeads = [
  {
    title: t("form.name.title") + " " + t("form.last_name.title"),
    keyName: "users.last_name",
    sortType: "alpha",
  },
  {
    title: t("form.iin.title"),
    keyName: "users.iin",
    sortType: "alpha",
  },
  {
    title: t("form.email"),
    keyName: "users.email",
    sortType: "alpha",
  },
  {
    title: t("form.phone.title"),
    keyName: "users.phone",
    sortType: "numeric",
  },
  {
    title: t("registered_at"),
    keyName: "users.created_at",
    sortType: "numeric",
  },
  {
    title: t("status"),
    keyName: "types_of_status_lang.status_type_name",
    sortType: "alpha",
  },
];

const getUsers = async (url) => {
  pending.value = true;

  const formData = new FormData(searchFormRef.value);
  formData.append("lang", localeProperties.value.code);
  formData.append("per_page", perPage.value);
  formData.append("sort_key", sortKey.value); // Добавляем ключ сортировки
  formData.append("sort_direction", sortDirection.value); // Добавляем направление сортировки

  if (!url) {
    url = "users/get";
  }

  await $axiosPlugin
    .post(url, formData)
    .then((response) => {
      users.value = response.data;
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

const getUser = async (user_id) => {
  pendingUser.value = true;
  userModalIsVisible.value = true;
  await $axiosPlugin
    .post("users/get/" + user_id, {
      lang: localeProperties.value.code,
    })
    .then((response) => {
      errors.value = [];
      user.value = response.data;

      if (authUser.value.user_id === user_id) {
        refreshIdentity();
      }

      if (!user.value.data) {
        user.value.data = createDataCollection();
      }

      if (!user.value.mediator) {
        user.value.mediator = {};
      }

      roles.value = [...user.value.roles];
      pendingUser.value = false;
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

const getEditUser = async () => {
  userModalIsVisible.value = false;
  editModalIsVisible.value = true;
};

const getUserAttributes = async () => {
  pending.value = true;
  await $axiosPlugin
    .post("users/get_user_attributes", {
      lang: localeProperties.value.code,
    })
    .then((response) => {
      attributes.value = response.data;
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

const editUserSubmit = async () => {
  pendingEdit.value = true;

  await $axiosPlugin
    .post("users/update", {
      ...user.value,
      new_roles: roles.value,
      mediator_is_selected: mediatorIsSelected.value,
      operation_type_id: 2,
      lang: localeProperties.value.code,
    })
    .then((response) => {
      errors.value = false;
      getUser(user.value.user_id);
      getUsers();
      pendingEdit.value = false;
      editModalIsVisible.value = false;
      userModalIsVisible.value = true;
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status == 422) {
          errors.value = err.response.data;
          pendingEdit.value = false;
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

const mediatorIsSelected = computed(() => {
  return (
    roles.value.length &&
    roles.value.find((r) => r.role_type_slug === "mediator").selected === true
  );
});

const getSelectionColumnClass = (selectionCount) => {
  if (selectionCount <= 1) {
    return "lg:col-span-12";
  }

  if (selectionCount === 2) {
    return "lg:col-span-6";
  }

  if (selectionCount === 3) {
    return "lg:col-span-4";
  }

  return "lg:col-span-3";
};

const locationsRef = computed(() => attributes.value?.locations || []);

const locationModel = computed({
  get: () => user.value?.data?.location ?? null,

  set: (val) => {
    if (!user.value) return;

    user.value.data.location = val;
  },
});

const {
  selections: locationSelections,
  init: initLocation,
  onSelect: onSelectLocation,
} = useLocationSelect({
  treeRef: locationsRef,
  modelRef: locationModel,
});

watch(
  () => attributes.value?.locations,
  (locations) => {
    if (locations?.length) {
      initLocation();
    }
  },
  { immediate: true },
);

const showHideUserSearchFilter = () => {
  if (searchFilter.value === true) {
    searchFilter.value = false;
    resetUserSearchFilter();
  } else {
    searchFilter.value = true;
  }
};

const resetUserSearchFilter = () => {
  searchFormRef.value.reset();
  getUsers();
};

const debounceUsers = debounceHandler(() => getUsers(), 1000);
const debounceReset = debounceHandler(() => resetUserSearchFilter(), 500);

onMounted(() => {
  getUserAttributes();
  getUsers();
});
</script>
