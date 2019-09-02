import React, { Component } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

import axios from 'axios';

const UserView = ({user}) => (
  <div>
    {user.email}
  </div>
);

class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userModalIsOpen: false,
      user: {}
    };
  }

  showUserModal = user => {
    this.setState({
      userModalIsOpen: true,
      user
    });
  }

  closeUserModal = () => {
    this.setState({
      userModalIsOpen: false,
      user: {}
    });
  }

  render() {
    return (
      <ul>
        {this.props.users.map(user => (<li onClick={() => { this.showUserModal(user); }}><UserView user={user}/></li>))}
        <Modal
          isOpen={this.state.userModalIsOpen}
          onRequestClose={this.closeUserModal}
          contentLabel="Find users"
        >
          {
            this.state.userModalIsOpen ? (
              <div>
                <UserProfile user={this.state.user} />
                <Link to={"/chat/" + this.state.user._id.toString()} onClick={this.closeUserModal}>Go to messaging</Link>
              </div>
            ) : null}
          <button onClick={this.closeUserModal}>Close modal</button>
        </Modal>
      </ul>
    );
  }
}

const UserProfile = ({user}) => (
  <div>
    <span>{user._id}</span>
    <span>{user.email}</span>
    <span>{user.info.name}</span>
  </div>
);

class SearchUsersButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    };
  }

  findUsers = name => {
    axios
      .post('/api/users', { name: name, token: localStorage.getItem('token') })
      .then(({ data: users }) => {
        this.setState({ users });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleUsersChange = e => {
    if (e.target.value === '') {
      return;
    }

    this.findUsers(e.target.value);
  }

  render() {
    return (
      <div>
        <input onChange={this.handleUsersChange} />
        <UsersList users={this.state.users} />
      </div>
    );
  }
}

export { SearchUsersButton, UsersList };
