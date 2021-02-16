import { useContext } from 'react';
import axios from 'axios';
import { SetApp } from '../../../Providers/Context.js';

export default function useLogin() {
  const setApp = useContext(SetApp);

  const login = async (type, email, password) => {
    let user = null,
      error = '',
      confirmation = '';
    try {
      setApp((prev) => ({ ...prev, loading: true }));
      const res = await axios.post(`/common/${type}`, {
        email,
        password,
      });
      user = res.data;
      confirmation = 'Logged In!';
      localStorage.remember = user.preferences.remember;
      localStorage.dark = user.preferences.dark;
    } catch (e) {
      console.log(e);
      error = e.response?.data || e.message;
    } finally {
      setApp((prev) => ({
        ...prev,
        loading: false,
        error,
        confirmation,
        user,
        settings: user ? { ...user.preferences } : prev.settings,
        headerName: user?.name?.firstName || '',
      }));
    }
  };

  return login;
}
