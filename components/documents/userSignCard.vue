<template>
  <li>
    <div class="flex items-center">
      <div class="step-item xs" :class="props.signId ? 'completed' : 'warning'">
        <div class="step-icon">
          <i class="pi" :class="props.signId ? 'pi-check' : 'pi-clock'"></i>
        </div>
      </div>
      <div class="flex flex-col gap-y-0.5">
        <span class="text-inactive text-xs"> {{ props.partyTypeName }}: </span>
        <b>{{ props.partyName }}</b>

        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <div class="flex flex-col gap-y-0.5">
            <span class="text-inactive text-xs">
              {{ $t("form.iin.title") }}:
            </span>
            <b
              class="text-xs"
              >{{
                props.iin
              }}</b
            >
          </div>

          <div class="flex flex-col gap-y-0.5">
            <span class="text-inactive text-xs">
              {{ $t("pages.documents.sign.status") }}:
            </span>
            <b
              class="text-xs"
              :class="props.signId ? 'text-success' : 'text-warning'"
              >{{
                $t(
                  props.signId
                    ? "pages.documents.sign.signed"
                    : "pages.documents.sign.pending",
                )
              }}</b
            >
          </div>

          <div v-if="props.signedAt" class="flex flex-col gap-y-0.5">
            <span class="text-inactive text-xs">
              {{ $t("pages.documents.sign.at") }}:
            </span>
            <b class="text-xs">{{
              new Date(props.signedAt).toLocaleString()
            }}</b>
          </div>
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
const props = defineProps({
  partyName: {
    type: String,
    required: true,
  },
  partyTypeName: {
    type: String,
    required: true,
  },
  iin: {
    type: String,
    required: true,
  },
  signId: {
    type: String,
    required: false,
    default: null,
  },
  signedAt: {
    type: String,
    required: false,
    default: null,
  },
});
</script>
