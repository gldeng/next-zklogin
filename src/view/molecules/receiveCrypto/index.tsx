import { Dispatch, SetStateAction } from "react";
import Image from 'next/image';
import {Box} from '@mui/material';
import ELFCoinImage from '@/image/elf-token.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { NotificationType } from '@/types';
import {maskAddress} from '@/utils';

type ReceiveCryptoProps = {
    setNotification: Dispatch<SetStateAction<NotificationType>>;
    setSelectedPage: Dispatch<SetStateAction<string>>;
};

const ReceiveCrypto = ({
    setNotification,
    setSelectedPage,
}: ReceiveCryptoProps) => {
    // DECLARE STATE
    const menuList = [
        {
            id: 1,
            label: 'ELF',
            icon: <Image src={ELFCoinImage} width={25} alt="ELF Coin"/>,
            address: "DACFAOJ13E13OHEO13HROU31RNO13",
        },
    ];

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setNotification({isOpen: true, message: 'Copied', type: 'success' });
    };
  return (
    <Box mt={2} mb={2} mx={2}>
        <Box className="page-title"><ArrowBackIcon onClick={() => setSelectedPage("table")}/>&nbsp;&nbsp;Receive crypto</Box>
        {menuList.map(item => (
            <Box className="crypto-item box" key={item.id}>
                <Box className="crypto-icon">{item.icon}</Box>
                <Box display='inline-flex' flexDirection='column' pl={1}>
                    <Box className="crypto-label">
                    {item.label}
                    </Box>
                    <Box  className="crypto-value" style={{justifyContent: 'flex-start !important'}}>{maskAddress(localStorage.getItem("caHolderAddress")) || ''}&nbsp;<ContentCopyIcon className="copy-icon" onClick={() => copyToClipboard(localStorage.getItem("caHolderAddress") || '')}/></Box>
                </Box>
                
            </Box>
        ))}
    </Box>
  );
}

export default ReceiveCrypto;