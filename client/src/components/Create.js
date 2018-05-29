import React from 'react';
import {FormControl, Button, Checkbox, Grid} from 'react-bootstrap';
import ReactPasswordStrength from 'react-password-strength';

import Res from "./Res";

const Create = props => {
    let alert;
    if(props.showAlert) {
        alert = <Res
            responseStyle={props.responseStyle}
            response={props.response}
            hideAlert={props.hideAlert}
        />;
    } else {
        alert = '';
    }

    return (
        <Grid>
            <div className="create">
                <form>
                    {alert}
                    <FormControl
                        id="message"
                        onInput={e => props.updateMessageValue(e)}
                        componentClass="textarea"
                        placeholder="Message to encrypt"
                        value={props.message}
                    />
                    <span className={props.charsLeft < 0 ? 'character-counter danger' : 'character-counter'}>{props.charsLeft}</span>
                    <FormControl
                        id="question"
                        maxLength="100"
                        onChange={e => props.updateInputValue(e)}
                        type="text"
                        placeholder="Password hint (optional)"
                        value={props.question}
                    />
                    <ReactPasswordStrength
                        className="password-strength"
                        minLength={5}
                        minScore={1}
                        scoreWords={['weak', 'okay', 'good', 'strong', 'stronger']}
                        changeCallback={props.changeCallback}
                        inputProps={{ name: "password", autoComplete: "off", id: "password", placeholder: "Message password" }}
                    />
                    <FormControl
                        id="password2"
                        onChange={e => props.updateInputValue(e)}
                        type="password"
                        placeholder="Confirm password"
                    />
                    <Checkbox
                        id="showPublic"
                        defaultChecked={props.showPublic}
                        onChange={e => props.updateCheckboxValue(e)}>
                        Show on homepage
                    </Checkbox>
                    <Button type="submit" onClick={e => props.sendMessage(e)} disabled={!props.canSend}>Encrypt and save</Button>
                </form>
            </div>
        </Grid>
    );
};

export default Create;