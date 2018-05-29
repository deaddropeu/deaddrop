import React from 'react';
import ReactDOM from 'react-dom';
import './styles/style.css';
import '../node_modules/bootstrap-sass/assets/javascripts/bootstrap.min'
import registerServiceWorker from './registerServiceWorker';

import App from './components/App';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

registerServiceWorker();
