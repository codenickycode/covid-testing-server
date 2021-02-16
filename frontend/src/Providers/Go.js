import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const Go = React.createContext();
export const GoProvider = ({ children }) => {
  const history = useHistory();
  const [goTo, setGoTo] = useState(null);

  useEffect(() => {
    let timer = null;
    if (goTo) {
      timer = setTimeout(() => {
        if (goTo === 'back') {
          history.goBack();
        } else {
          history.push(goTo);
        }
        setGoTo(null);
      }, 150);
    } else {
      const elements = document.querySelectorAll('.transition');
      elements.forEach((element) => {
        element.classList.add('show');
      });
    }
    return () => clearTimeout(timer);
  }, [goTo, history]);

  const go = (to) => {
    const elements = document.querySelectorAll('.transition');
    elements.forEach((element) => {
      element.classList.remove('show');
    });
    setGoTo(to);
  };

  return <Go.Provider value={go}>{children}</Go.Provider>;
};
