<script>
  import RecursosHumanos from './RecursosHumanos.svelte'; // Importar módulos
  import Inventario from './Inventario.svelte'; // Importar módulos
  import Ventas from './Ventas.svelte'; // Importar módulos
  import Facturacion from './Facturacion.svelte';  // Importa el componente de facturación
  import Reportes from './Reportes.svelte'; // Importar módulos
  export let user;
  let vista = "dashboard"; // Controla la vista actual

  const modulos = [
    { nombre: "Recursos Humanos", icono: "👥" },
    { nombre: "Ventas", icono: "💰" },
    { nombre: "Facturación", icono: "📜" },
    { nombre: "Inventario", icono: "📦" },
    { nombre: "Reportes", icono: "📊" }
  ];

  function cambiarVista(modulo) {
    vista = modulo.toLowerCase().replace(" ", ""); // Asegurar que el nombre coincida
  }
</script>

<style>
  /* Contenedor principal */
  .layout {
    height: 100vh;
  }

  /* Sidebar pegado a la izquierda */
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    height: 100vh;
    background: #2C3E50;
    color: white;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .sidebar h2 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .sidebar li {
    padding: 12px;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s;
  }

  .sidebar li:hover {
    background: #34495E;
  }

  /* Contenido del módulo */
  .content {
    margin-left: 250px; /* Ajustar espacio para el sidebar */
    flex-grow: 1;
    padding: 2rem;
  }

  /* Dashboard sin sidebar */
  .dashboard-container {
    text-align: center;
    padding: 2rem;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .modulo {
    background: #f8f8f8;
    padding: 1.5rem;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.3s;
  }

  .modulo:hover {
    transform: translateY(-5px);
  }

  .modulo-icon {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }

  .modulo-name {
    font-size: 1.2rem;
    font-weight: bold;
  }
</style>

{#if vista === "dashboard"}
  <!-- Mostrar solo el Dashboard sin el sidebar -->
  <div class="dashboard-container">
    <h2>Bienvenido, {user.email}</h2>
    <p>Selecciona un módulo para continuar</p>
    <div class="grid">
      {#each modulos as modulo}
        <div class="modulo" on:click={() => cambiarVista(modulo.nombre)}>
          <div class="modulo-icon">{modulo.icono}</div>
          <p class="modulo-name">{modulo.nombre}</p>
        </div>
      {/each}
    </div>
  </div>
{:else}
  <!-- Mostrar los módulos con el sidebar -->
  <div class="layout">
    <nav class="sidebar">
      <h2>Launcher</h2>
      <ul>
        <li on:click={() => vista = "dashboard"}>Dashboard</li>
        <li on:click={() => vista = "recursoshumanos"}>Recursos Humanos</li>
        <li on:click={() => vista = "ventas"}>Ventas</li>
        <li on:click={() => vista = "facturacion"}>Facturación</li>
        <li on:click={() => vista = "inventario"}>Inventario</li>
        <li on:click={() => vista = "reportes"}>Reportes</li> <!-- Corregido: se cambió la mayúscula por minúscula en 'reportes' -->
      </ul>
    </nav>

    <div class="content">

      {#if vista === "recursoshumanos"}
        <RecursosHumanos />
      {:else if vista === "ventas"}
        <Ventas />
      {:else if vista === "facturacion"}
        <Facturacion /> <!-- Mostrar el módulo de Facturación -->
      {:else if vista === "inventario"}
        <Inventario />
      {:else if vista === "reportes"} <!-- Corregido: coincidencia con minúscula -->
        <Reportes />
      {:else}
        <h2>{vista.charAt(0).toUpperCase() + vista.slice(1)}</h2>
        <p>Esta sección está en construcción.</p>
      {/if}
    </div>
  </div>
{/if}
