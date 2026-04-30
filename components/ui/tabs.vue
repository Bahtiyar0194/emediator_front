<template>
  <div v-if="props.showTabHeader === true" class="col-span-12">
    <div class="btn-wrap md:justify-end" role="tablist" aria-orientation="horizontal">
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
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.title }}</span>
      </button>
    </div>
  </div>
  <div class="col-span-12">
    <div class="tab-body">
      <div
        v-for="tab in props.tabs"
        :key="tab.name"
        class="tab-body-item"
        role="tabpanel"
        :id="getPanelId(tab.name)"
        :aria-labelledby="getTabId(tab.name)"
        :aria-hidden="activeTab === tab.name ? 'false' : 'true'"
        :tabindex="activeTab === tab.name ? 0 : -1"
        :class="activeTab === tab.name && 'active'"
      >
        <component
          :key="tab.name"
          v-if="tab.component"
          :is="tab.component"
          v-bind="tab.props"
        ></component>
      </div>
    </div>
  </div>
</template>

<script setup>
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

    const hasCurrentTab = props.tabs.some((tab) => tab.name === activeTab.value);
    if (!hasCurrentTab) {
      activeTab.value = getInitialActiveTab();
    }
  },
  { deep: true },
);

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
</script>
