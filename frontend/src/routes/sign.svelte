<script>
  import CryptoJS from "crypto-js";
  import didJWT from "did-jwt";
  import signChunks from "../helpers/signChunks";
  import Panel from "../components/Panel.svelte";
  import Button from "../components/Button.svelte";
  import { user } from "../stores/user";
  import Credential from "../components/Credential.svelte";

  let link;
  let files;
  let progress;
  let hash;
  let jwt;

  $: url = !link
    ? ""
    : !link.includes("https://") && !link.includes("http://")
    ? "https://" + link
    : link;

  $: if (files && files.length >= 0) {
    hash = "";
    const file = files[0];
    const SHA256 = CryptoJS.algo.SHA256.create();
    let counter = 0;
    signChunks(
      file,
      function (data) {
        const wordBuffer = CryptoJS.lib.WordArray.create(data);
        SHA256.update(wordBuffer);
        counter += data.byteLength;
        const p = ((counter / file.size) * 100).toFixed(0) + "%";
        progress = p;
        console.log(p);
      },
      function () {
        progress = "100%";
        const encrypted = SHA256.finalize().toString();
        console.log("encrypted: " + encrypted);
        hash = encrypted;
      }
    );
  }

  async function createJWT() {
    const signer = didJWT.SimpleSigner($user.privateKey);
    let resultJWT = await didJWT.createJWT(
      { hash, link },
      {
        alg: "ES256K",
        issuer: $user.did,
        signer,
      }
    );
    console.log(resultJWT);
    jwt = resultJWT;
  }

  async function downloadJWT() {
    const fileName = "jwt-" + Date.now();
    const blob = new Blob([jwt], { type: "application/text" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".jwt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
</script>

<svelte:head>
  <title>Firma</title>
</svelte:head>

<h1>Firma de un documento</h1>

<Panel title="1. Ingresa el archivo a firmar">
  <div><input type="file" class="file" bind:files /></div>
  <br />
  <strong>Hash:</strong>
  <p>{hash || ''}</p>
  <strong>Progreso:</strong>
  <p>{progress || ''}</p>
</Panel>

{#if hash}
  <Panel title="2. Ingresa un link al archivo">
    <strong>Link:</strong>
    <div><input type="text" bind:value={link} /></div>
    <p>{url}</p>
  </Panel>
{/if}

{#if url && link}
  <Panel title="3. Crear credencial de firma">
    {#if jwt}
			<Credential jwt={jwt} />
			<br />
			<Button on:click={() => {}}>Almacenar en el servidor</Button>
			<Button on:click={() => {}}>Enviar al sujeto</Button>
      <Button on:click={downloadJWT}>Descarga la credencial</Button>
    {:else}
      <Button on:click={createJWT}>Firmar</Button>
    {/if}
  </Panel>
{/if}
