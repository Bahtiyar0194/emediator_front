<template>
  <client-only>
    <div class="col-span-12">
      <!-- Контентный редактор -->
      <editor-content :editor="editor" v-if="editor" />
    </div>
  </client-only>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
const { t } = useI18n();
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align"; // Подключаем выравнивание
import { TextStyle } from "@tiptap/extension-text-style";
import { FontSize } from "../../utils/fontSize";
import { fontSizes } from "../../utils/fontSizes";
import Underline from "@tiptap/extension-underline";

// Импортируем расширения таблиц
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

// Внедряем контекст из самого верхнего родителя
const editorContext = inject("activeEditorContext", null);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    Underline,
    FontSize,
    Table.configure({
      resizable: true, // Позволит пользователю менять ширину колонок мышкой
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },

  // При фокусе записываем ЭТОТ инстанс редактора в общую панель
  onFocus: ({ editor }) => {
    if (editorContext) {
      editorContext.setActiveEditor(editor);
    }
  },
});

watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && val !== editor.value.getHTML()) {
      editor.value.commands.setContent(val || "");
    }
  },
);

onBeforeUnmount(() => {
  // Если уничтожается активный в данный момент редактор — очищаем панель
  if (editorContext && editorContext.activeEditor.value === editor.value) {
    editorContext.setActiveEditor(null);
  }

  editor.value?.destroy();
});
</script>
