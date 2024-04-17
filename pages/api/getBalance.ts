
// @ts-ignore
import AElf from 'aelf-sdk';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
    const ipAddress = "34.72.199.84"; //34.134.26.210 10.0.1.17

    let { caAddress, wpk } = request.body;

    const RPC_URL = `http://${ipAddress}:8000`;
    const privateKey = wpk;
    
    const aelf = new AElf(new AElf.providers.HttpProvider(RPC_URL));
    const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
    
    let tokenContractAddress;
    const tokenContractName = "AElf.ContractNames.Token";
    const chainStatus = await aelf.chain.getChainStatus();
    const GenesisContractAddress = chainStatus.GenesisContractAddress;
    const zeroContract = await aelf.chain.contractAt(
        GenesisContractAddress,
        wallet
    );
    tokenContractAddress = await zeroContract.GetContractAddressByName.call(
        AElf.utils.sha256(tokenContractName)
    );
    const tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet);
    try {
        const balanceResponse = await tokenContract.GetBalance.call({
            symbol: "ELF",
            owner: caAddress
        });
        response.status(200).json({balance: balanceResponse.balance});
    } catch (error) {
        console.log(error);
        response.status(405).json({ message: error });
    }
    
}

export default handler;