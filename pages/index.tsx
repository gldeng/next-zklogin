import { useSession, signIn, signOut } from "next-auth/react";
import { padString, toCircomBigIntBytes } from '../src/utils';
import * as jose from 'jose';

export default function Home() {
  const { data: session, status, ...rest } = useSession();
  const userEmail = session?.user?.email;
  const jwtSignature =
    "NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ",
    jwt =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0",
    salt = "a677999396dc49a28ad6c9c242719bb3";

  const generateInput = async () => {
    // eslint-disable-next-line prettier/prettier, no-restricted-globals
    const signatureBigInt = BigInt(
      "0x" + Buffer.from(jwtSignature, "base64").toString("hex")
    );
  
    // public key
    // TODO: generate using jose from remote jwk https://github.com/panva/jose
    const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

    const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS)
    console.log(protectedHeader)
    console.log(payload)
    /* const publicKeyPem = fs.readFileSync(
      path.join(__dirname, "../tests/keys/public_key.pem"),
      "utf8"
    );
    const pubKeyData = pki.publicKeyFromPem(publicKeyPem.toString());
    const pubkeyBigInt = BigInt(pubKeyData.n.toString()); */
  
    /* const input = {
      jwt: padString(jwt, 512),
      signature: toCircomBigIntBytes(signatureBigInt),
      pubkey: toCircomBigIntBytes(pubkeyBigInt),
      salt: padString(salt, 32),
    }; */
  
    //return input;
  };

  if (status === "loading") {
    return <p>Hang on there...</p>;
  }

  if (status === "authenticated") {
    return (
      <>
        <p>Signed in as {userEmail}</p>
        <button onClick={() => generateInput()}>Generate input</button>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  

  return (
    <>
      <p>Not signed in.</p>
      <button onClick={() => signIn("google")}>Sign in</button>
    </>
  );
}
