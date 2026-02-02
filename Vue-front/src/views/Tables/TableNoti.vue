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
          <span class="material-icons text-sm">add</span>
          Proposta
        </button>
      </div>

      <!-- Card com a tabela -->
      <ComponentCard title="Propostas">
        <BasicTableOne :propostas="propostas" />
      </ComponentCard>

      <!-- MODAL -->
      <ModalP v-if="showModal" @close="fecharModal">
        <template #title>NOVA PROPOSTA</template>

        <template #body>
          <DefaultInputs v-model:formData="formData" :docentes="docentes" />
        </template>

        <template #footer>
          <button
            @click="fecharModal"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            @click="guardarProposta"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </template>
      </ModalP>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import BasicTableOne from "@/components/tables/basic-tables/TableNotiOne.vue";
import ModalP from "@/views/Tables/Modal_p.vue";
import DefaultInputs from "@/components/forms/formElements/DefaultInputs.vue";

// Título da página
const currentPageTitle = ref("Proposta do Docente");

// Modal
const showModal = ref(false);
const novaProposta = () => showModal.value = true;
const fecharModal = () => showModal.value = false;

// Formulário
const formData = reactive({
  titulo: "",
  descricao: "",
  estado: "ativa",
  palavras_chave: "",
  orientadores: []
});

// Listas
const propostas = ref([]);
const docentes = ref([]);

// Carregar docentes da API
const carregarDocentes = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/usuarios/docente", {
      headers: { Authorization: `Bearer ${token}` }
    });
    docentes.value = res.data;
  } catch (err) {
    console.error("Erro ao carregar docentes:", err);
  }
};

// Guardar proposta
const guardarProposta = async () => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      ...formData,
      palavras_chave: formData.palavras_chave
        .split(",")
        .map(p => p.trim()),
      orientadores: formData.orientadores.map(id => ({
        docente: id,
        tipo: "orientador principal"
      }))
    };

    const res = await axios.post(
      "http://localhost:5000/propostas",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    propostas.value.push(res.data);
    alert("Proposta criada com sucesso!");
    fecharModal();

    // Resetar formulário
    Object.assign(formData, {
      titulo: "",
      descricao: "",
      estado: "ativa",
      palavras_chave: "",
      orientadores: []
    });

  } catch (err) {
    alert(err.response?.data?.erro || "Erro ao criar proposta");
  }
};

// Carregar docentes ao montar
onMounted(() => {
  carregarDocentes();
});
</script>
