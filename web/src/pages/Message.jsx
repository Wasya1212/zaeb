import React, { Component } from 'react';

import axios from "axios";
import socketIOClient from "socket.io-client";

import { MessageList, AddUserToChatBtn } from "../components/Chat.jsx";

import "../styles/message.sass";

class Message extends Component {
  constructor(props) {
    super(props);

    this.textInput = React.createRef();

    this.state = {
      messages: [],
      sendingMessage: '',
      chatId: null,
      interlocutorId: null,
      socket: null
    };
  }

  componentDidMount() {
    const {chatId, direction} = this.props.match.params;

    axios
      .get('/api/hostname')
      .then(resolve => {
        const socket = socketIOClient(resolve.data == 'localhost:3000' ? 'localhost:5000' : resolve.data);
        this.setState({
          socket: socket
        })
      })
      .then(() => {
        this.state.socket.emit('join to room', {chatId});
        this.state.socket.on('message', ({message}) => {
          this.setState({
            messages: this.state.messages.concat(message)
          });
        });
      })
      .catch(err => {
        console.error(err);
      })

    switch (direction) {
      case 'conversation':
        this.getConversationMessages(chatId);
        break;
      case 'discussion':
        this.getDiscussionMessages(chatId);
        break;
      default:
        console.log('redirect to error page');
    }
  }

  componentDidUpdate(prevProps, prevState) {
      if (prevProps.match.params != this.props.match.params) {
          const {chatId, direction} = this.props.match.params;

          switch (direction) {
            case 'conversation':
              this.getConversationMessages(chatId);
              break;
            case 'discussion':
              this.getDiscussionMessages(chatId);
              break;
            default:
              console.log('redirect to error page');
          }
      } else {
        return false;
      }
  }

  getConversationMessages = interlocutorId => {
    axios
      .post('/api/chat/conversation', {token: localStorage.getItem('token'), interlocutorId})
      .then(({data: chat}) => {
        this.setState({ chatId: chat._id, interlocutorId });
        return chat._id;
      })
      .then(chatId => {
        axios
          .post('/api/chat/messages',  {token: localStorage.getItem('token'), chatId})
          .then(({data: messages}) => {
            this.setState({ messages });
          });
      })
      .catch(err => {
        console.error(err);
      });
  }

  getDiscussionMessages = chatId => {
    axios
      .post('/api/chat/discussion', {token: localStorage.getItem('token'), chatId})
      .then(({data: chat}) => {
        this.setState({ chatId: chat._id });
        return chat._id;
      })
      .then(chatId => {
        axios
          .post('/api/chat/messages',  {token: localStorage.getItem('token'), chatId})
          .then(({data: messages}) => {
            this.setState({ messages });
          });
      })
      .catch(err => {
        console.error(err);
      });
  }

  sendMessage = e => {
    e.preventDefault();

    axios
      .post('/api/chat/message', {
        token: localStorage.getItem('token'),
        message: this.state.sendingMessage,
        chatId: this.state.chatId,
        interlocutorId: this.state.interlocutorId
      })
      .then(({data: message}) => {
        try {
          this.state.socket.emit('chat message', {room: this.props.match.params.chatId, message});
        } catch (e) {} finally {
          this.textInput.current.value = '';
          this.setState({
            messages: this.state.messages.concat(message),
            sendingMessage: ''
          });
        }
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
      <div className="messages-container">
        {
          this.props.match.params.direction === 'discussion' ? <AddUserToChatBtn chatId={this.state.chatId}/> : null
        }
        <ul className="messages-list">
          {
            this.state.messages.map(message => (
              <li key={message._id}>
                <div className="user-view">
                  <div className="user-view__picture">
                    <img src={message.author.info.photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc5zNZV5Uc6ZwS4JAxBVS0DiqUtIAR_Q5u6-G42vMfNk3mFFLj"} />
                  </div>
                  <div className="user-view__info">
                    <span className="user-view__name">{message.author.info.name}</span>
                    <span className="user-view__email">{message.author.email}</span>
                  </div>
                </div>
                <p className="message">{message.text}</p>
              </li>
            ))
          }
        </ul>
        <form className="message-form" onSubmit={this.sendMessage}>
          <input ref={this.textInput} type="text" required="required" onChange={this.handleMessageChange} placeholder="Enter message..." />
          <button type="submit">send</button>
        </form>
      </div>
    )
  }
}

export default Message;
