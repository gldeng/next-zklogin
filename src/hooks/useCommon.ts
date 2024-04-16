import {Dispatch, SetStateAction} from 'react';

export default function useCommon(
    setLoading: Dispatch<SetStateAction<boolean>>,
) {

  const getBalance = async () => {
      let result;
      setLoading(true);
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
          setLoading(false);
      }
      return result;
  }

    return {
      getBalance,
    }
}