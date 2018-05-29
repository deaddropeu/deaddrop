import React from 'react';
import {Grid} from 'react-bootstrap';

import Res from "./Res";

const Drop = props => {
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
            <div className="drop">
                {alert}
                <p className="message-text">{props.text}</p>
            </div>
        </Grid>
    );
};

export default Drop;