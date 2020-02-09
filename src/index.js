import React from 'react';
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Home from "./home";
import Login from "./login";
import CreateAccount from "./createAccount";
import {firebaseConfig} from "./firebaseConfig";
import Welcome from "./welcome";
import MyIngredients from "./myIngredients";
import FindRecipes from "./findRecipes";
import RecipeDetails from "./recipeDetails";


const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
export default firebase

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
                <Route path="/welcome">
                    <Welcome/>
                </Route>
                <Route path="/ingredients">
                    <MyIngredients/>
                </Route>
                <Route path="/findRecipes">
                    <FindRecipes/>
                </Route>
                <Route path="/recipeDetails">
                    <RecipeDetails/>
                </Route>
                <Route path="/">
                    <Home/>
                </Route>
            </Switch>
        </div>
    </BrowserRouter>, mountNode);