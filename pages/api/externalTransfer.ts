
// @ts-ignore
import AElf from 'aelf-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { handleManagerForwardCall } from "@portkey/contracts";
import { deserializeLogs } from '../../scripts/deserialize-logs'

const handler = async (request: NextApiRequest, response: NextApiResponse) => {

    let { caTranxId, toAddress, amount } = request.body;
    // caTranxId = "1268f4ab032aa23ca0ee30db7630c1f7d67936787683a086bd8bb074b1eee095";
    // toAddress = "2d5VE47tFtaGuYdYd1qto8AXX33hQudZBPasB2u621JqFNwLep";
    // amount = 12;
    console.log("caTranxId: ", caTranxId);
    console.log("toAddress: ", toAddress);
    console.log("amount: ", amount);
    // 8141ffd140742b3779a4651d9d14ddffab41bc758a690a6343859ff34723df79
    const RPC_URL = "http://35.202.43.42:8000";
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
    console.log("tokenContractAddress: ", tokenContractAddress);

    const caContract = await aelf.chain.contractAt(caContractAddress, wallet);

    console.log("caTranxId: ", caTranxId);
    const res = await aelf.chain.getTxResult(caTranxId);
    console.log("res: ", res);

    const logs = await deserializeLogs(
    aelf,
    res.Logs.filter((i: any) => i.Name === "CAHolderCreated")
    );

    const caHash = logs?.[0].caHash;
    console.log("caHash: ", caHash);

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
        console.log("res: ", res);

        try {
            const res2 = await aelf.chain.getTxResult(res.TransactionId);
            console.log("res2: ", res2);
            response.status(200).json({result: res2});
        } catch (error) {
            console.log(error);
            response.status(405).json({ message: error });
        }
    }
}

export default handler;