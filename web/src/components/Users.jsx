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
      <div>
        <ul {...this.props} className="users-search-list">
          {this.props.users.map(user => (<li className="users-search-list__item" onClick={() => { this.showUserModal(user); }}><UserProfile user={user}/></li>))}
        </ul>
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
      </div>
    );
  }
}

class SearchUsersButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      checked: false
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
      this.setState({
        users: []
      });
    } else {
      this.findUsers(e.target.value);
    }
  }

  hideUsersList = e => {
    setTimeout(() => {
      this.setState({
        checked: false
      });
    }, 200);
  }

  showUsersList = e => {
    this.setState({
      checked: true
    });
  }

  render() {
    return (
      <form className="users-search-form">
        <input
          onFocus={this.showUsersList}
          onBlur={this.hideUsersList}
          placeholder="Users search..."
          onChange={this.handleUsersChange}
        />
        <UsersList hidden={!this.state.checked} users={this.state.users} />
      </form>
    );
  }
}

const UserProfile = props => (
  <div {...props} className="user-profile">
    <div className="user-profile__picture">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc5zNZV5Uc6ZwS4JAxBVS0DiqUtIAR_Q5u6-G42vMfNk3mFFLj" />
    </div>
    <div className="user-profile__info">
      <div className="user-profile__name">{props.user.info.name}</div>
      <div className="user-profile__email">{props.user.email}</div>
    </div>
  </div>
);

export { SearchUsersButton, UsersList, UserProfile };
