import React, {Component} from 'react';
import misc from '../misc';
import {FormControl, Grid, Button, Alert} from 'react-bootstrap';
import CryptoJS from "crypto-js";

class Drop extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            decoded: false,
            show_form: true,
            id: props.match.params.id,
            password: '',
            encrypted_text: '',
            text: '',
            question: '',
            response: '',
            responseStyle: 'success'
        };
    }

    componentDidMount() {
        this.setState({ loading: 'true' });
        misc.postData('/api/getmessage', {
            id: this.state.id
        }).then(data => {

            if(data.success === true) {
                this.setState({
                    loading: false,
                    encrypted_text: data.text,
                    question: data.question,
                    response: ''
                });
            } else {
                this.setState({
                    loading: false,
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

    decodeMessage(e) {
        e.preventDefault();

        let response, responseStyle;
        let bytes  = CryptoJS.AES.decrypt(this.state.encrypted_text, this.state.password);
        let message_text = bytes.toString(CryptoJS.enc.Utf8);

        if(message_text === '') {
            response = 'Bad password';
            responseStyle = 'danger';
        } else {
            response = 'Message was decoded!';
            responseStyle = 'success';
        }

        this.setState({
            decoded: true,
            response: response,
            responseStyle: responseStyle,
            text: message_text
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
        if(this.state.decoded) {
            output = (
                <div>
                    {alert}
                    <p className="message-text">{this.state.text}</p>
                </div>
            );
        } else {
            if(this.state.show_form) {
                output = (
                    <div>
                        <form>
                            {alert}
                            <FormControl
                                id="password"
                                onChange={e => this.updateInputValue(e)}
                                type="password"
                                placeholder="Password"
                            />
                            <p>Password hint: {this.state.question}</p>
                            <Button type="submit" onClick={e => this.decodeMessage(e)}>Decode message</Button>
                        </form>
                    </div>
                );
            } else {
                output = alert;
            }
        }

        return (
            <Grid>
                <div className="drop">
                    {output}
                </div>
            </Grid>
        );
    }
}

export default Drop;
