<template>
<div class="app-container">

  <!-- NAVBAR -->
  <div class="navbar">
    <div class="logo">
      <q-icon name="business" size="28px"/>
      <span>Sistema de Planillas</span>
    </div>

    <div class="nav-icons">
      <q-icon name="notifications"/>
      <q-icon name="account_circle"/>
    </div>
  </div>

  <!-- CONTENIDO -->
  <div class="container">

    <div class="title-section">
      <h1>Subir Datos de Planilla</h1>
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
            <q-icon name="event">
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

          <q-input
            v-model="form.anio"
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

const form = ref({
  tipoDocumento:"",
  numeroDocumento:"",
  fecha:"",
  plataforma:"Asopagos",
  anio:"",
  mes:"",
  tipoReporte:""
})

const tiposDocumento = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "NIT"
]

const plataformas = [
  "Asopagos",
  "SOI",
  "Compensar",
  "Aportes en Línea"
]

const meses = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
]

const tiposReporte = [
  "Reporte mensual",
  "Reporte extraordinario",
  "Ajuste de aportes"
]

async function enviar(){
  if(!form.value.numeroDocumento || !form.value.mes || !form.value.anio){
    Notify.create({
      message: "Debe completar los campos obligatorios",
      color: "negative",
      position: "top"
    })
    return
  }

  try {
    const response = await api.post('/reports', {
      contractorId: form.value.numeroDocumento,
      supervisorId: "67d5e4b6b6d8d6a7d5a0d5a0",
      activeDate: `${form.value.anio}-01-01`,
      inactiveDate: `${form.value.anio}-12-31`,
      daysWorked: 30,
      valuePerDay: 50000,
      totalToPay: 1500000,
      isPaid: false,
      paidMonth: form.value.mes,
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
  }
  console.log(form.value)
}
</script>

<style>

.app-container{
  min-height:100vh;
  background:#f8f6f6;
}

/* NAVBAR */

.navbar{
  background:#39A900;
  color:white;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:14px 25px;
}

.logo{
  display:flex;
  gap:10px;
  align-items:center;
  font-weight:600;
}

.nav-icons{
  display:flex;
  gap:15px;
}

/* CONTENIDO */

.container{
  max-width:800px;
  margin:auto;
  padding:40px 20px;
}

.title-section h1{
  font-size:26px;
  font-weight:700;
}

.title-section p{
  color:#666;
}

/* FORM */

.form-card{
  margin-top:20px;
}

/* responsive grid */

.form-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(250px,1fr));
  gap:20px;
}

.form-grid-3{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(180px,1fr));
  gap:20px;
}

.subtitle{
  font-weight:700;
  margin-bottom:15px;
}

/* MOBILE */

@media (max-width:600px){

  .navbar{
    padding:12px 15px;
  }

  .title-section h1{
    font-size:22px;
  }

}

</style>
