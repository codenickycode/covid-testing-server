import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { App } from '../../Providers/Context';
import { Go } from '../../Providers/Go';
import Menu from './Menu';
import { ArrowLeft, MenuIcon } from '../../icons';

export default function Header({ children }) {
  const location = useLocation();
  const url = location.pathname.match(/\w*$/)[0];
  const { loading, navDisabled } = useContext(App);
  const go = useContext(Go);
  const [title, setTitle] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setTitle(getTitle(url));
  }, [url]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const arrowClass = loading || navDisabled ? 'disabled' : '';
  const arrowClick = loading || navDisabled ? null : () => go('back');
  const menuClass =
    loading || navDisabled
      ? 'disabled menu-icon'
      : showMenu
      ? 'active menu-icon show-menu'
      : 'active menu-icon';
  const menuClick = loading || navDisabled ? null : toggleMenu;
  return (
    <div>
      <header id='header'>
        <div id='header-wrapper'>
          <div id='header-main'>
            <ArrowLeft
              id='back-btn'
              addClass={arrowClass}
              onClick={arrowClick}
            />
            <LoadingOrTitle loading={loading} title={title} />
            <div id='header-dummy'>
              <ArrowLeft />
            </div>
            <MenuIcon addClass={menuClass} onClick={menuClick} />
            {location.pathname.match(/search/) && <SearchProgress url={url} />}
          </div>
          <div className={showMenu ? 'show-menu no-menu' : 'no-menu'}>
            <Menu toggleMenu={toggleMenu} />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

const LoadingOrTitle = ({ loading, title }) => {
  return loading ? (
    <p className='skeleton-h1text transition show'>Loading...</p>
  ) : (
    <h2 className='title transition show'>{title}</h2>
  );
};

const getTitle = (url) => {
  switch (url) {
    case '':
      return 'Welcome';
    case 'form':
      return 'Search';
    case 'results':
      return 'Next Available';
    case 'selection':
      return 'Book An Appointment';
    case 'appointments':
      return 'My Appointments';
    case 'account':
      return 'My Account';
    case 'settings':
      return 'My Settings';
    case 'faq':
      return 'FAQ';
    default:
      return 'Covid-19 Testing';
  }
};

const SearchProgress = ({ url }) => {
  return (
    <div id='search-progress'>
      <span>{url === 'form' ? '⚪' : '⚫'}</span>
      <span>{url === 'results' ? '⚪' : '⚫'}</span>
      <span>{url === 'selection' ? '⚪' : '⚫'}</span>
    </div>
  );
};
