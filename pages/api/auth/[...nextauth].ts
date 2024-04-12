import NextAuth from "next-auth";
// @ts-ignore
import AElf from 'aelf-sdk';
import GoogleProvider from "next-auth/providers/google";
import { handleManagerForwardCall } from "@portkey/contracts";
import {generateInput} from '../../../scripts/generate-input';
import { deserializeLogs } from "../../../scripts/deserialize-logs";

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
        const controller = new AbortController();
        const signal = controller.signal;
        let identifierHash;
        let proof;
        let publicKey;
        const result = generateInput({jwtSignature, jwt, salt});
        const issuerPubkey = (await result).jwkValue;
        const input = (await result).input;
        // GETTING THE PROOF BY API CALL
        const param = {
          jwt: id_token, 
          //input.jwt.map(item  =>  item.toString()),
          // signature: input.signature,
          // pubkey: input.pubkey,
          salt: salt,
          // input.salt.map(item  =>  item.toString()),
        }
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.log('Request timed out');
      }, 60000);
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
            signal: signal
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

        // CREATE WALLET USING AELF SDK
        // aelf-public-node.aelf.io --> production
        // aelf-test-node.aelf.io -> Testing
        console.log("Contract creating process...");
        const aelf = new AElf(new AElf.providers.HttpProvider('http://35.202.43.42:8000'));
        const privateKey = '1111111111111111111111111111111111111111111111111111111111111111'
        const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
        let contract; 
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
        (async () => {
          // CREATE CONTRACT
          console.log("Contract creating...");
          console.log("Contract address: ", contractAddress);
          console.log("Contract wallet: ", wallet);
          contract = await aelf.chain.contractAt(contractAddress, wallet);
          console.log("Contract completed");

          // CREATE CA HOLDER ACCOINT
          const response = await contract.CreateCAHolder(caHolderObject);
          
          const CREATE_CA_TRANSACTION_ID = response.TransactionId;
          console.log("Create CA transaction Id: ", CREATE_CA_TRANSACTION_ID);

          let tokenContractAddress;
            // get chain status
            const chainStatus = await aelf.chain.getChainStatus();
            // get genesis contract address
            const GenesisContractAddress = chainStatus.GenesisContractAddress;
            // get genesis contract instance
            const zeroContract = await aelf.chain.contractAt(
              GenesisContractAddress,
              wallet
            );
            // Get contract address by the read only method `GetContractAddressByName` of genesis contract
            tokenContractAddress = await zeroContract.GetContractAddressByName.call(
              AElf.utils.sha256(tokenContractName)
            );
          
            const caContract = await aelf.chain.contractAt(contractAddress, wallet);
          
            const res = await aelf.chain.getTxResult(CREATE_CA_TRANSACTION_ID);
          
            const logs = await deserializeLogs(
              aelf,
              res.Logs.filter((i: any) => i.Name === "CAHolderCreated")
            );
          
            const caHash = logs?.[0].caHash;
          
            if (caHash) {
              const params = await handleManagerForwardCall({
                paramsOption: {
                  caHash,
                  contractAddress: tokenContractAddress,
                  methodName: "Transfer",
                  args: {
                    to: TO_ADDRESS,
                    symbol: "ELF",
                    amount: "20000000",
                    memo: "ca transfer",
                  },
                },
                instance: aelf,
                functionName: "Transfer",
              });
          
              const res = await caContract.ManagerForwardCall({
                caHash,
                contractAddress: tokenContractAddress,
                methodName: "Transfer",
                args: params.args,
              });
          
              try {
                const res2 = await aelf.chain.getTxResult(res.TransactionId);
        
              } catch (err) {
                console.log("Tx result: ", err);
              }
            }

        })();
      }

      return token;
    },
  },
});
