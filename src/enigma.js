import React, { Component } from 'react';
import { Card, CardTitle } from 'react-toolbox/lib/card';
import Input from 'react-toolbox/lib/input';
import DatePicker from 'react-toolbox/lib/date_picker';
import Button from 'react-toolbox/lib/button';
import Dialog from 'react-toolbox/lib/dialog';
import Avatar from 'react-toolbox/lib/avatar';

const GithubIcon = () => (
    <svg viewBox="0 0 284 277">
        <g><path d="M141.888675,0.0234927555 C63.5359948,0.0234927555 0,63.5477395 0,141.912168 C0,204.6023 40.6554239,257.788232 97.0321356,276.549924 C104.12328,277.86336 106.726656,273.471926 106.726656,269.724287 C106.726656,266.340838 106.595077,255.16371 106.533987,243.307542 C67.0604204,251.890693 58.7310279,226.56652 58.7310279,226.56652 C52.2766299,210.166193 42.9768456,205.805304 42.9768456,205.805304 C30.1032937,196.998939 43.9472374,197.17986 43.9472374,197.17986 C58.1953153,198.180797 65.6976425,211.801527 65.6976425,211.801527 C78.35268,233.493192 98.8906827,227.222064 106.987463,223.596605 C108.260955,214.426049 111.938106,208.166669 115.995895,204.623447 C84.4804813,201.035582 51.3508808,188.869264 51.3508808,134.501475 C51.3508808,119.01045 56.8936274,106.353063 65.9701981,96.4165325 C64.4969882,92.842765 59.6403297,78.411417 67.3447241,58.8673023 C67.3447241,58.8673023 79.2596322,55.0538738 106.374213,73.4114319 C117.692318,70.2676443 129.83044,68.6910512 141.888675,68.63701 C153.94691,68.6910512 166.09443,70.2676443 177.433682,73.4114319 C204.515368,55.0538738 216.413829,58.8673023 216.413829,58.8673023 C224.13702,78.411417 219.278012,92.842765 217.804802,96.4165325 C226.902519,106.353063 232.407672,119.01045 232.407672,134.501475 C232.407672,188.998493 199.214632,200.997988 167.619331,204.510665 C172.708602,208.913848 177.243363,217.54869 177.243363,230.786433 C177.243363,249.771339 177.078889,265.050898 177.078889,269.724287 C177.078889,273.500121 179.632923,277.92445 186.825101,276.531127 C243.171268,257.748288 283.775,204.581154 283.775,141.912168 C283.775,63.5477395 220.248404,0.0234927555 141.888675,0.0234927555" /></g>
    </svg>
);

class Enigma extends Component {
    constructor(props){
        super(props);
        this.state = {
            passcode: '',
            message: '',
            name: '',
            date: '',
            minDate: new Date(),
            multiline: '',
            popupActive: false
        };

        this.getPasscodeAPICall();

        this.handleToggle = () => {
            this.setState({popupActive: !this.state.popupActive});
        };

        this.handleChange = (name, value) => {
            this.setState({[name]: value})
        };

        this.actions = [{
            label: "Close",
            onClick: this.handleToggle
        }];
    }

    encryptionAPICAll(){
        this.handleToggle();
        let date = this.state.date === '' ? Infinity :
            Math.floor( Date.parse(this.state.date) / 1000);

        fetch('/api/sendMessageAndCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                passcode: this.state.passcode,
                message: this.state.message,
                time: date,
                sender: this.state.name
            })
        }).then(response => response.json())
          .then(message => this.setState(message));
    }

    decryptionAPICall(e){
        this.handleToggle();
        fetch('/api/decipherMessageAndCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: this.state.message,
                passcode: this.state.passcode
            })
        }).then(response => response.json())
          .then(message => this.setState(message));
    }

    componentDidMount(){
        const self = this;
        window.addEventListener('hashchange', (event) => {
            self.state.passcode = event.newURL.split('#')[1];
        });
    }

    componentDidUpdate(){
        window.location.hash = this.state.passcode;
    }

    getPasscodeAPICall(){
        fetch('/api/generatePasscode').then(response => response.json())
            .then(cypher => this.setState(cypher));
    }

    render() {
        return (
            <section id="app">
                <Card className="myForm">
                    <CardTitle
                        title="Tovia's Enigma Engine"/>
                        <Input name="name"
                               label="Name"
                               type="text"
                               value={this.state.name}
                               onChange={this.handleChange.bind(this, 'name')} />
                        <Input name="message"
                               label="Message"
                               type="text"
                               maxLength={120}
                               value={this.state.message}
                               onChange={this.handleChange.bind(this, 'message')}
                               multiline />
                        <Input name="passcode"
                               label="Passcode"
                               type="text"
                               value={this.state.passcode}
                               onChange={this.handleChange.bind(this, 'passcode')} />
                        <DatePicker label='Expiration Date'
                               onChange={this.handleChange.bind(this, 'date')}
                               value={this.state.date}
                               minDate={this.state.minDate}
                               sundayFirstDayOfWeek />
                    <div>
                        <Button label="Encrypt" onClick={this.encryptionAPICAll.bind(this)}></Button>
                        <Button label="Decrypt" onClick={this.decryptionAPICall.bind(this)}></Button>
                    </div>
                    <Dialog actions={this.actions}
                            active={this.state.popupActive}
                            onEscKeyDown={this.handleToggle}
                            onOverlayClick={this.handleToggle}
                            title='Encrypt/Decrypt'>
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