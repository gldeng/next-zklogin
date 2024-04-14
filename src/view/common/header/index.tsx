import { useState } from "react";
import {Box, Chip, Button} from '@mui/material';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WalletIcon from '@mui/icons-material/Wallet';
import useStyles from './styles';

type HeaderType = {
    onlogin: () => void;
    onlogout: () => void;
    email: string;
}

const Header = ({
    onlogin,
    onlogout,
    email = '',
}: HeaderType) => {
  const classes = useStyles();
  const [caHolderTranxId, setCAHolderTranxId] = useState<string>();

  return (
    <Box className={classes.header}>
        <Box className={classes.logoContainer}><AcUnitIcon/>zkLogin</Box>
        <Box className={classes.addressContainer}>
            {email ? 
            <Box display='flex' gap={1} alignItems='center'>
                <Box>{email}</Box>
                <Chip className={classes.chipBox} avatar={<WalletIcon />} color="primary" label={localStorage.getItem("caHolderTranxId") || ''} />
                <Button size="small" variant="contained" onClick={onlogout}>Disconnect</Button>
            </Box> : 
            <Button  size="small" variant="contained" onClick={onlogin}>Connect</Button>}
        </Box>
    </Box>
  );
}

export default Header;