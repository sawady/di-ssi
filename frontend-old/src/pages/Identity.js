import React, { useState, useContext } from "react";
import { Credentials } from "uport-credentials";
import Panel from "../components/Panel";
import Row from "../components/Row";
import { store } from "../hooks/useUser";

export default function Home() {
  const [did, setDID] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [name, setName] = useState("");
  const { state, dispatch } = useContext(store);

  function onChangeName(event) {
    setName(event.target.value);
  }

  function generateKeyPair() {
    const { did, privateKey } = Credentials.createIdentity();
    setDID(did);
    setPrivateKey(privateKey);
    if (state.did === "chau") {
      dispatch({ type: "login" });
    } else {
      dispatch({ type: "logout" });
    }
  }

  async function downloadFile() {
    const data = {
      did,
      privateKey,
      name,
      date: Date.now(),
    };
    // is an object and I wrote it to file as
    // json
    const fileName = name;
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);
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
      <Panel>
        <h3>1. Genera tu identidad (DID)</h3>
        <button onClick={generateKeyPair}>Generar par de claves</button>
        <div>
          <Row title="DID:">{did}</Row>
          <Row title="Clave privada:">{privateKey}</Row>
          <Row title="User:">{state.did}</Row>
        </div>
      </Panel>
      <hr></hr>
      <Panel>
        <h3>
          2. Asigna un nombre a tu credencial de identidad para poder
          descargarla
        </h3>
        Nombre: <input type="text" onChange={onChangeName} />
      </Panel>
      {did && name && (
        <>
          <hr></hr>
          <button onClick={downloadFile}>Descarga</button>
        </>
      )}
    </>
  );
}
