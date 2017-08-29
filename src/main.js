import React from 'react';
import ReactDOM from 'react-dom';
import Enigma from './enigma.jsx';

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Enigma />,
    document.getElementById('enigma'),
  );
});
