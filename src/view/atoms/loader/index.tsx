/**
 * 
 * Loader component
 * @author - NA 
 * @date - 15th April, 2024
 * 
 */
// GENERIC IMPORT
import React from 'react';
import {Backdrop, CircularProgress} from '@mui/material';

const Loader = () => {
    return (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
            <CircularProgress color="inherit" />
        </Backdrop>
    )
};

export default Loader;