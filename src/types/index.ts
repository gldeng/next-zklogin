export type ExternalTransferType = {
    caTranxId: string;
    toAddress: string;
    amount: string;
}

export type InternalTransferType = {
    managerAddress: string;
    caHolderAddress: string;
}