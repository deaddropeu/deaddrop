import React, {Component} from 'react';
import {Grid, Alert} from 'react-bootstrap';
import utils from '../utils';

import Drop from './Drop';
import DropLocked from './DropLocked';
import Loading from './Loading';

class DropContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingData: false,
            loadingDecoding: false,
            decoded: false,
            show_form: true,
            id: props.match.params.id,
            password: '',
            encrypted_text: '',
            salt: '',
            text: '',
            question: '',
            response: '',
            responseStyle: 'success'
        };
    }

    componentDidMount() {
        this.setState({ loadingData: true });

        utils.postData('/api/getmessage', {
            id: this.state.id
        }).then(data => {

            if(data.success === true) {
                this.setState({
                    loadingData: false,
                    encrypted_text: data.text,
                    question: data.question,
                    salt: data.salt,
                    response: ''
                });
            } else {
                this.setState({
                    loadingData: false,
                    show_form: false,
                    response: 'We can\'t find this drop.',
                    responseStyle: 'danger'
                });
            }
        }).catch(error => console.error(error));
    }

    updateInputValue(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    hideAlert() {
        this.setState({ response: '' });
    }

    decodeMessage(e) {
        e.preventDefault();

        this.setState({ loadingDecoding: true });
        let response, responseStyle;

        let message_text = utils.decryptText(this.state.encrypted_text, this.state.password, this.state.salt);

        response = 'Message was decoded! If you see an unreadable message, maybe you used the wrong password.';
        responseStyle = 'success';

        this.setState({
            loadingDecoding: false,
            decoded: true,
            response: response,
            responseStyle: responseStyle,
            text: message_text
        });
    }

    render() {
        if (this.state.loadingData) {
            return <Loading>Loading</Loading>;
        }

        if (this.state.loadingDecoding) {
            return <Loading>Decoding</Loading>;
        }

        let showAlert;
        showAlert = this.state.response !== '';

        if(this.state.decoded) {
            return <Drop
                showAlert={showAlert}
                responseStyle={this.state.responseStyle}
                response={this.state.response}
                text={this.state.text}
                hideAlert={this.hideAlert.bind(this)}
            />
        } else {
            if(this.state.show_form) {
                let hint = '';
                if(this.state.question !== '') {
                    hint = <p>Password hint: {this.state.question}</p>;
                }

                return <DropLocked
                    showAlert={showAlert}
                    responseStyle={this.state.responseStyle}
                    response={this.state.response}
                    hint={hint}
                    updateInputValue={this.updateInputValue.bind(this)}
                    decodeMessage={this.decodeMessage.bind(this)}
                    hideAlert={this.hideAlert.bind(this)}
                />
            } else {
                return (
                    <Grid>
                        <div style={{marginTop: '20px'}}>
                            <Alert bsStyle={this.state.responseStyle}>
                                {this.state.response}
                            </Alert>
                        </div>
                    </Grid>
                );
            }
        }
    }
}

export default DropContainer;
