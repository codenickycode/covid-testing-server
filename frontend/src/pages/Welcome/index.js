import React, { useContext } from 'react';
import { App } from '../../Providers/Context';
import { Go } from '../../Providers/Go';
import { WelcomeSkeleton } from '../../components/Skeletons';
import { Button, Page } from '../../components/index';
import { ReactComponent as WelcomeSVG } from '../../img/welcome.svg';
import { ReactComponent as LogoSVG } from '../../img/logoWithText.svg';

const Welcome = () => {
  const { loading } = useContext(App);
  const go = useContext(Go);

  return loading ? (
    <WelcomeSkeleton />
  ) : (
    <Page id='welcome' addClass='flex-col'>
      <div id='welcome-logo'>
        <LogoSVG />
      </div>
      <div className='center'>
        <h1>COVID-19 testing is available at UrgentMD</h1>
        <p>We're here for you during this pandemic.</p>
      </div>
      <WelcomeSVG />
      <div className='center'>
        <h1>
          No more <br />
          waiting in line
        </h1>
        <p>Schedule an appointment in advance</p>
      </div>
      <Button
        autoFocus={true}
        onClick={() => go('/search/form')}
        label='START'
      />
    </Page>
  );
};

export default Welcome;
