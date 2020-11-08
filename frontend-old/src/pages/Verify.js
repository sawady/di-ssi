import React, { useState } from "react";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import didJWT from "did-jwt";
import JSONViewer from "react-json-viewer";

// BFA testnet
// const BLOCKCHAIN_URL_BFA = "http://60.225.64.742:5854";

// uPort SC ON BFA
// const BLOCKCHAIN_CONTRACT_BFA = "0x0b2b8e138c38f4ca844dc79d4c004256712de547";

const BLOCK_CHAIN_URL =
  "https://rinkeby.infura.io/v3/5dcd1d1dbdef433f88f8a23dc862f656"; // ETH

const BLOCK_CHAIN_CONTRACT = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";

const providerConfig = {
  rpcUrl: BLOCK_CHAIN_URL,
  registry: BLOCK_CHAIN_CONTRACT,
};

// getResolver will return an object with a key/value pair of { "ethr": resolver } where resolver is a function used by the generic did resolver.
const ethrDidResolver = getResolver(providerConfig);
const resolver = new Resolver(ethrDidResolver);

export default function Verify() {
  const [jwt, setJWT] = useState("");
  const [res, setRes] = useState("");
  const [error, setError] = useState("");

  async function verifyJWT() {
    try {
      console.log("hola");
      const verifiedResponse = await didJWT.verifyJWT(jwt, {
        resolver: resolver,
      });
      console.log(verifiedResponse);
      setRes(verifiedResponse);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }

  async function onJWTFileChange(event) {
    setJWT("");
    setRes("");
    setError("");
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (evt) {
      const result = reader.result;
      setJWT(result);
    };
    reader.readAsText(file);
  }

  return (
    <>
      <h2>Verificación</h2>
      <div>
        Firma de archivo:{" "}
        <input type="file" onChange={onJWTFileChange} accept=".jwt" />
        {jwt && (
          <>
            <hr></hr>
            <div>JWT: </div>
            <div>{jwt}</div>
            <button onClick={verifyJWT}>Verificar</button>
          </>
        )}
        {res && (
          <>
            <hr></hr>
            <div>Resultado: </div>
            <div>
              <JSONViewer json={{ signer: res.signer }} />
              <JSONViewer json={{ payload: res.payload }} />
            </div>
          </>
        )}
        {error && (
          <>
            <hr></hr>
            <div>Error: {error}</div>
          </>
        )}
      </div>
    </>
  );
}
