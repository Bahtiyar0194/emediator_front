<template>
  <div class="custom-grid mt-6">
    <div class="col-span-12">
      <div class="flex flex-col gap-y-4 mb-4">
        <label
          v-for="format in paymentFormats"
          :key="format"
          class="custom-radio"
        >
          <input type="radio" :value="format" v-model="paymentFormat" />
          <span>{{
            $t(
              "pages.documents.attributes.rent.payment_format." +
                format +
                ".title",
            )
          }}</span>
        </label>
      </div>
    </div>

    <div class="col-span-12">
      <div class="form-group-border active">
        <i class="pi pi-calendar"></i>
        <input v-model="startDate" type="date" placeholder=" " />
        <label
          :class="{
            'label-error': errors.start_date,
          }"
        >
          {{
            errors.start_date
              ? $t("pages.documents.start_payment_date.required")
              : $t("pages.documents.start_payment_date.title")
          }}
        </label>
      </div>
    </div>

    <client-only>
      <div class="col-span-12">
        <div class="form-group-border active">
          <i class="pi pi-money-bill"></i>
          <input v-model="formattedValue" v-digits-only placeholder=" " />
          <label
            :class="{
              'label-error': errors.payment_amount,
            }"
          >
            {{
              errors.payment_amount
                ? $t("pages.documents." + paymentFormat + ".amount.required")
                : $t("pages.documents." + paymentFormat + ".amount.title")
            }}
          </label>
        </div>
      </div>
    </client-only>

    <div class="col-span-12">
      <div class="form-group-border active">
        <i class="pi pi-list"></i>
        <input v-model="paymentsCount" type="number" placeholder=" " />
        <label
          :class="{
            'label-error': errors.payments_count,
          }"
        >
          {{
            errors.payments_count
              ? $t("pages.documents." + paymentFormat + ".count.required")
              : $t("pages.documents." + paymentFormat + ".count.title")
          }}
        </label>
      </div>
    </div>

    <div class="col-span-12">
      <button
        type="button"
        class="btn btn-primary"
        @click="insertAmortizationSchedule()"
      >
        <i class="pi pi-arrow-right"></i>
        {{ $t("continue") }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";
import { useFormattedAmount } from "../../composables/useFormattedAmount";

const closeTableModal = inject("closeTableModal");

const errors = ref({
  start_date: false,
  payment_amount: false,
  payments_count: false,
});

const paymentFormats = ["monthly", "daily"];
const paymentFormat = ref(paymentFormats[0]);
const startDate = ref("");
const paymentsCount = ref("");

// Просто вызываем хук. Можно передать дефолтное значение, например "50000"
const { rawValue: paymentAmount, formattedValue } = useFormattedAmount("");

// Забираем контекст активного редактора
const context = inject("activeEditorContext", null);
const getEditor = () => context?.activeEditor.value;

const insertAmortizationSchedule = () => {
  const editor = getEditor();

  if (!editor) return; // Если нет активного редактора, прерываем

  // 1. Сброс старых ошибок
  errors.value.start_date = false;
  errors.value.payment_amount = false;
  errors.value.payments_count = false;

  // 2. Валидация полей
  const amount = parseFloat(paymentAmount.value);
  const count = parseInt(paymentsCount.value, 10);

  if (!startDate.value) {
    errors.value.start_date = true;
  }

  if (!amount || amount <= 0) {
    errors.value.payment_amount = true;
  }
  if (!count || count <= 0) {
    errors.value.payments_count = true;
  }

  // Если есть хоть одна ошибка, останавливаем генерацию
  if (
    errors.value.start_date ||
    errors.value.payment_amount ||
    errors.value.payments_count
  ) {
    return;
  }

  const formattedPayment = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const formattedTotalPayment = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount * count);

  // 4. Сборка шапки таблицы
  let tableHtml =
    "<table><thead><tr>" +
    "<th><p>№</p></th>" +
    "<th><p>Дата платежа</p></th>" +
    "<th><p>Сумма платежа</p></th>" +
    "</tr></thead><tbody>";

  // Базовая дата начала
  const baseDate = new Date(startDate.value);

  // 5. Цикл генерации строк
  for (let i = 1; i <= count; i++) {
    const paymentDate = new Date(baseDate);

    // В зависимости от выбранного формата прибавляем либо месяцы, либо дни
    if (paymentFormat.value === "monthly") {
      paymentDate.setMonth(baseDate.getMonth() + (i - 1));
    } else if (paymentFormat.value === "daily") {
      paymentDate.setDate(baseDate.getDate() + (i - 1));
    }

    const formattedDate = paymentDate.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    tableHtml += `<tr><td><p>${i}</p></td><td><p>${formattedDate}</p></td><td><p>${formattedPayment}</p></td></tr>`;
  }

  // Добавляем финальную строку: первые две колонки объединены под "Итого"
  tableHtml += `<tr><td colspan="2" style="text-align: right;"><p><b>Итого:</b></p></td><td><p><b>${formattedTotalPayment}</b></p></td></tr>`;

  tableHtml += "</tbody></table>";

  // 6. Вставка таблицы в редактор
  editor.chain().focus().insertContent(tableHtml).run();

  // 7. Очистка полей после успешной вставки
  startDate.value = "";
  paymentAmount.value = "";
  paymentsCount.value = "";

  // 8. Закрываем модалку (если у вас используется этот инжект)
  if (closeTableModal) {
    closeTableModal();
  }
};
</script>
