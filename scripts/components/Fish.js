import React from 'react';
import helpers from'../helpers';

class Fish extends React.Component {
  constructor() {
    super();
    this.onButtonClick = this.onButtonClick.bind(this);
  }
  
  onButtonClick() {
    this.props.addToOrder(this.props.index);
  }
  
  render() {
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
}

Fish.propTypes = {
  addToOrder: React.PropTypes.func.isRequired,
  details: React.PropTypes.object.isRequired
};

export default Fish;
