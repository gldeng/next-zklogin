import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
 walletBox: {
    border: '2px solid #256dd3',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '8px 16px 0 16px',
    margin: '10% auto 16px auto',
    width: '400px',
    boxSizing: 'border-box',
    color: '#2c3e50',
    fontSize: '12px',
  },
  walletBoxTitle: {
    fontSize: '30px',
    fontWeight: 600,
    textAlign: 'center',
    margin: '16px 0',
  },
  tabTitle: {
    fontSize: '15px',
    fontWeight: 600,
    textAlign: 'center',
    margin: '0 0 16px 0',
  },
  btnContainer: {
    display: 'flex',
    gap: '4px',
    marginTop: '16px'
  },
  info: {
    fontSize: '13px',
    fontWeight: 400,
    margin: '0 0 16px 0',
    textAlign: 'center',

  }
}));
  
export default useStyles;