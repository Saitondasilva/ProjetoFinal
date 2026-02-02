<template>
  <div class="space-y-6">

    <!-- Título -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Título
      </label>
      <input
        type="text"
        v-model="formData.titulo"
        placeholder="Digite o título da proposta"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      />
    </div>

    <!-- Descrição -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Descrição
      </label>
      <textarea
        v-model="formData.descricao"
        placeholder="Digite a descrição da proposta"
        class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      ></textarea>
    </div>

    <!-- Estado -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Estado
      </label>
      <select
        v-model="formData.estado"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      >
        <option value="ativa">Ativa</option>
        <option value="arquivada">Arquivada</option>
        <option value="concluida">Concluída</option>
      </select>
    </div>

    <!-- Palavras-chave -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Palavras-chave (separadas por vírgula)
      </label>
      <input
        type="text"
        v-model="formData.palavras_chave"
        placeholder="Ex: Vue, Node, MongoDB"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      />
    </div>

    <!-- Orientadores (select múltiplo) -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Orientadores
      </label>
      <select
        v-model="formData.orientadores"
        multiple
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
      >
        <option v-for="docente in docentes" :key="docente._id" :value="docente._id">
          {{ docente.nome }}
        </option>
      </select>
    </div>

  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  formData: Object,
  docentes: Array
});
</script>
