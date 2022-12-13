import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ReferenceBoard} from "./components/ReferenceBoard";

function App() {
  return (
    <section className="flex flex-col w-screen h-screen bg-black place-items-center place-content-center">
      <ReferenceBoard/>
      {/*<header className="App-header">*/}
      {/*  <img src={logo} className="App-logo" alt="logo" />*/}
      {/*  <p>*/}
      {/*    Edit <code>src/App.tsx</code> and save to reload.*/}
      {/*  </p>*/}
      {/*  <a*/}
      {/*    className="App-link"*/}
      {/*    href="https://reactjs.org"*/}
      {/*    target="_blank"*/}
      {/*    rel="noopener noreferrer"*/}
      {/*  >*/}
      {/*    Learn React*/}
      {/*  </a>*/}
      {/*</header>*/}
    </section>
  );
}

export default App;
