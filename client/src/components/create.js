import React, {Component} from 'react';
import misc from '../misc';
import CryptoJS from 'crypto-js';
import {FormControl, Grid, Button, Alert} from 'react-bootstrap';
import ReactPasswordStrength from 'react-password-strength';

class Create extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            created: false,
            new_id: '',
            message: '',
            question: '',
            password: '',
            passwordValid: false,
            password2: '',
            response: '',
            responseStyle: 'success'
        };
    }

    updateInputValue(e) {
        this.setState({ [e.target.id]: e.target.value });
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

        this.setState({
            loading: false,
            created: false,
            new_id: '',
            message: '',
            question: '',
            password: '',
            passwordValid: false,
            password2: '',
            response: '',
            responseStyle: 'success'
        });
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
                            onChange={e => this.updateInputValue(e)}
                            componentClass="textarea"
                            placeholder="Message to encrypt"
                            value={this.state.message}
                        />
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
                        <Button type="submit" onClick={e => this.sendMessage(e)}>Encrypt and save</Button>
                    </form>
                </div>
            );
        } else {
            output = (
                <div>
                    {alert}
                    <h2>ID of your message: {this.state.new_id}</h2>
                    <p>{this.state.question !== '' ? 'Hint for password: '+ this.state.question : ''}</p>
                    <p>Pass this informations to recipient by safe route.</p>
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
