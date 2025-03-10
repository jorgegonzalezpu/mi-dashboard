<script>
    import { onMount } from 'svelte'; // Importamos onMount
    import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
    import { db } from "../lib/firebase.js";
    import Chart from "chart.js/auto";
  
    let productos = [];  // Usamos variables normales, sin writable
    let ventas = [];
    let productoSeleccionado = "";
    let cantidadVenta = 0;
    let cliente = "Cliente Ficticio";
  
    let chartInstance = null;
  
    let bestProduct = {}; // Definir el mejor producto
  
    // Cargar productos desde Firestore
    async function cargarProductos() {
      const snapshot = await getDocs(collection(db, "productos"));
      productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      // Si las imágenes están almacenadas en Firebase Storage, debes tener las URLs en Firestore
      // Aquí asumimos que la URL está almacenada en el campo 'imagen' de cada producto
      productos.forEach(producto => {
        if (producto.imagen) {
          // La URL de la imagen ya debería estar almacenada en Firestore
          producto.imagen = producto.imagen; // Asegúrate de que sea una URL válida
        }
      });
  
      actualizarGrafico(productos);
      obtenerMejorProducto(); // Llamar para actualizar el mejor producto
    }
  
    // Cargar ventas mensuales
    async function cargarVentas() {
      const snapshot = await getDocs(collection(db, "ventas"));
      ventas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  
    // Función para actualizar la gráfica de ventas
    function actualizarGrafico(productosData) {
      if (chartInstance) {
        chartInstance.destroy();
      }
  
      const ctx = document.getElementById("ventasChart").getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: productosData.map(p => p.nombre),
          datasets: [{
            label: "Ventas Mensuales",
            data: productosData.map(p => p.stock),
            backgroundColor: "rgba(54, 162, 235, 0.6)"
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
  
    // Función para obtener el mejor producto
    function obtenerMejorProducto() {
      // Asegúrate de que hay productos cargados
      if (productos.length > 0) {
        bestProduct = productos.reduce((prev, current) => (prev.ventas > current.ventas) ? prev : current, {});
      }
    }
  
    // Vender producto
    async function venderProducto() {
      if (productoSeleccionado && cantidadVenta > 0) {
        const producto = productos.find(p => p.nombre === productoSeleccionado);
  
        if (producto.stock >= cantidadVenta) {
          // Actualizar stock en Firestore
          const productoRef = doc(db, "productos", producto.id);
          await updateDoc(productoRef, {
            stock: producto.stock - cantidadVenta
          });
  
          // Registrar venta
          const venta = { producto: producto.nombre, cantidad: cantidadVenta, cliente, fecha: new Date() };
          await addDoc(collection(db, "ventas"), venta);
  
          // Actualizar la gráfica y productos
          cargarProductos();
          cargarVentas();
        } else {
          alert("No hay suficiente stock.");
        }
      }
    }
  
    // Cargar datos iniciales
    onMount(() => {
      cargarProductos();
      cargarVentas();
    });
  </script>
  
  <style>
    .ventas-container {
      text-align: center;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .ventas-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin: 2rem 0;
    }
  
    .producto-card {
      text-align: center;
      padding: 1rem;
      background: #f8f8f8;
      border-radius: 12px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 250px;
    }
  

  
    .producto-card h3 {
      font-size: 1.2rem;
      font-weight: bold;
    }
  
    .producto-card p {
      color: #555;
    }
  
    .ventas-chart-container {
      width: 100%;
      height: 400px;
      margin: 0 auto;
    }
  
    .form-container {
      margin-top: 20px;
      text-align: center;
    }
  
    .form-container input, .form-container select {
      padding: 0.5rem;
      margin: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  
    .form-container button {
      padding: 0.7rem 1.5rem;
      cursor: pointer;
      border: none;
      background: #28a745;
      color: white;
      border-radius: 5px;
      font-size: 1rem;
    }
  
    .form-container button:hover {
      background: #218838;
    }
  </style>
  
  <div class="ventas-container">
    <h2>Ventas</h2>
  
    <div class="ventas-chart-container">
      <canvas id="ventasChart"></canvas>
    </div>
  
    <div class="form-container">
      <h3>Vender Producto</h3>
      <select bind:value={productoSeleccionado}>
        <option disabled selected>Selecciona un Producto</option>
        {#each productos as producto}
          <option>{producto.nombre}</option>
        {/each}
      </select>
      <input type="number" bind:value={cantidadVenta} placeholder="Cantidad" />
      <button on:click={venderProducto}>Vender</button>
    </div>
  
    <h3>Productos Más Vendidos</h3>
    <div class="ventas-grid">
      {#each productos.slice(0, 4) as producto}
        <div class="producto-card">
          <!-- Asegúrate de que el campo imagen está correctamente referenciado -->
          <h3>{producto.nombre}</h3>
          <p>Stock: {producto.stock}</p>
          <p>Precio: ${producto.precio.toFixed(2)}</p>
        </div>
      {/each}
    </div>
  
    <div class="ventas-grid">
      <div class="producto-card">
        <h3>Mejor Producto</h3>
        <p>{bestProduct.nombre || 'Cargando...'}</p>
        <p>{bestProduct.ventas || '10'} Unidades</p>
      </div>
    </div>
  </div>
  