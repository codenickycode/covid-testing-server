import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const scrollIntoView = (ref, type) => {
  let itemBottom = ref.current.getBoundingClientRect().bottom;
  let viewHeight = window.innerHeight;
  ref.current.scrollIntoView({
    behavior: 'smooth',
    block: type,
  });
  window.scrollBy({
    left: 0,
    top: itemBottom - viewHeight + 160,
    behavior: 'smooth',
  });
};
