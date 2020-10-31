import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Nav from "./components/Nav";
import Routes from "./Routes";
import "./App.css";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes />
      </div>
    </Router>
  );
}
