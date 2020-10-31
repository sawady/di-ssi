import React, { useState } from "react";
import { Credentials } from "uport-credentials";

export default function Home() {
  const [did, setDID] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  function generateKeyPair() {
    const { did, privateKey } = Credentials.createIdentity();
    setDID(did);
    setPrivateKey(privateKey);
  }

  async function downloadFile() {
    const data = {
      did,
      privateKey,
    };
    // is an object and I wrote it to file as
    // json
    const fileName = "credenciales";
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".did";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <h2>Identidad</h2>
      <hr></hr>
      <button onClick={generateKeyPair}>Generar par de claves</button>
      <hr></hr>
      <div>
        <div>DID: {did}</div>
        <div>Clave privada: {privateKey}</div>
      </div>
      {did && (
        <>
          <hr></hr>
          <button onClick={downloadFile}>Descarga</button>
        </>
      )}
    </>
  );
}
