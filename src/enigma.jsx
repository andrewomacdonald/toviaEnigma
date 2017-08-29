import React, { Component } from 'react';
import { Card, CardTitle } from 'react-toolbox/lib/card';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-toolbox/lib/date_picker';
import Button from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';

class Enigma extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passcode: '',
      message: '',
      name: '',
      date: '',
      minDate: new Date(),
      multiline: '',
      popupActive: false,
    };

    this.getPasscodeAPICall();

    this.handleToggle = () => {
      this.setState({ popupActive: !this.state.popupActive });
    };

    this.handleChange = (name, value) => {
      this.setState({ [name]: value });
    };

    this.actions = [{
      label: 'Close',
      onClick: this.handleToggle,
    }];
  }

  componentDidMount() {
    const self = this;
    window.addEventListener('hashchange', (event) => {
      self.state.passcode = event.newURL.split('#')[1];
    });
  }

  componentDidUpdate() {
    window.location.hash = this.state.passcode;
  }

  getPasscodeAPICall() {
    fetch('/api/generatePasscode').then(response => response.json())
      .then(cypher => this.setState(cypher));
  }

  decryptionAPICall() {
    this.handleToggle();
    fetch('/api/decipherMessageAndCode', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: this.state.message,
        passcode: this.state.passcode,
      }),
    }).then(response => response.json())
      .then(message => this.setState(message));
  }

  encryptionAPICAll() {
    this.handleToggle();

    const date = this.state.date === '' ? Infinity : Math.floor(Date.parse(this.state.date) / 1000);

    fetch('/api/sendMessageAndCode', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        passcode: this.state.passcode,
        message: this.state.message,
        time: date,
        sender: this.state.name,
      }),
    }).then(response => response.json())
      .then(message => this.setState(message));
  }

  render() {
    return (
      <section id="app">
        <Card className="myForm">
          <CardTitle
            title="Tovia's Enigma Engine"
          />
          <Input
            name="name"
            label="Name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange.bind(this, 'name')}
          />
          <Input
            name="message"
            label="Message"
            type="text"
            maxLength={120}
            value={this.state.message}
            onChange={this.handleChange.bind(this, 'message')}
            multiline
          />
          <Input
            name="passcode"
            label="Passcode"
            type="text"
            value={this.state.passcode}
            onChange={this.handleChange.bind(this, 'passcode')}
          />
          <DatePicker
            label="Expiration Date"
            onChange={this.handleChange.bind(this, 'date')}
            value={this.state.date}
            minDate={this.state.minDate}
            sundayFirstDayOfWeek
          />
          <div>
            <Button label="Encrypt" onClick={this.encryptionAPICAll.bind(this)} />
            <Button label="Decrypt" onClick={this.decryptionAPICall.bind(this)} />
          </div>
          <Dialog
            actions={this.actions}
            active={this.state.popupActive}
            onEscKeyDown={this.handleToggle}
            onOverlayClick={this.handleToggle}
            title="Encrypt/Decrypt"
          >
            <p>{this.state.message}</p>
          </Dialog>
        </Card>
        <div className="passcodeDiv">
                    Your Passcode - <span>{this.state.passcode}</span>
        </div>
        <a onClick={this.getPasscodeAPICall.bind(this)}>Get New Passcode</a>
      </section>
    );
  }
}

export default Enigma;
