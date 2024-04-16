import { useState, Dispatch, SetStateAction } from "react";
import Image from 'next/image';
import {Box, Chip, Button} from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';
import ELFLogoLightImage from '@/image/aelf-logo-light.png';
import {NotificationType} from '@/types';

type HeaderType = {
    onlogin: (event: any) => void;
    onlogout: () => void;
    email: string;
    caHolderTranxId:  string;
    userName: string;
    setNotification: Dispatch<SetStateAction<NotificationType>>,
}

const Header = ({
    onlogin,
    onlogout,
    email = '',
    caHolderTranxId,
    userName,
    setNotification,
}: HeaderType) => {
  const [state, setState] = useState<string>(caHolderTranxId);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setNotification({isOpen: true, message: 'Copied', type: 'success' });
};

  return (
    <Box className='header'>
        <Box className='logoContainer'><Image src={ELFLogoLightImage} alt="ELF Logo" width={25} height={25} />zkLogin</Box>
        <Box className='addressContainer'>
            {userName ? 
            <Box display='flex' gap={1} alignItems='center'>
                <Box>{userName}</Box>
                {localStorage.getItem("caHolderAddress") && <Chip className='chipBox' avatar={<WalletIcon color="primary" />} onClick={() => copyToClipboard(localStorage.getItem("caHolderAddress") || '')} color="primary" label={localStorage.getItem("caHolderAddress") || ''} />}
                <Button size="small" variant="contained" onClick={onlogout}>Disconnect</Button>
            </Box> : 
            <Button  size="small" variant="contained" onClick={onlogin}>Login</Button>}
        </Box>
    </Box>
  );
}

export default Header;