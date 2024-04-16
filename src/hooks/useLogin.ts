import {Dispatch, SetStateAction} from 'react';
import {CAHolderDetailsType, NotificationType} from '../types';

export default function useLogin(
    setLoading: Dispatch<SetStateAction<boolean>>,
    setCAHolderTranxId: Dispatch<SetStateAction<string>>,
    setCAHolderDetails: Dispatch<SetStateAction<CAHolderDetailsType>>,
    setNotification: Dispatch<SetStateAction<NotificationType>>,
    logout: () => void
) {

  const generateProof = async (idToken: string) => {
      let result;
      setLoading(true);
      try {
        // const mockTraxId = "8c798c1e7e033d78f68d73e9f49a2475e6df4c60c1ea693cbe8b0c9b9083408b";
        // setCAHolderTranxId(mockTraxId);
        // localStorage.setItem("caHolderTranxId", mockTraxId);
        const response = await fetch('/api/generateProofCAHolder', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({token: idToken})
        });
        if (!response.ok) {
          setNotification({isOpen: true, message: 'Something went wrong. Please try again.', type: 'error' });
          logout();
          throw new Error('Network response was not ok');
        }
        result = await response.json();
        console.log("Generat proof result: ", result);
        setCAHolderTranxId(result.transactionId);
        setCAHolderDetails(result);
        localStorage.setItem("caHolderTranxId", result.transactionId);
        localStorage.setItem("caHolderAddress", result.caAddress);
        localStorage.setItem("caHolderHash", result.caHash);
        localStorage.setItem("caHolderBalance", result.balance);
        localStorage.setItem("wpk", result.wpk);
        console.log("Result: ", result);
      } catch (error) {
        setNotification({isOpen: true, message: 'Something went wrong. Please try again.', type: 'error' });
        console.error('Error:', error);
      } finally {
          setLoading(false);
      }
      return result;
  }

    return {
        generateProof,
    }
}