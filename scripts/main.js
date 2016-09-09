var React = require('react');
var ReactDOM = require('react-dom');
var { Router, Route, browserHistory, withRouter } = require('react-router');
var createBrowserHistory = require('history/lib/createBrowserHistory');
var h = require('./helpers');

// ----------------
var App = React.createClass({
  render: function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
        </div>
        <Order/>
        <Inventory/>
      </div>
    );
  }
});

// ----------------
var Header = React.createClass({
  render: function() {
    const { tagline } = this.props;
    return (
      <header className="top">
        <h1>
          Catch
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>
          Day
        </h1>
        <h3 className="tagline"><span>{tagline}</span></h3>
      </header>
    );
  }
});

// ----------------
var Order = React.createClass({
  render: function() {
    return (
      <p>Order</p>
    );
  }
});

// ----------------
var Inventory = React.createClass({
  render: function() {
    return (
      <p>Inventory</p>
    );
  }
});

// ----------------
var StorePicker = React.createClass({
  getToStore: function(event) {
    event.preventDefault();
    var storeId = this.refs.storeId.value;
    this.props.router.push(`/store/${storeId}`);
  },
  render: function() {
    return (
     <form className="store-selector" onSubmit={this.getToStore}>
      <h2>Please Enter A Store</h2>
      <input type="text" ref="storeId" defaultValue={h.getFunName()} required/>
      <input type="submit"/>
     </form>
    );
  }
});

StorePicker = withRouter(StorePicker);

// ----------------
var NotFound = React.createClass({
  render: function() {
    return (
      <h1>404 Not Found!</h1>
    );
  }
});

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
