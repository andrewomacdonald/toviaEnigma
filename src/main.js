import React from 'react';
import ReactDOM from 'react-dom';
import Enigma from './enigma.js';
import { AppContainer } from 'react-hot-loader';
import { overrideComponentTypeChecker } from 'react-toolbox';


document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <Enigma />,
        document.getElementById('enigma')
    );
});