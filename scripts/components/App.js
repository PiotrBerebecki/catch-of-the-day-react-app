import React from 'react';
import Catalyst from 'react-catalyst';
// Firebase
import Rebase from 're-base';
var base = Rebase.createClass({databaseURL: 'https://catch-of-the-day-react-app.firebaseio.com/'});

import Header from './Header';
import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory';

// ----------------
var App = React.createClass({
  mixins: [Catalyst.LinkedStateMixin],
  getInitialState: function() {
    return {
      fishes: {},
      order: {}
    };
  },
  componentDidMount: function() {
    base.syncState(`${this.props.params.storeId}/fishes`, {
      context: this,
      state: 'fishes',
    });
    
    var localStorageOrder = localStorage.getItem(`order-${this.props.params.storeId}`);
    
    if (localStorageOrder) {
      this.setState({
        order: JSON.parse(localStorageOrder)
      });
    }
  },
  componentWillUpdate: function(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
  },
  addToOrder: function(fish) {
    var order = this.state.order;
    this.setState({
      order: {...order, [fish]: order[fish] + 1 || 1}
    });
  },
  removeFromOrder: function(key) {    
    var orderCopy = Object.assign({}, this.state.order);
    delete orderCopy[key];
    this.setState({
      order: {...orderCopy}
    });
  },
  addFish: function(fish) { 
    var timestamp = (new Date()).getTime();
    this.setState({
      fishes: {...this.state.fishes, [`fish-${timestamp}`]: fish}
    });
  },
  removeFish: function(key) {  
    if (confirm('Are you sure you want to remove this fish?')) {
      this.setState({
        fishes: {[key]: null}
      });
    }
  },
  loadSamples: function() {
    this.setState({
      fishes: require('../sample-fishes')
    });
  },
  renderFish: function(fish) {
    return (
      <Fish key={fish} index={fish} details={this.state.fishes[fish]} addToOrder={this.addToOrder}/>
    );
  },
  render: function() {
    var { fishes, order } = this.state;
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {Object.keys(fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order fishes={fishes}
               order={order}
               removeFromOrder={this.removeFromOrder}/>
        <Inventory addFish={this.addFish}
                   removeFish={this.removeFish}
                   loadSamples={this.loadSamples}
                   linkState={this.linkState}
                   fishes={this.state.fishes}/>
      </div>
    );
  }
});

export default App;
