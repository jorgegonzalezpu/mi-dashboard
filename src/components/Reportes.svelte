<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
  
    // Datos inventados para el reporte
    const distribucionRecursos = {
      ventas: 50000,
      gastos: 15000,
      inventario: 30000,
      salarios: 20000
    };
  
    const balanceGeneral = {
      balanceNeto: 15000,
      rentabilidad: 30.00
    };
  
    // Función para actualizar el gráfico de distribución de recursos
    let chartInstance = null;
  
    function actualizarGrafico() {
      const ctx = document.getElementById("distribucionChart").getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Ventas", "Gastos", "Inventario", "Salarios"],
          datasets: [{
            label: "Distribución de Recursos",
            data: [
              distribucionRecursos.ventas,
              distribucionRecursos.gastos,
              distribucionRecursos.inventario,
              distribucionRecursos.salarios
            ],
            backgroundColor: ["#28a745", "#dc3545", "#ffc107", "#007bff"],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom'
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
    .reportes-container {
      text-align: center;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .chart-container {
      width: 100%;
      max-width: 800px;
      height: 400px;
      margin: 0 auto;
    }
  
    .tabla-container {
      margin-top: 2rem;
    }
  
    .detalle-table {
      width: 100%;
      margin-top: 2rem;
      border-collapse: collapse;
    }
  
    .detalle-table th,
    .detalle-table td {
      padding: 10px;
      border: 1px solid #ccc;
      text-align: center;
    }
  
    .detalle-table th {
      background-color: #f8f8f8;
    }
  
    .balance-container {
      margin-top: 3rem;
      padding: 1rem;
      background-color: #f8f8f8;
      border-radius: 8px;
    }
  
    .balance-container h4 {
      margin-bottom: 1rem;
    }
  
    .balance-container p {
      font-size: 1.2rem;
    }
  </style>
  
  <div class="reportes-container">
    <h2>Reportes</h2>
  
    <!-- Gráfico de distribución de recursos -->
    <div class="chart-container">
      <canvas id="distribucionChart"></canvas>
    </div>
  
    <!-- Detalles de Reportes -->
    <div class="tabla-container">
      <h3>Detalle de Reportes</h3>
      <table class="detalle-table">
        <thead>
          <tr>
            <th>Recurso</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ventas</td>
            <td>${distribucionRecursos.ventas.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Gastos</td>
            <td>${distribucionRecursos.gastos.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Inventario</td>
            <td>${distribucionRecursos.inventario.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Salarios</td>
            <td>${distribucionRecursos.salarios.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  
  </div>
  