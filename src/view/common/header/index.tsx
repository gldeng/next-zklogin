import { useState, Dispatch, SetStateAction } from "react";
import Image from 'next/image';
import {Box, Chip, Button} from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';
import ELFLogoLightImage from '@/image/aelf-logo-light.png';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
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
        <Box className='logoContainer'><Image src={ELFLogoLightImage} alt="ELF Logo" width={25} height={25} />zkLogin wallet</Box>
        <Box className='addressContainer'>
            {userName &&
            <Box display='flex' gap={1.5} alignItems='center'>
                {localStorage.getItem("caHolderAddress") && <ContentCopyIcon className="copy-icon" onClick={() => copyToClipboard(localStorage.getItem("caHolderAddress") || '')}/>}
                <PowerSettingsNewIcon onClick={onlogout}/>
            </Box>}
        </Box>
    </Box>
  );
}

export default Header;