<template>
  <ClientOnly>
    <VuePdfEmbed :source="props.src" />
  </ClientOnly>
</template>

<script setup>
import { defineAsyncComponent } from "vue";

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
});

const VuePdfEmbed = defineAsyncComponent(() => import("vue-pdf-embed"));
</script>
