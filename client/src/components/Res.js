import React from 'react';
import {Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';

const Res = props => {
    return (
        <Alert bsStyle={props.responseStyle}>
            <button type="button" className="close" aria-label="Close" onClick={props.hideAlert}><span aria-hidden="true">&times;</span></button>
            {props.response}
        </Alert>
    );
};

Res.propTypes = {
    responseStyle: PropTypes.string,
    response: PropTypes.string.isRequired,
    hideAlert: PropTypes.func.isRequired
};

export default Res;