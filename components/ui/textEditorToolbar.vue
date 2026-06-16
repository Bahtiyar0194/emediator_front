<template>
  <stickyBox v-if="getEditor()" :offsetTop="20">
    <div class="bg-active border-inactive p-3 mb-4 rounded-xl px-4">
      <p class="select-none">
        <b>{{ $t("text.editor") }}</b>
      </p>
      <div class="flex flex-wrap gap-x-1 gap-y-3 items-center">
        <button
          type="button"
          @click="toggleBold"
          class="btn btn-square btn-sm"
          :class="isBoldActive ? 'btn-primary' : 'btn-light'"
          :title="$t('text.bold')"
        >
          <i class="bi bi-type-bold"></i>
        </button>
        <button
          type="button"
          @click="toggleItalic"
          class="btn btn-square btn-sm"
          :class="isItalicActive ? 'btn-primary' : 'btn-light'"
          :title="$t('text.italic')"
        >
          <i class="bi bi-type-italic"></i>
        </button>
        <button
          type="button"
          @click="toggleUnderline"
          class="btn btn-square btn-sm"
          :class="isUnderlineActive ? 'btn-primary' : 'btn-light'"
          :title="$t('text.underline')"
        >
          <i class="bi bi-type-underline"></i>
        </button>
        <button
          type="button"
          @click="toggleStrike"
          class="btn btn-square btn-sm"
          :class="isStrikeActive ? 'btn-primary' : 'btn-light'"
          :title="$t('text.strikethrough')"
        >
          <i class="bi bi-type-strikethrough"></i>
        </button>

        <button
          type="button"
          @click="setAlign('left')"
          class="btn btn-square btn-sm btn-light"
          :title="$t('text.text_left')"
        >
          <i class="bi bi-text-left"></i>
        </button>
        <button
          type="button"
          @click="setAlign('center')"
          class="btn btn-square btn-sm btn-light"
          :title="$t('text.text_center')"
        >
          <i class="bi bi-text-center"></i>
        </button>
        <button
          type="button"
          @click="setAlign('right')"
          class="btn btn-square btn-sm btn-light"
          :title="$t('text.text_right')"
        >
          <i class="bi bi-text-right"></i>
        </button>

        <dropdownMenu :dropdownArrow="false" position="left">
          <template #btn_content>
            <button type="button" class="btn btn-light btn-sm">
              <i class="pi pi-table"></i>
              {{
                getEditor().isActive("table")
                  ? $t("table.work")
                  : $t("table.title")
              }}
            </button>
          </template>

          <template #menu_content>
            <template v-if="getEditor().isActive('table')">
              <li>
                <button
                  type="button"
                  @click="getEditor().chain().focus().addColumnAfter().run()"
                >
                  <i class="pi pi-bars rotate-90"></i>
                  {{ $t("table.columns.add") }}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  @click="getEditor().chain().focus().addRowAfter().run()"
                >
                  <i class="pi pi-bars"></i>
                  {{ $t("table.rows.add") }}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  @click="getEditor().chain().focus().mergeCells().run()"
                >
                  <i class="pi pi-window-maximize"></i>
                  {{ $t("table.merge") }}
                </button>
              </li>

              <li>
                <button
                  type="button"
                  class="!text-red-500"
                  @click="openDeleteTableModal()"
                >
                  <i class="pi pi-trash"></i>
                  {{ $t("table.delete.title") }}
                </button>
              </li>
            </template>
            <li v-else>
              <button type="button" @click="openTableModal()">
                <i class="pi pi-plus"></i>
                {{ $t("table.add") }}
              </button>
            </li>
          </template>
        </dropdownMenu>

        <!-- <button
        type="button"
        @click="toggleHeading"
        class="btn btn-square btn-sm"
        :class="isHeadingActive ? 'btn-primary' : 'btn-light'"
        :title="$t('text.title')"
      >
        <i class="bi bi-type-h2"></i>
      </button>
      <button
        type="button"
        @click="toggleBulletList"
        class="btn btn-square btn-sm"
        :class="isBulletListActive ? 'btn-primary' : 'btn-light'"
        :title="$t('text.li')"
      >
        <i class="bi bi-list-ul"></i>
      </button>
      <button
        type="button"
        @click="toggleOrderedList"
        class="btn btn-square btn-sm"
        :class="isOrderedListActive ? 'btn-primary' : 'btn-light'"
        :title="$t('text.ol')"
      >
        <i class="bi bi-list-ol"></i>
      </button> 
      
      <div class="per-page-select active" :class="'bg_active'">
        <select @change="setFontSize($event.target.value)">
          <option
            v-for="fontSize in fontSizes"
            :key="fontSize"
            :value="`${fontSize}px`"
          >
            {{ fontSize + "px" }}
          </option>
        </select>
        <label>{{ $t("board.font_size") }}</label>
      </div>-->
      </div>
    </div>
  </stickyBox>
</template>
<script setup>
import stickyBox from "./stickyBox.vue";
import dropdownMenu from "./dropdownMenu.vue";

const openTableModal = inject("openTableModal");
const openDeleteTableModal = inject("openDeleteTableModal");

// Забираем контекст активного редактора, созданный на странице
const context = inject("activeEditorContext", null);

// Сокращение для удобства чтения кода функций
const getEditor = () => context?.activeEditor.value;

// ===== ФУНКЦИИ ДЛЯ КНОПОК (работают через actctiveEditor) =====
const toggleBold = () => getEditor()?.chain().focus().toggleBold().run();
const toggleItalic = () => getEditor()?.chain().focus().toggleItalic().run();
const toggleUnderline = () =>
  getEditor()?.chain().focus().toggleUnderline().run();
const toggleStrike = () => getEditor()?.chain().focus().toggleStrike().run();

const toggleHeading = () =>
  getEditor()?.chain().focus().toggleHeading({ level: 2 }).run();
const toggleBulletList = () =>
  getEditor()?.chain().focus().toggleBulletList().run();
const toggleOrderedList = () =>
  getEditor()?.chain().focus().toggleOrderedList().run();
const setFontSize = (size) =>
  getEditor()?.chain().focus().setFontSize(size).run();
const setAlign = (align) =>
  getEditor()?.chain().focus().setTextAlign(align).run();

// ===== ВЫЧИСЛЯЕМЫЕ СВОЙСТВА АКТИВНОСТИ (computed) =====
const isBoldActive = computed(() => getEditor()?.isActive("bold"));
const isItalicActive = computed(() => getEditor()?.isActive("italic"));
const isUnderlineActive = computed(() => getEditor()?.isActive("underline"));
const isStrikeActive = computed(() => getEditor()?.isActive("strike"));
const isHeadingActive = computed(() =>
  getEditor()?.isActive("heading", { level: 2 }),
);
const isBulletListActive = computed(() => getEditor()?.isActive("bulletList"));
const isOrderedListActive = computed(() =>
  getEditor()?.isActive("orderedList"),
);
</script>
