<template>

<div class="contenedor">

  <!-- HEADER -->
  <header class="header">
    <div class="logo">
      <span class="material-symbols-outlined icono">corporate_fare</span>
      <h1>Logo Corporativo</h1>
    </div>

    <nav class="menu">
      <a href="#">Inicio</a>
      <a href="#">Servicios</a>
      <a href="#">Contacto</a>

      <button class="btn-acceder">
        Acceder
      </button>
    </nav>
  </header>


  <!-- FORMULARIO -->
  <main class="contenido">

    <div class="titulo">
      <h2>Subir Datos de Planilla</h2>
      <p>Complete la información para reportar sus aportes a la seguridad social.</p>
    </div>


    <div class="card">

      <form @submit.prevent="enviar">

        <!-- fila -->
        <div class="fila">

          <div class="campo">
            <label>Tipo de documento</label>

            <select v-model="form.tipoDocumento">
              <option value="">Seleccione tipo</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="TI">Tarjeta de Identidad</option>
            </select>
          </div>


          <div class="campo">
            <label>Número de documento</label>
            <input v-model="form.numeroDocumento" type="text">
          </div>

        </div>


        <!-- fila -->
        <div class="fila">

          <div class="campo">
            <label>Fecha de expedición</label>
            <input v-model="form.fechaExpedicion" type="date">
          </div>

          <div class="campo">
            <label>Plataforma de aportes</label>

            <select v-model="form.plataforma">
              <option value="Aportes en linea">Aportes en línea</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

        </div>


        <hr>


        <!-- periodo -->
        <div class="fila">

          <div class="campo">
            <label>Desde mes</label>

            <select v-model="form.desdeMes">
              <option value="">Mes</option>
              <option>Enero</option>
              <option>Febrero</option>
              <option>Marzo</option>
            </select>
          </div>

          <div class="campo">
            <label>Desde año</label>

            <select v-model="form.desdeAnio">
              <option value="">Año</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>

        </div>


        <div class="fila">

          <div class="campo">
            <label>Hasta mes</label>

            <select v-model="form.hastaMes">
              <option value="">Mes</option>
              <option>Enero</option>
              <option>Febrero</option>
              <option>Marzo</option>
            </select>
          </div>

          <div class="campo">
            <label>Hasta año</label>

            <select v-model="form.hastaAnio">
              <option value="">Año</option>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>

        </div>


        <!-- radio -->
        <div class="estado">

          <label>
            <input type="radio" value="activo" v-model="form.estado">
            Cotizante activo
          </label>

          <label>
            <input type="radio" value="pensionado" v-model="form.estado">
            Pensionado
          </label>

        </div>


        <!-- boton -->
        <div class="boton">

          <button type="submit">
            Continuar
          </button>

        </div>

      </form>

    </div>

  </main>

</div>

</template>



<script setup>

import { reactive } from "vue"
import { Notify } from "quasar"
import api from "../plugins/axios.js"

const form = reactive({

  tipoDocumento:"",
  numeroDocumento:"",
  fechaExpedicion:"",
  plataforma:"Aportes en linea",

  desdeMes:"",
  desdeAnio:"",

  hastaMes:"",
  hastaAnio:"",

  estado:"activo"

})


const enviar = async () => {

  if(!form.tipoDocumento || !form.numeroDocumento){

    Notify.create({
      message:"Debe completar los campos obligatorios",
      color:"negative",
      position:"top"
    })

    return
  }

  try {
    const response = await api.post('/reports', {
      contractorId: form.numeroDocumento, // Mapeo temporal, ajustar segun backend
      supervisorId: "67d5e4b6b6d8d6a7d5a0d5a0", // ID de prueba o dinámico
      activeDate: `${form.desdeAnio}-${form.desdeMes}-01`,
      inactiveDate: `${form.hastaAnio}-${form.hastaMes}-01`,
      daysWorked: 30, // Ejemplo
      valuePerDay: 50000, // Ejemplo
      totalToPay: 1500000, // Ejemplo
      isPaid: false,
      paidMonth: form.desdeMes,
      paidYear: parseInt(form.desdeAnio)
    })

    Notify.create({
      message: response.data.message || "Datos enviados correctamente",
      color:"positive",
      position:"top",
      icon:"check"
    })
  } catch (error) {
    Notify.create({
      message: error.response?.data?.message || "Error al enviar datos",
      color:"negative",
      position:"top"
    })
  }

  console.log(form)

}

</script>

<style>
.contenedor{
  font-family: Calibri;
  background:#f5f5f5;
  min-height:100vh;
}

/* HEADER */

.header{
  background:white;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:20px 40px;
  border-bottom:1px solid #ddd;
  flex-wrap:wrap;
}

.logo{
  display:flex;
  align-items:center;
  gap:10px;
}

.icono{
  background:#39A900;
  color:white;
  padding:6px;
  border-radius:6px;
}

.menu{
  display:flex;
  gap:25px;
  align-items:center;
}

.menu a{
  text-decoration:none;
  color:#444;
}

.btn-acceder{
  background:#39A900;
  color:white;
  border:none;
  padding:8px 18px;
  border-radius:10px;
  cursor:pointer;
}


/* CONTENIDO */

.contenido{
  max-width:900px;
  margin:auto;
  padding:40px 20px;
}

.titulo h2{
  font-size:32px;
  margin-bottom:5px;
}

.card{
  background:white;
  padding:40px;
  border-radius:15px;
  box-shadow:0 10px 25px rgba(0,0,0,0.1);
}


/* FORMULARIO */

.fila{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:20px;
  margin-bottom:20px;
}

.campo{
  display:flex;
  flex-direction:column;
}

.campo label{
  font-weight:bold;
  margin-bottom:5px;
}

.campo input,
.campo select{
  padding:12px;
  border-radius:10px;
  border:1px solid #ddd;
}

.estado{
  margin-top:20px;
  display:flex;
  gap:30px;
}

.boton{
  margin-top:30px;
  text-align:right;
}

.boton button{
  background:#39A900;
  color:white;
  border:none;
  padding:14px 30px;
  font-size:16px;
  border-radius:12px;
  cursor:pointer;
  transition:0.3s;
}

.boton button:hover{
  background:#329600;
}


/* RESPONSIVE */

/* TABLET */
@media (max-width:900px){

  .contenido{
    padding:30px 15px;
  }

  .card{
    padding:30px;
  }

}

/* CELULAR */

@media (max-width:600px){

  .header{
    flex-direction:column;
    align-items:flex-start;
    gap:15px;
    padding:20px;
  }

  .menu{
    width:100%;
    justify-content:space-between;
    flex-wrap:wrap;
  }

  .fila{
    grid-template-columns:1fr;
  }

  .estado{
    flex-direction:column;
    gap:10px;
  }

  .boton{
    text-align:center;
  }

  .boton button{
    width:100%;
  }

  .titulo h2{
    font-size:26px;
  }

  .card{
    padding:20px;
  }

}
</style>
<!-- <style>

.contenedor{
  font-family: Calibri;
  background:#f5f5f5;
  min-height:100vh;
}

/* header */

.header{
  background:white;
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:20px 40px;
  border-bottom:1px solid #ddd;
}

.logo{
  display:flex;
  align-items:center;
  gap:10px;
}

.icono{
  background:#39A900;
  color:white;
  padding:6px;
  border-radius:6px;
}

.menu{
  display:flex;
  gap:25px;
  align-items:center;
}

.menu a{
  text-decoration:none;
  color:#444;
}

.btn-acceder{
  background:#39A900;
  color:white;
  border:none;
  padding:8px 18px;
  border-radius:10px;
  cursor:pointer;
}


/* contenido */

.contenido{
  max-width:900px;
  margin:auto;
  padding:40px;
}

.titulo h2{
  font-size:32px;
  margin-bottom:5px;
}

.card{
  background:white;
  padding:40px;
  border-radius:15px;
  box-shadow:0 10px 25px rgba(0,0,0,0.1);
}


/* formulario */

.fila{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:20px;
  margin-bottom:20px;
}

.campo{
  display:flex;
  flex-direction:column;
}

.campo label{
  font-weight:bold;
  margin-bottom:5px;
}

.campo input,
.campo select{
  padding:12px;
  border-radius:10px;
  border:1px solid #ddd;
}

.estado{
  margin-top:20px;
  display:flex;
  gap:30px;
}

.boton{
  margin-top:30px;
  text-align:right;
}

.boton button{
  background:#39A900;
  color:white;
  border:none;
  padding:14px 30px;
  font-size:16px;
  border-radius:12px;
  cursor:pointer;
}

.boton button:hover{
  background:#329600;
}

</style> -->