import {Dispatch, SetStateAction} from 'react';
import {LoadingType} from '@/types';

export default function useCommon(
    setLoading: Dispatch<SetStateAction<LoadingType>>,
) {

  const getBalance = async () => {
      let result;
      setLoading({isLoading: true, message: 'Loading. Please wait...'});
      try {
        const param  = {
          caAddress: localStorage.getItem("caHolderAddress"),
          wpk: localStorage.getItem("wpk")
        }
        const response = await fetch('/api/getBalance', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({...param})
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        result = await response.json();
        localStorage.setItem("caHolderBalance", result.balance);
        console.log("Result: ", result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
          setLoading({isLoading: false, message: ''});
      }
      return result;
  }

    return {
      getBalance,
    }
}