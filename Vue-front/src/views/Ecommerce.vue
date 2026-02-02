<template>
  <admin-layout>
    <div class="flex items-center justify-center h-[80vh]">
      <h1 class="text-5xl font-bold text-center text-gray-800">
        Bem-vindo ao Sistema de Gestão Acadêmica
        <span class="text-blue-600">{{ userNome }}</span>!
      </h1>
    </div>
  </admin-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../components/layout/AdminLayout.vue'

const userNome = ref('')

// Pegar usuário do localStorage (assumindo que foi salvo no login)
onMounted(() => {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    const user = JSON.parse(savedUser)
    userNome.value = user.nome
  }
})
</script>
