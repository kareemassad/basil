import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import firebase from "./index";
import {Typography} from "@material-ui/core";
import {recipeAPIKey} from "./firebaseConfig";
import {recipeID} from "./firebaseConfig";

class FindRecipes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {recipeJSON: [], recipeLabel: [], searchClicked: false, error: null, errorMessage: ""};
        this.signOut = this.signOut.bind(this);
        this.search = this.search.bind(this);
        this.searchResults = this.searchResults.bind(this);
        this.calculateHealth = this.calculateHealth.bind(this);
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
                    <div key={label.label + "_div"} style={{display: 'block'}}>
                        <Typography key={label.label + "_text"}>{label.label}
                            <Button key={label.label + "_buttons"} color="primary"
                                    onClick={() => this.props.history.push("/recipeDetails", {
                                        name: this.props.location.state.name,
                                        recipe: label,
                                        ingredients: this.props.location.state.ingredients
                                    })}>See Recipe</Button>
                            <br/>
                        </Typography>
                    </div>
            ));
        } else {
            return (
                <div>
                    <Typography variant="h4">Click on Search to Show Results</Typography>
                </div>
            )
        }
    }

    calculateHealth(recipe) {
        let calories, vitamins = 0, rating = 0;
        const keys = Object.keys(recipe.totalNutrients);
        keys.map(key => {
            console.log(key);
            if (key === "ENERC_KCAL") {
                calories = recipe.totalDaily[key].quantity * 4;
            }
            else if (key === "VITA_RAE" || key === "VITC" || key === "VITD" || key === "VITK1") {
                vitamins += recipe.totalDaily[key].quantity;
                const newRating = (vitamins / calories) * 100.0;
                rating = Math.round(newRating) + "%"
            }
        })
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
            <div>
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
                        <this.searchResults/>

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