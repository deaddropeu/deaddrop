import React, {Component} from 'react';
import {FormControl, Glyphicon, Button} from 'react-bootstrap';

class Search extends Component {
    render() {
        return (
            <form onSubmit={e => this.props.searchDrop(e)}>
                <FormControl
                    id="search"
                    onChange={e => this.props.updateInputValue(e)}
                    type="text"
                    placeholder="Search drops by ID"
                    autoComplete="off"
                />
                <Button onClick={e => this.props.searchDrop(e)} className="search-button"><Glyphicon glyph="search" /></Button>
            </form>
        );
    }
}

export default Search;
