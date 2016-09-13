import React from 'react';
import helpers from'../helpers';

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
          <span className="price">{helpers.formatPrice(price)}</span>
        </h3>
        <p>{desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    );
  }
});

export default Fish;
