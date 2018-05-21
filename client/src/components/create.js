import React, {Component} from 'react';
import misc from '../misc';
import CryptoJS from 'crypto-js';
import {FormControl, Grid, Button, Alert} from 'react-bootstrap';
import ReactPasswordStrength from 'react-password-strength';

const maxMessageLength = 4000;
class Create extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            created: false,
            new_id: '',
            message: '',
            charsLeft: maxMessageLength,
            question: '',
            password: '',
            passwordValid: false,
            password2: '',
            response: '',
            responseStyle: 'success',
            canSend: true
        };
    }

    updateInputValue(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    updateMessageValue(e) {
        let chars = maxMessageLength - e.target.value.length;
        let setStatateObj = {
            message: e.target.value,
            charsLeft: chars
        };

        setStatateObj['canSend'] = chars >= 0;

        this.setState(setStatateObj);
    }

    changeCallback(state) {
        this.setState({
            password: state.password,
            passwordValid: state.isValid,
            passLength: state.password.length
        })
    }

    sendMessage(e) {
        e.preventDefault();

        if(!this.state.canSend) {
            return this.setState({ response: 'Message is too long.', responseStyle: 'danger' });
        }

        if(this.state.password === '' || this.state.password2 === '') {
            return this.setState({ response: 'Please fill up passwords.', responseStyle: 'danger' });
        }

        if(this.state.passwordValid === false) {
            return this.setState({ response: 'Your password is too weak.', responseStyle: 'danger' });
        }

        if(this.state.password !== this.state.password2) {
            return this.setState({ response: 'Passwords doesn\'t match.', responseStyle: 'danger' });
        }

        if(this.state.message === '') {
            return this.setState({ response: 'Please fill up your message.', responseStyle: 'danger' });
        }

        this.setState({ loading: true });
        let ciphertext = CryptoJS.AES.encrypt(this.state.message, this.state.password);
        misc.postData('/api/setmessage', {
            text: ciphertext.toString(),
            question: this.state.question
        }).then(data => {
            this.setState({
                loading: false,
                created: true,
                response: data.response,
                responseStyle: 'success',
                new_id: data.id
            });
        }).catch(error => console.error(error));
    }

    newMessage(e) {
        e.preventDefault();

        this.state = {
            loading: false,
            created: false,
            new_id: '',
            message: '',
            charsLeft: 0,
            question: '',
            password: '',
            passwordValid: false,
            password2: '',
            response: '',
            responseStyle: 'success',
            canSend: true
        };
    }

    render() {
        if (this.state.loading) {
            return <p className="loading">Loading...</p>;
        }

        let alert;
        if(this.state.response === '') {
            alert = '';
        } else {
            alert = (
                <Alert bsStyle={this.state.responseStyle}>
                    {this.state.response}
                </Alert>
            );
        }

        let output;
        if(!this.state.created) {
            output = (
                <div>
                    <form>
                        {alert}
                        <FormControl
                            id="message"
                            onInput={e => this.updateMessageValue(e)}
                            componentClass="textarea"
                            placeholder="Message to encrypt"
                            value={this.state.message}
                        />
                        <span className={this.state.charsLeft < 0 ? 'character-counter danger' : 'character-counter'}>{this.state.charsLeft}</span>
                        <FormControl
                            id="question"
                            onChange={e => this.updateInputValue(e)}
                            type="text"
                            placeholder="Password hint (optional)"
                            value={this.state.question}
                        />
                        <ReactPasswordStrength
                            className="password-strength"
                            minLength={5}
                            minScore={1}
                            scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                            changeCallback={this.changeCallback.bind(this)}
                            inputProps={{ name: "password", autoComplete: "off", id: "password", placeholder: "Message password" }}
                        />
                        <FormControl
                            id="password2"
                            onChange={e => this.updateInputValue(e)}
                            type="password"
                            placeholder="Confirm password"
                        />
                        <Button type="submit" onClick={e => this.sendMessage(e)} disabled={!this.state.canSend}>Encrypt and save</Button>
                    </form>
                </div>
            );
        } else {
            let link = 'https://'+ window.location.hostname +'/d/'+this.state.new_id;
            output = (
                <div>
                    {alert}
                    <h2>ID of your drop: {this.state.new_id}</h2>
                    <p>Link: <a href={link}>{link}</a></p>
                    <p>{this.state.question !== '' ? 'Hint for password: '+ this.state.question : ''}</p>
                    <em>Pass these informations to the recipient by a safe route.</em>
                    <Button onClick={e => this.newMessage(e)}>New message</Button>
                </div>
            );
        }

        return (
            <Grid>
                <div className="create">
                    {output}
                </div>
            </Grid>
        );
    }
}

export default Create;
