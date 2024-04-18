import { useEffect, useState } from "react";
import {Box, Button, Typography, Snackbar, Alert, Tabs, Tab} from '@mui/material';
import { useSession, signIn, signOut } from "next-auth/react";

import {Loader} from '@/atoms';
import {CAHolderDetailsType, NotificationType, LoadingType} from '@/types';
import {ShortMenu, CryptoTable, ReceiveCrypto, SendTransfer} from '@/molecules';

import useLogin from '../src/hooks/useLogin';
import useCommon from '../src/hooks/useCommon';
import Header from '../src/view/common/header';

type UserType = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  idToken?: string | null | undefined; // Add idToken property
}

export default function Home() {
  const { data: session, status } = useSession();
  const [notification, setNotification] = useState<NotificationType>({
    isOpen: false,
    message: '',
    type: 'success'
  });

  const logout = () => {
    localStorage.clear();
    signOut();
  }
  const [caHolderTranxId, setCAHolderTranxId] = useState<string>('');
  const [isLoading, setLoading] = useState<LoadingType>({
    isLoading: false,
    message: '',
  });
  const [isProofGenerated, setProofGenerated] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<string>("table");
  const [caHolderDetails, setCAHolderDetails] = useState<CAHolderDetailsType>({} as CAHolderDetailsType);
  const {generateProof} = useLogin(setLoading, setCAHolderTranxId, setCAHolderDetails, setNotification, logout);
  const [selectedTab, setSelectedTab] = useState<string>("1");
  const {getBalance} = useCommon(setLoading);
  const userData = session?.user as UserType;
  const userEmail = session?.user?.email || '';
  const userName = session?.user?.name || '';
  const idToken = userData?.idToken || '';
  const balance = (typeof window !== 'undefined') ? ((Number(localStorage.getItem("caHolderBalance"))/100000000 || 0).toFixed(8)).toString() : 0;

  const login =  async (event: any) => {
    await signIn("google");
  }

  useEffect(() => {
    const caHolderTranxId = localStorage.getItem("caHolderTranxId") || '';
    if (userEmail && !isProofGenerated && !caHolderTranxId) {
      generateProof(idToken);
      // setProofGenerated(true);
    } else if (caHolderTranxId) {
      getBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  return (
    <>
    <Header onlogin={login} onlogout={logout} userName={userName} email={userEmail} caHolderTranxId={caHolderTranxId} setNotification={setNotification}/>
    {status === "authenticated" ? <Box>
      <Box className='title-h1' mx={2} mt={2}>{(Number(balance) * 0.62 || 0).toLocaleString('en-US', {style:"currency", currency:"USD"})}</Box>
      <ShortMenu setSelectedPage={setSelectedPage} selectedPage={selectedPage}/>
      <Box className="line"/>
      {selectedPage === "table" && 
        <Box>
            <Tabs
            value={selectedTab}
            onChange={(event: React.SyntheticEvent, newValue: string) => setSelectedTab(newValue)}
            aria-label="wrapped label tabs example"
          >
            <Tab value="1" label="Crypto" />
            <Tab value="2" label="NFTs" />
          </Tabs>
          {selectedTab === "1" && <Box>
            <CryptoTable/>
          </Box>}
          {selectedTab === "2" && <Box>
          </Box>}
        </Box>
      }
      {selectedPage === "send" && <Box>
        <SendTransfer  setNotification={setNotification} setSelectedPage={setSelectedPage} setLoading={setLoading}/>
      </Box>}
      {selectedPage === "receive" && <Box>
        <ReceiveCrypto setNotification={setNotification} setSelectedPage={setSelectedPage}/>
      </Box>}

    </Box> :
    <Box className="app-login">
      <Box className='walletBox'>
        <Box textAlign='center'>
          <Typography variant="h4">WELCOME</Typography>
        </Box>
        <Box>
          <Box className='info'>Google email integration, users can do transfer between wallet. 
            Transfers involve moving funds from their own wallet to another recipient&apos;s wallet.</Box>
          <Button variant="contained" onClick={login} fullWidth>Login</Button>
        </Box>
      </Box>
    </Box>
    }
    {isLoading.isLoading && <Loader message={isLoading.message}/>}
    <Snackbar open={notification.isOpen} autoHideDuration={15000} onClose={() => setNotification({isOpen: false, message: '', type: 'success'})}>
      <Alert
        onClose={() => setNotification({isOpen: false, message: '', type: 'success'})}
        severity={notification.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
    </>
  );
}

/**
 * {status === "authenticated" ? 
      <Box className='container' gap={4} justifyContent='center'>
        <Box width={400} className='animate'>
          <SendTransfer email={userEmail} username={userName} setNotification={setNotification} setLoading={setLoading}/>
        </Box>
      </Box>
    :
      <Box className='walletBox'>
        <Box textAlign='center'>
          <Typography variant="h4">WELCOME</Typography>
        </Box>
        <Box>
          <Box className='info'>Google email integration, users can do transfer between wallet. 
            Transfers involve moving funds from their own wallet to another recipient&apos;s wallet.</Box>
          <Button variant="contained" onClick={login} fullWidth>Login</Button>
        </Box>
      </Box>
    }
    {isLoading.isLoading && <Loader message={isLoading.message}/>}
    <Snackbar open={notification.isOpen} autoHideDuration={15000} onClose={() => setNotification({isOpen: false, message: '', type: 'success'})}>
      <Alert
        onClose={() => setNotification({isOpen: false, message: '', type: 'success'})}
        severity={notification.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
 */