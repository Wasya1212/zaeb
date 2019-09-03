import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

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
            .map(chat => <li className="chat-list__item"><Link to={"/chat/" + chat._id.toString()}><ChatView chat={chat} /></Link></li>)
        }
      </ul>
      <ul className="chat-list">
        <h3>Group chats:</h3>
        {
          props.chats
            .filter(chat => chat.name !== 'conversation')
            .map(chat => <li className="chat-list__item"><Link to={"/chat/" + chat._id.toString()}><ChatView chat={chat} /></Link></li>)
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

const MessageList = ({messages}) => (
  <ul>
    {
      messages.map(message => <li>{message.text}</li>)
    }
  </ul>
);

export { CreateChatComponent, ChatList, MessageList };
