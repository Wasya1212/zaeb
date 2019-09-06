import React, { Component } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

import axios from 'axios';

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
                <Link to={"/chat/conversation/" + this.state.user._id.toString()} onClick={this.closeUserModal}>Go to messaging</Link>
              </div>
            ) : null}
          <button className="close-modal-btn" onClick={this.closeUserModal}>Close modal</button>
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
      <img src={props.user.info.photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc5zNZV5Uc6ZwS4JAxBVS0DiqUtIAR_Q5u6-G42vMfNk3mFFLj"} />
    </div>
    <div className="user-profile__info">
      <div className="user-profile__name">{props.user.info.name}</div>
      <div className="user-profile__email">{props.user.email}</div>
    </div>
  </div>
);

const UserView = ({user}) => (
  <div className="user-info">
    <div className="user-info__picture">
      <img src={user.info.photo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc5zNZV5Uc6ZwS4JAxBVS0DiqUtIAR_Q5u6-G42vMfNk3mFFLj"} />
    </div>
    <ul>
      <li>{user.info.name}</li>
      <li>{user.email}</li>
      <li>{user.info.post}</li>
      <li>{user.info.salary}</li>
      <li>{(user.info.status.work_times.start || '') + ' - ' + (user.info.status.work_times.end || '')}</li>
      <li>
        <div className={user.info.status.work_days.indexOf(1) != -1 ? "day" : "day active-day"}>Mn</div>
        <div className={user.info.status.work_days.indexOf(2) != -1 ? "day" : "day active-day"}>Ts</div>
        <div className={user.info.status.work_days.indexOf(3) != -1 ? "day" : "day active-day"}>Wd</div>
        <div className={user.info.status.work_days.indexOf(4) != -1 ? "day" : "day active-day"}>Th</div>
        <div className={user.info.status.work_days.indexOf(5) != -1 ? "day" : "day active-day"}>Fd</div>
        <div className={user.info.status.work_days.indexOf(6) != -1 ? "day" : "day active-day"}>St</div>
        <div className={user.info.status.work_days.indexOf(7) != -1 ? "day" : "day active-day"}>Sn</div>
      </li>
    </ul>
  </div>
);

class UserSettingsButton extends Component {
  constructor(props) {
    super(props);

    try {
      this.state = {
        userModalIsOpen: false,
        selectedFile: null,
        workDays: [],
        salary: this.props.user.info || 0,
        post: this.props.user.info.post || '',
        startWorkTime: this.props.user.info.status.work_times[0].start || '',
        endWorkTime: this.props.user.info.status.work_times[0].end || '',
        phone: this.props.user.info.phone || '',
        avatarImage: this.props.user.info.photo || ''
      };
    } catch (e) {
      this.state = {
        userModalIsOpen: false,
        selectedFile: null,
        workDays: [],
        salary: 0,
        post: '',
        startWorkTime: '',
        endWorkTime: '',
        phone: '',
        avatarImage: ''
      };
    }
  }

  showUserModal = user => {
    this.setState({
      userModalIsOpen: true
    });
  }

  closeUserModal = () => {
    this.setState({
      userModalIsOpen: false
    });
  }

  onFileChange = e => {
    this.setState({
      selectedFile: e.target.files[0]
    })
  }

  onWorkDaysChange = e => {
    if (e.target.checked) {
      this.setState({
        workDays: this.state.workDays.concat(e.target.value)
      });
    } else {
      this.setState({
        workDays: this.state.workDays.filter(workDay => workDay != e.target.value)
      });
    }
  }

  onSalaryChange = e => {
    this.setState({
      salary: e.target.value
    });
  }

  onPostChange = e => {
    this.setState({
      post: e.target.value
    });
  }

  onPhoneChange = e => {
    this.setState({
      phone: e.target.value
    });
  }

  onStartWorkTimeChange = e => {
    this.setState({
      startWorkTime: e.target.value
    });
  }

  onEndWorkTimeChange = e => {
    this.setState({
      endWorkTime: e.target.value
    });
  }

  validateForm() {
    let valid = true;

    if (/^((\+|38|0)+([0-9]){9})$/m.test(this.state.phone) == false && this.state.phone != '') {
      valid = false
    }

    return valid;
  }

  onSubmit = e => {
    e.preventDefault();

    if (!this.validateForm()) {
      alert("Wrong data!");
      return false;
    }

    const data = new FormData();
    data.append('token', localStorage.getItem('token'));
    data.append('file', this.state.selectedFile);
    data.append('workDays', JSON.stringify(this.state.workDays));
    data.append('salary', this.state.salary);
    data.append('post', this.state.post);
    data.append('startWorkTime', this.state.startWorkTime);
    data.append('endWorkTime', this.state.endWorkTime);
    data.append('phone', this.state.phone);
    data.append('avatarImage', this.state.avatarImage);

    axios.post("/api/user/edit", data, { headers: { 'content-type': 'multipart/form-data' }})
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    return (
      <div>
        <button onClick={this.showUserModal}>Settings</button>
        <Modal
          isOpen={this.state.userModalIsOpen}
          onRequestClose={this.closeUserModal}
          contentLabel="Find users"
        >
          <form onSubmit={this.onSubmit}>
            <p><label>Photo</label><input onChange={this.onFileChange} name="photo" type="file" placeholder="choose photo" /></p>
            <p><label>salary</label><input onChange={this.onSalaryChange} placeholder={`${this.props.user.info.salary} UAH`} name="salary" type="number" /></p>
            <p><label>Post</label><input onChange={this.onPostChange} placeholder={`${this.props.user.info.post || "enter your post"}`} name="post" type="text" /></p>
            <p><label>Phone</label><input onChange={this.onPhoneChange} placeholder={`${this.props.user.info.phone || "+380123456789"}`} name="phone" type="tel" /></p>
            <p>
              <label>Work Days</label>
              <div><label>Monday</label>{this.props.user.info.workDays && this.props.user.info.workDays.indexOf(1) != -1 ? <input checked onChange={this.onWorkDaysChange} value="1" type="checkbox" name="workDay" id="" /> : <input onChange={this.onWorkDaysChange} value="1" type="checkbox" name="workDay" id="" />}</div>
              <div><label>Tuesday</label>{this.props.user.info.workDays && this.props.user.info.workDays.indexOf(2) != -1 ? <input checked onChange={this.onWorkDaysChange} value="2" type="checkbox" name="workDay" id="" /> : <input onChange={this.onWorkDaysChange} value="2" type="checkbox" name="workDay" id="" />}</div>
              <div><label>Wednesday</label>{this.props.user.info.workDays && this.props.user.info.workDays.indexOf(3) != -1 ? <input checked onChange={this.onWorkDaysChange} value="3" type="checkbox" name="workDay" id="" /> : <input onChange={this.onWorkDaysChange} value="3" type="checkbox" name="workDay" id="" />}</div>
              <div><label>Thursday</label>{this.props.user.info.workDays && this.props.user.info.workDays.indexOf(4) != -1 ? <input checked onChange={this.onWorkDaysChange} value="4"  type="checkbox" name="workDay" id="" /> : <input onChange={this.onWorkDaysChange} value="4"  type="checkbox" name="workDay" id="" />}</div>
              <div><label>Friday</label>{this.props.user.info.workDays && this.props.user.info.workDays.indexOf(5) != -1 ? <input checked onChange={this.onWorkDaysChange} value="5" type="checkbox" name="workDay" id="" /> : <input onChange={this.onWorkDaysChange} value="5" type="checkbox" name="workDay" id="" />}</div>
              <div><label>Saturday</label>{this.props.user.info.workDays && this.props.user.info.workDays.indexOf(6) != -1 ? <input checked onChange={this.onWorkDaysChange} value="6" type="checkbox" name="workDay" id="" /> : <input onChange={this.onWorkDaysChange} value="6" type="checkbox" name="workDay" id="" />}</div>
              <div><label>Sunday</label>{this.props.user.info.workDays && this.props.user.info.workDays.indexOf(7) != -1 ? <input checked onChange={this.onWorkDaysChange} value="7" type="checkbox" name="workDay" id="" /> : <input onChange={this.onWorkDaysChange} value="7" type="checkbox" name="workDay" id="" />}</div>
            </p>
            <p>
              <label>Work times</label>
              <input onChange={this.onStartWorkTimeChange} name="workStart" type="time" />
              <input onChange={this.onEndWorkTimeChange} name="workEnd" type="time" />
            </p>
            <input type="submit" value="Confirm" />
          </form>

          <button className="close-modal-btn" onClick={this.closeUserModal}>Close modal</button>
        </Modal>
      </div>
    );
  }
}

export { UserView, SearchUsersButton, UsersList, UserProfile, UserSettingsButton };
