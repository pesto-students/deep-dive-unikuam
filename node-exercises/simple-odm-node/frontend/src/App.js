import React, { Component } from 'react';
import Home from './components/home/Home';
import Dashboard from './components/dashboard/Dashboard';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/dashboard" component={Dashboard} />
    </Switch>
  </Router>
)

export default App;
