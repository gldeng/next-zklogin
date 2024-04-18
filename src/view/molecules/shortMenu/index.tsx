import clsx from 'clsx';
import { Dispatch, SetStateAction } from "react";
import {Box} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';

type ShortMenuProps = {
    setSelectedPage: Dispatch<SetStateAction<string>>,
    selectedPage: string;
};

const ShortMenu = ({
    setSelectedPage,
    selectedPage,
}: ShortMenuProps) => {
    // DECLARE STATE
    const menuList = [
        {
            id: 1,
            label: 'Send',
            icon: <ArrowUpwardIcon/>,
            isEnable: true,
            value: 'send',
        },
        {
            id: 2,
            label: 'Receive',
            icon: <ArrowDownwardIcon/>,
            isEnable: true,
            value: 'receive'
        },
        /* {
            id: 3,
            label: 'Buy',
            icon: <AddIcon/>,
            isEnable: false,
            value: 'buy'
        },
        {
            id: 4,
            label: 'Swap',
            icon: <SwapHorizIcon/>,
            isEnable: false,
            value: 'swap'
        },
        {
            id: 5,
            label: 'Bridge',
            icon: <SwapCallsIcon/>,
            isEnable: false,
            value: 'bridge'
        }, */
    ]

    const handlePageSelect = (value: string, isEnabled: boolean) => {
        if (isEnabled) {
            setSelectedPage(value);
        }
    }
  return (
    <Box className="circle-list" mt={2} mb={2} mx={2}>
        {menuList.map(item => (
            <Box className="circle-item" key={item.id} onClick={() => handlePageSelect(item.value, item.isEnable)}>
                <Box className={clsx("circle-icon", !item.isEnable && "circle-icon-disabled", selectedPage === item.value && "circle-icon-active")}>{item.icon}</Box>
                <Box className={clsx("circle-label", !item.isEnable && "circle-label-disabled", selectedPage === item.value && "circle-label-active")}>{item.label}</Box>
            </Box>
        ))}
    </Box>
  );
}

export default ShortMenu;