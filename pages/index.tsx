import { useState } from "react";
import {Box, Backdrop, CircularProgress, Button, Chip, Tabs, Tab, TextField} from '@mui/material';
import { useSession, signIn, signOut } from "next-auth/react";
import useLogin from '../src/hooks/useLogin';
import {ExternalTransferType, InternalTransferType} from '../src/types';
import Header from '../src/view/common/header';

export default function Home() {
  const { data: session, status } = useSession();
  const [caHolderTranxId, setCAHolderTranxId] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(2000);
  const [selectedTab, setSelectedTab] = useState<string>('1');
  const [externalTransferObj, setExternalTransferObj] = useState<ExternalTransferType>({
    caTranxId: '',
    toAddress: '',
    amount: '0',
  });
  const [internalTransferObj, setInternalTransferObj] = useState<InternalTransferType>({
    managerAddress: "",
    caHolderAddress: "",
  });
  const {generateProof, internalTransfer, externalTransfer} = useLogin(setLoading, setCAHolderTranxId, setInternalTransferObj);
  const userEmail = session?.user?.email || '';

  const login = async () => {
    const data = await signIn("google", { scope: "openid profile email" });
    console.log("data: ", data);
    generateProof();
  }

  const logout = () => {
    localStorage.clear();
    signOut();
  }

  if (status === "loading" || isLoading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }
  

  return (
    <>
    <Header onlogin={login} onlogout={logout} email={userEmail}/>
    <Box className='walletBox'>
      <Box className='walletBoxTitle'>zkLogin Wallet</Box>
      {(status === "authenticated") ? (
        <Box>
          <Box display={'flex'} gap={1}>
            <Box flex={1} mb={2} textAlign='center'><Chip label={`Balance: ${balance} ELF`} /></Box>
          </Box>
          
          <Tabs
            value={selectedTab}
            centered
            onChange={(event: React.SyntheticEvent, newValue: string) => setSelectedTab(newValue)}
          >
            <Tab value="1" label="Internal" />
            <Tab value="2" label="External" />
          </Tabs>
          {selectedTab === '1' && 
            <Box my={2}>
              <Box className='tabTitle'>Manager to CA holder account transfer</Box>
              <TextField label="Manage address" variant="outlined" size="small" fullWidth 
              value={internalTransferObj.managerAddress} 
              onChange={(event) => setInternalTransferObj({...internalTransferObj, managerAddress: event.target.value})}/>
              <Box mt={2}/>
              <TextField label="CA Holder address" variant="outlined" size="small" fullWidth 
              value={internalTransferObj.caHolderAddress} 
              onChange={(event) => setInternalTransferObj({...internalTransferObj, caHolderAddress: event.target.value})}/>
              <Box className='btnContainer'>
                <Button variant="contained" onClick={() => internalTransfer(internalTransferObj)} fullWidth>Transfer</Button>
              </Box>
            </Box>
          }
          {selectedTab === '2' && 
            <Box my={2}>
              <Box className='tabTitle'>Transfer to another wallet</Box>
              <TextField label="Tranx Id" variant="outlined" size="small" fullWidth
               value={externalTransferObj.caTranxId}
               defaultValue={localStorage.getItem("caHolderTranxId")} 
               onChange={(event) => setExternalTransferObj({...externalTransferObj, caTranxId: event.target.value})}/>
              <Box mt={2}/>
              <TextField label="To address" variant="outlined" size="small" fullWidth 
               value={externalTransferObj.toAddress} 
               onChange={(event) => setExternalTransferObj({...externalTransferObj, toAddress: event.target.value})}/>
              <Box mt={2}/>
              <TextField label="Amount" variant="outlined" size="small" fullWidth 
              value={externalTransferObj.amount}
              onChange={(event) => setExternalTransferObj({...externalTransferObj, amount: event.target.value})}/>
              <Box className='btnContainer'>
                <Button variant="contained" onClick={() => externalTransfer(externalTransferObj)} fullWidth>Transfer</Button>
              </Box>
            </Box>
          }
        </Box>
      ) : (
        <Box pb={2}>
          <Box className='info'>Google email integration, users can do both internal and external transfers. 
            Internal transfers involve moving funds from the manager's account to a CA holder's address, 
            while external transfers entail sending funds from their own wallet to another recipient's wallet.</Box>
          <Button variant="contained" onClick={() => login()} fullWidth>Connect</Button>
        </Box>
      )}
    </Box>
    </>
  );
}

/*
<p>Not signed in.</p>
<button onClick={() => signIn("google")}>Sign in</button>

<Box display='flex' m={2}>
  <Box flex={1}>
    <Chip label={`Signed in as ${userEmail}`} /><br/>
    <Box display='inline-flex' gap={2} mt={1}>
      <Button variant="contained" onClick={() => signOut()}>Sign out</Button>
      <Button variant="contained" onClick={() => generateProof()}>Generate Proof</Button>
      <Button variant="contained" onClick={() => createCAHolder()}>Create CA Holder</Button>
    </Box>
  </Box>
  <Box flex={1}>
    {proofObject && 
      <Box>
        <Box>Proof: {proofObject?.proof || 'Not found'}</Box>
        <Box>Identifier Hash: {proofObject?.identifierHash || 'Not found'}</Box>
        <Box>Public key: {proofObject?.publicKey || 'Not found'}</Box>
      </Box>}
  </Box>
</Box>
*/