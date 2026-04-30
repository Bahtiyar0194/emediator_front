<template>
  <div :class="props.className" ref="selectWrapper">
    <i :class="props.icon"></i>
    <input
      ref="triggerInput"
      class="!cursor-pointer"
      :id="triggerId"
      :value="selectionText"
      readonly
      role="combobox"
      aria-autocomplete="none"
      :aria-expanded="selectMenuOpen ? 'true' : 'false'"
      :aria-controls="listboxId"
      aria-haspopup="listbox"
      :aria-labelledby="labelId"
      @click="toggleSelect"
      @keydown.down.prevent="openSelect(true)"
      @keydown.enter.prevent="toggleSelect"
      @keydown.space.prevent="toggleSelect"
      @keydown.esc.prevent="closeSelect"
    />

    <button
      :class="checkedCount > 0 ? 'block' : 'hidden'"
      type="button"
      @click="resetAllCheckboxes"
      class="clear mr-5 -mt-1"
      :aria-label="$t('clear')"
    >
      <i class="pi pi-times text-xs text-danger"></i>
    </button>

    <div
      v-if="props.items && props.items.length > 0"
      class="multiple-select-menu-wrap"
      :class="{ show: selectMenuOpen === true }"
      ref="selectMenu"
      :id="menuId"
      :aria-labelledby="labelId"
    >
      <div class="form-group-border mt-4 active label-active w-full">
        <i class="pi pi-search"></i>
        <input
          ref="searchInput"
          v-model="searchTerm"
          type="text"
          placeholder=" "
          :aria-label="$t('search')"
          @keydown.esc.prevent="closeSelect"
        />
        <label>
          {{ $t("search") }}
        </label>
        <button
          :class="searchTerm != '' ? 'block' : 'hidden'"
          type="button"
          @click="clearSearch"
          class="clear -mt-1"
          :aria-label="$t('clear')"
        >
          <i class="pi pi-times text-xs text-danger"></i>
        </button>
      </div>

      <p v-if="filteredItems?.length === 0" class="text-inactive mt-2">
        {{ $t("nothing_was_found_for_your_query") }}
      </p>

      <ul
        class="multiple-select-menu"
        :id="listboxId"
        role="listbox"
        aria-multiselectable="true"
        :aria-labelledby="labelId"
      >
        <li
          v-for="(item, index) in filteredItems"
          :key="index"
          role="option"
          :id="getOptionId(index)"
          :aria-selected="isCheckboxChecked(item[props.optionValue]) ? 'true' : 'false'"
        >
          <label
            class="custom-radio-checkbox w-full whitespace-nowrap"
            :class="props.avatar && 'avatar'"
          >
            <input
              type="checkbox"
              :name="props.optionName"
              :value="item[props.optionValue]"
              @change="handleCheckboxChange"
            />
            <span v-if="!props.avatar">{{ item[props.optionLabel] }}</span>
            <span v-else>
              <div class="flex gap-x-1 items-center">
                <userAvatar
                  :padding="0.5"
                  :className="'w-5 h-5 text-[10px]'"
                  :user="item"
                  :isChecked="isCheckboxChecked(item[props.optionValue])"
                />
                {{ item[props.optionLabel] }}
              </div>
            </span>
          </label>
        </li>
      </ul>
    </div>
    <label :id="labelId" :for="triggerId">{{ props.label }}</label>
  </div>
</template>

<script setup>
import userAvatar from "./userAvatar.vue";

const instance = getCurrentInstance();
const selectId = `multiple-select-${instance?.uid ?? "field"}`;
const triggerId = `${selectId}-trigger`;
const labelId = `${selectId}-label`;
const menuId = `${selectId}-menu`;
const listboxId = `${selectId}-listbox`;

const selectWrapper = ref(null);
const selectMenu = ref(null);
const triggerInput = ref(null);
const searchInput = ref(null);
const selectMenuOpen = ref(false);
const checkedCount = ref(0);
const searchTerm = ref("");

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    required: false,
  },
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  optionName: {
    type: String,
    required: true,
  },
  optionValue: {
    type: String,
    required: true,
  },
  optionLabel: {
    type: String,
    required: true,
  },
  avatar: {
    type: Boolean,
    required: false,
  },
  onChange: {
    type: Function,
    required: true,
  },
});

const { t } = useI18n();

const selectionText = computed(() => {
  if (checkedCount.value > 0) {
    return `${t("selected")}: ${checkedCount.value}`;
  }

  return t("not_selected");
});

const filteredItems = computed(() => {
  if (!searchTerm.value) {
    return props.items;
  }

  return props.items.filter((item) =>
    item[props.optionLabel]
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase()),
  );
});

const getOptionId = (index) => `${selectId}-option-${index}`;

const syncCheckedCount = () => {
  if (!selectMenu.value) {
    checkedCount.value = 0;
    return;
  }

  const allCheckboxes = selectMenu.value.querySelectorAll('input[type="checkbox"]');
  const checkedCheckboxes = Array.from(allCheckboxes).filter(
    (checkbox) => checkbox.checked,
  );

  checkedCount.value = checkedCheckboxes.length;
};

const isCheckboxChecked = (value) => {
  const checkbox = selectMenu.value?.querySelector(
    `input[type="checkbox"][value="${value}"]`,
  );

  return checkbox ? checkbox.checked : false;
};

const openSelect = async (focusSearch = false) => {
  selectMenuOpen.value = true;

  if (focusSearch) {
    await nextTick();
    searchInput.value?.focus();
  }
};

const closeSelect = (restoreFocus = true) => {
  selectMenuOpen.value = false;

  if (restoreFocus) {
    nextTick(() => triggerInput.value?.focus());
  }
};

const toggleSelect = async () => {
  if (selectMenuOpen.value) {
    closeSelect(false);
    return;
  }

  await openSelect();
};

const clearSearch = () => {
  searchTerm.value = "";
  nextTick(() => searchInput.value?.focus());
};

const handleCheckboxChange = (event) => {
  const target = event.target;

  if (target && target.matches('input[type="checkbox"]')) {
    syncCheckedCount();
    props.onChange();
  }
};

const resetAllCheckboxes = () => {
  const allCheckboxes = selectMenu.value?.querySelectorAll('input[type="checkbox"]');

  allCheckboxes?.forEach((checkbox) => {
    checkbox.checked = false;
  });

  syncCheckedCount();
  props.onChange();
  closeSelect();
};

const handleClickOutside = (event) => {
  if (selectWrapper.value && !selectWrapper.value.contains(event.target)) {
    closeSelect(false);
  }
};

const handleFormReset = () => {
  checkedCount.value = 0;
  searchTerm.value = "";
  closeSelect(false);
};

const handleKeyPress = (event) => {
  if (event.key === "Escape" && selectMenuOpen.value) {
    closeSelect();
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  window.addEventListener("keydown", handleKeyPress);

  if (selectMenu.value) {
    selectMenu.value.addEventListener("change", handleCheckboxChange);
  }

  const formElement = selectWrapper.value?.closest("form");
  if (formElement) {
    formElement.addEventListener("reset", handleFormReset);
  }

  syncCheckedCount();
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
  window.removeEventListener("keydown", handleKeyPress);

  if (selectMenu.value) {
    selectMenu.value.removeEventListener("change", handleCheckboxChange);
  }

  const formElement = selectWrapper.value?.closest("form");
  if (formElement) {
    formElement.removeEventListener("reset", handleFormReset);
  }
});
</script>
