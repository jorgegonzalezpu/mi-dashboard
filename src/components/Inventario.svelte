<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { writable } from "svelte/store";
    import { collection, addDoc, getDocs } from "firebase/firestore";
    import { db } from "../lib/firebase.js";
    import Chart from "chart.js/auto";
  
    const dispatch = createEventDispatcher();
    let productos = writable([]);
    let showModal = false;
  
    let imagen = "";
    let nombre = "";
    let stock = "";
    let precio = "";
    let imagenPreview = "";
  
    let chartInstance = null;
  
    async function cargarProductos() {
      const snapshot = await getDocs(collection(db, "productos"));
      const productosCargados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      productosCargados.forEach(producto => {
        const imagenLocal = localStorage.getItem(`producto_${producto.id}`);
        if (imagenLocal) {
          producto.imagen = imagenLocal;
        }
      });
  
      productos.set(productosCargados);
      actualizarGrafico(productosCargados);
    }
  
    onMount(() => {
      cargarProductos();
    });
  
    function handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          imagenPreview = reader.result;
          imagen = reader.result;
        };
        reader.readAsDataURL(file);
      }
    }
  
    async function agregarProducto() {
      if (!nombre || !stock || !precio || !imagen) {
        alert("Por favor, completa todos los campos y selecciona una imagen.");
        return;
      }
  
      try {
        const nuevoProducto = { imagen: "local", nombre, stock: parseInt(stock), precio: parseFloat(precio) };
        const docRef = await addDoc(collection(db, "productos"), nuevoProducto);
  
        localStorage.setItem(`producto_${docRef.id}`, imagen);
  
        productos.update(lista => [...lista, { id: docRef.id, ...nuevoProducto, imagen }]);
        actualizarGrafico([...$productos, { id: docRef.id, ...nuevoProducto, imagen }]);
  
        nombre = "";
        stock = "";
        precio = "";
        imagenPreview = "";
        imagen = "";
        showModal = false;
      } catch (error) {
        console.error("Error al guardar el producto:", error);
        alert("Hubo un error al guardar el producto.");
      }
    }
  
    function actualizarGrafico(productosData) {
      if (chartInstance) {
        chartInstance.destroy();
      }
  
      const ctx = document.getElementById("productosChart").getContext("2d");
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: productosData.map(p => p.nombre),
          datasets: [{
            label: "Stock",
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
  </script>
  
  <style>
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  
    .header-buttons {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
    }
  
    .chart-container {
      width: 100%;
      max-width: 800px;
      height: 400px;
      margin: 0 auto;
    }
  
    .productos-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      justify-content: center;
      max-width: 1000px;
      margin: 2rem auto;
    }
  
    @media (max-width: 900px) {
      .productos-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  
    @media (max-width: 600px) {
      .productos-grid {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  
    .producto-card {
      text-align: center;
      padding: 1.5rem;
      background: #f8f8f8;
      border-radius: 12px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 250px;
      margin: 0 auto;
    }
  
    .producto-card img {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 10px;
    }
  
    .producto-card h3 {
      margin: 5px 0;
      font-size: 1.2rem;
      font-weight: bold;
    }
  
    .producto-card p {
      font-size: 1rem;
      color: #555;
    }
  
    .modal {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      text-align: center;
      z-index: 1000;
      width: 300px;
    }
  
    .modal input {
      display: block;
      width: 100%;
      margin: 10px 0;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  
    .modal button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      border: none;
      background: #28a745;
      color: white;
      border-radius: 5px;
    }
  
    .modal button:hover {
      background: #218838;
    }
  </style>
  
  <div class="container">
    <h2>Inventario</h2>
  
    <div class="chart-container">
      <canvas id="productosChart"></canvas>
    </div>
  
    <div class="header-buttons">
      <button class="add-button" on:click={() => showModal = true}>Añadir Producto</button>
    </div>
  
    <div class="productos-grid">
      {#each $productos as producto}
        <div class="producto-card">
          <img src={producto.imagen} alt="Imagen de {producto.nombre}" />
          <h3>{producto.nombre}</h3>
          <p>Stock: {producto.stock}</p>
          <p>Precio: ${producto.precio.toFixed(2)}</p>
        </div>
      {/each}
    </div>
  </div>
  
  {#if showModal}
    <div class="modal">
      <h3>Agregar Nuevo Producto</h3>
      <input type="text" placeholder="Nombre" bind:value={nombre} />
      <input type="number" placeholder="Stock" bind:value={stock} />
      <input type="number" placeholder="Precio" bind:value={precio} step="0.01" />
      <input type="file" accept="image/*" on:change={handleFileChange} />
  
      {#if imagenPreview}
        <img src={imagenPreview} alt="Vista previa" width="100" height="100" />
      {/if}
  
      <button on:click={agregarProducto}>Guardar</button>
    </div>
  {/if}
  