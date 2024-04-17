import { useState, Dispatch, SetStateAction } from "react";
import Image from 'next/image';
import {Box, TextField, Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {useTransfer} from '@/hooks';
import {SendTransferType, CAHolderDetailsType, NotificationType, LoadingType} from '@/types';
import ELFTokenImage from '@/image/elf-token.png';

type SendTransferProps = {
    setNotification: Dispatch<SetStateAction<NotificationType>>,
    setLoading: Dispatch<SetStateAction<LoadingType>>,
    setSelectedPage: Dispatch<SetStateAction<string>>;
};

const SendTransfer = ({
    setNotification,
    setLoading,
    setSelectedPage
}: SendTransferProps) => {
  // DECLARE STATE
  const [caHolderDetails, setCAHolderDetails] = useState<CAHolderDetailsType>({} as CAHolderDetailsType);
  const [state, setState] = useState<SendTransferType>({
    caAddress: caHolderDetails.caAddress,
    caHash: caHolderDetails.caHash,
    toAddress: '2d5VE47tFtaGuYdYd1qto8AXX33hQudZBPasB2u621JqFNwLep',
    amount: '0',
  });
  const {sendTransfer} = useTransfer(setLoading, setNotification);

  return (
    <Box mt={2} mb={2} mx={2}>
      <Box className="page-title"><ArrowBackIcon onClick={() => setSelectedPage("table")}/>&nbsp;&nbsp;Send</Box>
      <Box mt={3}>
        <Box mt={2}/>
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <TextField variant="outlined" size="small" fullWidth 
          value={state.amount}
          onChange={(event) => setState({...state, amount: event.target.value})}/>
          <Image src={ELFTokenImage} alt="ELF Token" width={25} height={25} className="icon-overlap"/>
        </Box>
        <Box mt={2}/>
        <TextField label="To address" variant="outlined" size="small" fullWidth 
          value={state.toAddress} 
          onChange={(event) => setState({...state, toAddress: event.target.value})}/>
        <Box className='btn-container'>
          <Button variant="contained" onClick={() => sendTransfer(state)} fullWidth>Send</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SendTransfer;