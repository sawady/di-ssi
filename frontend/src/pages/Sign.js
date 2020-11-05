import React, { useState } from "react";
import CryptoJS from "crypto-js";
import didJWT from "did-jwt";
import signChunks from "../helpers/signChunks";
import Panel from "../components/Panel";
import Row from "../components/Row";

export default function Sign() {
  const [hash, setHash] = useState("");
  const [progress, setProgress] = useState("");
  const [credential, setCredential] = useState(null);
  const [link, setLink] = useState("");
  const [jwt, setJWT] = useState("");

  function onChangeLink(event) {
    let url = event.target.value;
    if (!url.includes("https://") && !url.includes("http://")) {
      url = "https://" + url;
    }
    setLink(url);
    setJWT("");
  }

  function onCredentialsFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (evt) {
      const result = JSON.parse(reader.result);
      setCredential(result);
    };
    reader.readAsText(file);
  }

  function onToSignFileChange(event) {
    setHash("");
    const file = event.target.files[0];
    const SHA256 = CryptoJS.algo.SHA256.create();
    let counter = 0;
    signChunks(
      file,
      function (data) {
        const wordBuffer = CryptoJS.lib.WordArray.create(data);
        SHA256.update(wordBuffer);
        counter += data.byteLength;
        const p = ((counter / file.size) * 100).toFixed(0) + "%";
        setProgress(p);
        console.log(p);
      },
      function (data) {
        const p = "100%";
        setProgress(p);
        console.log(p);
        const encrypted = SHA256.finalize().toString();
        console.log("encrypted: " + encrypted);
        setHash(encrypted);
      }
    );
  }

  async function createJWT() {
    const signer = didJWT.SimpleSigner(credential.privateKey);
    let jwt = await didJWT.createJWT(
      { hash, link },
      {
        alg: "ES256K",
        issuer: credential.did,
        signer,
      }
    );
    console.log(jwt);
    setJWT(jwt);
  }

  async function downloadJWT() {
    // is an object and I wrote it to file as
    // json
    const fileName = "jwt-" + Date.now();
    const blob = new Blob([jwt], { type: "application/text" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".jwt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <h2>Firma de archivo</h2>
      <div>
        <Panel>
          <h3>1. Ingresa tus credenciales</h3>
          {!credential && (
            <input
              type="file"
              onChange={onCredentialsFileChange}
              accept=".did"
            />
          )}
          {credential && (
            <>
              <Row title="Nombre:">{credential.name}</Row>
              <Row title="Fecha de creación:">
                {new Date(credential.date).toString()}
              </Row>
              <Row title="DID:">{credential.did}</Row>
              <Row title="Clave privada:">{credential.privateKey}</Row>
            </>
          )}
        </Panel>
        {credential && (
          <Panel>
            <h3>2. Ingresa el archivo a firmar</h3>
            <input type="file" onChange={onToSignFileChange} />
            <hr></hr>
            <div>Hash: {hash || "-"}</div>
            <div>Progreso: {progress || "0%"}</div>
          </Panel>
        )}
        {hash && (
          <Panel>
            <h3>3. Ingresa un link al archivo</h3>
            <input type="url" onChange={onChangeLink} />
            <hr></hr>
            <Row title="Link:">
              <a href={link} target="_blank" rel="noreferrer">
                {link}
              </a>
            </Row>
          </Panel>
        )}
        {link && (
          <Panel>
            <h3>4. Crear documento de firma</h3>
            {!jwt && <button onClick={createJWT}>Firmar</button>}
            {jwt && (
              <>
                <Row title="JWT:">{jwt}</Row>
                <hr></hr>
                <button onClick={downloadJWT}>Descargar JWT</button>
              </>
            )}
          </Panel>
        )}
      </div>
    </>
  );
}
