var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

var { Router, Route, browserHistory, withRouter } = require('react-router');
var createBrowserHistory = require('history/lib/createBrowserHistory');
var h = require('./helpers');
var Rebase = require('re-base');
var base = Rebase.createClass({databaseURL: 'https://catch-of-the-day-react-app.firebaseio.com/'});
var Catalyst = require('react-catalyst');


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
      fishes: require('./sample-fishes')
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
  },
  propTypes: {
    tagline: React.PropTypes.string.isRequired
  }
});

// ----------------
var Fish = React.createClass({
  onButtonClick: function() {
    this.props.addToOrder(this.props.index);
  },
  render: function() {
    var { name, price, status, desc, image } = this.props.details;
    var isAvailable = status === 'available' ? true : false;
    var buttonText = isAvailable ? 'Add to Order' : 'Sold Out!';
    return (
      <li className="menu-fish">
        <img src={image} alt={image}/>
        <h3 className="fish-name">
          {name}
          <span className="price">{h.formatPrice(price)}</span>
        </h3>
        <p>{desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    );
  }
});

// ----------------
var Order = React.createClass({
  renderOrder: function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={this.props.removeFromOrder.bind(null, key)}>&times;</button>;
    
    if (Object.keys(this.props.fishes).length === 0) {
      return (
        <li key={key}>Loading item...</li>
      );
    }    

    if (!fish) {
      return (
        <li key={key}>Sorry, fish no longer available! {removeButton}</li>
      );
    }
    
    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup component="span"
                              transitionName="count"
                              transitionEnterTimeout={250}
                              transitionLeaveTimeout={250}>
            <span key={count}>{count}</span>
          </CSSTransitionGroup>
          lbs {fish.name} {removeButton}
        </span>
        <span className="price">{h.formatPrice(count * fish.price)}</span>
      </li>
    );
  },
  render: function() {
    var { fishes, order } = this.props;
    var orderKeys = Object.keys(order);
    
    var total = orderKeys.reduce((prevTotal, key) => {
      var fish = fishes[key];
      var count = order[key];
      var isAvailable = fish && fish.status === 'available';
      
      if (fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0);
      } else {
        return prevTotal;
      }
    }, 0);
    
    return (
      <div className="order-wrap">
        <h2 className="order-title">Your order</h2>
        
        <CSSTransitionGroup className="order"
                            component="ul"
                            transitionName="order"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
          {orderKeys.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
        
      </div>
    );
  },
  propTypes: {
    fishes: React.PropTypes.object.isRequired,
    order: React.PropTypes.object.isRequired,
    removeFromOrder: React.PropTypes.func.isRequired
  }
});

// ----------------
var Inventory = React.createClass({
  renderInventory: function(key) {
    var { linkState } = this.props;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState(`fishes.${key}.name`)}/>
        <input type="text" valueLink={linkState(`fishes.${key}.price`)}/>
        <select valueLink={linkState(`fishes.${key}.status`)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea valueLink={linkState(`fishes.${key}.desc`)}></textarea>
        <input type="text" valueLink={linkState(`fishes.${key}.image`)}/>
        <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
      </div>
    );
  },
  render: function() {
    return (
      <div>
        <h2>Inventory</h2>
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  },
  propTypes: {
    addFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    linkState: React.PropTypes.func.isRequired,
    fishes: React.PropTypes.object.isRequired
  }
});


// ----------------
var AddFishForm = React.createClass({
  createFish: function(event) {
    event.preventDefault();
    
    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value
    };
    
    this.props.addFish(fish);
    
    this.refs.fishForm.reset();
  },
  render: function() {
    return (
     <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
      <input type="text" ref="name" placeholder="Fish Name"/>
      <input type="text" ref="price" placeholder="Fish Price"/>
      <select ref="status">
        <option value="available">Fresh!</option>
        <option value="unavailable">Sold Out!</option>
      </select>
      <textarea type="text" ref="desc" placeholder="Desc"></textarea>
      <input type="text" ref="image" placeholder="URL to Image"/>
      <button type="submit">+ Add Item </button>
     </form>
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
