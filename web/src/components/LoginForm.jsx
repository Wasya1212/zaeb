import React, { Component } from 'react';
import { connect } from "react-redux";

import axios from 'axios';

import { addToken, addAuthentication, removeAuthentication } from "../actions/index";

function mapDispatchToProps(dispatch) {
  return {
    addToken: token => dispatch(addToken(token)),
    addAuthentication: () => dispatch(addAuthentication()),
    removeAuthentication: () => dispatch(removeAuthentication())
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
        .post('/api/auth/sign-in', {
          email: this.state.email,
          password: this.state.password
        })
        .then(({ data: token }) => {
          localStorage.setItem('token', token);
          this.props.addToken(token);
          this.props.addAuthentication();
        })
        .then(() => {
          try {
            this.props.success();
          } catch (err) {
            console.error(err);
          }
        })
        .catch(err => {
          localStorage.clear();
          this.props.removeAuthentication();
          console.error(err);
        });
    } else {
      alert('incorrect data');
    }
  }

  render() {
    return (
      <form className="login-form" onSubmit={this.handleSubmit}>
        <input
          className="email"
          value={this.state.email}
          type="email"
          onChange={this.handleChange}
          name="email"
          placeholder="email"
          required
        />
        <input
          className="password"
          value={this.state.password}
          type="password"
          onChange={this.handleChange}
          name="password"
          placeholder="password"
          required
        />
        <button
          type="submit"
        >login</button>
      </form>
    )
  }
}

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginForm);

export default Login;
