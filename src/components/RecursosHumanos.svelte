<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { writable } from "svelte/store";
    import { collection, addDoc, getDocs } from "firebase/firestore";
    import { db } from "../lib/firebase.js";
  
    const dispatch = createEventDispatcher();
    let empleados = writable([]);
    let showModal = writable(false); // ✅ Ahora es reactivo
  
    let foto = "";
    let nombre = "";
    let apellidos = "";
    let puesto = "";
    let imagenPreview = "";
  
    // Cargar empleados desde Firestore
    async function cargarEmpleados() {
      const snapshot = await getDocs(collection(db, "empleados"));
      const empleadosCargados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
      empleadosCargados.forEach(empleado => {
        const imagenLocal = localStorage.getItem(`empleado_${empleado.id}`);
        if (imagenLocal) {
          empleado.foto = imagenLocal;
        }
      });
  
      empleados.set(empleadosCargados);
    }
  
    onMount(() => {
      cargarEmpleados();
    });
  
    // Manejar la selección de imagen
    function handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          imagenPreview = reader.result;
          foto = reader.result; // ✅ Ahora guarda la imagen correctamente
        };
        reader.readAsDataURL(file);
      }
    }
  
    // Agregar empleado
    async function agregarEmpleado() {
      if (!nombre || !apellidos || !puesto || !foto) {
        alert("Por favor, completa todos los campos y selecciona una imagen.");
        return;
      }
  
      try {
        const nuevoEmpleado = { foto: "local", nombre, apellidos, puesto };
        const docRef = await addDoc(collection(db, "empleados"), nuevoEmpleado);
  
        localStorage.setItem(`empleado_${docRef.id}`, foto);
  
        empleados.update(lista => [...lista, { id: docRef.id, ...nuevoEmpleado, foto }]);
  
        nombre = "";
        apellidos = "";
        puesto = "";
        imagenPreview = "";
        foto = "";
        showModal.set(false); // ✅ Cerrar modal correctamente
  
      } catch (error) {
        console.error("Error al guardar el empleado:", error);
        alert("Hubo un error al guardar el empleado.");
      }
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
  
    .empleados-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      justify-content: center;
      max-width: 1000px;
      margin: 0 auto;
    }
  
    @media (max-width: 900px) {
      .empleados-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  
    @media (max-width: 600px) {
      .empleados-grid {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  
    .empleado-card {
      text-align: center;
      padding: 1.5rem;
      background: #f8f8f8;
      border-radius: 12px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 250px;
      margin: 0 auto;
    }
  
    .empleado-card img {
      width: 120px;
      height: 120px;
      object-fit: cover;
      border-radius: 50%;
      margin-bottom: 10px;
    }
  
    .empleado-card h3 {
      margin: 5px 0;
      font-size: 1.2rem;
      font-weight: bold;
    }
  
    .empleado-card p {
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
  
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
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
    <h2>Recursos Humanos</h2>
  
    <div class="header-buttons">
      <button class="add-button" on:click={() => showModal.set(true)}>Añadir Empleado</button>
    </div>
  
    <div class="empleados-grid">
      {#each $empleados as empleado}
        <div class="empleado-card">
          <img src={empleado.foto} alt="Foto de {empleado.nombre}" />
          <h3>{empleado.nombre} {empleado.apellidos}</h3>
          <p>{empleado.puesto}</p>
        </div>
      {/each}
    </div>
  </div>
  
  {#if $showModal}
    <div class="overlay" on:click={() => showModal.set(false)}></div>
    <div class="modal">
      <h3>Agregar Nuevo Empleado</h3>
      <input type="text" placeholder="Nombre" bind:value={nombre} />
      <input type="text" placeholder="Apellidos" bind:value={apellidos} />
      <input type="text" placeholder="Puesto de Trabajo" bind:value={puesto} />
      <input type="file" accept="image/*" on:change={handleFileChange} />
  
      {#if imagenPreview}
        <img src={imagenPreview} alt="Vista previa" width="100" height="100" />
      {/if}
  
      <button on:click={agregarEmpleado}>Guardar</button>
    </div>
  {/if}
  