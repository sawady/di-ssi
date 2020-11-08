<script>
  import { Credentials } from "uport-credentials";
  import Panel from "../components/Panel.svelte";
  import Loader from "../components/Loader.svelte";
  import Button from "../components/Button.svelte";

  let did = "";
  let privateKey = "";
  let name = "";
  let guardado = false;
  let uploading = false;
  let uploaded = false;
  let email = "";
  let invalidEmail = false;

  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  $: invalidEmail = email.length > 0 && !regex.test(email);

  function createIdentity() {
    const credentials = Credentials.createIdentity();
    did = credentials.did;
    privateKey = credentials.privateKey;
  }

  async function downloadFile() {
    const data = {
      did,
      privateKey,
      email,
      date: Date.now(),
    };
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = name + ".did";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    guardado = true;
  }

  async function uploadCredential() {
    uploading = true;
    uploaded = false;
    await new Promise((resolve) => {
      setTimeout(() => resolve(null), 2000);
    });
    uploading = false;
    uploaded = true;
  }
</script>

<style>
  h1 {
    margin-bottom: 25px;
  }

  a {
    text-decoration: none;
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

  .error {
    color: lightcoral;
  }
</style>

<svelte:head>
  <title>Identidad</title>
</svelte:head>

<h1>Generación de identidad</h1>

<Panel title="1. Presiona el botón para generar un par de claves">
  <Button on:click={createIdentity}>Crear identidad</Button>
  <p><strong>DID (clave pública): </strong>{did}</p>
  <p><strong>Clave privada: </strong>{privateKey}</p>
</Panel>

{#if did}
  <Panel
    title="2. Asigna un nombre e email a tu credencial de identidad para poder descargarla">
    <strong>Nombre del archivo: </strong>
    <p><input type="text" bind:value={name} /></p>
    <strong>Email: </strong>
    <p><input type="email" bind:value={email} /></p>
    {#if invalidEmail}
      <p class="error">el email es inválido</p>
    {/if}
  </Panel>
{/if}

{#if name && email}
  <Panel title="3. Descarga tu credencial de identidad">
    <Button on:click={downloadFile}>Descarga</Button>
  </Panel>
{/if}

{#if guardado}
  <Panel title="4. ¿Deseas almacenar la credencial en el servidor?">
    {#if !uploaded && !uploading}
      <Button on:click={uploadCredential}>Subir</Button>
    {/if}
    {#if uploading}
      <Loader />
    {/if}
    {#if uploaded}
      <h4>¡Almacenado! 👌</h4>
    {/if}
  </Panel>
{/if}

<a href=".">🢨 Volver</a>
