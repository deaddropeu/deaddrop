import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Redirect, Switch} from "react-router-dom";
import {Navbar} from 'react-bootstrap';
import githublogo from './github-logo.png';

import Home from "./home";
import Create from "./create";
import Drop from "./drop";
import Search from './search';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            searchRedirect: false
        };
    }

    searchDrop(e) {
        e.preventDefault();

        if (this.state.search !== '') {
            this.setState({
                searchRedirect: true
            });
        }
    }

    updateInputValue(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    componentDidUpdate() {
        if(this.state.searchRedirect === true) {
            this.setState({
                searchRedirect: false
            });
        }
    }

    render() {
        if (this.state.searchRedirect) {
            let route = '/d/' + this.state.search;

            return (
                <Router>
                    <Redirect to={route} push={true} />
                </Router>
            );
        }

        return (
            <div className="app">
                <Router>
                    <div>
                        <Navbar collapseOnSelect fixedTop>
                            <Navbar.Header>
                                <Navbar.Brand>
                                    <Link className="navbar-brand" to="/">DeadDrop</Link>
                                </Navbar.Brand>
                                <Link to="/create" className="add-drop-link" title="Create new drop">+</Link>
                                <Search searchDrop={this.searchDrop.bind(this)} updateInputValue={this.updateInputValue.bind(this)} />
                            </Navbar.Header>
                        </Navbar>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route path='/create' component={Create} />
                            <Route path='/d/:id' component={Drop} />
                            <Redirect to="/" />
                        </Switch>
                        <footer>
                           <a href="https://github.com/hynekhavel/deaddrop/"><img src={githublogo} alt="GitHub logo" title="Go to GitHub repo" /></a>
                        </footer>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
