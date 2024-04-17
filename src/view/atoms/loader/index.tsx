/**
 * 
 * Loader component
 * @author - NA 
 * @date - 15th April, 2024
 * 
 */
// GENERIC IMPORT
import React from 'react';
import {Backdrop, CircularProgress, Box} from '@mui/material';

type LoaderProps = {
    message?: string
}
const Loader = ({
    message
}: LoaderProps) => {
    return (
        <Backdrop style={{display: 'flex', flexDirection: 'column'}} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
            <CircularProgress color="inherit" /><br/>
            {message && <Box style={{display: 'block', width: '400px', textAlign: 'center'}}>{message}</Box>}
        </Backdrop>
    )
};

export default Loader;