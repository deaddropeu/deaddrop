import React, {Component} from 'react';
import { Link } from "react-router-dom";
import {Jumbotron, Button, Grid} from 'react-bootstrap';

class Home extends Component {
    render() {
        return (
            <div className="home">
                <Jumbotron>
                    <Grid>
                        <h1>DeadDrop</h1>
                        <p>
                            DeadDrop is a simple application for sending encrypted messages. Every message is saved on our server in encrypted format and then decrypted by password on the client. DeadDrop is <a href="https://github.com/hynekhavel/deaddrop/">open-source</a>.
                        </p>
                        <p>
                            <Link to="/create"><Button>Create drop ></Button></Link>
                        </p>
                    </Grid>
                </Jumbotron>
            </div>
        );
    }
}

export default Home;
