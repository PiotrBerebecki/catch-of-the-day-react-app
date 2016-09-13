import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import StorePicker from './components/StorePicker';
import App from './components/App';
import NotFound from './components/NotFound';

// ----------------
var routes = (
  <Router history={browserHistory}>
    <Route path="/" component={StorePicker}/>
    <Route path="store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
);

// ----------------
ReactDOM.render(
  routes,
  document.getElementById('main')
);
