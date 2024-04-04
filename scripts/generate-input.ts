import fs from "fs";
import * as jose from 'jose'
import { pki } from "node-forge";
import { padString, toCircomBigIntBytes } from "../src/utils";
import  * as jsonwebtoken from 'jsonwebtoken';
import inquirer from "inquirer";

const _jwtSignature =
    "NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ",
  _jwt =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0",
  _salt = "a677999396dc49a28ad6c9c242719bb3";

export const generateInput = async ({
  jwtSignature = _jwtSignature,
  jwt = _jwt,
  salt = _salt,
}) => {
  // eslint-disable-next-line prettier/prettier, no-restricted-globals
  const signatureBigInt = BigInt(
    "0x" + Buffer.from(jwtSignature, "base64").toString("hex")
  );
    const decodedToken = jsonwebtoken.decode(jwt, { complete: true });
    // Access the header information
    const header = decodedToken?.header;
    // Access the "kid" (key ID)
    const kid = header?.kid;

  // public key
  const jwkResponse = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  const jwkList = await jwkResponse.json();
  const jwkValue = jwkList.keys.find((item: any) => item.kid === kid)?.n;
  const publicKey = await jose.importJWK(
    {
      kty: 'RSA',
      e: 'AQAB',
      n: jwkValue,
    },
    'PS256',
  );
  const spkiPem = await jose.exportSPKI(publicKey as jose.KeyLike)
  const pubKeyData = pki.publicKeyFromPem(spkiPem.toString());
  console.log("pubKeyData: ", pubKeyData);
  console.log("spkiPem: ", spkiPem);
  console.log("jwkValue: ", jwkValue);
  const pubkeyBigInt = BigInt(pubKeyData.n.toString());


  const input = {
    jwt: padString(jwt, 512),
    signature: toCircomBigIntBytes(signatureBigInt),
    pubkey: toCircomBigIntBytes(pubkeyBigInt),
    salt: padString(salt, 32),
    jwkValue,
  };

  console.log("input: ", input);
  const result = {
    input, jwkValue
  }
  return result;
};

inquirer
  .prompt([
    {
      type: "input",
      name: "jwtSignature",
      message: "Enter jwt signature:",
      default: _jwtSignature,
    },
    {
      type: "input",
      name: "jwt",
      message: "Enter jwt:",
      default: _jwt,
    },
    {
      type: "input",
      name: "salt",
      message: "Enter salt:",
      default: _salt,
    },
    {
      type: "input",
      name: "filename",
      message: "Enter filename:",
      default: "bls12381/input.json",
    },
  ])
  .then((answers) => {
    const { jwtSignature, jwt, salt, filename } = answers;

    const output = generateInput({ jwtSignature, jwt, salt });

    fs.writeFile(filename, JSON.stringify(output), (err) => {
      if (err) {
        console.error(err);
      }
      // done!
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });