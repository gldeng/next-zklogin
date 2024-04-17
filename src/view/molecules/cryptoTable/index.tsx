import { useState } from "react";
import Image from 'next/image';
import {Box} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ELFCoinImage from '@/image/elf-token.png';

type CryptoTableProps = {
    selectedPage?: string;
};

const CryptoTable = ({
    selectedPage,
}: CryptoTableProps) => {
    // DECLARE STATE
    const balance = ((Number(localStorage.getItem("caHolderBalance"))/100000000 || 0).toFixed(8)).toString();
    const menuList = [
        {
            id: 1,
            label: 'ELF',
            icon: <Image src={ELFCoinImage} width={25} alt="ELF Coin"/>,
            value: balance,
        },
    ];
  return (
    <Box className="crypto-list" mt={2} mb={2} mx={2}>
        {menuList.map(item => (
            <Box className="crypto-item" key={item.id}>
                <Box className="crypto-icon">{item.icon}</Box>
                <Box className="crypto-label">{item.label}</Box>
                <Box className="crypto-value">{item.value}&nbsp;{item.label}</Box>
            </Box>
        ))}
    </Box>
  );
}

export default CryptoTable;