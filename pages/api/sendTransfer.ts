
// @ts-ignore
import AElf from 'aelf-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { handleManagerForwardCall } from "@portkey/contracts";
import { deserializeLogs } from '../../scripts/deserialize-logs'

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
    const ipAddress = "35.224.183.238"; //34.134.26.210 10.0.1.17

    const wait = (n: number) => new Promise((resolve) => setTimeout(resolve, n));
    let { caHash, caAddress, toAddress, amount, wpk } = request.body;
    console.log("caHash: ", caHash);
    console.log("caAddress: ", caAddress);
    console.log("toAddress: ", toAddress);
    console.log("amount: ", amount);
    console.log("wpk: ", wpk);

    // 8141ffd140742b3779a4651d9d14ddffab41bc758a690a6343859ff34723df79
    const RPC_URL = `http://${ipAddress}:8000`;
    const privateKey = wpk;
    const caContractAddress = "2LUmicHyH4RXrMjG4beDwuDsiWJESyLkgkwPdGTR8kahRzq5XS";
    
    const aelf = new AElf(new AElf.providers.HttpProvider(RPC_URL));
    const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
    
    const tokenContractName = "AElf.ContractNames.Token"; // Need to change
    let tokenContractAddress;
    const chainStatus = await aelf.chain.getChainStatus();
    const GenesisContractAddress = chainStatus.GenesisContractAddress;
    const zeroContract = await aelf.chain.contractAt(
        GenesisContractAddress,
        wallet
    );
    console.log("wallet: ", wallet);
    tokenContractAddress = await zeroContract.GetContractAddressByName.call(
        AElf.utils.sha256(tokenContractName)
    );
    const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);
    console.log("tokenContractAddress: ", tokenContractAddress);

    const caContract = await aelf.chain.contractAt(caContractAddress, wallet);



    if (caHash) {
        const params = await handleManagerForwardCall({
            paramsOption: {
            caHash,
            contractAddress: tokenContractAddress,
            methodName: "Transfer",
            args: {
                to: toAddress,
                symbol: "ELF",
                amount: Number(amount) * 100000000,
                memo: "ca transfer",
            },
            },
            instance: aelf,
            functionName: "Transfer",
        });
        // console.log("Manager handleManagerForwardCall params: ", params);

        const res = await caContract.ManagerForwardCall({
            caHash,
            contractAddress: tokenContractAddress,
            methodName: "Transfer",
            args: params.args,
        });
        wait(10000);
        // console.log("CA ManagerForwardCall response: ", res);

        try {
            const transactionResponse = await aelf.chain.getTxResult(res.TransactionId);
            // console.log("getTxResult response: ", transactionResponse.TransactionId);
            const balanceResponse = await tokenContract.GetBalance.call({
                symbol: "ELF",
                owner: caAddress
                });
            console.log("Main balance: ", balanceResponse.balance);
            console.log("Amount sent: ", amount);
            console.log("Balance after : ", balanceResponse.balance - amount);
            response.status(200).json({transactionId: transactionResponse.TransactionId, balance: balanceResponse.balance});
        } catch (error) {
            console.log(error);
            response.status(405).json({ message: error });
        }
    }
    
}

export default handler;