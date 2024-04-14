import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
 header: {
    backgroundColor: '#0f5dcb',
    padding: '16px 16px',
    boxSizing: 'border-box',
    color: '#fff',
    fontSize: '12px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    boxShadow: '1px 1px 2px #094aa5',
    display: 'flex'
  },
  logoContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '22px',
    fontWeight: 600,
    flex: 1,
  },
  addressContainer: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  chipBox: {
    width: '200px',
    cursor: 'pointer'
  }
}));
  
export default useStyles;