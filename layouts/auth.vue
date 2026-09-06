<template>
  <div class="h-screen w-full flex items-center justify-center relative">
    <div class="custom-container">
      <div class="grid grid-cols-10">
        <div class="col-span-12 lg:col-span-4 lg:col-start-4">
          <div class="card">
            <NuxtPage />
          </div>
        </div>
      </div>
    </div>
  </div>

  <modal
    :show="policyModalIsVisible"
    :onClose="() => (policyModalIsVisible = false)"
    :className="'modal-full'"
    :showLoader="false"
    :closeOnClickSelf="true"
  >
    <template v-slot:header_content>
      <h3>{{ $t("pages.privacy-policy.title") }}</h3>
    </template>
    <template v-slot:body_content>
      <content />
    </template>
  </modal>
</template>

<script setup>
import modal from '../components/ui/modal.vue';
import content from '../components/privacy-policy/content.vue';

const policyModalIsVisible = ref(false);

const openPolicyModal = () => {
  policyModalIsVisible.value = true;
};

provide("openPolicyModal", openPolicyModal);
</script>
