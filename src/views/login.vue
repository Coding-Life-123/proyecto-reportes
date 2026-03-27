<template>
  <q-page class="flex flex-center">
    <q-card style="width: 400px; max-width: 90vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Inicio de Sesión</div>
        <div class="text-subtitle2">Portal de Supervisores</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="email"
            label="Email"
            type="email"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Por favor ingrese su email']"
          />

          <q-input
            filled
            type="password"
            v-model="password"
            label="Contraseña"
            lazy-rules
            :rules="[val => val && val.length > 0 || 'Por favor ingrese su contraseña']"
          />

          <div>
            <q-btn label="Ingresar" type="submit" color="primary" class="full-width" :loading="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const email = ref('');
const password = ref('');
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  try {
    await authStore.login(email.value, password.value);
    $q.notify({
      color: 'positive',
      message: 'Bienvenido',
      icon: 'check'
    });
    router.push('/contratista');
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Error al iniciar sesión',
      icon: 'report_problem'
    });
  } finally {
    loading.value = false;
  }
};
</script>
