import React, { Component } from 'react';

import axios from 'axios';

const ChatList = props => {
  if (!Array.isArray(props.chats)) {
    return null;
  }

  return (
    <ul>
      {props.chats.map(chat => (<li>{chat.name}</li>))}
    </ul>
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
