import React from 'react';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';
import Header from './Header';
import Fish from './Fish';
import Order from './Order';
import Inventory from './Inventory';
import { base } from '../firebaseConfig';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      fishes: {},
      order: {}
    };
     
    this.addToOrder = this.addToOrder.bind(this);
    this.renderFish = this.renderFish.bind(this);
    this.removeFromOrder = this.removeFromOrder.bind(this);
    this.addFish = this.addFish.bind(this);
    this.removeFish = this.removeFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.linkState = this.linkState.bind(this);
  }
 
  componentDidMount() {
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
  }
  
  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.params.storeId}`,
     JSON.stringify(nextState.order));
  }
  
  addToOrder(fish) {
    var order = this.state.order;
    this.setState({
      order: {...order, [fish]: order[fish] + 1 || 1}
    });
  }
  
  removeFromOrder(key) {    
    var orderCopy = Object.assign({}, this.state.order);
    delete orderCopy[key];
    this.setState({
      order: {...orderCopy}
    });
  }
  
  addFish(fish) { 
    var timestamp = (new Date()).getTime();
    this.setState({
      fishes: {...this.state.fishes, [`fish-${timestamp}`]: fish}
    });
  }
  
  removeFish(key) {  
    if (confirm('Are you sure you want to remove this fish?')) {
      this.setState({
        fishes: {[key]: null}
      });
    }
  }
  
  loadSamples() {
    this.setState({
      fishes: require('../sample-fishes')
    });
  }
  
  renderFish(fish) {
    return (
      <Fish key={fish}
            index={fish}
            details={this.state.fishes[fish]}
            addToOrder={this.addToOrder}/>
    );
  }
  
  render() {
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
                   fishes={fishes}
                   params={this.props.params}/>
      </div>
    );
  }
  
}

reactMixin.onClass(App, Catalyst.LinkedStateMixin);

export default App;
