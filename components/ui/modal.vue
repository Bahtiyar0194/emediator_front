<template>
  <div
    class="modal-backdrop"
    :class="isVisible && 'show'"
    @click.self="props.closeOnClickSelf && closeModal()"
  >
    <div
      ref="modalDialog"
      class="modal"
      :class="props.className"
      tabindex="-1"
      role="dialog"
      :aria-modal="isVisible ? 'true' : 'false'"
      :aria-labelledby="hasHeaderContent ? dialogTitleId : undefined"
      :aria-label="hasHeaderContent ? undefined : props.ariaLabel"
      :aria-busy="props.showLoader ? 'true' : 'false'"
      @keydown="handleDialogKeydown"
    >
      <loader
        v-if="props.showLoader"
        :className="
          props.loaderOpacityFull === true ? 'overlay opacity-full' : 'overlay'
        "
        :showPendingText="props.showPendingText"
        :pendingText="props.pendingText"
        :progress="props.progress"
      />
      <div class="modal-header">
        <div v-if="hasHeaderContent" :id="dialogTitleId">
          <slot name="header_content" />
        </div>
        <button
          type="button"
          :title="$t('close')"
          :aria-label="$t('close')"
          @click="closeModal"
          class="modal-close-button"
        >
          <i class="bi bi-x"></i>
        </button>
      </div>
      <div class="modal-body">
        <slot name="body_content" />
      </div>
    </div>
  </div>
</template>

<script setup>
import loader from "./loader.vue";

const slots = useSlots();
const instance = getCurrentInstance();
const dialogTitleId = `modal-title-${instance?.uid ?? "dialog"}`;
const modalDialog = ref(null);
const isVisible = ref(false);
const lastFocusedElement = ref(null);
const previousBodyOverflow = ref("");

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  className: {
    type: String,
    required: false,
  },
  showLoader: {
    type: Boolean,
    required: false,
  },
  loaderOpacityFull: {
    type: Boolean,
    required: false,
  },
  onClose: {
    type: Function,
    required: true,
  },
  closeOnClickSelf: {
    type: Boolean,
    required: true,
  },
  showPendingText: {
    type: Boolean,
    required: false,
    default: false,
  },
  pendingText: {
    type: String,
    required: false,
    default: "",
  },
  progress: {
    type: Number,
    required: false,
  },
  ariaLabel: {
    type: String,
    required: false,
    default: "Dialog",
  },
});

const hasHeaderContent = computed(() => Boolean(slots.header_content));

const getFocusableElements = () => {
  if (!modalDialog.value) {
    return [];
  }

  return Array.from(
    modalDialog.value.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("hidden"));
};

const focusModal = () => {
  const focusableElements = getFocusableElements();
  const firstFocusableElement = focusableElements.find(
    (element) => !element.classList.contains("modal-close-button"),
  );

  if (firstFocusableElement) {
    firstFocusableElement.focus();
    return;
  }

  modalDialog.value?.focus();
};

const restoreFocus = () => {
  if (lastFocusedElement.value && typeof lastFocusedElement.value.focus === "function") {
    lastFocusedElement.value.focus();
  }
};

const syncBodyScrollLock = (shouldLock) => {
  if (typeof document === "undefined") {
    return;
  }

  if (shouldLock) {
    previousBodyOverflow.value = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return;
  }

  document.body.style.overflow = previousBodyOverflow.value;
};

const openModal = async () => {
  if (typeof document !== "undefined") {
    lastFocusedElement.value = document.activeElement;
  }

  isVisible.value = true;
  syncBodyScrollLock(true);

  await nextTick();
  focusModal();
};

const closeModal = () => {
  isVisible.value = false;
  syncBodyScrollLock(false);
  restoreFocus();

  if (props.onClose) {
    props.onClose();
  }
};

const handleDialogKeydown = (event) => {
  if (!isVisible.value) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getFocusableElements();

  if (!focusableElements.length) {
    event.preventDefault();
    modalDialog.value?.focus();
    return;
  }

  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && activeElement === firstFocusableElement) {
    event.preventDefault();
    lastFocusableElement.focus();
    return;
  }

  if (!event.shiftKey && activeElement === lastFocusableElement) {
    event.preventDefault();
    firstFocusableElement.focus();
  }
};

watch(
  () => props.show,
  async (newVal) => {
    if (newVal) {
      await openModal();
      return;
    }

    isVisible.value = false;
    syncBodyScrollLock(false);
    restoreFocus();
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  syncBodyScrollLock(false);
});
</script>
