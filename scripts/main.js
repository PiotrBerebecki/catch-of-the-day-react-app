var React = require('react');
var ReactDOM = require('react-dom');
var { Router, Route, browserHistory, withRouter } = require('react-router');
var createBrowserHistory = require('history/lib/createBrowserHistory');
var h = require('./helpers');

// ----------------
var App = React.createClass({
  getInitialState: function() {
    return {
      fishes: {},
      order: {}
    };
  },
  addFish: function(fish) { 
    var timestamp = (new Date()).getTime();
    this.setState({
      fishes: {...this.state.fishes, [`fish-${timestamp}`]: fish}
    });
  },
  loadSamples: function() {
    this.setState({
      fishes: require('./sample-fishes')
    });
  },
  addToOrder: function(fish) {
    var order = this.state.order;
    this.setState({
      order: {...order, [fish]: order[fish] + 1 || 1}
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
        <Order fishes={fishes} order={order}/>
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
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
    
    if (!fish) {
      return (
        <li key={key}>Sorry, fish no longer available!</li>
      );
    }
    
    return (
      <li key={key}>
        {count}lbs
        {fish.name}
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
        <ul className="order">
          {orderKeys.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </ul>
      </div>
    );
  }
});

// ----------------
var Inventory = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Inventory</h2>
        <AddFishForm {...this.props}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
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
