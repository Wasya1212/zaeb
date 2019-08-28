import React, { Component } from 'react';
import { connect } from "react-redux";

import axios from 'axios';

import { addToken } from "../actions/index";

function mapDispatchToProps(dispatch) {
  return {
    addToken: token => dispatch(addToken(token))
  };
}

const mapStateToProps = state => {
  return { token: state.token };
};

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
  }

  validateForm() {
    return this.state.email.length > 5 && this.state.password.length > 8;
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    if (this.validateForm() === true) {
      axios
        .post('/api/auth/login', {
          email: this.state.email,
          password: this.state.password
        })
        .then(({ data: token }) => {
          console.log(token);
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      alert('incorrect data');
    }
  }

  render() {
    return (
      <div>
        <div>login</div>
        <form onSubmit={this.handleSubmit}>
          <input
            className="email"
            value={this.state.email}
            type="email"
            onChange={this.handleChange}
            name="email"
            placeholder="email"
          />
          <input
            className="password"
            value={this.state.password}
            type="password"
            onChange={this.handleChange}
            name="password"
            placeholder="password"
          />
          <button
            type="submit"
          >login</button>
        </form>
      </div>
    )
  }
}

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginForm);

export default Login;
