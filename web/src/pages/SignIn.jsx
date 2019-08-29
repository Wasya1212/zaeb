import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import LoginForm from '../components/LoginForm.jsx';
import Auth from '../components/Auth.jsx';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false
    }
  }

  successLogin = () => {
    this.setState({
      redirect: true
    });
  }

  render() {
    return (
      <div>
        {this.state.redirect ? <Redirect to="/profile" /> : null}
        <Auth successRedirect="/profile" />
        <LoginForm success={this.successLogin} />
      </div>
    );
  }
}

export default SignIn;
