import React from 'react';

const DropList = props => {
    return (
        <ul className="droplist">
            {props.drops.map(({publicId, text, question}, i) =>
                <li key={i}><a href={document.location.protocol +'//'+ document.location.host +'/d/'+ publicId} className="public-id">{publicId}</a><span className="hint">{question === '' ? '' : 'Hint:'} {question}</span><p className="text">{text}</p></li>
            )}
        </ul>
    );
};

export default DropList;