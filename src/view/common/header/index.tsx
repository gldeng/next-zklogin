import { useState } from "react";
import {Box, Chip, Button} from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WalletIcon from '@mui/icons-material/Wallet';

type HeaderType = {
    onlogin: (event: any) => void;
    onlogout: () => void;
    email: string;
    caHolderTranxId:  string;
    userName: string;
}

const Header = ({
    onlogin,
    onlogout,
    email = '',
    caHolderTranxId,
    userName,
}: HeaderType) => {
  const [state, setState] = useState<string>(caHolderTranxId);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
};

  return (
    <Box className='header'>
        <Box className='logoContainer'><AcUnitIcon/>zkLogin</Box>
        <Box className='addressContainer'>
            {userName ? 
            <Box display='flex' gap={1} alignItems='center'>
                <Box>{userName}</Box>
                <Chip className='chipBox' avatar={<WalletIcon />} onClick={() => copyToClipboard(localStorage.getItem("caHolderTranxId") || '')} color="primary" label={localStorage.getItem("caHolderTranxId") || ''} />
                <Button size="small" variant="contained" onClick={onlogout}>Disconnect</Button>
            </Box> : 
            <Button  size="small" variant="contained" onClick={onlogin}>Connect</Button>}
        </Box>
    </Box>
  );
}

export default Header;