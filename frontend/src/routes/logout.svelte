<script>
  import Button from "../components/Button.svelte";
  import { user } from "../stores/user";
  import { goto } from "@sapper/app";

  async function logout() {
    await goto("/");
    user.set(null);
  }
</script>

<svelte:head>
  <title>Salir</title>
</svelte:head>

<h2>¿Deseas salir y borrar los datos de la aplicación?</h2>

<div>
  <Button on:click={logout}>Salir</Button>
</div>
