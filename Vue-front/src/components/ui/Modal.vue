<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="space-y-5 sm:space-y-6">

      <!-- Botão + Proposta -->
      <div class="flex justify-end">
        <button
          @click="novaProposta"
          class="flex items-center gap-2 px-4 py-2 
                 bg-blue-600 text-white rounded-lg 
                 hover:bg-blue-700 transition"
        >
          <span class="material-icons text-sm">+</span>
          Proposta
        </button>
      </div>

      <!-- Card com a tabela -->
      <ComponentCard title="Basic Table 1">
        <BasicTableOne />
      </ComponentCard>

      <!-- Modal -->
      <Modal v-if="showModal" @close="showModal = false">
        <!-- Conteúdo da modal -->
        <template #title>
          Nova Proposta
        </template>

        <template #body>
          <p class="text-gray-600 dark:text-gray-300">
            Aqui entra o formulário da proposta.
          </p>
        </template>

        <template #footer>
          <button
            @click="showModal = false"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Salvar
          </button>
        </template>
      </Modal>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from "vue";

import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import BasicTableOne from "@/components/tables/basic-tables/BasicTableOne.vue";
import Modal from "@/components/ui/Modal.vue";

const currentPageTitle = ref("Basic Tables");
const showModal = ref(false);

const novaProposta = () => {
  showModal.value = true;
};
</script>
