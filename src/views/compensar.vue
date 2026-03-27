<template>
  <div class="container">
    <div class="form-wrapper">
      <q-card class="form-card">
        <q-card-section>
          <div class="row items-center justify-between">
            <div>
              <div class="text-h5 text-bold">Subir Datos de Planilla (Compensar)</div>
              <div class="text-grey">
                Complete la información para reportar sus aportes a la seguridad social.
              </div>
            </div>
            <div class="nav-links">
              <q-btn flat label="Listado" to="/contratista" color="primary" />
              <q-btn flat icon="logout" @click="logout" color="negative" />
            </div>
          </div>
        </q-card-section>

        <q-separator/>

        <q-card-section class="q-gutter-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-select
                v-model="form.tipoDocumento"
                :options="documentos"
                label="Tipo de documento"
                outlined
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.numeroDocumento"
                label="Número de documento"
                outlined
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.fechaExpedicion"
                label="Fecha de expedición"
                type="date"
                outlined
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.plataforma"
                label="Plataforma de aportes"
                disable
                outlined
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.numeroPlanilla"
                label="Número de planilla"
                outlined
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                v-model="form.valorPlanilla"
                label="Valor planilla"
                prefix="$"
                type="number"
                outlined
              />
            </div>
          </div>

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

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input
                v-model="form.fechaPago"
                label="Fecha de pago de la planilla"
                type="date"
                outlined
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="boton-container">
          <q-btn
            label="Continuar"
            color="green"
            icon-right="arrow_forward"
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
import { reactive, ref } from "vue"
import { Notify } from "quasar"
import api from "../plugins/axios.js"
import { useAuthStore } from "../stores/auth"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

const documentos = ["Cédula de Ciudadanía", "Cédula de Extranjería", "NIT"]
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
const anios = ["2023", "2024", "2025"]

const form = reactive({
  tipoDocumento: "",
  numeroDocumento: "",
  fechaExpedicion: "",
  plataforma: "Compensar",
  numeroPlanilla: "",
  valorPlanilla: "",
  mes: "",
  anio: "",
  fechaPago: ""
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const enviar = async () => {
  if (!form.tipoDocumento || !form.numeroDocumento || !form.numeroPlanilla || !form.mes || !form.anio) {
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
      contractorId: form.numeroDocumento,
      supervisorId: authStore.user?._id,
      activeDate: `${form.anio}-01-01`,
      inactiveDate: `${form.anio}-12-31`,
      daysWorked: 30,
      valuePerDay: 50000,
      totalToPay: parseFloat(form.valorPlanilla) || 0,
      isPaid: false,
      paidMonth: form.mes.value,
      paidYear: parseInt(form.anio)
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
.container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.form-wrapper {
  max-width: 900px;
  margin: auto;
}

.form-card {
  width: 100%;
}

.boton-container {
  justify-content: flex-end;
}

.btn-responsive {
  width: auto;
}

.nav-links {
  display: flex;
  gap: 10px;
}

@media (max-width: 600px) {
  .container {
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
