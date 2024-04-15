// @ts-ignore
import AElf from 'aelf-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const ipAddress = "10.0.1.17"; //34.134.26.210
  let identifierHash: string = "217f047dbbf7b6233d427a811ac87ce13587ed66b9d8d1df10304f747e71ef65";
  let proof: string = "dd035f99330d5786b42537194346d69f1b4c2ce359b3191981d92451e5d90600736a41a5b2e104c7598f185deb60b4ae150050a3ddb11122a81bdcc10754211c9a8e0e56ebcc6547823aef5d407995601e5d480d0be7440bff95d31fe43b34045d70e8b844d1399e0cc86a09d8fece16e86714d903635ad6d4cebeea986f0b82";
  let publicKey: string = "dcd5f001235fffbfbd84e5832b2677f6a833fb297f9e9b88b018319e136813b5b241097e9ae6a33ec411745a8cf875ac0006d2fd6b4bae67f66914a68d7066f305c721e26372b66259e5274b27d92c3af5de3c5784dd2b0ef762644b0095a2ae87e8828300bfa577744ed5a969896fe45160bae4a2b4a4ce88347acf77926547745cdc6bf0f3820d0ed5946ff81f2ce1b0eee73b0822bcef8fcde90311b7282c8f7753cbb32995d81d24716168684a9e3b3db33d0f959bbb05ea6e65d1a7d4e3889532e86a84389e0ad8536fa9efa0e82dc19e93d5b8764d6957fc4063fcd3aad6ad63dd2748ab181860f846ac0beb1d152ac7de4c4cc4115f56cba3ebd53eed";
  const { token } = req.body;
  console.log("token: ", token);
  const id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjkzYjQ5NTE2MmFmMGM4N2NjN2E1MTY4NjI5NDA5NzA0MGRhZjNiNDMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MDE1NzYwMDcyMTEtdWQyMWRwcXRyOHZmZ2hha3FyZ2lvMWc5NDk4czM5a2suYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MDE1NzYwMDcyMTEtdWQyMWRwcXRyOHZmZ2hha3FyZ2lvMWc5NDk4czM5a2suYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTAxNzAzNjg5MzA1NTYwMDU5MTkiLCJlbWFpbCI6InNmYWl6YWw4OEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjhkclZKUkR3UDE5YmNiSXpNcGUzTnciLCJuYW1lIjoiQWhhbWVkIEZhaXphbCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMTS10Q0pCUG1Rczd6VGJOUXFHZTNaYXdXcHBObVdmeFV6Qmwzam05a0FZNEV0NVRrcj1zOTYtYyIsImdpdmVuX25hbWUiOiJBaGFtZWQiLCJmYW1pbHlfbmFtZSI6IkZhaXphbCIsImlhdCI6MTcxMjkwNzM2MCwiZXhwIjoxNzEyOTEwOTYwfQ.apE3ovVoCONGcrdWPzDcWh4TrmFskzfm7EYVqDo1N-AfaXC9sBii55SfdHXEA3gTkMoY6ZCTRXmhKKceJ1-t1lEzFxNnGh4DUYRq8LZ3VamsIULrv2zQKJJIW9TUyZHgAT3mynINFcCnxGb1QJJXxU2aQxbc5ffnOo7-K3gAkr8NVxaQVyY5iyNwiyud9rPXISEwjF5LbrHUj-KZcoD5dAz_Mnd-yfZ2nIp-_qaXgY6st3INJJzehTU2i4cS6R_VHxWwj6hr_T1QOh8N5FWgaZCx3aCFo-Yj_gH-QfamG0tRhUJEI9jZx8YAZUFtYSq7od65QWxlKvNxqabCYdq2OA"
  const salt = "a677999396dc49a28ad6c9c242719bb3";
  const param = {
      jwt: id_token, 
      salt: salt,
  }

  const wait = (n: number) => new Promise((resolve) => setTimeout(resolve, n));

  const createCAHolderAccount = async () => {
    const httpProvider = `http://${ipAddress}:8000`;
    // const privateKey = '1111111111111111111111111111111111111111111111111111111111111111';
    const aelf = new AElf(new AElf.providers.HttpProvider(httpProvider));
    const wallet = AElf.wallet.createNewWallet();
    console.log("wallet: ", wallet);
    try {
      const param = {
        proof: proof,
        identifierHash: identifierHash,
        publicKey: publicKey,
        managerAddress: wallet.address,
        salt: salt
      }
      const response = await fetch(`http://${ipAddress}:7020/proof/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(param),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseAPIData = await response.json();
        const caHash = responseAPIData.caCash;
        const caAddress = responseAPIData.caAddress;
      await wait(10000);

      // GET BALANCE INFO
      const tokenContractName = "AElf.ContractNames.Token";
      const chainStatus = await aelf.chain.getChainStatus();
      const GenesisContractAddress = chainStatus.GenesisContractAddress;
      const zeroContract = await aelf.chain.contractAt(
        GenesisContractAddress,
        wallet
      );
      const tokenContractAddress = await zeroContract.GetContractAddressByName.call(
        AElf.utils.sha256(tokenContractName)
      );
      const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);
      const balanceResponse = await tokenContract.GetBalance.call({
        symbol: "ELF",
        owner: caAddress
      });
      console.log("balanceResponse: ", balanceResponse);
      res.status(200).json({
        transactionId: "dafnbi2ubrn21f",
        caHash: caHash,
        caAddress: caAddress,
        balance: balanceResponse.balance,
        wpk: wallet.privateKey
      });
    } catch (error) {
      console.error('Create CA holder rrror:', error);
      res.status(405).json({ message: error });
    }
  }

  try {
    const response = await fetch(`http://${ipAddress}:7020/proof/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const responseData = await response.json();
      proof = responseData.proof;
      identifierHash = responseData.identifierHash;
      publicKey = responseData.publicKey;
      console.log("Proof generated successfully response: ", responseData);
      createCAHolderAccount();
  } catch (error) {
      console.error('Error:', error);
      res.status(405).json({ message: error });
  }
}

export default handler;