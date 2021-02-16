import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ContextProvider from './Providers/Context';
import { GoProvider } from './Providers/Go';
import { ScrollToTop } from './tools/scrolling.js';
import ErrorBoundary from './components/ErrorBoundary';
import Alert from './components/Alert.js';
import Header from './sections/Header';
import Navbar from './sections/Navbar';
import Welcome from './pages/Welcome';
import Search from './pages/Search';
import Appointments from './pages/Appointments';
import Account from './pages/Account';
import Settings from './pages/Settings';
import Faq from './pages/Faq';
import Gateway from './pages/Gateway';

import Skeleton from './components/Skeletons.js';
import ErrorHandler from './components/ErrorHandler';

const App = () => {
  return (
    <Router>
      <ErrorBoundary>
        <GoProvider>
          <ContextProvider>
            <ScrollToTop />
            <Alert />
            <Switch>
              <Route exact path='/' component={Welcome} />
              <Header>
                <div id='pages'>
                  <Route path='/search' component={Search} />
                  <Route path='/appointments' component={Appointments} />
                  <Route path='/account' component={Account} />
                  <Route path='/settings' component={Settings} />
                  <Route path='/faq' component={Faq} />
                  <Route path='/gateway/:to' component={Gateway} />
                  {/*  */}
                  <Route path='/error' component={ErrorHandler} />
                  <Route path='/skeleton' component={Skeleton} />
                </div>
                <Navbar />
              </Header>
            </Switch>
          </ContextProvider>
        </GoProvider>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
