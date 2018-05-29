import React from 'react';
import {FormControl, Button, Grid} from 'react-bootstrap';

import Res from "./Res";

const DropLocked = props => {
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
                <form>
                    {alert}
                    <FormControl
                        id="password"
                        onChange={e => props.updateInputValue(e)}
                        type="password"
                        placeholder="Password"
                    />
                    {props.hint}
                    <Button type="submit" onClick={e => props.decodeMessage(e)}>Decode message</Button>
                </form>
            </div>
        </Grid>
    );
};

export default DropLocked;