import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Switch, Route } from 'react-router-dom';

import StreamerPage from './StreamerPage';
import ListenerPage from './ListenerPage';

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/">
          <StreamerPage />
        </Route>
        <Route exact path="/listen">
          <ListenerPage />
        </Route>
      </Switch>
    </HashRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
