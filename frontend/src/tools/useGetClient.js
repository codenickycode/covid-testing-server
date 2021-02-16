import { useContext } from 'react';
import axios from 'axios';
import { App, SetApp } from '../Providers/Context';

export default function useGetClient() {
  const setApp = useContext(SetApp);
  const { settings } = useContext(App);

  async function getClient(callback) {
    let user = null,
      newSettings = settings,
      error = '',
      confirmation = '';
    try {
      setApp((prev) => ({ ...prev, loading: true }));
      const res = await axios.get('/common/user');
      user = res.data;
      newSettings = { ...user.preferences };
      confirmation = 'Successfully logged in';
    } catch (e) {
      console.log(e);
      error = e.response?.data || e.message;
    } finally {
      setApp((prev) => ({
        ...prev,
        loading: false,
        error,
        confirmation,
        settings: user ? newSettings : { ...prev[settings], remember: false },
        user,
        headerName: user?.name?.firstName || '',
      }));
      if (callback) callback();
    }
  }
  return getClient;
}
