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

    <!-- Tabela de propostas -->
    <div class="max-w-full overflow-x-auto custom-scrollbar">
      <table class="min-w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700">
            <th class="px-5 py-3 text-left">Proposta</th>
            <th class="px-5 py-3 text-left">Estado</th>
            <th class="px-5 py-3 text-left">Palavras-chave</th>
            <th class="px-5 py-3 text-left">Orientadores</th>
            <th class="px-5 py-3 text-left">Ações</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="proposta in filteredPropostas" :key="proposta._id">
            <td class="px-5 py-4">{{ proposta.titulo }}</td>
            <td class="px-5 py-4 capitalize">{{ proposta.estado }}</td>
            <td class="px-5 py-4">{{ proposta.palavras_chave.join(', ') }}</td>
            <td class="px-5 py-4">
              <span v-for="(o, i) in proposta.orientadores" :key="i">
                {{ o.docente.nome }}{{ i < proposta.orientadores.length - 1 ? ', ' : '' }}
              </span>
            </td>
            <td class="px-5 py-4 flex gap-2">
              <button @click="editarProposta(proposta)" class="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs">Editar</button>
              <button 
                          @click="deletarProposta(proposta._id)" 
                          class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                          Deletar
              </button>
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

    <!-- Modal -->
    <ModalP v-if="showModal" @close="fecharModal">
      <template #title>{{ isEdit ? 'Editar Proposta' : 'Nova Proposta' }}</template>

      <template #body>
        <DefaultInputs v-model:formData="formData" :docentes="docentes" />
      </template>

      <template #footer>
        <button @click="fecharModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
        <button @click="isEdit ? salvarAlteracoes() : criarProposta()" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
      </template>
    </ModalP>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from 'axios';
import ModalP from '@/views/Tables/Modal_p.vue';
import DefaultInputs from '@/components/forms/formElements/DefaultInputs.vue';

const search = ref('');
const showModal = ref(false);
const isEdit = ref(false);
const selectedProposta = ref(null);

// Formulário
const formData = reactive({
  titulo: '',
  descricao: '',
  estado: 'ativa',
  palavras_chave: '',
  orientadores: []
});

// Listas
const propostas = ref([]);
const docentes = ref([]);

// Filtro
const filteredPropostas = computed(() => {
  if (!search.value) return propostas.value;
  const term = search.value.toLowerCase();
  return propostas.value.filter(p =>
    p.titulo.toLowerCase().includes(term) ||
    p.estado.toLowerCase().includes(term) ||
    p.orientadores.some(o => o.docente.nome.toLowerCase().includes(term))
  );
});

// Carregar docentes
const carregarDocentes = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/usuarios/docente', {
      headers: { Authorization: `Bearer ${token}` }
    });
    docentes.value = res.data;
  } catch (err) { console.error(err); }
};

// Listar propostas
const listarPropostas = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/propostas', {
      headers: { Authorization: `Bearer ${token}` }
    });
    propostas.value = res.data;
  } catch (err) { console.error(err); }
};

// Criar nova proposta
// Criar nova proposta
const criarProposta = async () => {
  try {
    const token = localStorage.getItem('token');

    // 🔹 transforma orientadores em array de objetos como no schema
    const payload = {
      ...formData,
      palavras_chave: formData.palavras_chave.split(',').map(p => p.trim()),
      orientadores: formData.orientadores.map(id => ({
        docente: id,
        tipo: 'orientador principal' // você pode ajustar para 'coorientador' se precisar
      }))
    };

    const res = await axios.post(
      'http://localhost:5000/propostas',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Proposta criada com sucesso!');
    // Atualiza a lista de propostas
    listarPropostas();

  } catch (err) {
    alert(err.response?.data?.erro || 'Erro ao criar proposta');
  }
};


// Editar proposta
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

// Salvar alterações
const salvarAlteracoes = async () => {
  if (!selectedProposta.value) return;
  try {
    const token = localStorage.getItem('token');
    const payload = {
      ...formData,
      palavras_chave: formData.palavras_chave.split(',').map(p => p.trim()),
      orientadores: formData.orientadores.map(id => ({ docente: id, tipo: 'orientador principal' }))
    };
    const res = await axios.put(`http://localhost:5000/propostas/${selectedProposta.value._id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const i = propostas.value.findIndex(p => p._id === selectedProposta.value._id);
    if (i !== -1) propostas.value[i] = res.data;
    fecharModal();
  } catch (err) { alert(err.response?.data?.erro || 'Erro ao atualizar proposta'); }
};

//Eliminar ppropostas 
const deletarProposta = async (id) => {
  if (!confirm('Tem certeza que deseja deletar esta proposta?')) return;

  try {
    const token = localStorage.getItem('token');

    await axios.delete(`http://localhost:5000/propostas/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Proposta deletada com sucesso');

    // Atualiza lista
    propostas.value = propostas.value.filter(p => p._id !== id);

  } catch (err) {
    alert(err.response?.data?.erro || 'Erro ao deletar proposta');
  }
};


const fecharModal = () => showModal.value = false;

onMounted(() => {
  carregarDocentes();
  listarPropostas();
});
</script>
