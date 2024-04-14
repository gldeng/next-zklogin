// session.js
import Cookies from 'js-cookie';

// Set session value
export const setSessionValue = (key: string, value: any) => {
  Cookies.set(key, JSON.stringify(value), { expires: 7 }); // Expires in 7 days
};

// Get session value
export const getSessionValue = (key: string) => {
  const value = Cookies.get(key);
  return value ? JSON.parse(value) : null;
};