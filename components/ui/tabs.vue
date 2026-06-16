<template>
  <div v-if="props.showTabHeader === true" class="col-span-12">
<div class="w-full flex md:justify-end">
      <div
      class="tab-header-wrap"
      role="tablist"
      aria-orientation="horizontal"
    >
      <button
        v-for="tab in props.tabs"
        :key="tab.name"
        :ref="(el) => setTabButtonRef(tab.name, el)"
        type="button"
        class="tab-header-item"
        role="tab"
        :id="getTabId(tab.name)"
        :aria-selected="activeTab === tab.name ? 'true' : 'false'"
        :aria-controls="getPanelId(tab.name)"
        :tabindex="activeTab === tab.name ? 0 : -1"
        :class="[
          { active: activeTab === tab.name },
          tab.className ? tab.className : '',
        ]"
        @click="selectTab(tab.name)"
        @keydown="handleTabKeydown($event, tab.name)"
        style="position: relative; z-index: 2; background: transparent"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.title }}</span>
      </button>

      <div class="tab-bg-slider" :style="sliderStyle"></div>
    </div>
</div>
  </div>
  <div class="col-span-12">
    <div
      class="tab-body"
      :style="{ height: currentHeight }"
      style="overflow: hidden; transition: height 0.3s ease"
    >
      <div
        class="tab-slider"
        :style="{
          transform: `translateX(-${activeIndex * 100}%)`,
          display: 'flex',
          alignItems: 'flex-start',
        }"
      >
        <div
          v-for="tab in props.tabs"
          :key="tab.name"
          :ref="(el) => setPanelRef(tab.name, el)"
          class="tab-body-item"
          style="width: 100%; flex-shrink: 0"
          role="tabpanel"
          :id="getPanelId(tab.name)"
          :aria-labelledby="getTabId(tab.name)"
        >
          <component
            v-if="tab.component"
            :is="tab.component"
            v-bind="tab.props"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from "vue";

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTabIndex: {
    type: Number,
    required: false,
    default: 0,
  },
  showTabHeader: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const instance = getCurrentInstance();
const tabsId = `tabs-${instance?.uid ?? "group"}`;
const tabButtonRefs = ref({});

const sliderWidth = ref(0);
const sliderHeight = ref(0);
const sliderLeft = ref(0);
const sliderTop = ref(0);

const panelRefs = ref({});
const currentHeight = ref("auto");
let resizeObserver = null;

const setPanelRef = (tabName, element) => {
  if (!element) {
    delete panelRefs.value[tabName];
    return;
  }
  panelRefs.value[tabName] = element;

  // Как только элемент появился в DOM, подписываем Observer на него
  if (resizeObserver) {
    resizeObserver.observe(element);
  }
};

// Функция обновления высоты
const updateHeight = () => {
  const activePanel = panelRefs.value[activeTab.value];
  if (activePanel) {
    currentHeight.value = `${activePanel.offsetHeight}px`;
  }
};

// Инициализируем Observer, который слушает изменения любых размеров
if (typeof window !== "undefined" && "ResizeObserver" in window) {
  resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      // Если изменился размер именно ТЕКУЩЕГО активного таба — обновляем высоту
      const changedTabName = Object.keys(panelRefs.value).find(
        (key) => panelRefs.value[key] === entry.target,
      );

      if (changedTabName === activeTab.value) {
        updateHeight();
      }
    }
  });
}

const updateSliderPosition = () => {
  nextTick(() => {
    const activeBtn = tabButtonRefs.value[activeTab.value];
    if (activeBtn) {
      // Считываем ВСЕ геометрические параметры кнопки
      sliderWidth.value = activeBtn.offsetWidth;
      sliderHeight.value = activeBtn.offsetHeight;
      sliderLeft.value = activeBtn.offsetLeft;
      sliderTop.value = activeBtn.offsetTop;
    }
  });
};

const getInitialActiveTab = () => {
  if (!props.tabs.length) {
    return null;
  }

  const safeIndex = Math.min(
    Math.max(Number(props.activeTabIndex) || 0, 0),
    props.tabs.length - 1,
  );

  return props.tabs[safeIndex].name;
};

const activeTab = ref(getInitialActiveTab());

watch(
  () => props.activeTabIndex,
  () => {
    activeTab.value = getInitialActiveTab();
  },
);

watch(
  () => props.tabs,
  () => {
    if (!props.tabs.length) {
      activeTab.value = null;
      return;
    }

    const hasCurrentTab = props.tabs.some(
      (tab) => tab.name === activeTab.value,
    );
    if (!hasCurrentTab) {
      activeTab.value = getInitialActiveTab();
    }
  },
  { deep: true },
);

// Если вручную переключили таб — тоже обновляем
watch(activeTab, () => {
  nextTick(() => {
    updateHeight();
  });
  updateSliderPosition();
});

const getTabId = (tabName) => `${tabsId}-tab-${tabName}`;
const getPanelId = (tabName) => `${tabsId}-panel-${tabName}`;

const setTabButtonRef = (tabName, element) => {
  if (!element) {
    delete tabButtonRefs.value[tabName];
    return;
  }

  tabButtonRefs.value[tabName] = element;
};

const selectTab = (tabName) => {
  activeTab.value = tabName;
};

const focusTabButton = (tabName) => {
  const tabButton = tabButtonRefs.value[tabName];

  if (tabButton) {
    tabButton.focus();
  }
};

const handleTabKeydown = (event, currentTabName) => {
  const tabNames = props.tabs.map((tab) => tab.name);
  const currentIndex = tabNames.indexOf(currentTabName);

  if (currentIndex === -1) {
    return;
  }

  let nextIndex = currentIndex;

  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    nextIndex = (currentIndex + 1) % tabNames.length;
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    nextIndex = (currentIndex - 1 + tabNames.length) % tabNames.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabNames.length - 1;
  } else {
    return;
  }

  event.preventDefault();

  const nextTabName = tabNames[nextIndex];
  selectTab(nextTabName);
  nextTick(() => focusTabButton(nextTabName));
};

const activeIndex = computed(() =>
  props.tabs.findIndex((tab) => tab.name === activeTab.value),
);

// Стили, которые теперь поддерживают и сдвиг вниз, и изменение высоты
const sliderStyle = computed(() => ({
  width: `${sliderWidth.value}px`,
  height: `${sliderHeight.value}px`,
  transform: `translate(${sliderLeft.value}px, ${sliderTop.value}px)`,
}));

// На случай, если табы загружаются асинхронно (например, PDF рендерится не сразу)
// Можно вызвать updateHeight() после монтирования или по кастомному событию
onMounted(() => {
  updateHeight();

  updateSliderPosition();
  if (typeof window !== "undefined") {
    window.addEventListener("resize", updateSliderPosition);
  }
});

// Не забываем очистить память при уничтожении компонента
onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }

  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateSliderPosition);
  }
});
</script>
