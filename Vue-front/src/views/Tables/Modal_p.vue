<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
  >
    <!-- Fundo escuro -->
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="close"
    ></div>

    <!-- Caixa da modal -->
    <div
      class="relative z-10 w-full max-w-3xl rounded-xl bg-white 
             dark:bg-gray-900 shadow-xl p-6 overflow-auto"
      :style="{ maxHeight: '90vh' }"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          <slot name="title">Título</slot>
        </h2>

        <button
          @click="close"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="mb-6 text-gray-600 dark:text-gray-300">
        <slot name="body">
          Conteúdo da modal
        </slot>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-2">
        <slot name="footer">
          <button
            @click="close"
            class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Fechar
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>
