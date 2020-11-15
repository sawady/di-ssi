<script>
  import Panel from "../components/Panel";
  import { user } from "../stores/user";
  import Button from "../components/Button.svelte";

  let files;
  let email;
  let password;

  $: if (files && files.length >= 0) {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = function () {
      user.set(JSON.parse(reader.result));
    };
    reader.readAsText(file);
  }

  async function importCredential() {
    try {
      const res = await fetch("http://localhost:8080/auth/credential/get", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error);
      }
      const userResponse = await res.json();
      user.set(userResponse);
    } catch (e) {
      console.log(e);
    }
  }
</script>

<style>
  h1 {
    margin-bottom: 25px;
  }

  .section {
    width: 100%;
    margin-bottom: 25px;
  }

  .file {
    margin-top: 10px;
  }

  input {
    border: 1px solid #ccc !important;
    border-radius: 4px;
    width: 90%;
    padding: 8px;
    display: block;
  }

  input:hover {
    border: 1px solid orange !important;
    border-radius: 4px;
  }

  .line {
    border-bottom: 3px solid white;
    margin-bottom: 25px;
  }
</style>

<svelte:head>
  <title>di-ssi</title>
</svelte:head>

<h1>¡Bienvenido a di-ssi!</h1>

{#if !$user}
  <Panel title="Login / Registro">
    <div class="section">
      <div>Importa tu credencial para loguearte</div>
      <input type="file" accept=".did" class="file" bind:files />
    </div>
    <div class="line" />
    <div class="section">
      <div style="margin-bottom: 15px">o ingresa email y password</div>
      <div style="margin-bottom: 15px">email: <input type="text" bind:value={email} /></div>
      <div style="margin-bottom: 15px">password: <input type="password" bind:value={password} /></div>
      <Button on:click={importCredential}>enviar</Button>
    </div>
    <div class="line" />
    <div class="section">o genera una <a href="identity">nueva credencial</a></div>
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
