<template>
  <div class="custom-grid mt-6">
    <div class="col-span-12">
      <div class="form-group-border active">
        <i class="pi pi-bars rotate-90"></i>
        <input v-model="columnsCount" type="number" placeholder=" " />
        <label
          :class="{
            'label-error': errors.columns,
          }"
        >
          {{
            errors.columns
              ? $t("table.columns.required")
              : $t("table.columns.count")
          }}
        </label>
      </div>
    </div>
    <div class="col-span-12">
      <div class="form-group-border active">
        <i class="pi pi-bars"></i>
        <input v-model="rowsCount" type="number" placeholder=" " />
        <label
          :class="{
            'label-error': errors.rows,
          }"
        >
          {{ errors.rows ? $t("table.rows.required") : $t("table.rows.count") }}
        </label>
      </div>
    </div>
    <div class="col-span-12">
      <label class="custom-radio-checkbox text-nowrap">
        <input type="checkbox" v-model="withHeader" />
        <span>{{ $t("table.has_header") }}</span>
      </label>
    </div>

    <div class="col-span-12">
      <button type="button" class="btn btn-primary" @click="addCustomTable()">
        <i class="pi pi-arrow-right"></i>
        {{ $t("continue") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";

const closeTableModal = inject("closeTableModal");

const errors = ref({
  columns: false,
  rows: false,
});

const columnsCount = ref("");
const rowsCount = ref("");
const withHeader = ref(true);

// Забираем контекст активного редактора
const context = inject("activeEditorContext", null);
const getEditor = () => context?.activeEditor.value;

const addCustomTable = () => {
  const editor = getEditor();
  if (!editor) return; // Если редактор не в фокусе, ничего не делаем

  // 1. Сброс предыдущих ошибок
  errors.value.columns = false;
  errors.value.rows = false;

  // 2. Валидация (переводим строки в числа)
  const cols = parseInt(columnsCount.value, 10);
  const rows = parseInt(rowsCount.value, 10);

  if (!cols || cols < 1) {
    errors.value.columns = true;
  }
  if (!rows || rows < 1) {
    errors.value.rows = true;
  }

  // Если есть ошибки — останавливаем выполнение
  if (errors.value.columns || errors.value.rows) {
    return;
  }

  // 3. Генерация чистой HTML-структуры таблицы без лишних пробелов форматирования
  let tableHtml = "<table>";

  // Если нужен заголовок (Header Row)
  if (withHeader.value) {
    tableHtml += "<thead><tr>";
    for (let c = 0; c < cols; c++) {
      tableHtml += "<th><p>&nbsp;</p></th>"; // <br> или пустой <p> нужен для фокуса внутри ячейки
    }
    tableHtml += "</tr></thead>";
  }

  // Генерация тела таблицы
  tableHtml += "<tbody>";
  for (let r = 0; r < rows; r++) {
    tableHtml += "<tr>";
    for (let c = 0; c < cols; c++) {
      tableHtml += "<td><p>&nbsp;</p></td>";
    }
    tableHtml += "</tr>";
  }
  tableHtml += "</tbody></table>";

  // 4. Вставка сгенерированной таблицы в активный TipTap
  editor.chain().focus().insertContent(tableHtml).run();

  // 5. Очистка полей формы после успешного добавления
  columnsCount.value = "";
  rowsCount.value = "";
  closeTableModal();
};
</script>
