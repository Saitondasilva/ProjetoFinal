<template>
  <FullScreenLayout>
    <div class="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div class="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900">
        <!-- Formulário de Login -->
        <div class="flex flex-col flex-1 w-full lg:w-1/2">
          <div class="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div class="mb-5 sm:mb-8">
                <h1 class="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Sign In
                </h1>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Enter your email and password to sign in!
                </p>
              </div>

              <!-- Formulário -->
              <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Email -->
                <div>
                  <label for="email" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Email<span class="text-error-500">*</span>
                  </label>
                  <input
                    v-model="email"
                    type="email"
                    id="email"
                    placeholder="info@gmail.com"
                    class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    required
                  />
                </div>

                <!-- Password -->
                <div>
                  <label for="password" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    Password<span class="text-error-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      placeholder="Enter your password"
                      class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                      required
                    />
                    <span
                      @click="togglePasswordVisibility"
                      class="absolute z-30 text-gray-500 -translate-y-1/2 cursor-pointer right-4 top-1/2 dark:text-gray-400"
                    >
                      <svg v-if="!showPassword" class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10 13.862C7.234 13.862 4.868 12.137 3.923 9.702C4.868 7.268 7.234 5.543 10 5.543C12.767 5.543 15.132 7.268 16.077 9.702C15.132 12.137 12.767 13.862 10 13.862ZM10 4.043C6.482 4.043 3.495 6.309 2.416 9.459C3.495 12.609 6.482 14.875 10 14.875C13.518 14.875 16.505 12.609 17.584 9.459C16.505 6.309 13.518 4.043 10 4.043ZM10 7.844C8.965 7.844 8.133 8.676 8.133 9.702C8.133 10.728 8.965 11.561 10 11.561C11.035 11.561 11.867 10.728 11.867 9.702C11.867 8.676 11.035 7.844 10 7.844Z" fill="#98A2B3"/>
                      </svg>
                      <svg v-else class="fill-current" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.638 3.577C4.345 3.284 3.87 3.284 3.577 3.577C3.284 3.87 3.284 4.345 3.577 4.638L4.853 5.914C3.746 6.842 2.894 8.064 2.416 9.459C3.495 12.61 6.482 14.875 10 14.875C10.832 14.875 11.629 14.706 12.361 14.421L15.363 17.423C15.655 17.716 16.13 17.716 16.423 17.423C16.716 17.13 16.716 16.655 16.423 16.362L4.638 3.577Z" fill="#98A2B3"/>
                      </svg>
                    </span>
                  </div>
                </div>

                <!-- Erro -->
                <p v-if="erro" class="text-sm text-red-500">{{ erro }}</p>

                <!-- Submit -->
                <div>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="loading">Logging in...</span>
                    <span v-else>Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Lado direito -->
        <div class="relative items-center hidden w-full h-full lg:w-1/2 bg-brand-950 dark:bg-white/5 lg:grid">
          <div class="flex items-center justify-center z-1">
            <CommonGridShape />
            <div class="flex flex-col items-center max-w-xs">
              <h2 class="text-center text-gray-400 dark:text-white/60">Sistema de Gestão Academica</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </FullScreenLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
import CommonGridShape from '@/components/common/CommonGridShape.vue'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const erro = ref('')
const loading = ref(false)
const router = useRouter()

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    erro.value = 'Por favor, preencha todos os campos'
    return
  }

  erro.value = ''
  loading.value = true

  try {
    const response = await axios.post('http://localhost:5000/usuarios/login', {
      email: email.value,
      palavraPasse: password.value
    })

    localStorage.setItem('token', response.data.token)
    router.push('/') // Redireciona para dashboard
  } catch (err: any) {
    erro.value = err.response?.data?.erro || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>


