<template>
  <div v-if="previewDocument" class="col-span-12">
    <div v-html="previewDocument"></div>
  </div>
</template>

<script setup>
const previewDocument = inject("previewDocument", ref([]));
</script>
