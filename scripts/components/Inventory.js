import React from 'react';
import AddFishForm from './AddFishForm';
import { base,
         firebaseRef,
         githubProvider,
         facebookProvider,
         twitterProvider
       } from '../firebaseConfig';

class Inventory extends React.Component {
  constructor() {
    super();
    this.state = {
      uid: '',
      owner: ''
    };
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.logout = this.logout.bind(this);
  }
  
  componentWillMount() {
    base.auth().onAuthStateChanged((user) => {
      if (user) {  
        this.setState({
          uid: user.uid,
          owner: this.state.owner || user.uid
        });
      } else {
        this.setState({
          uid: null,
          owner: null
        });
      }
    });  
  }
  
  logout() {
    base.unauth();
    this.setState({
      uid: null
    });
  }
  
  authHandler(authData) {  
    // console.log('authData', authData);
    // console.log('base', base);
    const storeRef = firebaseRef.child(this.props.params.storeId);
    
    storeRef.on('value', (snapshot) => {
      var data = snapshot.val() || {};
      // claim the store as our own if no owner already
      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        });
      }
      // update state to reflect current user & store owner
      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });
    });
  }
  
  authenticate(provider) {
    base.auth().signInWithPopup(provider).then((authData) => {
      this.authHandler(authData);
    }).catch((error) => {
      console.log('catch authenticate', error);
    });
  }  
  
  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <button className="github"
                onClick={this.authenticate.bind(this, githubProvider)}>
          Log in with Github
        </button>
        <button className="facebook"
                onClick={this.authenticate.bind(this, facebookProvider)}>
          Log in with Facebook
        </button>
        <button className="twitter"
                onClick={this.authenticate.bind(this, twitterProvider)}>
          Log in with Twitter
        </button>
      </nav>
    );
  }
  
  renderInventory(key) {
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
  }
  
  render() {
    let logoutButton = <button onClick={this.logout}>Log Out!</button>;
    
    // check if user is logged in
    if (!this.state.uid) {
      return (
        <div>
          {this.renderLogin()}
        </div>
      );
    }
    
    // check if user owns the store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of this store</p>
          {logoutButton}
        </div>
      );
    }
    
    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        
        <AddFishForm {...this.props}/>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  addFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  linkState: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired
};

export default Inventory;
