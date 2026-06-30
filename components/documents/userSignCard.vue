<template>
  <li>
    <div class="flex">
      <div
        class="step-item xs"
        :class="props.party.sigex_sign_id ? 'completed' : 'warning'"
      >
        <div class="step-icon">
          <i
            class="pi"
            :class="props.party.sigex_sign_id ? 'pi-check' : 'pi-clock'"
          ></i>
        </div>
      </div>
      <div class="flex flex-col gap-y-1 w-full">
        <template v-if="isAttorneyIncludes">
          <span class="text-inactive text-xs">
            {{
              props.party.is_mediator === 1
                ? $t("pages.documents.mediator.title")
                : $t("pages.documents.party_" + (props.partyIndex + 1))
            }}:
          </span>

          <b>{{
            `${props.party.last_name || ""} ${props.party.first_name || ""} ${props.party.given_name || ""}`.trim()
          }}</b>

          <div class="flex flex-wrap gap-1">
            <span class="text-inactive text-xs">
              {{ $t("form.iin.title") }}:
            </span>
            <b class="text-xs">{{ props.party.iin }}</b>
          </div>

          <hr class="!my-0.5">
        </template>
        <span class="text-inactive text-xs">
          {{
            props.party.is_mediator === 1
              ? $t("pages.documents.mediator.title")
              : isAttorneyIncludes ? $t("form.attorney.representative") : $t("pages.documents.party_" + (props.partyIndex + 1))
          }}:
        </span>
        <b>{{ displayFullName }}</b>

        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <div class="flex flex-wrap gap-1">
            <span class="text-inactive text-xs">
              {{ $t("form.iin.title") }}:
            </span>
            <b class="text-xs">{{ displayIin }}</b>
          </div>

          <div class="flex gap-1">
            <span class="text-inactive text-xs">
              {{ $t("pages.documents.sign.status") }}:
            </span>
            <b
              class="text-xs"
              :class="
                props.party.sigex_sign_id ? 'text-success' : 'text-warning'
              "
              >{{
                $t(
                  props.party.sigex_sign_id
                    ? "pages.documents.sign.signed"
                    : "pages.documents.sign.pending",
                )
              }}</b
            >
          </div>

          <div v-if="props.party.signed_at" class="flex gap-1">
            <span class="text-inactive text-xs">
              {{ $t("pages.documents.sign.at") }}:
            </span>
            <b class="text-xs">{{
              new Date(props.party.signed_at).toLocaleString()
            }}</b>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  party: {
    type: Object,
    required: true,
  },
  partyIndex: {
    type: Number,
    required: true,
  },
});

// Проверка: идет ли подписание по доверенности
const isAttorneyIncludes = computed(() => {
  return props.party.data?.attorney?.includes === true;
});

// Определяем, откуда брать данные: из корня или из person в доверенности
const activePerson = computed(() => {
  if (isAttorneyIncludes.value && props.party.data?.attorney?.person) {
    return props.party.data.attorney.person;
  }
  return props.party;
});

// Вычисляемое ФИО
const displayFullName = computed(() => {
  const p = activePerson.value;
  return `${p.last_name || ""} ${p.first_name || ""} ${p.given_name || ""}`.trim();
});

// Вычисляемый ИИН
const displayIin = computed(() => {
  return activePerson.value?.iin || "—";
});
</script>
