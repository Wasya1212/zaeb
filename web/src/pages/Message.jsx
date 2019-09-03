import React, { Component } from 'react';

import axios from "axios";

import { MessageList } from "../components/Chat.jsx";

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      sendingMessage: '',
      interlocutorId: null
    };
  }

  componentDidMount() {
    const {chatId} = this.props.match.params;

    this.setState({
      interlocutorId: chatId
    });

    axios
      .post('/api/chat/conversation', {token: localStorage.getItem('token'), interlocutorId: chatId})
      .then(({data: chat}) => {
        this.setState({
          messages: (chat.messages || [])
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  sendMessage = e => {
    e.preventDefault();

    axios
      .post('/api/chat/message', {token: localStorage.getItem('token'), message: this.state.sendingMessage, interlocutorId: this.state.interlocutorId})
      .then(resolve => {
        console.log(resolve);
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleMessageChange = e => {
    this.setState({
      sendingMessage: e.target.value
    });
  }

  render() {
    return (
      <div>
        <MessageList messages={this.state.messages} />
        <form onSubmit={this.sendMessage}>
          <input onChange={this.handleMessageChange} placeholder="Enter message..." />
          <button type="submit">send</button>
        </form>
      </div>
    )
  }
}

export default Message;
