import {Dispatch, SetStateAction} from 'react';
import {SendTransferType, NotificationType, LoadingType} from '@/types';
import {useCommon} from '@/hooks';

export default function useTransfer(
    setLoading: Dispatch<SetStateAction<LoadingType>>,
    setNotification: Dispatch<SetStateAction<NotificationType>>,
) {
    const {getBalance} = useCommon(setLoading);
    const sendTransfer  = async (sendTransferObj: SendTransferType) => {
        setLoading({isLoading: true, message: 'Transfer in progress...'});
        const availableBalance = Number(localStorage.getItem("caHolderBalance"));
        if (availableBalance < Number(sendTransferObj.amount)) {
            setNotification({isOpen: true, message: 'Something went wrong. Please try again.', type: 'error' });
            throw new Error('Available balance is less than provided amount.');
        }
        try {
            const param  = {
                ...sendTransferObj,
                caAddress: localStorage.getItem("caHolderAddress"),
                caHash: localStorage.getItem("caHolderHash"),
                wpk: localStorage.getItem("wpk")
            }
            const response = await fetch('/api/sendTransfer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...param})
            });
            if (!response.ok) {
                setNotification({isOpen: true, message: 'Something went wrong. Please try again.', type: 'error' });
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            localStorage.setItem("caHolderBalance", result.balance);
            setNotification({isOpen: true, message: `Transferred successfully and transaction Id is ${result.transactionId}`, type: 'success' });
            getBalance();
        } catch (error) {
            console.error('Error:', error);
            setNotification({isOpen: true, message: error as string, type: 'error' });
            setLoading({isLoading: false, message: ''});
        }
    }

    return {
        sendTransfer,
    }
}