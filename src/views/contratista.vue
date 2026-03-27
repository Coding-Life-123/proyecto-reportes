<template>
<div class="layout">

  <!-- SIDEBAR -->
  <aside class="sidebar">

    <div class="logo">
      🛡️ <span>Supervisor Portal</span>
    </div>

    <nav class="menu">
      <p class="menu-title">Vista General</p>

      <router-link to="/contratista" class="menu-item active">Listado Contratistas</router-link>
      <router-link to="/" class="menu-item">Aportes en Línea</router-link>
      <router-link to="/SOI" class="menu-item">SOI</router-link>
      <router-link to="/asopagos" class="menu-item">Asopagos</router-link>
      <router-link to="/compensar" class="menu-item">Compensar</router-link>

      <p class="menu-title">Sistema</p>
      <a class="menu-item" @click="logout">Cerrar Sesión</a>
    </nav>

  </aside>

  <!-- MAIN -->
  <div class="main">

    <!-- TOPBAR -->
    <header class="topbar">

      <input class="search" placeholder="Buscar contratista..." />

      <div class="top-links">
        <a>Dashboard</a>
        <a class="active">Contratistas</a>
        <a>Reportes</a>
        <a>Configuración</a>
      </div>

      <div class="user">
        🔔
        <img src="https://i.pravatar.cc/40"/>
      </div>

    </header>

    <!-- CONTENT -->
    <section class="content">

      <div class="title-row">

        <div>
          <h1>Listado de Contratistas</h1>
          <p>Gestión y monitoreo del estado de registro de contratistas activos.</p>
        </div>

        <div class="actions">
          <button class="btn-outline">Exportar</button>
          <button class="btn-green">Agregar Contratista</button>
        </div>

      </div>

      <!-- FILTER -->
      <div class="filter-bar">
        <span class="chip">Estado: Aprobado ✕</span>

        <select>
          <option>Más recientes</option>
        </select>
      </div>

      <!-- TABLE -->
      <div class="table-card">

        <table>
          <thead>
            <tr>
              <th>NOMBRES</th>
              <th>APELLIDOS</th>
              <th>TIPO DE DOCUMENTO</th>
              <th>NÚMERO DE DOCUMENTO</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="c in contratistas" :key="c.id">
              <td>{{c.nombre}}</td>
              <td>{{c.apellido}}</td>
              <td>{{c.tipo}}</td>
              <td>{{c.numero}}</td>
              <td><span class="status">● Aprobado</span></td>
              <td class="accion">Gestionar</td>
            </tr>
          </tbody>
        </table>

        <!-- FOOTER TABLE -->
        <div class="table-footer">

          <span>Mostrando 1 a 5 de 48 contratistas</span>

          <div class="pagination">
            <button>&lt;</button>
            <button class="active">1</button>
            <button>2</button>
            <button>3</button>
            <span>...</span>
            <button>10</button>
            <button>&gt;</button>
          </div>

        </div>

      </div>

    </section>

  </div>

</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from "../plugins/axios.js"
import { Notify } from "quasar"
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const contratistas = ref([])

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const fetchContractors = async () => {
  try {
    const response = await api.get('/contractors')
    // Mapeamos los datos del backend a la estructura de la tabla
    contratistas.value = response.data.map(c => ({
      id: c._id,
      nombre: c.names,
      apellido: c.surnames,
      tipo: c.docType,
      numero: c.docNumber
    }))
  } catch (error) {
    Notify.create({
      message: "Error al cargar contratistas",
      color: "negative",
      position: "top"
    })
  }
}

onMounted(() => {
  fetchContractors()
})
</script>

<style>

.layout{
display:flex;
height:100vh;
font-family:Arial;
background:#f4f6f9;
}

/* SIDEBAR */

.sidebar{
width:240px;
background:white;
border-right:1px solid #eee;
padding:20px;
}

.logo{
font-weight:bold;
margin-bottom:30px;
font-size:18px;
}

.menu-title{
font-size:12px;
color:#999;
margin:20px 0 10px;
}

.menu-item{
display:block;
padding:10px;
border-radius:6px;
color:#555;
margin-bottom:5px;
cursor:pointer;
}

.menu-item.active{
background:#e8f5e9;
color:#2e7d32;
font-weight:bold;
}

.badge{
background:#2ecc71;
color:white;
padding:2px 6px;
border-radius:10px;
font-size:11px;
margin-left:5px;
}

/* MAIN */

.main{
flex:1;
display:flex;
flex-direction:column;
}

/* TOPBAR */

.topbar{
background:white;
display:flex;
align-items:center;
padding:15px 25px;
border-bottom:1px solid #eee;
}

.search{
flex:1;
padding:8px;
border-radius:6px;
border:1px solid #ddd;
margin-right:20px;
}

.top-links a{
margin-right:15px;
color:#555;
cursor:pointer;
}

.top-links .active{
color:#2ecc71;
font-weight:bold;
}

.user{
margin-left:auto;
display:flex;
align-items:center;
gap:15px;
}

.user img{
border-radius:50%;
}

/* CONTENT */

.content{
padding:30px;
}

.title-row{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:20px;
}

.actions button{
margin-left:10px;
}

/* BUTTONS */

.btn-outline{
border:1px solid #ccc;
background:white;
padding:8px 14px;
border-radius:6px;
cursor:pointer;
}

.btn-green{
background:#2ecc71;
border:none;
color:white;
padding:8px 14px;
border-radius:6px;
cursor:pointer;
}

/* FILTER */

.filter-bar{
background:white;
padding:12px;
border-radius:8px;
margin-bottom:20px;
display:flex;
justify-content:space-between;
}

.chip{
background:#e9ecef;
padding:6px 10px;
border-radius:20px;
font-size:13px;
}

/* TABLE */

.table-card{
background:white;
border-radius:10px;
overflow:hidden;
}

table{
width:100%;
border-collapse:collapse;
}

thead{
background:#f3f5f7;
}

th,td{
padding:15px;
text-align:left;
font-size:14px;
border-bottom:1px solid #eee;
}

.status{
background:#e8f5e9;
color:#2e7d32;
padding:5px 10px;
border-radius:20px;
font-size:12px;
}

.accion{
color:#2ecc71;
font-weight:bold;
cursor:pointer;
}

/* FOOTER TABLE */

.table-footer{
display:flex;
justify-content:space-between;
padding:15px;
font-size:13px;
}

.pagination button{
margin:0 3px;
padding:5px 10px;
border:1px solid #ddd;
background:white;
cursor:pointer;
}

.pagination .active{
background:#2ecc71;
color:white;
border:none;
}

</style>