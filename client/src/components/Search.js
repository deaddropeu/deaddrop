import React from 'react';
import {FormControl, Glyphicon, Button} from 'react-bootstrap';

const Search = props => {
    return (
        <form onSubmit={e => props.searchDrop(e)}>
            <FormControl
                id="search"
                onChange={e => props.updateInputValue(e)}
                type="text"
                placeholder="Search drops by ID"
                autoComplete="off"
            />
            <Button onClick={e => props.searchDrop(e)} className="search-button"><Glyphicon glyph="search" /></Button>
        </form>
    );
};

export default Search;
