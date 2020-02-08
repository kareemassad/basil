import React from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from "./home";
import Login from "./login";
import CreateAccount from "./createAccount";


if (module.hot) {
    module.hot.accept()
}

const mountNode = document.getElementById("app");
ReactDOM.render(
    <BrowserRouter>
        <div>
            <Switch>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/createAccount">
                    <CreateAccount/>
                </Route>
                <Route path="/">
                    <Home/>
                </Route>
            </Switch>
        </div>
    </BrowserRouter>, mountNode);