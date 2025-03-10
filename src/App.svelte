<script>
	import { onMount } from 'svelte';
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import Login from './components/Login.svelte';
	import Dashboard from './components/Dashboard.svelte';
	import { auth } from './lib/firebase.js';
  
	let isLogged = false;
	let user = null;
  
	// Detectar el estado de autenticación
	onMount(() => {
	  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
		isLogged = !!firebaseUser;
		user = firebaseUser;
	  });
  
	  return () => unsubscribe();
	});
  
	// Cerrar sesión
	function logout() {
	  signOut(auth);
	}
  </script>
  
  <main>
	{#if !isLogged}
	  <Login />
	{:else}
	  <button on:click={logout} style="position: absolute; top: 10px; right: 10px;">Cerrar sesión</button>
	  <Dashboard {user} />
	{/if}
  </main>
  
  <style>
	main {
	  text-align: center;
	  padding: 1em;
	  margin: 0 auto;
	  max-width: 800px;
	}
  </style>
  