// @ts-ignore
import AElf from 'aelf-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let identifierHash: string;
  let proof: string;
  let publicKey: string;
  const { token } = req.body;
  console.log("token: ", token);
  const id_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjkzYjQ5NTE2MmFmMGM4N2NjN2E1MTY4NjI5NDA5NzA0MGRhZjNiNDMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI2MDE1NzYwMDcyMTEtdWQyMWRwcXRyOHZmZ2hha3FyZ2lvMWc5NDk4czM5a2suYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI2MDE1NzYwMDcyMTEtdWQyMWRwcXRyOHZmZ2hha3FyZ2lvMWc5NDk4czM5a2suYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTAxNzAzNjg5MzA1NTYwMDU5MTkiLCJlbWFpbCI6InNmYWl6YWw4OEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjhkclZKUkR3UDE5YmNiSXpNcGUzTnciLCJuYW1lIjoiQWhhbWVkIEZhaXphbCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMTS10Q0pCUG1Rczd6VGJOUXFHZTNaYXdXcHBObVdmeFV6Qmwzam05a0FZNEV0NVRrcj1zOTYtYyIsImdpdmVuX25hbWUiOiJBaGFtZWQiLCJmYW1pbHlfbmFtZSI6IkZhaXphbCIsImlhdCI6MTcxMjkwNzM2MCwiZXhwIjoxNzEyOTEwOTYwfQ.apE3ovVoCONGcrdWPzDcWh4TrmFskzfm7EYVqDo1N-AfaXC9sBii55SfdHXEA3gTkMoY6ZCTRXmhKKceJ1-t1lEzFxNnGh4DUYRq8LZ3VamsIULrv2zQKJJIW9TUyZHgAT3mynINFcCnxGb1QJJXxU2aQxbc5ffnOo7-K3gAkr8NVxaQVyY5iyNwiyud9rPXISEwjF5LbrHUj-KZcoD5dAz_Mnd-yfZ2nIp-_qaXgY6st3INJJzehTU2i4cS6R_VHxWwj6hr_T1QOh8N5FWgaZCx3aCFo-Yj_gH-QfamG0tRhUJEI9jZx8YAZUFtYSq7od65QWxlKvNxqabCYdq2OA"
  const salt = "a677999396dc49a28ad6c9c242719bb3";
  const param = {
      jwt: id_token, 
      salt: salt,
  }

  const createCAHolderAccount = async () => {
    const httpProvider = 'http://35.202.43.42:8000';
    const privateKey = '1111111111111111111111111111111111111111111111111111111111111111';
    const contractAddress = "2LUmicHyH4RXrMjG4beDwuDsiWJESyLkgkwPdGTR8kahRzq5XS";
    let contract;
    const aelf = new AElf(new AElf.providers.HttpProvider(httpProvider));
    const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
    // CREATING CA OBJECT
    const caHolderObject = {
      "guardianApproved": {
        "identifierHash": identifierHash, // Will get from YM BE
        "zkGuardianInfo": {
            "identifierHash": identifierHash,// Will get from YM BE
            "salt": salt, // STATIC RIGHT NOW
            "issuerName": "Google", // STATIC RIGHT NOW
            "issuerPubkey": publicKey,
            "proof": proof // Will get from YM BE
        }
      },
      "managerInfo": {
        "address": wallet.address, // EOA Address
        "extraData": ""
      }
    };
    console.log("caHolderObject: ", caHolderObject);

    try {
      // CREATE CONTRACT
      contract = await aelf.chain.contractAt(contractAddress, wallet);

      // CREATE CA HOLDER ACCOINT
      const responseData = await contract.CreateCAHolder(caHolderObject);
      console.log("Create CA response: ", responseData);
      res.status(200).json({transactionId: responseData.TransactionId});
    } catch (error) {
      console.error('Create CA holder rrror:', error);
      res.status(405).json({ message: error });
    }
  }

  try {
    const response = await fetch("http://35.202.43.42:7020/proof/generate-mock", {
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
      console.error('Proof generator rrror:', error);
      res.status(405).json({ message: error });
  }
}

export default handler;