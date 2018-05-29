import React from 'react';

const Loading = props => {
    return (
        <p className="loading">{props.children}</p>
    );
};

export default Loading;