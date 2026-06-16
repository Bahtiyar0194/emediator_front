<template>
  <li class="!border-none" :ref="(el) => setItemRef(el, node.point_id)">
    <div
      class="transition-all duration-300 rounded-xl"
      :class="{
        highlight: highlightedId === node.point_id,
        removing: removingId === node.point_id,
      }"
    >
      <!-- HEADER -->
      <div class="p-3 bg-inactive rounded-t-xl border-inactive !border-b-0">
        <div class="flex justify-between items-center">
          <b>{{ $t("pages.documents.point.title") }} {{ label }}</b>

          <dropdownMenu :dropdownArrow="false" position="right">
            <template #btn_content>
              <button type="button" class="btn btn-square btn-light btn-sm">
                <i class="pi pi-ellipsis-v"></i>
              </button>
            </template>

            <template #menu_content>
              <li>
                <button type="button" @click="addPoint(parentList, index)">
                  <i class="pi pi-plus"></i>
                  {{ $t("pages.documents.point.add") }}
                </button>
              </li>

              <li>
                <button type="button" @click="addSubPoint(node)">
                  <i class="pi pi-plus"></i>
                  {{ $t("pages.documents.point.sub.add") }}
                </button>
              </li>

              <li v-if="index > 0">
                <button type="button" @click="order('up', parentList, index)">
                  <i class="pi pi-arrow-up"></i> {{ $t("move_up") }}
                </button>
              </li>

              <li v-if="index + 1 < parentList.length">
                <button type="button" @click="order('down', parentList, index)">
                  <i class="pi pi-arrow-down"></i> {{ $t("move_down") }}
                </button>
              </li>

              <li v-if="parentList.length > 1 || props.path.length > 1">
                <button
                  type="button"
                  class="!text-red-500"
                  @click="removePoint(parentList, index)"
                >
                  <i class="pi pi-trash"></i> {{ $t("delete") }}
                </button>
              </li>
            </template>
          </dropdownMenu>
        </div>
      </div>

      <!-- EDITOR -->
      <div class="p-3 border-inactive rounded-b-xl">
        <div class="custom-grid">
          <textEditor
            :modelValue="node.content"
            @update:modelValue="(val) => updatePoint(node.point_id, val)"
          />
          <div class="col-span-12" v-if="node.children?.length">
            <TransitionGroup
              tag="ul"
              class="list-group nowrap"
              :move="{ transition: { duration: 0.3 } }"
            >
              <PointItem
                v-for="(child, i) in node.children"
                :key="child.point_id"
                :node="child"
                :index="i"
                :parentList="node.children"
                :path="[...path, i]"
              />
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import dropdownMenu from "../ui/dropdownMenu.vue";
import textEditor from "../ui/textEditor.vue";

defineOptions({ name: "PointItem" });

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  parentList: {
    type: Array,
    required: true,
  },
  path: {
    type: Array,
    required: true,
  },
});

const itemRefs = inject("itemRefs");

const setItemRef = (el, id) => {
  if (el) itemRefs.value[id] = el;
};

const highlightedId = ref(null);
const removingId = ref(null);

const updatePoint = (id, value) => {
  const item = props.parentList.find((p) => p.point_id === id);
  if (item) {
    item.content = value;
  }
};

// label типа 1.2.3
const label = computed(() => props.path.map((i) => i + 1).join("."));

// ===== ACTIONS =====

const addPoint = (list, index) => {
  const newItem = {
    point_id: Date.now(),
    content: "",
    children: [],
  };

  list.splice(index + 1, 0, newItem);

  highlightedId.value = newItem.point_id;

  nextTick(() => {
    const el = itemRefs.value[newItem.point_id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  setTimeout(() => {
    highlightedId.value = null;
  }, 1000);
};

const addSubPoint = (node) => {
  if (!node.children) node.children = [];

  node.children.push({
    point_id: Date.now(),
    content: "",
    children: [],
  });
};

const removePoint = (list, index) => {
  const item = list[index];
  if (!item) return;

  // подсвечиваем удаляемый элемент
  highlightedId.value = item.point_id;

  // можно сразу добавить класс "removing"
  removingId.value = item.point_id;

  setTimeout(() => {
    list.splice(index, 1);

    // очищаем состояния
    highlightedId.value = null;
    removingId.value = null;
  }, 1000); // время должно совпадать с CSS-анимацией
};

const order = (dir, list, index) => {
  if (dir === "up" && index > 0) {
    [list[index - 1], list[index]] = [list[index], list[index - 1]];
    highlightedId.value = list[index - 1].point_id;
  }

  if (dir === "down" && index < list.length - 1) {
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    highlightedId.value = list[index + 1].point_id;
  }

  nextTick(() => {
    const movedItem = list.find((p) => p.point_id === highlightedId.value);
    setTimeout(() => {
      const el = itemRefs.value[movedItem.point_id];
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  });

  setTimeout(() => {
    highlightedId.value = null;
  }, 1000);
};

onUnmounted(() => {
  delete itemRefs.value[props.node.point_id];
});
</script>
