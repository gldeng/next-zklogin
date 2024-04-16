import { useEffect, useState } from "react";
import {Box, Button, Typography} from '@mui/material';
import { useSession, signIn, signOut } from "next-auth/react";

import {Loader} from '@/atoms';
import {CAHolderDetailsType} from '@/types';
import {SendTransfer} from '@/molecules';

import useLogin from '../src/hooks/useLogin';
import Header from '../src/view/common/header';

type UserType = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  idToken?: string | null | undefined; // Add idToken property
}

export default function Home() {
  const { data: session, status } = useSession();
  const [caHolderTranxId, setCAHolderTranxId] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isProofGenerated, setProofGenerated] = useState<boolean>(false);
  const [caHolderDetails, setCAHolderDetails] = useState<CAHolderDetailsType>({} as CAHolderDetailsType);
  const {generateProof} = useLogin(setLoading, setCAHolderTranxId, setCAHolderDetails);
  const userData = session?.user as UserType;
  const userEmail = session?.user?.email || '';
  const userName = session?.user?.name || '';
  const idToken = userData?.idToken || '';

  const login =  async (event: any) => {
    await signIn("google");
  }

  const logout = () => {
    localStorage.clear();
    signOut();
  }

  useEffect(() => {
    if (userEmail && !isProofGenerated) {
      generateProof(idToken);
      setProofGenerated(true);
    }
  }, [userEmail]);

  return (
    <>
    <Header onlogin={login} onlogout={logout} userName={userName} email={userEmail} caHolderTranxId={caHolderTranxId}/>
    {status === "authenticated" ? 
      <Box className='container' gap={4} justifyContent='center'>
        <Box width={400} className='animate'>
          <SendTransfer email={userEmail} username={userName} />
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
    </>
  );
}