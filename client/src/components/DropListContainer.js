import React, {Component} from 'react';

import DropList from "./DropList";
import Loading from "./Loading";

import io from 'socket.io-client';
import utils from "../utils";

class DropListContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            drops: []
        };
    }

    componentDidMount() {
        let url;
        if(document.location.protocol === 'http:') {
            url = document.location.protocol +'//'+ document.location.hostname +':3001';
        } else {
            url = document.location.protocol +'//'+ document.location.hostname;
        }

        console.log(document.location.protocol +'//'+ document.location.hostname +':3001');
        console.log(document.location.protocol +'//'+ document.location.hostname +'/');

        this.socket = io(url);

        this.socket.on('new_message', data => {
            let drops = this.state.drops;
            drops.unshift(data);

            this.setState({
                drops: drops
            });
        });

        this.socket.open();

        //get 10 newest drops
        this.setState({ loading: true });
        utils.postData('/api/getdroplist', {}).then(data => {
            if(data.success) {
                this.setState({
                    loading: false,
                    drops: data.drops
                });
            } else {
                this.setState({
                    loading: false,
                });
            }
        }).catch(error => console.error(error));
    }

    componentWillUnmount() {
        this.socket.close();
    }

    render() {
        if (this.state.loading) {
            return <Loading>Loading</Loading>;
        }

        if(this.state.drops.length !== 0) {
            return <DropList drops={this.state.drops} />;
        } else {
            return <div className="np-drops">No public drops.</div>;
        }
    }
}

export default DropListContainer;
