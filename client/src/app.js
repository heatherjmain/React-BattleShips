import React from 'react';
import ReactDOM from 'react-dom';
import GameContainer from "./containers/GameContainer"

window.addEventListener('load', function () {
  ReactDOM.render(
    <GameContainer />,
    document.getElementById('app')
  );
});
