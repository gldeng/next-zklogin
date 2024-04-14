
// @ts-ignore
import AElf from 'aelf-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { handleManagerForwardCall } from "@portkey/contracts";
import { deserializeLogs } from '../../scripts/deserialize-logs'

const handler = async (request: NextApiRequest, response: NextApiResponse) => {

    const { caTranxId, toAddress, amount } = request.body;

    console.log("caTranxId: ", caTranxId);
    console.log("toAddress: ", toAddress);
    console.log("amount: ", amount);
    // 8141ffd140742b3779a4651d9d14ddffab41bc758a690a6343859ff34723df79
    const RPC_URL = "http://10.0.0.170:8000";
    const privateKey = '1111111111111111111111111111111111111111111111111111111111111111';
    const caContractAddress = "2LUmicHyH4RXrMjG4beDwuDsiWJESyLkgkwPdGTR8kahRzq5XS";
    
    const aelf = new AElf(new AElf.providers.HttpProvider(RPC_URL));
    const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
    
    const tokenContractName = "AElf.ContractNames.Token"; // Need to change
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

    const caContract = await aelf.chain.contractAt(caContractAddress, wallet);

    const res = await aelf.chain.getTxResult(caTranxId);

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
                to: toAddress,
                symbol: "ELF",
                amount,
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
            console.log(res2);
            response.status(200).json({result: res2});
        } catch (error) {
            console.log(error);
            response.status(405).json({ message: error });
        }
    }
}

export default handler;