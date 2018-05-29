import React from 'react';
import {Button, Grid} from 'react-bootstrap';

import Res from "./Res";

const CreateDone = props => {
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
                {alert}
                <h2>ID of your drop: {props.newId}</h2>
                <p>Link: <a href={props.link}>{props.link}</a></p>
                <p>{props.question !== '' ? 'Hint for password: '+ props.question : ''}</p>
                <em>Pass these informations to the recipient by a safe route.</em>
                <br /><Button onClick={e => props.newMessage(e)}>New message</Button>
            </div>
        </Grid>
    );
};

export default CreateDone;