import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./pages/HomePage"; // ok

import Relatorios from "./pages/Relatorios";

import Dispositivos from "./pages/Dispositivos";

import Usuarios from "./pages/Usuarios";

import Login from "./pages/Login";

class Routes extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/home" component={Home} />

        {/*
      
      <Route path='/relatorios' component={Relatorios} />

        <Route path='/dispositivos' component={Dispositivos} />

        <Route path='/usuarios' component={Usuarios} />
      */}
        <Route path="*" component={Home} />
        <Route path="/login" component={Login} />
      </Switch>
    );
  }
}

export default Routes;
