import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import RegistrationForm from '../components/RegistrationForm.jsx';
import Auth from '../components/Auth.jsx';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    }
  }

  successregistration = () => {
    this.setState({
      redirect: true
    });
  }

  render() {
    return (
      <div>
        {this.state.redirect ? <Redirect to="/profile" /> : null}
        <Auth successRedirect="/profile" />
        <RegistrationForm success={this.successregistration} />
      </div>
    );
  }
}

export default SignUp;
