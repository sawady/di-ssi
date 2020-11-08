<script>
  import Panel from "../components/Panel";
  import { user } from "../stores/user";

  let files;

  $: if (files && files.length >= 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function () {
      user.set(JSON.parse(reader.result));
    };
    reader.readAsText(file);
  }
</script>

<style>
  h1 {
    margin-bottom: 25px;
  }

  .flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .line {
    border-left: 1px solid gray;
    height: 100px;
  }

  .file {
    margin-top: 10px;
  }
</style>

<svelte:head>
  <title>di-ssi</title>
</svelte:head>

<h1>¡Bienvenido a di-ssi!</h1>

{#if !$user}
  <Panel title="Login / Registro">
    <div class="flex">
      <div>
        <div>Sube tu credencial para loguearte</div>
        <input type="file" accept=".did" class="file" bind:files />
      </div>
      <div class="line" />
      <div>o genera una <a href="identity">nueva credencial</a></div>
    </div>
  </Panel>
{/if}

{#if $user}
  <Panel title="¡Bienvenido!">
    <strong>DID: </strong>
    <p>{$user.did}</p>
    <strong>EMAIL: </strong>
    <p>{$user.email}</p>
    <strong>FECHA DE CREACIÓN: </strong>
    <p>{new Date($user.date)}</p>
  </Panel>
{/if}

