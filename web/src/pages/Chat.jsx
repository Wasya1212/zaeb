import React, { Component } from 'react';
import Modal from 'react-modal';

import axios from 'axios';

import { Auth } from '../components/Auth.jsx';
import { ChatList, CreateChatComponent as CreateChat } from '../components/Chat.jsx';

Modal.setAppElement('#root');

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createChatModalIsOpen: false,
      chats: []
    }
  }

  componentDidMount() {
    axios
      .post('/api/chat/chat-rooms', { token: localStorage.getItem('token') })
      .then(({ data: chats }) => {
        this.setState({ chats });
      })
      .catch(err => {
        console.error(err);
      })
  }

  showCreateChatForm = () => {
    this.setState({
      createChatModalIsOpen: true
    });
  }

  closeCreateChatForm = () => {
    this.setState({
      createChatModalIsOpen: false
    });
  }

  afterChatCreate = chat => {
    this.setState({
      chats: this.state.chats.concat(chat)
    });
    this.closeCreateChatForm();
  }

  render() {
    return (
      <div>
        <Auth failureRedirect="/sign-in" />
        <Modal
          isOpen={this.state.createChatModalIsOpen}
          onRequestClose={this.closeCreateChatForm}
          contentLabel="Create chat"
        >
          <CreateChat afterCreate={this.afterChatCreate} />
          <button onClick={this.closeCreateChatForm}>Close modal</button>
        </Modal>
        <button className="create-chat-btn" onClick={this.showCreateChatForm}>Create chat</button>
        <ChatList chats={this.state.chats} />
      </div>
    );
  }
}

export default Chat;
