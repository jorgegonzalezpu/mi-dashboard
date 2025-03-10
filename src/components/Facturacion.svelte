<script>
    import { onMount } from 'svelte'; // Importamos onMount
    import Chart from 'chart.js/auto';
  
    // Datos ficticios para la facturación mensual
    const facturacionMensual = [
      { mes: "Enero", cantidad: 6000 },
      { mes: "Febrero", cantidad: 5000 },
      { mes: "Marzo", cantidad: 7000 },
      { mes: "Abril", cantidad: 8000 },
      { mes: "Mayo", cantidad: 7500 },
      { mes: "Junio", cantidad: 6500 },
    ];
  
    // Datos ficticios de las facturas
    const facturas = [
      { empresa: "Empresa A", monto: 2000, fecha: "2025-02-10", estado: "Pagado" },
      { empresa: "Empresa B", monto: 3500, fecha: "2025-01-15", estado: "Pendiente" },
      { empresa: "Empresa C", monto: 1500, fecha: "2025-02-05", estado: "Pagado" },
      { empresa: "Empresa D", monto: 5000, fecha: "2025-01-25", estado: "Pendiente" },
    ];
  
    let chartInstance = null;
  
    // Función para actualizar el gráfico
    function actualizarGrafico() {
      const ctx = document.getElementById("facturacionChart").getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: facturacionMensual.map(f => f.mes),
          datasets: [{
            label: "Facturación Mensual",
            data: facturacionMensual.map(f => f.cantidad),
            backgroundColor: "rgba(255, 99, 132, 0.6)"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    // Cargar los gráficos al montar el componente
    onMount(() => {
      actualizarGrafico();
    });
  </script>
  
  <style>
    .facturacion-container {
      text-align: center;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .facturacion-chart-container {
      width: 100%;
      height: 400px;
      margin: 0 auto;
    }
  
    .facturas-table {
      width: 100%;
      margin-top: 2rem;
      border-collapse: collapse;
    }
  
    .facturas-table th,
    .facturas-table td {
      padding: 10px;
      border: 1px solid #ccc;
      text-align: center;
    }
  
    .facturas-table th {
      background-color: #f8f8f8;
    }
  
    .estado-pagado {
      color: green;
      font-weight: bold;
    }
  
    .estado-pendiente {
      color: red;
      font-weight: bold;
    }
  </style>
  
  <div class="facturacion-container">
    <h2>Facturación</h2>
  
    <div class="facturacion-chart-container">
      <canvas id="facturacionChart"></canvas>
    </div>
  
    <h3>Lista de Facturas</h3>
    <table class="facturas-table">
      <thead>
        <tr>
          <th>Empresa</th>
          <th>Monto</th>
          <th>Fecha</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        {#each facturas as factura}
          <tr>
            <td>{factura.empresa}</td>
            <td>${factura.monto}</td>
            <td>{factura.fecha}</td>
            <td class={factura.estado === "Pagado" ? 'estado-pagado' : 'estado-pendiente'}>
              {factura.estado}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  