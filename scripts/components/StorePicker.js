import React from 'react';
import { withRouter } from 'react-router';
import helpers from'../helpers';

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
      <input type="text" ref="storeId" defaultValue={helpers.getFunName()} required/>
      <input type="submit"/>
     </form>
    );
  }
});

export default withRouter(StorePicker);
