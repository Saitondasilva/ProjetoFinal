<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">

    <!-- Campo pesquisa -->
    <div class="p-4 flex justify-end">
      <input
        v-model="search"
        type="text"
        placeholder="Pesquisar aluno ou proposta..."
        class="w-full sm:w-64 px-4 py-2 border rounded-lg text-sm"
      />
    </div>

    <!-- Tabela candidaturas -->
    <div class="max-w-full overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b">
            <th class="px-5 py-3 text-left">Aluno</th>
            <th class="px-5 py-3 text-left">Proposta</th>
            <th class="px-5 py-3 text-left">Estado</th>
            <th class="px-5 py-3 text-left">Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="c in filteredCandidaturas" :key="c._id">

            <td class="px-5 py-4">
              {{ c.aluno.nome }}
            </td>

            <td class="px-5 py-4">
              {{ c.proposta.titulo }}
            </td>

            <td class="px-5 py-4">
              {{ c.estado }}
            </td>

            <td class="px-5 py-4 flex gap-2">

              <button
                @click="aceitar(c._id)"
                class="px-3 py-1 bg-green-600 text-white rounded text-xs"
              >
                Aceitar
              </button>

              <button
                @click="recusar(c._id)"
                class="px-3 py-1 bg-red-600 text-white rounded text-xs"
              >
                Recusar
              </button>

            </td>

          </tr>

          <tr v-if="filteredCandidaturas.length === 0">
            <td colspan="4" class="text-center py-6 text-gray-500">
              Nenhuma candidatura pendente
            </td>
          </tr>

        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const candidaturas = ref([])
const search = ref('')

/* =========================
   FILTRO
========================= */
const filteredCandidaturas = computed(() => {

  if (!search.value) return candidaturas.value

  const term = search.value.toLowerCase()

  return candidaturas.value.filter(c =>
    c.aluno.nome.toLowerCase().includes(term) ||
    c.proposta.titulo.toLowerCase().includes(term)
  )
})

/* =========================
   LISTAR PENDENTES
========================= */
const listarPendentes = async () => {

  try {

    const token = localStorage.getItem('token')

    const res = await axios.get(
      'http://localhost:5000/propostas/docente/candidaturas/pendentes',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    candidaturas.value = res.data

  } catch (err) {
    console.error(err)
  }
}

/* =========================
   ACEITAR
========================= */
const aceitar = async (id) => {

  if (!confirm('Deseja aceitar esta candidatura?')) return

  try {

    const token = localStorage.getItem('token')

    await axios.put(
      `http://localhost:5000/propostas/candidatura/${id}/aceitar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    alert('Candidatura aceite')

    listarPendentes()

  } catch (err) {
    alert(err.response?.data?.erro || 'Erro ao aceitar')
  }
}

/* =========================
   RECUSAR
========================= */
const recusar = async (id) => {

  if (!confirm('Deseja recusar esta candidatura?')) return

  try {

    const token = localStorage.getItem('token')

    await axios.put(
      `http://localhost:5000/candidatura/${id}/recusar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    alert('Candidatura recusada')

    listarPendentes()

  } catch (err) {
    alert(err.response?.data?.erro || 'Erro ao recusar')
  }
}

onMounted(listarPendentes)
</script>
