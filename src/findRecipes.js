import React from "react";
import { withRouter } from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import firebase from "./index";
import { Typography } from "@material-ui/core";
import { recipeAPIKey } from "./firebaseConfig";
import { recipeID } from "./firebaseConfig";
import { AwesomeButton } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";
import "./css/findRecipe.css";

class FindRecipes extends React.Component {
    constructor(props) {
        super(props);
        this.state = { recipeJSON: [], recipeLabel: [], searchClicked: false, error: null, errorMessage: "" };
        this.signOut = this.signOut.bind(this);
        this.search = this.search.bind(this);
        this.searchResults = this.searchResults.bind(this);
        this.calculateHealth = this.calculateHealth.bind(this);
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
        if (!user) {
            this.props.history.push("/", { message: "You have been signed out." });
            return;
        }
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            this.props.history.push("/", { message: "" });
        }).catch(() => {
            this.props.history.push("/", { message: "Error signing out." });
        })
    }

    searchResults() {
        if (this.state.searchClicked) {
            return this.state.recipeLabel.map(label => (
                <div class="cell">
                    <div key={label.label + "_div"} style={{ display: 'block' }}>
                        <Typography key={label.label + "_text"}><span class="recipeTitle">{label.label}</span>
                            <Button class="recipeButton" color="primary" style={{ borderBlockColor: 'green' }}
                                onClick={() => this.props.history.push("/recipeDetails", {
                                    name: this.props.location.state.name,
                                    recipe: label,
                                    ingredients: this.props.location.state.ingredients
                                })}>See Recipe</Button>
                            <br />
                        </Typography>
                    </div>
                    <div key={label.calories + "_div"} style={{ display: 'block' }}>
                        <Typography key={label.calories + "_text"}><span
                            class="recipeCalories">Calories: {Math.round(label.calories / 10) * 10}</span></Typography>
                    </div>
                    <div key={label.calories + "_div"} style={{ display: 'block' }}>
                        <Typography key={label.calories + "_text"}><span
                            class="recipeCalories">Health Rating: {this.calculateHealth(label)}/5</span></Typography>
                    </div>
                </div>
            ));
        } else {
            return (
                <div>
                    <Typography variant="h3">Click on Search to Show Results</Typography>
                </div>
            )
        }
    }

    calculateHealth(recipe) {
        let negative = 0, vitamins = 0, rating = 0, count = 0;
        const keys = Object.keys(recipe.totalNutrients);
        keys.map(key => {
            console.log(key);
            if (key === "ENERC_KCAL" || key === "NA") {
                negative += recipe.totalDaily[key].quantity
            } else if (key === "VITA_RAE" || key === "VITC" || key === "VITD" || key === "VITK1" || key === "FE" || key === "PROCNT") {
                vitamins += recipe.totalDaily[key].quantity;
                if (key === "PROCNT") vitamins += recipe.totalDaily[key].quantity;
                count += 1;
            }

        });
        negative *= count;
        const newRating = (vitamins / negative) * 75;
        if(newRating < 40){
            rating = 1;
        } else if (newRating < 80){
            rating = 2;
        } else if (newRating < 120){
            rating = 3;
        } else if (newRating < 160){
            rating = 4;
        } else {
            rating = 5;
        }
        return rating;
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
        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            cache: 'default'
        })
            .then(
                (response) => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.json().then((data) => {
                        thisInstance.setState({ recipeJSON: data.hits });
                        let tempLabel = [];
                        data.hits.map(recipe => {
                            tempLabel.push(recipe.recipe);
                        })

                        thisInstance.setState({ recipeLabel: tempLabel });
                        thisInstance.setState({ searchClicked: true });

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
                    style={{ minHeight: '50vh' }}
                >
                    <div class="container">
                        <this.searchResults/>
                    </div>
                    <br></br>
                    
                    <AwesomeButton type="primary" variant="contained"
                        onPress={this.search}>Search</AwesomeButton>
                    <br/><br />

                    <AwesomeButton type="secondary" variant="contained"
                        onPress={() => this.props.history.push("/ingredients", { name: this.props.location.state.name })}>Back</AwesomeButton>
                    <br /><br />
                    <AwesomeButton type="secondary" variant="contained" onPress={this.signOut}>Sign Out</AwesomeButton>
                    <br /><br />
                </Grid>
            </div>
        )
    }
}

export default withRouter(FindRecipes)