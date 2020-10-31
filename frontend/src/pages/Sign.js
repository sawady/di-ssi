import React, { useState } from "react";
import CryptoJS from "crypto-js";
import didJWT from "did-jwt";

export default function Sign() {
  const [hash, setHash] = useState("");
  const [progress, setProgress] = useState("");
  const [did, setDid] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [jwt, setJWT] = useState("");

  function onCredentialsFileChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (evt) {
      const result = JSON.parse(reader.result);
      setDid(result.did);
      setPrivateKey(result.privateKey);
    };
    reader.readAsText(file);
  }

  function onToSignFileChange(event) {
    setHash("");
    const file = event.target.files[0];
    const SHA256 = CryptoJS.algo.SHA256.create();
    let counter = 0;
    loading(
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
    const signer = didJWT.SimpleSigner(privateKey);
    let jwt = await didJWT.createJWT(
      { hash },
      {
        alg: "ES256K",
        issuer: did,
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
        <div>
          Credenciales:{" "}
          <input type="file" onChange={onCredentialsFileChange} accept=".did" />
          {did && privateKey && (
            <>
              <hr></hr>
              <div>DID: {did}</div>
              <div>Clave privada: {privateKey}</div>
            </>
          )}
        </div>
        <hr></hr>
        <div>
          Archivo a firmar: <input type="file" onChange={onToSignFileChange} />
        </div>
        <hr></hr>
        <div>Hash: {hash || "-"}</div>
        <div>Progreso: {progress || "0%"}</div>
        <hr></hr>
        {hash !== "" && did !== "" && (
          <>
            <button onClick={createJWT}>Firmar</button>
            <div style={{ overflowWrap: "break-word" }}>
              {jwt && <span>JWT: {jwt}</span>}
            </div>
            {jwt && <button onClick={downloadJWT}>Descargar JWT</button>}
          </>
        )}
      </div>
    </>
  );
}

function loading(file, callbackProgress, callbackFinal) {
  let chunkSize = 1024 * 1024; // bytes
  let offset = 0;
  let size = chunkSize;
  let partial;
  let index = 0;
  let lastOffset = 0;
  let chunkTotal = 0;
  let previous = [];
  let chunkReorder = 0;

  if (file.size === 0) {
    callbackFinal();
  }
  while (offset < file.size) {
    partial = file.slice(offset, offset + size);
    let reader = new FileReader();
    reader.size = chunkSize;
    reader.offset = offset;
    reader.index = index;
    reader.onload = function (evt) {
      callbackRead_buffered(reader, file, evt, callbackProgress, callbackFinal);
    };
    reader.readAsArrayBuffer(partial);
    offset += chunkSize;
    index += 1;
  }
  function callbackRead_buffered(
    reader,
    file,
    evt,
    callbackProgress,
    callbackFinal
  ) {
    chunkTotal++;

    if (lastOffset !== reader.offset) {
      // out of order
      console.log(
        "[",
        reader.size,
        "]",
        reader.offset,
        "->",
        reader.offset + reader.size,
        ">>buffer"
      );
      previous.push({
        offset: reader.offset,
        size: reader.size,
        result: reader.result,
      });
      chunkReorder++;
      return;
    }

    function parseResult(offset, size, result) {
      lastOffset = offset + size;
      callbackProgress(result);
      if (offset + size >= file.size) {
        lastOffset = 0;
        callbackFinal();
      }
    }

    // in order
    console.log(
      "[",
      reader.size,
      "]",
      reader.offset,
      "->",
      reader.offset + reader.size,
      ""
    );
    parseResult(reader.offset, reader.size, reader.result);

    // resolve previous buffered
    var buffered = [{}];
    while (buffered.length > 0) {
      buffered = previous.filter(function (item) {
        return item.offset === lastOffset;
      });
      buffered.forEach(function (item) {
        console.log(
          "[",
          item.size,
          "]",
          item.offset,
          "->",
          item.offset + item.size,
          "<<buffer"
        );
        parseResult(item.offset, item.size, item.result);
        remove(previous, item);
      });
    }
  }
}

function remove(arr, item) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === item) {
      arr.splice(i, 1);
    }
  }
}
