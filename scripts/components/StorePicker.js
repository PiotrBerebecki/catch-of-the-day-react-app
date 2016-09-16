import React from 'react';
import { withRouter } from 'react-router';
import helpers from'../helpers';

class StorePicker extends React.Component {
  constructor() {
    super();
    this.getToStore = this.getToStore.bind(this);
  }
     
  getToStore(event) {
    event.preventDefault();
    var storeId = this.refs.storeId.value;
    this.props.router.push(`/store/${storeId}`);
  }
  
  render() {
    return (
     <form className="store-selector" onSubmit={this.getToStore}>
      <h2>Please Enter A Store</h2>
      <input type="text" ref="storeId" defaultValue={helpers.getFunName()} required/>
      <button type="submit">Submit</button>
     </form>
    );
  }
}

StorePicker.propTypes = {
  router: React.PropTypes.object.isRequired
};

export default withRouter(StorePicker);
