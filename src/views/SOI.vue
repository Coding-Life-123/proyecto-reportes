<template>
  <div>
    <!-- NAVBAR -->
    <div class="navbar bg-primary text-white q-px-lg q-py-md">
      <div class="text-h6 text-weight-bold">
        SENA - Sistema de Planillas
      </div>
      <div class="menu row q-gutter-sm">
        <q-btn flat label="Inicio" text-color="white" class="btn-nav" to="/contratista" />
        <q-btn flat label="Ayuda" text-color="white" class="btn-nav" />
        <q-btn flat label="Soporte" text-color="white" class="btn-nav" />
      </div>
    </div>

    <!-- CONTENIDO -->
    <div class="contenido">
      <q-card class="form-card">
        <q-card-section>
          <div class="text-h5 text-primary">
            Subir Datos de Planilla (SOI)
          </div>
          <div class="text-grey">
            Complete la información para procesar los datos
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-select
            v-model="form.tipoDocumento"
            :options="tiposDocumento"
            label="Tipo de documento"
            outlined
          />

          <q-input
            v-model="form.numeroDocumento"
            label="Número de documento"
            outlined
          />

          <q-input
            v-model="form.fecha"
            label="Fecha de expedición"
            outlined
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.fecha" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-select
            v-model="form.plataforma"
            :options="plataformas"
            label="Plataforma de aportes"
            outlined
          />

          <q-input
            v-model="form.eps"
            label="EPS"
            outlined
          />

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.mes"
                :options="meses"
                label="Mes"
                outlined
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.anio"
                :options="anios"
                label="Año"
                outlined
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="boton-container">
          <q-btn
            label="Continuar"
            color="primary"
            @click="enviar"
            class="btn-responsive"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { Notify } from "quasar"
import api from "../plugins/axios.js"
import { useAuthStore } from "../stores/auth"

const authStore = useAuthStore()
const loading = ref(false)

const form = ref({
  tipoDocumento: "",
  numeroDocumento: "",
  fecha: "",
  plataforma: "SOI",
  eps: "",
  mes: "",
  anio: ""
})

const tiposDocumento = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "NIT",
  "Tarjeta de Identidad"
]

const plataformas = [
  "SOI",
  "Compensar",
  "Aportes en Línea",
  "Asopagos"
]

const meses = [
  { label: "Enero", value: 1 },
  { label: "Febrero", value: 2 },
  { label: "Marzo", value: 3 },
  { label: "Abril", value: 4 },
  { label: "Mayo", value: 5 },
  { label: "Junio", value: 6 },
  { label: "Julio", value: 7 },
  { label: "Agosto", value: 8 },
  { label: "Septiembre", value: 9 },
  { label: "Octubre", value: 10 },
  { label: "Noviembre", value: 11 },
  { label: "Diciembre", value: 12 }
]

const anios = ["2024", "2023", "2022", "2021"]

async function enviar() {
  if (!form.value.numeroDocumento || !form.value.mes || !form.value.anio) {
    Notify.create({
      message: "Debe completar los campos obligatorios",
      color: "negative",
      position: "top"
    })
    return
  }

  loading.value = true
  try {
    const response = await api.post('/reports', {
      contractorId: form.value.numeroDocumento,
      supervisorId: authStore.user?._id,
      activeDate: `${form.value.anio}-01-01`,
      inactiveDate: `${form.value.anio}-12-31`,
      daysWorked: 30,
      valuePerDay: 50000,
      totalToPay: 1500000,
      isPaid: false,
      paidMonth: form.value.mes.value,
      paidYear: parseInt(form.value.anio)
    })

    Notify.create({
      message: response.data.message || "Datos enviados correctamente",
      color: "positive",
      position: "top",
      icon: "check"
    })
  } catch (error) {
    Notify.create({
      message: error.response?.data?.message || "Error al enviar datos",
      color: "negative",
      position: "top"
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.menu {
  display: flex;
}

.contenido {
  padding: 30px;
  display: flex;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 700px;
}

.boton-container {
  justify-content: flex-end;
}

.btn-responsive {
  width: auto;
}

@media (max-width: 900px) {
  .contenido {
    padding: 20px;
  }
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .menu {
    width: 100%;
    justify-content: space-between;
  }

  .btn-nav {
    font-size: 12px;
  }

  .contenido {
    padding: 10px;
  }

  .btn-responsive {
    width: 100%;
  }

  .boton-container {
    justify-content: center;
  }
}
</style>
