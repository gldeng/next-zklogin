import NextAuth from "next-auth";
// @ts-ignore
import AElf from 'aelf-sdk';
import axios from 'axios';
import GoogleProvider from "next-auth/providers/google";
import {generateInput} from '../../../scripts/generate-input';

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
        let identifierHash = "7f0bdbbd5bc4c68c21afe63067d39bbc863432cec2c56b9d351cad89346a8b47";
        let proof;
        const result = generateInput({jwtSignature, jwt, salt});
        const issuerPubkey = (await result).jwkValue;
        const input = (await result).input;
        // GETTING THE PROOF BY API CALL
        const param = {
          jwt: input.jwt.map(item  =>  item.toString()),
          signature: input.signature,
          pubkey: input.pubkey,
          salt: input.salt.map(item  =>  item.toString()),
        }
        console.log(param)
        try {
          const response = await fetch("http://34.29.20.98:7020/proof/generate", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const responseData = await response.json();
          proof = responseData.proof;
          console.log('Proof:', proof);
        } catch (error) {
          console.error('Error:', error);
        }

        

        // CREATE WALLET USING AELF SDK
        // aelf-public-node.aelf.io --> production
        // aelf-test-node.aelf.io -> Testing
        const aelf = new AElf(new AElf.providers.HttpProvider('http://34.29.20.98:8000'));
        const wallet = AElf.wallet.createNewWallet();
        let contract;
        const contractAddress = "2LUmicHyH4RXrMjG4beDwuDsiWJESyLkgkwPdGTR8kahRzq5XS"; // Need to get from YM after contract deployment
        // CREATING CA OBJECT
        const caHolderObject = {
          "guardianApproved": {
            "identifierHash": identifierHash, // Will get from YM BE
            "zkGuardianInfo": {
                "identifierHash": identifierHash,// Will get from YM BE
                "salt": salt, // STATIC RIGHT NOW
                "issuerName": "Google", // STATIC RIGHT NOW
                "issuerPubkey": issuerPubkey,
                "proof": proof // Will get from YM BE
            }
          },
          "managerInfo": {
            "address": wallet.address, 
            "extraData": ""
          }
        };
        
        (async () => {
          // CREATE CONTRACT
          console.log("Contracted creating...");
          contract = await aelf.chain.contractAt(contractAddress, wallet);
          console.log("Contracted created with ", contractAddress);

          // CREATE CA HOLDER ACCOINT
          console.log("Creating CA Holder...");
          console.log("CA Holder object: ", caHolderObject);
          const response = await contract.CreateCAHolder(caHolderObject);
          console.log("CA Holder response: ", response.TransactionId);

          // SIGN AND TRAX
          // ELF_2pRWD7pt2CLHwoyE63xnPmGk8S5XzjNzHSp52cmXSu2TXw4JXe_AELF
          // Testnet
          // console.log("Sign and Transaction contract api creating...", contract);
          const transactionId = await contract.sendTransaction({
            symbol: "ELF",
            to: "2pRWD7pt2CLHwoyE63xnPmGk8S5XzjNzHSp52cmXSu2TXw4JXe",
            amount: "100",
            memo: "transfer in demo"
          });
          console.log("Sign and Transaction triggered: ", transactionId);
        })();
      }

      return token;
    },
  },
});
