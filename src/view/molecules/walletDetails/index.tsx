import { useState } from "react";
import {Box, Paper, Button} from '@mui/material';
import {Loader} from '@/atoms';

type WalletDetailsProps = {
    email: string;
    username: string;
    toggleVisibility: () => void;
};

const WalletDetails = ({
    email,
    username,
    toggleVisibility,
}: WalletDetailsProps) => {
  // DECLARE STATE
  const [isLoading, setLoading] = useState<boolean>(false);
  const balance = "34902457";

  return (
    <Paper elevation={3} className="box-container">
      <Box className="box-title">Wallet information</Box>
      <Box display='flex' flex={1} mt={1} alignItems='center'>
        <Box flex={1}>
          <Box className='walletDetailsTitle'>{username}</Box>
          <Box className='walletDetailsSubTitle'>Welcome back</Box>
        </Box>
        <Box  display='inline-flex' justifyContent='flex-end' alignItems='flex-start'>
          <Button variant="contained" onClick={toggleVisibility} fullWidth>Send</Button>
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
        
    {isLoading && <Loader/>}
    </Paper>
  );
}

export default WalletDetails;

/**
 * <Box>
    <Box className='fieldset'>
      <Box className='field-label'>Email</Box>
      <Box className='field-value'>{email}</Box>
    </Box>
    <Box mb={4}/>
    <Box className='fieldset'>
      <Box className='field-label'>CA Holder address</Box>
      {localStorage.getItem("caHolderAddress") && <Box className='field-value'>{localStorage.getItem("caHolderAddress")}</Box>}
    </Box>
  </Box>
 */