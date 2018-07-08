import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Redirect, Switch} from "react-router-dom";
import {Navbar} from 'react-bootstrap';
import githublogo from '../imgs/github-logo.svg';

import Home from "./Home";
import CreateContainer from "./CreateConatiner";
import DropContainer from "./DropContainer";
import Search from './Search';

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
                                <Link to="/create" className="add-drop-link" data-toggle="tooltip" data-placement="bottom" title="Create new drop"><span className="glyphicon glyphicon-plus"></span></Link>
                                <Search searchDrop={this.searchDrop.bind(this)} updateInputValue={this.updateInputValue.bind(this)} />
                            </Navbar.Header>
                        </Navbar>
                        <Switch>
                            <Route exact path='/' component={Home} />
                            <Route path='/create' component={CreateContainer} />
                            <Route path='/d/:id' component={DropContainer} />
                            <Redirect to="/" />
                        </Switch>
                        <footer>
                           <a href="https://github.com/deaddropeu/deaddrop/"><img src={githublogo} alt="GitHub logo" data-toggle="tooltip" data-placement="top" title="Go to GitHub repo" /></a>
                        </footer>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
