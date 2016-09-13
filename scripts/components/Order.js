import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import helpers from '../helpers';

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
        <span className="price">{helpers.formatPrice(count * fish.price)}</span>
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
            {helpers.formatPrice(total)}
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

export default Order;
