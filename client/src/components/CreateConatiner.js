import React, {Component} from 'react';
import utils from '../utils';
import {randomBytes} from 'crypto-browserify';

import Create from "./Create";
import CreateDone from "./CreateDone";
import Loading from "./Loading";

const maxMessageLength = 4000;

const initialState = {
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
    canSend: true,
    showPublic: false
};

class CreateContainer extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    updateInputValue(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    hideAlert() {
        this.setState({ response: '' });
    }

    updateCheckboxValue(e) {
        this.setState({ showPublic: e.target.checked });
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

        randomBytes(16, (err, buf) => {
            if (err) throw err;

            let salt = buf.toString('hex');
            let ciphertext = utils.encryptText(this.state.message, this.state.password, salt);

            utils.postData('/api/setmessage', {
                text: ciphertext,
                question: this.state.question,
                showPublic: this.state.showPublic,
                salt: salt
            }).then(data => {
                this.setState({
                    loading: false,
                    created: true,
                    response: data.response,
                    responseStyle: 'success',
                    new_id: data.id
                });
            }).catch(error => console.error(error));
        });
    }

    newMessage(e) {
        e.preventDefault();

        this.setState(initialState);
    }

    render() {
        if (this.state.loading) {
            return <Loading>Encoding</Loading>;
        }

        let showAlert;
        showAlert = this.state.response !== '';

        if(!this.state.created) {
            return <Create
                showAlert={showAlert}
                responseStyle={this.state.responseStyle}
                response={this.state.response}
                message={this.state.message}
                charsLeft={this.state.charsLeft}
                question={this.state.question}
                showPublic={this.state.showPublic}
                canSend={this.state.canSend}
                hideAlert={this.hideAlert.bind(this)}
                updateMessageValue={this.updateMessageValue.bind(this)}
                updateInputValue={this.updateInputValue.bind(this)}
                updateCheckboxValue={this.updateCheckboxValue.bind(this)}
                changeCallback={this.changeCallback.bind(this)}
                sendMessage={this.sendMessage.bind(this)}
            />;
        } else {
            let link = document.location.protocol +'//'+ document.location.host +'/d/'+this.state.new_id;

            return <CreateDone
                showAlert={showAlert}
                responseStyle={this.state.responseStyle}
                response={this.state.response}
                newId={this.state.new_id}
                link={link}
                question={this.state.question}
                hideAlert={this.hideAlert.bind(this)}
                newMessage={this.newMessage.bind(this)}
            />;
        }
    }
}

export default CreateContainer;
