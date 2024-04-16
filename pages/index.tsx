import { useEffect, useState } from "react";
import {Box, Button, Typography, Snackbar, Alert} from '@mui/material';
import { useSession, signIn, signOut } from "next-auth/react";

import {Loader} from '@/atoms';
import {CAHolderDetailsType, NotificationType} from '@/types';
import {SendTransfer} from '@/molecules';

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
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isProofGenerated, setProofGenerated] = useState<boolean>(false);
  const [caHolderDetails, setCAHolderDetails] = useState<CAHolderDetailsType>({} as CAHolderDetailsType);
  const {generateProof} = useLogin(setLoading, setCAHolderTranxId, setCAHolderDetails, setNotification, logout);
  const {getBalance} = useCommon(setLoading);
  const userData = session?.user as UserType;
  const userEmail = session?.user?.email || '';
  const userName = session?.user?.name || '';
  const idToken = userData?.idToken || '';

  const login =  async (event: any) => {
    await signIn("google");
  }

  useEffect(() => {
    const caHolderTranxId = localStorage.getItem("caHolderTranxId") || '';
    if (userEmail && !isProofGenerated && !caHolderTranxId) {
      generateProof(idToken);
      setProofGenerated(true);
    }
  }, [userEmail]);

  return (
    <>
    <Header onlogin={login} onlogout={logout} userName={userName} email={userEmail} caHolderTranxId={caHolderTranxId} setNotification={setNotification}/>
    {status === "authenticated" ? 
      <Box className='container' gap={4} justifyContent='center'>
        <Box width={400} className='animate'>
          <SendTransfer email={userEmail} username={userName} setNotification={setNotification}/>
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
    {isLoading && <Loader/>}
    <Snackbar open={notification.isOpen} autoHideDuration={6000} onClose={() => setNotification({isOpen: false, message: '', type: 'success'})}>
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