import React from 'react';

class AddFishForm extends React.Component {
  constructor() {
    super();
    this.createFish = this.createFish.bind(this);
  }
  
  createFish(event) {
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
  }
  
  render() {
    return (
     <form className="fish-edit" ref="fishForm" onSubmit={this.createFish}>
      <input type="text" ref="name" placeholder="Fish name"/>
      <input type="text" ref="price" placeholder="Price in cents"/>
      <select ref="status">
        <option value="available">Fresh!</option>
        <option value="unavailable">Sold Out!</option>
      </select>
      <textarea type="text" ref="desc" placeholder="Desc"></textarea>
      <input type="text" ref="image" placeholder="URL to image"/>
      <button type="submit">+ Add Item</button>
     </form>
    );
  }
}

AddFishForm.propTypes = {
  addFish: React.PropTypes.func.isRequired
};

export default AddFishForm;
