<template>
  <div class="app-container">
    <!-- NAVBAR -->
    <div class="navbar">
      <div class="logo">
        <q-icon name="business" size="28px"/>
        <span>SENA - Asopagos</span>
      </div>
      <div class="nav-links">
        <q-btn flat label="Listado" to="/contratista" />
        <q-btn flat label="Aportes en Línea" to="/" />
        <q-btn flat label="SOI" to="/SOI" />
        <q-btn flat label="Compensar" to="/compensar" />
      </div>
      <div class="nav-icons">
        <q-btn flat icon="logout" @click="logout" />
      </div>
    </div>

    <!-- CONTENIDO -->
    <div class="container">
      <div class="title-section">
        <h1>Subir Datos de Planilla (Asopagos)</h1>
        <p>Complete la información para reportar sus aportes.</p>
      </div>

      <q-card class="form-card">
        <q-card-section class="form-grid">
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
                <q-popup-proxy>
                  <q-date v-model="form.fecha" mask="YYYY-MM-DD"/>
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
        </q-card-section>

        <q-separator/>

        <q-card-section>
          <div class="subtitle">Detalles de reporte</div>
          <div class="form-grid-3">
            <q-select
              v-model="form.anio"
              :options="anios"
              label="Año"
              outlined
            />
            <q-select
              v-model="form.mes"
              :options="meses"
              label="Mes"
              outlined
            />
            <q-select
              v-model="form.tipoReporte"
              :options="tiposReporte"
              label="Tipo de reporte"
              outlined
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Continuar"
            icon="arrow_forward"
            color="primary"
            @click="enviar"
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
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

const form = ref({
  tipoDocumento: "",
  numeroDocumento: "",
  fecha: "",
  plataforma: "Asopagos",
  anio: "",
  mes: "",
  tipoReporte: ""
})

const tiposDocumento = ["Cédula de Ciudadanía", "Cédula de Extranjería", "NIT"]
const plataformas = ["Asopagos", "SOI", "Compensar", "Aportes en Línea"]
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
const tiposReporte = ["Reporte mensual", "Reporte extraordinario", "Ajuste de aportes"]

const logout = () => {
  authStore.logout()
  router.push('/login')
}

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
.app-container {
  min-height: 100vh;
  background: #f8f6f6;
}

.navbar {
  background: #39A900;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 25px;
}

.logo {
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 10px;
}

.nav-icons {
  display: flex;
  gap: 15px;
}

.container {
  max-width: 800px;
  margin: auto;
  padding: 40px 20px;
}

.title-section h1 {
  font-size: 26px;
  font-weight: 700;
}

.title-section p {
  color: #666;
}

.form-card {
  margin-top: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
}

.subtitle {
  font-weight: 700;
  margin-bottom: 15px;
}

@media (max-width: 600px) {
  .navbar {
    padding: 12px 15px;
    flex-direction: column;
    gap: 10px;
  }
  .title-section h1 {
    font-size: 22px;
  }
}
</style>
