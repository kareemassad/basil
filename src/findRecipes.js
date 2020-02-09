import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import firebase from "./index";
import {Typography} from "@material-ui/core";
import {recipeAPIKey} from "./firebaseConfig";
import {recipeID} from "./firebaseConfig";
import "./app.css";

class FindRecipes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {recipeJSON: [], recipeLabel: [], searchClicked: false, error: null, errorMessage: ""};
        this.signOut = this.signOut.bind(this);
        this.search = this.search.bind(this);
        this.searchResults = this.searchResults.bind(this);

    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
        if (!user) {
            this.props.history.push("/", {message: "You have been signed out."});
            return;
        }
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            this.props.history.push("/", {message: ""});
        }).catch(() => {
            this.props.history.push("/", {message: "Error signing out."});
        })
    }

    searchResults() {
        if (this.state.searchClicked) {
            return this.state.recipeLabel.map(label => (
<<<<<<< HEAD
                <div class="cell">
                    <div key={label.label + "_div"} style={{display: 'block'}} >
                        <Typography key={label.label + "_text"}><span class="recipeTitle">{label.label}</span>
                            <Button class="recipeButton" color="primary"
=======
                    <div key={label.label + "_div"} style={{display: 'block'}}>
                        <Typography key={label.label + "_text"}>{label.label}
                            <Button key={label.label + "_buttons"} color="primary"
>>>>>>> b034c66b9cf687356df1a1859c00bac3f5e43234
                                    onClick={() => this.props.history.push("/recipeDetails", {
                                        name: this.props.location.state.name,
                                        recipe: label,
                                        ingredients: this.props.location.state.ingredients
                                    })}>See Recipe</Button>
                            <br/>
                        </Typography>
                    </div>
<<<<<<< HEAD
                    <div key={label.calories + "_div"} style={{display: 'block'}} >
                        <Typography key={label.calories + "_text"}><span class="recipeCalories">Calories: {Math.round(label.calories)}</span></Typography>
                    </div>
                </div>
=======
>>>>>>> b034c66b9cf687356df1a1859c00bac3f5e43234
            ));
        } else {
            return (
                <div>
                    <Typography variant="h4">Click on Search to Show Results</Typography>
                </div>
            )
        }
    }


    search() {
        const thisInstance = this;
        let url = "https://api.edamam.com/search?q=";
        this.props.location.state.ingredients.map(ingredient => {
            if (ingredient.includes(' ')) {
                ingredient = ingredient.replace(" ", "+");
            }
            url = url + ingredient + ",";
        });
        url = url.slice(0, url.length - 1);
        url = url + "&";
        url = url + "app_id=" + recipeID + "&app_key=" + recipeAPIKey;
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.json().then((data) => {
                        thisInstance.setState({recipeJSON: data.hits});
                        let tempLabel = [];
                        data.hits.map(recipe => {
                            tempLabel.push(recipe.recipe);
                        })

                        thisInstance.setState({recipeLabel: tempLabel});
                        thisInstance.setState({searchClicked: true});

                    });
                }
            )

            .catch((err) => {
                console.log('Fetch Error :-S', err);
            });
    }


    render() {
        return (
            <div class="container">
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="bottom"
                    style={{minHeight: '100vh'}}
                >
                    <Grid item xl={3} align='center'>
                        <Button variant="contained"
                                onClick={this.search}>Search</Button>
                        <br/><br/>
                        <div class="container">
                            <this.searchResults/>
                        </div>
                        <Button variant="contained"
                                onClick={() => this.props.history.push("/ingredients", {name: this.props.location.state.name})}>Back</Button>
                        <br/><br/>
                        <Button variant="contained" onClick={this.signOut}>Sign Out</Button>
                        <br/><br/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(FindRecipes)