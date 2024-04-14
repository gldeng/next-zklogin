import NextAuth from "next-auth";
// @ts-ignore
import AElf from 'aelf-sdk';
import GoogleProvider from "next-auth/providers/google";
import { handleManagerForwardCall } from "@portkey/contracts";
import {generateInput} from '../../../scripts/generate-input';
import { deserializeLogs } from "../../../scripts/deserialize-logs";
import { setSessionValue } from "../../../src/utils/cookies";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const { id_token } = account;
        const jwt = id_token;
        const jwtSignature = id_token?.split(".")[2];
        const salt = "a677999396dc49a28ad6c9c242719bb3";
        const TO_ADDRESS = "2pRWD7pt2CLHwoyE63xnPmGk8S5XzjNzHSp52cmXSu2TXw4JXe";
        const contractAddress = "2LUmicHyH4RXrMjG4beDwuDsiWJESyLkgkwPdGTR8kahRzq5XS";
        const tokenContractName = "JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE";
        let identifierHash;
        let proof;
        let publicKey;
        const result = generateInput({jwtSignature, jwt, salt});
        const issuerPubkey = (await result).jwkValue;
        const input = (await result).input;
        // GETTING THE PROOF BY API CALL
        console.log("id_token: ", id_token)
        const param = {
          jwt: id_token, 
          //input.jwt.map(item  =>  item.toString()),
          // signature: input.signature,
          // pubkey: input.pubkey,
          salt: salt,
          // input.salt.map(item  =>  item.toString()),
        }
        console.log("Proof generator param: ", param);
        try {
          const response = await fetch("http://35.202.43.42:7020/proof/generate-mock", {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache',
              'Content-Type': 'application/json',
              'Content-Length': JSON.stringify(param).length.toString(),
              'Host': '35.202.43.42:7020',
              'Accept': '*/*',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive'
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
          console.log("Proof generated successfully - proof: ", proof);
          console.log("Proof generated successfully - identifierHash: ", identifierHash);
          console.log("Proof generated successfully - publicKey: ", publicKey);
        } catch (error) {
          console.error('Proof generator rrror:', error);
        }
        setSessionValue('id_token', id_token || '');
        setSessionValue('proof', proof);
        setSessionValue('identifierHash', identifierHash);
        setSessionValue('publicKey', publicKey);

        const httpProvider = 'http://35.202.43.42:8000';
        const privateKey = '1111111111111111111111111111111111111111111111111111111111111111';
        let contract;
        console.log("proof: ", proof);
        console.log("identifierHash: ", identifierHash);
        console.log("publicKey: ", publicKey);
        
        // aelf-public-node.aelf.io --> production
        // aelf-test-node.aelf.io -> Testing
        console.log("Contract creating process...");
        const aelf = new AElf(new AElf.providers.HttpProvider(httpProvider));
        const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
        console.log("CA holder object creating...");
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
          console.log("Create CA transaction Id: ", responseData.TransactionId);
        } catch (error) {
          console.error('Create CA holder rrror:', error);
        }
      }

      return token;
    },
  },
});
