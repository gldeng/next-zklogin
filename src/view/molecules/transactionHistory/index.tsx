import { useState } from "react";
import Image from 'next/image';
import {Box, Paper} from '@mui/material';
import {Loader} from '@/atoms';
import ELFTokenImage from '../src/assets/image/elf-token.png';

type TransactionHistoryProps = {
    email: string;
    username: string;
};

const TransactionHistory = ({
    email,
    username,
}: TransactionHistoryProps) => {
    // DECLARE STATE
    const [isLoading, setLoading] = useState<boolean>(false);
  return (
    <Paper elevation={3} className="box-container">
      <Box className="box-title">Transaction history</Box>
      {isLoading && <Loader/>}
    </Paper>
  );
}

export default TransactionHistory;