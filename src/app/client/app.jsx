import React from 'react';
import FluxComponent from 'flummox/component';
import List from './components/List.jsx'
import Flux from './Flux'
import connectToStores from 'flummox/connect';

const flux = new Flux();

class Root {
    render () {
        return (
            <App flux={flux}/>
        );
    }
}

class App {
    render () {
        return (
            <div>
                <div>{this.props.cities}</div>
                <div>{this.props.cities}</div>
                <div>{this.props.cities}</div>
                <div>{this.props.cities}</div>
                <div>{this.props.cities}</div>
                <div>{this.props.cities}</div>
            </div>
        );
    }
}

App = connectToStores(App, {
  cities: store => ({
    cities: store.getCities()
  })
});

let root = React.createElement(Root);

React.render(root, document.getElementById('app'));
