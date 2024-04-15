import { useState } from "react";
import Image from 'next/image';
import {Box, Paper, TextField, Button, Snackbar, Alert} from '@mui/material';

import {Loader} from '@/atoms';
import {useTransfer} from '@/hooks';
import {SendTransferType, CAHolderDetailsType, NotificationType} from '@/types';
import ELFTokenImage from '@/image/elf-token.png';

type SendTransferProps = {
    email: string;
    username: string;
};

const SendTransfer = ({
    email,
    username,
}: SendTransferProps) => {
  // DECLARE STATE
  const [isLoading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationType>({
    isOpen: false,
    message: '',
    type: 'success'
  });
  const [caHolderDetails, setCAHolderDetails] = useState<CAHolderDetailsType>({} as CAHolderDetailsType);
  const [state, setState] = useState<SendTransferType>({
    caAddress: caHolderDetails.caAddress,
    caHash: caHolderDetails.caHash,
    toAddress: '2d5VE47tFtaGuYdYd1qto8AXX33hQudZBPasB2u621JqFNwLep',
    amount: '12',
  });
  const {sendTransfer} = useTransfer(setLoading, setNotification);
  const balance = localStorage.getItem("caHolderBalance");

  return (
    <Paper elevation={3} className="box-container wallet-box">
        <Box className="box-title">Transfer token</Box>
        <Box display='flex' flex={1} mt={1} alignItems='center'>
        <Box flex={1}>
          <Box className='walletDetailsTitle'>{username}</Box>
          <Box className='walletDetailsSubTitle'>Welcome back</Box>
        </Box>
      </Box>
      {balance && <Box display='flex' alignItems='flex-end'>
        <Box className='balance-big'>
          {Number(balance || 0).toLocaleString('en-US')}
        </Box>
        <Box className='balance-icon'>
          ELF
        </Box>
      </Box>}
        <Box mt={3}>
          <Box mt={2}/>
          <TextField label="To address" variant="outlined" size="small" fullWidth 
            value={state.toAddress} 
            onChange={(event) => setState({...state, toAddress: event.target.value})}/>
          <Box mt={2}/>
          <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <TextField label="Amount" variant="outlined" size="small" fullWidth 
            value={state.amount}
            onChange={(event) => setState({...state, amount: event.target.value})}/>
            <Image src={ELFTokenImage} alt="ELF Token" width={25} height={25} className="icon-overlap"/>
          </Box>
          <Box className='btn-container'>
            <Button variant="contained" onClick={() => sendTransfer(state)} fullWidth>Transfer</Button>
          </Box>
        </Box>
    {isLoading && <Loader/>}
    <Snackbar open={notification.isOpen} autoHideDuration={6000} onClose={() => setNotification({isOpen: false, message: '', type: 'success'})}>
      <Alert
        onClose={() => setNotification({isOpen: false, message: '', type: 'success'})}
        severity={notification.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
    </Paper>
  );
}

export default SendTransfer;