import {Dispatch, SetStateAction} from 'react';
import {SendTransferType, NotificationType} from '../types';

export default function useLogin(
    setLoading: Dispatch<SetStateAction<boolean>>,
    setNotification: Dispatch<SetStateAction<NotificationType>>,
) {

    const sendTransfer  = async (sendTransferObj: SendTransferType) => {
        setLoading(true);
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
            setNotification({isOpen: true, message: `Transferred successfully and transaction Id is ${result.transactionId}`, type: 'success' })
        } catch (error) {
            console.error('Error:', error);
            setNotification({isOpen: true, message: error as string, type: 'error' })
        } finally {
            setLoading(false);
        }
    }

    return {
        sendTransfer,
    }
}