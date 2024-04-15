export type ExternalTransferType = {
    caAddress: string;
    caHash: string;
    toAddress: string;
    amount: string;
}

export type InternalTransferType = {
    managerAddress: string;
    caHolderAddress: string;
}

export type CAHolderDetailsType = {
    transactionId: string;
    caHash: string;
    caAddress: string;
    balance: string;
}