import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Nav from "./components/Nav";
import Routes from "./Routes";
import "./App.css";

import { UserProvider } from "./hooks/useUser";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Nav />
          <Routes />
        </div>
      </Router>
    </UserProvider>
  );
}
