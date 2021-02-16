import { useContext } from 'react';
import axios from 'axios';
import { SetApp, INIT_APP } from '../../Providers/Context';
import { Go } from '../../Providers/Go';

export const LogoutButton = ({ saving }) => {
  const setApp = useContext(SetApp);
  const go = useContext(Go);

  async function logout() {
    go('/');
    localStorage.clear();
    sessionStorage.clear();
    setApp((prev) => ({ ...prev, loading: true }));
    let error = '';
    let confirmation = '';
    try {
      const res = await axios.get('/common/logout');
      confirmation = res.data;
    } catch (e) {
      error = e.response?.data || e.message;
    } finally {
      setApp({
        ...INIT_APP,
        settings: { dark: false, remember: false },
        error,
        confirmation,
      });
    }
  }

  return (
    <button
      type='button'
      className={saving ? 'btn disabled' : 'btn'}
      onClick={logout}
      disabled={saving}
    >
      Logout
    </button>
  );
};
