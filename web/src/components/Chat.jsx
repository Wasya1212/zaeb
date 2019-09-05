import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

import axios from 'axios';

import { UserProfile } from "./Users.jsx";

import "../styles/chat.sass";

function getTime(timestamp) {
  const date = timestamp.toString().slice(0,10);
  let time = timestamp.toString().slice(11,16);

  return `${date} ${time}`;
}

const ChatView = ({chat}) => (
  <div className="chat-view">
    <div className="chat-view__poster">
      <img src="https://ik.imagekit.io/PrintOctopus/s/files/1/0006/0158/7777/products/dab_life.png?v=1554963498" />
    </div>
    <div className="chat-view__info">
      <div className="chat-view__title">{chat.name}</div>
      <div className="chat-view__users-count">users: {chat.users.length - 1}</div>
      <div className="chat-view__messages-count">messages: {chat.messages.length}</div>
      <div className="chat-view__latest-update">{getTime(chat.updatedAt)}</div>
    </div>
  </div>
);

const ChatList = props => {
  if (!Array.isArray(props.chats)) {
    return null;
  }

  return (
    <div className="chats">
      <ul className="chat-list">
        <h3>Users chats:</h3>
        {
          props.chats
            .filter(chat => chat.name === 'conversation')
            .map(chat => <li key={chat._id} className="chat-list__item"><Link to={"/chat/conversation/" + chat.users[1].toString()}><ChatView chat={chat} /></Link></li>)
        }
      </ul>
      <ul className="chat-list">
        <h3>Group chats:</h3>
        {
          props.chats
            .filter(chat => chat.name !== 'conversation')
            .map(chat => <li key={chat._id} className="chat-list__item"><Link to={"/chat/discussion/" + chat._id.toString()}><ChatView chat={chat} /></Link></li>)
        }
      </ul>
    </div>
  );
};

class CreateChatComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatName: ''
    };
  }

  validateForm() {
    return this.state.chatName !== '';
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
        .post('/api/chat/create', { token: localStorage.getItem('token'), private: false, name: this.state.chatName })
        .then(({ data: chat }) => {
          if (this.props.afterCreate) {
            this.props.afterCreate(chat);
          }
        })
        .catch(err => {
          console.log(err);
          alert("Cannot create chat! Try again(");
        });
    } else {
      alert('incorrect data');
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          onChange={this.handleChange}
          name="chatName"
          placeholder="Chat name"
          required="required"
        />
        <button type="submit">create</button>
      </form>
    );
  }
}

class AddUserToChatBtn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addUserToChatModalIsOpen: false,
      users: []
    };
  }

  showAddUsersToChatModal = () => {
    this.setState({
      addUserToChatModalIsOpen: true
    });
  }

  hideAddUsersToChatModal = () => {
    this.setState({
      addUserToChatModalIsOpen: false,
      requestProcessing: false
    });
  }

  findUsers = name => {
    this.setState({requestProcessing: true});

    axios
      .post('/api/users', { name, token: localStorage.getItem('token') })
      .then(({ data: users }) => {
        this.setState({ users, requestProcessing: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({requestProcessing: false});
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

  addUser = userId => {
    axios
      .post('/api/chat/add-user', {token: localStorage.getItem('token'), userId, chatId: this.props.chatId})
      .then(resolve => {
        this.setState({
          users: []
        });
      })
      .catch(err => {
        console.error(err);
      })
  }

  render() {
    return (
      <div className="add-user-btn">
        <button onClick={this.showAddUsersToChatModal}>add user</button>
        <Modal
          isOpen={this.state.addUserToChatModalIsOpen}
          onRequestClose={this.hideAddUsersToChatModal}
          contentLabel="Add users"
        >
          <h2>Add users to chat:</h2>
          <input placeholder="Enter username..." className="add-users-to-chat-input" onChange={this.handleUsersChange} />
          <ul className="add-users-to-chat-list">
            {
              this.state.users.map(user => (
                <li key={user._id}>
                  <UserProfile user={user}/>
                  {
                    user.info.chats.indexOf(this.props.chatId) === -1 ? <button className="add-users-to-chat-btn" onClick={() => {this.addUser(user._id)}}>add user</button> : null
                  }
                </li>
              ))
            }
          </ul>
          <button className="close-modal-btn" onClick={this.hideAddUsersToChatModal}>Close modal</button>
        </Modal>
      </div>
    );
  }
}

export { CreateChatComponent, ChatList, AddUserToChatBtn };
