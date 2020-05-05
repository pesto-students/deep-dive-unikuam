import React from 'react';
import Home from './components/jsx/Home';
import DashBoard from './components/jsx/DashBoard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <React.Fragment>
        <Switch>
          <Route path="/home" component={Home}/>
          <Route exact path="/" component={Home}/>
          <Route path="/dashboard" component={DashBoard}/>
        </Switch>
      </React.Fragment>
    </Router>
  );
}

export default App;
