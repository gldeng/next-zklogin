export type SendTransferType = {
    caAddress: string;
    caHash: string;
    toAddress: string;
    amount: string;
}

export type CAHolderDetailsType = {
    transactionId: string;
    caHash: string;
    caAddress: string;
    balance: string;
}

export type NotificationType = {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error'
}