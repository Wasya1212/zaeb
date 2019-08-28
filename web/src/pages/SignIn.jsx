import React, { Component } from 'react';

import LoginForm from '../components/LoginForm.jsx';
import Auth from '../components/Auth.jsx';

class SignIn extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Auth successRedirect="/profile" />
        <LoginForm />
      </div>
    );
  }
}

export default SignIn;
