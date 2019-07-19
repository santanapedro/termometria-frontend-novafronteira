import React, { Component } from "react";
import Routes from "../src/components/Routes";
import TopNavigation from "./components/topNavigation";
import SideNavigation from "./components/sideNavigation";

import Login from "./components/pages/Login";
import "./index.css";

class App extends Component {
  auth() {
    const token = localStorage.getItem("@hortech:token");
    if (!token) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    //======================================================================

    return (
      <div className="flexible-content">
        {this.auth() ? (
          <div>
            <TopNavigation />
            <SideNavigation />
            <main id="content" className="p-5">
              <Routes />
            </main>
          </div>
        ) : (
          <Login />
        )}
      </div>
    );
  }
}

export default App;
