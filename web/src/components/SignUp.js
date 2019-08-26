import React, { Component } from 'react';
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      reEmail: '',
      password: '',
      rePassword: ''
    };
  }

  validateForm() {
    return this.state.username.length > 5 && this.state.email !== '' && this.state.password !== '' && this.state.email === this.state.reEmail && this.state.password === this.state.rePassword;
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
        .post('/api/auth/sign-up', {
          username: this.state.username,
          email: this.state.email,
          password: this.state.password
        })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.error(err.message);
        });
    } else {
      alert('incorrect data');
    }
  }

  render() {
    return (
      <div>
        <div>sign up</div>
        <form onSubmit={this.handleSubmit}>
          <input
            name="username"
            type="text"
            placeholder="full name"
            onChange={this.handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={this.handleChange}
          />
          <input
            name="reEmail"
            type="email"
            placeholder="retype email"
            onChange={this.handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="password"
            onChange={this.handleChange}
          />
          <input
            name="rePassword"
            type="password"
            placeholder="retype password"
            onChange={this.handleChange}
          />
          <button
            type="submit"
          >sign up</button>
        </form>
      </div>
    );
  }
}

export default Signup;
