import NextAuth from "next-auth";
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
        let proof = "e4f43e941f23f1478ffd459a9f6ec97e60ad790467bb9ffca97d7865ac5df09953cbaf72d64482095954e1770b249de00e405b2c5ac47b601850cac0939749183f8447be0c6b3e44e7bb61100b1f6b0fac038ea4f56271c45f2a3ebe79a367034aa423bf11f4dc3ab21440dd6642255d4a50d843a3db42fc3fa79852adec062f";
        console.log("jwt: ", jwt);
        console.log("jwtSignature: ", jwtSignature);
        console.log("salt: ", salt);
        const result = generateInput({jwtSignature, jwt, salt});
        const issuerPubkey = (await result).jwkValue;
        const input = (await result).input;
        // GETTING THE PROOF BY API CALL
        /* try {
          const response = await axios.post(
            'https://example.com/api/post-endpoint',
            {...input},
            {
              headers: {
                'Content-Type': 'application/json',
              }
            }
          );
          console.log("response: ", response.data)
        } catch (error) {
          console.error('Error:', error);
        } */

        

        // CREATE WALLET USING AELF SDK
        // aelf-public-node.aelf.io --> production
        // aelf-test-node.aelf.io -> Testing
        const aelf = new AElf(new AElf.providers.HttpProvider('aelf-test-node.aelf.io'));
        const wallet = AElf.wallet.createNewWallet();
        let contract;
        const contractAddress = "wdwewe"; // Need to get from YM after contract deployment
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
        
        /* (async () => {
          // CREATE CONTRACT
          contract = await aelf.chain.contractAt(contractAddress, wallet);

          // CREATE CA HOLDER ACCOINT
          await contract.CreateCAHolder(caHolderObject);

          // SIGN AND TRAX
          const transactionId = await contract.transfer({
            symbol: "ELF",
            to: "7s4XoUHfPuqoZAwnTV7pHWZAaivMiL8aZrDSnY9brE1woa8vz",
            amount: "1000000000",
            memo: "transfer in demo"
          });
          console.log(transactionId);
        })(); */
      }

      return token;
    },
  },
});
