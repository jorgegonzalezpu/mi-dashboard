<script>
  import { auth } from '../lib/firebase.js';
  import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

  let email = "";
  let password = "";
  let error = "";
  let isRegister = false; // Alterna entre login y registro

  async function handleAuth() {
    try {
      if (isRegister) {
        // Registro de usuario
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Inicio de sesión
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Limpiar error en caso de éxito
      error = "";
    } catch (err) {
      error = "Error: " + err.message;
    }
  }
</script>

<style>
  .login-container {
    max-width: 300px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }
  input {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
  }
  button {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  .toggle-auth {
    margin-top: 10px;
    color: blue;
    cursor: pointer;
  }
</style>

<div class="login-container">
  <h2>{isRegister ? "Registro" : "Iniciar Sesión"}</h2>
  {#if error}
    <p style="color:red">{error}</p>
  {/if}
  <input type="email" placeholder="Correo electrónico" bind:value={email} required />
  <input type="password" placeholder="Contraseña" bind:value={password} required />
  <button on:click={handleAuth}>{isRegister ? "Registrarse" : "Entrar"}</button>

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <p class="toggle-auth" on:click={() => isRegister = !isRegister}>
    {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
  </p>
</div>
