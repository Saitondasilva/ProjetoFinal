<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">

    <!-- Pesquisa -->
    <div class="p-4 flex justify-end">
      <input
        v-model="search"
        type="text"
        placeholder="Pesquisar proposta..."
        class="w-full sm:w-64 px-4 py-2 border rounded-lg text-sm"
      />
    </div>

    <!-- Tabela -->
    <div class="max-w-full overflow-x-auto">
      <table class="min-w-full">
        <thead>
          <tr class="border-b">
            <th class="px-5 py-3 text-left">Proposta</th>
            <th class="px-5 py-3 text-left">Estado</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="p in filteredPropostas" :key="p._id">

            <td class="px-5 py-4">
              {{ p.proposta.titulo }}
            </td>
                <td class="px-5 py-4">
                <span
                    class="px-2 py-1 text-sm font-semibold rounded"
                    :class="{
                    'bg-green-100 text-green-700': p.estado === 'aceite',
                    'bg-yellow-100 text-yellow-700': p.estado === 'pendente',
                    'bg-red-100 text-red-700': p.estado === 'recusado'
                    }"
                >
                    {{ p.estado }}
                </span>
                </td>

          </tr>

          <tr v-if="filteredPropostas.length === 0">
            <td colspan="2" class="text-center py-6 text-gray-500">
              Nenhuma proposta aceite
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

const propostas = ref([])
const search = ref('')

/* =========================
   FILTRO
========================= */
const filteredPropostas = computed(() => {

  if (!search.value) return propostas.value

  const term = search.value.toLowerCase()

  return propostas.value.filter(p =>
    p.proposta.titulo.toLowerCase().includes(term)
  )
})

/* =========================
   LISTAR PROPOSTAS ACEITES
========================= */
const listarAceites = async () => {

  try {

    const token = localStorage.getItem('token')

    const res = await axios.get(
      'http://localhost:5000/aluno/propostas/aceites',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    propostas.value = res.data

  } catch (err) {
    console.error(err)
  }
}

onMounted(listarAceites)
</script>
