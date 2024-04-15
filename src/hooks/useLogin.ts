import {Dispatch, SetStateAction} from 'react';
import {ExternalTransferType, InternalTransferType} from '../types';

export default function useLogin(
    setLoading: Dispatch<SetStateAction<boolean>>,
    setCAHolderTranxId: Dispatch<SetStateAction<string>>,
    setInternalTransferObj: Dispatch<SetStateAction<InternalTransferType>>,
) {

  const generateProof = async () => {
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
          body: JSON.stringify({token: 'SODH28UGD28'})
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        result = await response.json();
        console.log("Generat proof result: ", result);
        setCAHolderTranxId(result.transactionId);
        localStorage.setItem("caHolderTranxId", result.transactionId);
        console.log("Result: ", result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
          setLoading(false);
      }
      return result;
  }

  const internalTransfer = async (internalTransferObj: InternalTransferType) => {
    console.log("Internal transfer");
    setLoading(true);
    try {
      const response = await fetch('/api/internalTransfer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...internalTransferObj})
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log("Internal TransId: ", result);
      alert("Successfully transfered and transaction id: IBJIDBCNO23HE1OE13IJB");
    } catch (error) {
      console.error('Error:', error);
    } finally {
        setLoading(false);
    }
  }

  const externalTransfer  = async (externalTransferObj: ExternalTransferType) => {
    setLoading(true);
    try {
      console.log("externalTransferObj: ", externalTransferObj);
      const param  = {
        ...externalTransferObj,
        caTranxId: localStorage.getItem("caHolderTranxId")
      }
      const response = await fetch('/api/externalTransfer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({...param})
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log("TransId: ", result);
      alert("Successfully transfered and transaction id: IBJIDBCNO23HE1OE13IJB");
    } catch (error) {
      console.error('Error:', error);
    } finally {
        setLoading(false);
    }
  }

    return {
        generateProof,
        internalTransfer,
        externalTransfer,
    }
}