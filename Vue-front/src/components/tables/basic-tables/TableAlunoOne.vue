<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

    <!-- Campo de pesquisa -->
    <div class="p-4 flex justify-end">
      <input
        v-model="search"
        type="text"
        placeholder="Pesquisar título, estado ou orientador..."
        class="w-full sm:w-64 px-4 py-2 border rounded-lg text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500
               dark:bg-gray-900 dark:border-gray-700 dark:text-white"
      />
    </div>

    <!-- Tabela -->
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left">Título</th>
            <th class="px-5 py-3 text-left">Estado</th>
            <th class="px-5 py-3 text-left">Palavras-chave</th>
            <th class="px-5 py-3 text-left">Orientadores</th>
            <th class="px-5 py-3 text-left">Ações</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">

          <tr v-for="proposta in filteredPropostas" :key="proposta._id">

            <td class="px-5 py-4">{{ proposta.titulo }}</td>

            <td class="px-5 py-4 capitalize">
              {{ proposta.estadoCandidatura || proposta.estado }}
            </td>

            <td class="px-5 py-4">
              {{ proposta.palavras_chave?.join(', ') }}
            </td>

            <td class="px-5 py-4">
              <span v-for="(o, i) in proposta.orientadores" :key="i">
                {{ o.docente.nome }}
                {{ i < proposta.orientadores.length - 1 ? ', ' : '' }}
              </span>
            </td>

            <td class="px-5 py-4 flex gap-2">

              <!-- PROPOSTAS DISPONIVEIS -->
              <button
                v-if="modo === 'propostas-disponiveis'"
                @click="candidatar(proposta._id)"
                class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
              >
                Candidatar
              </button>

              <!-- MINHAS PROPOSTAS -->
              <span
                v-else
                class="px-3 py-1 bg-green-100 text-green-700 rounded text-xs"
              >
                {{ proposta.estadoCandidatura }}
              </span>

            </td>

          </tr>

          <tr v-if="filteredPropostas.length === 0">
            <td colspan="5" class="text-center py-6 text-gray-500 dark:text-gray-400">
              Nenhuma proposta encontrada
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <!-- Modal docente -->
    <ModalP v-if="showModal" @close="fecharModal">

      <template #title>
        {{ isEdit ? 'Editar Proposta' : 'Nova Proposta' }}
      </template>

      <template #body>
        <DefaultInputs v-model:formData="formData" :docentes="docentes" />
      </template>

      <template #footer>
        <button @click="fecharModal" class="px-4 py-2 bg-gray-300 rounded">
          Cancelar
        </button>

        <button
          @click="isEdit ? salvarAlteracoes() : criarProposta()"
          class="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Guardar
        </button>

      </template>

    </ModalP>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import ModalP from '@/views/Tables/Modal_p.vue';
import DefaultInputs from '@/components/forms/formElements/DefaultInputs.vue';

const route = useRoute();

/* ============================
   MODO DA TELA
============================ */

const modo = computed(() => route.name);

/* ============================
   STATES
============================ */

const search = ref('');
const propostas = ref([]);
const docentes = ref([]);

const showModal = ref(false);
const isEdit = ref(false);
const selectedProposta = ref(null);

/* ============================
   FORM DOCENTE
============================ */

const formData = reactive({
  titulo: '',
  descricao: '',
  estado: 'ativa',
  palavras_chave: '',
  orientadores: []
});

/* ============================
   FILTRO
============================ */

const filteredPropostas = computed(() => {
  if (!search.value) return propostas.value;

  const term = search.value.toLowerCase();

  return propostas.value.filter(p =>
    p.titulo?.toLowerCase().includes(term) ||
    (p.estadoCandidatura || p.estado)?.toLowerCase().includes(term) ||
    p.orientadores?.some(o =>
      o.docente.nome.toLowerCase().includes(term)
    )
  );
});

/* ============================
   API
============================ */

const listarPropostas = async () => {
  try {

    const token = localStorage.getItem('token');

    let url = 'http://localhost:5000/propostas';

    if (modo.value === 'minhas-propostas') {
      url = 'http://localhost:5000/aluno/minhas-candidaturas';
    }

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (modo.value === 'minhas-propostas') {

      propostas.value = res.data.map(c => ({
        ...c.proposta,
        estadoCandidatura: c.estado
      }));

    } else {

      propostas.value = res.data;

    }

  } catch (err) {
    console.error(err);
  }
};
const candidatar = async (id) => {

  if (!confirm('Deseja candidatar-se a esta proposta?')) return;

  try {

    const token = localStorage.getItem('token');

    await axios.post(
      `http://localhost:5000/propostas/${id}/candidatar`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    alert('Candidatura enviada!');
    listarPropostas();

  } catch (err) {
    alert(err.response?.data?.erro || 'Erro ao candidatar');
  }
};

/* ============================
   DOCENTES
============================ */

const carregarDocentes = async () => {
  try {
    const token = localStorage.getItem('token');

    const res = await axios.get(
      'http://localhost:5000/usuarios/docente',
      { headers: { Authorization: `Bearer ${token}` } }
    );

    docentes.value = res.data;

  } catch (err) {
    console.error(err);
  }
};

/* ============================
   DOCENTE CRUD
============================ */

const criarProposta = async () => {

  try {

    const token = localStorage.getItem('token');

    const payload = {
      ...formData,
      palavras_chave: formData.palavras_chave.split(',').map(p => p.trim()),
      orientadores: formData.orientadores.map(id => ({
        docente: id,
        tipo: 'orientador principal'
      }))
    };

    const res = await axios.post(
      'http://localhost:5000/propostas',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    propostas.value.push(res.data);
    fecharModal();

  } catch (err) {
    alert(err.response?.data?.erro || 'Erro ao criar proposta');
  }
};

const editarProposta = (proposta) => {

  isEdit.value = true;
  selectedProposta.value = proposta;

  Object.assign(formData, {
    titulo: proposta.titulo,
    descricao: proposta.descricao,
    estado: proposta.estado,
    palavras_chave: proposta.palavras_chave.join(', '),
    orientadores: proposta.orientadores.map(o => o.docente._id)
  });

  showModal.value = true;
};

const salvarAlteracoes = async () => {

  if (!selectedProposta.value) return;

  try {

    const token = localStorage.getItem('token');

    const payload = {
      ...formData,
      palavras_chave: formData.palavras_chave.split(',').map(p => p.trim()),
      orientadores: formData.orientadores.map(id => ({
        docente: id,
        tipo: 'orientador principal'
      }))
    };

    const res = await axios.put(
      `http://localhost:5000/propostas/${selectedProposta.value._id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const i = propostas.value.findIndex(
      p => p._id === selectedProposta.value._id
    );

    if (i !== -1) propostas.value[i] = res.data;

    fecharModal();

  } catch (err) {
    alert(err.response?.data?.erro || 'Erro ao atualizar proposta');
  }
};

const fecharModal = () => showModal.value = false;

/* ============================
   LIFE CYCLE
============================ */

onMounted(() => {
  carregarDocentes();
  listarPropostas();
});

watch(modo, () => listarPropostas());

</script>
