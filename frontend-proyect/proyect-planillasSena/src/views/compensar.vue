<template>

<div class="container">

  <div class="form-wrapper">

    <q-card class="form-card">

      <q-card-section>
        <div class="text-h5 text-bold">Subir Datos de Planilla</div>
        <div class="text-grey">
          Complete la información para reportar sus aportes a la seguridad social.
        </div>
      </q-card-section>

      <q-separator/>

      <q-card-section class="q-gutter-md">

        <!-- fila -->
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


        <!-- fila -->
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


        <!-- fila -->
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


        <!-- fila -->
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


        <!-- fila -->
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
        />

      </q-card-actions>

    </q-card>

  </div>

</div>

</template>


<script setup>

import { reactive } from "vue"
import { Notify } from "quasar"
import api from "../plugins/axios.js"

const documentos = [
  "Cédula de Ciudadanía",
  "Cédula de Extranjería",
  "NIT"
]

const meses = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
]

const anios = [
  "2023","2024","2025"
]

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

const enviar = async () => {

  if(
    !form.tipoDocumento ||
    !form.numeroDocumento ||
    !form.numeroPlanilla
  ){

    Notify.create({
      message: "Debe completar los campos obligatorios",
      color: "negative",
      position: "top"
    })

    return
  }

  try {
    const response = await api.post('/reports', {
      contractorId: form.numeroDocumento,
      supervisorId: "67d5e4b6b6d8d6a7d5a0d5a0",
      activeDate: `${form.anio}-01-01`,
      inactiveDate: `${form.anio}-12-31`,
      daysWorked: 30,
      valuePerDay: 50000,
      totalToPay: parseFloat(form.valorPlanilla) || 0,
      isPaid: false,
      paidMonth: form.mes,
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
  }

  console.log(form)

}

</script>


<style scoped>

.container{
  padding:20px;
}

/* centra el formulario */
.form-wrapper{
  max-width:900px;
  margin:auto;
}

/* tarjeta responsive */
.form-card{
  width:100%;
}

/* botón */
.boton-container{
  justify-content:flex-end;
}

/* botón adaptable */
.btn-responsive{
  width:auto;
}

/* ajustes móviles */

@media (max-width:600px){

  .container{
    padding:10px;
  }

  .btn-responsive{
    width:100%;
  }

  .boton-container{
    justify-content:center;
  }

}

</style>