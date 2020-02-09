import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import firebase from "./index";
import Typography from "@material-ui/core/Typography";
import { AwesomeButton } from 'react-awesome-button';

class RecipeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {rating: ""};

        this.signOut = this.signOut.bind(this);
        this.showRecipeDetails = this.showRecipeDetails.bind(this);
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
        if (!user) {
            this.props.history.push("/", {message: "You have been signed out."});
            return;
        }
        const health = this.calculateHealth(this.props.location.state.recipe);
        this.setState({rating: health})
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            this.props.history.push("/", {message: ""});
        }).catch(() => {
            this.props.history.push("/", {message: "Error signing out."});
        })
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
        if (newRating < 40) {
            rating = 1;
        } else if (newRating < 80) {
            rating = 2;
        } else if (newRating < 120) {
            rating = 3;
        } else if (newRating < 160) {
            rating = 4;
        } else {
            rating = 5;
        }
        return rating + "/5";
    }

    showRecipeDetails() {
        if (this.props.location.state !== undefined && this.props.location.state.recipe !== undefined) {
            const recipe = this.props.location.state.recipe;
            const recipeName = recipe.label + " - " + recipe.source;
            const recipeTime = "Total time: " + recipe.totalTime + " minutes";
            const getKeys = obj => Object.keys(obj).flatMap(k => Object(obj[k]) === obj[k]
                ? [k, ...getKeys(obj[k])]
                : k);
            const keys = Object.keys(recipe.totalNutrients);

            return (
                <div>
                    <Typography variant="h4">{recipeName}</Typography>
                    <Typography>{recipeTime}</Typography>
                    <br/>
                    <Typography>Ingredients:</Typography>
                    {recipe.ingredientLines.map(ingredient => {
                        return <Typography id={ingredient}>{'\u25cf' + " " + ingredient}</Typography>
                    })}
                    <br/>
                    {
                        keys.map(key => {
                            return <Typography>{recipe.totalNutrients[key].label + " - " + Math.round(recipe.totalNutrients[key].quantity) + recipe.totalNutrients[key].unit + ((key in recipe.totalDaily) ? (" " + Math.round(recipe.totalDaily[key].quantity) + "%") : "")}</Typography>
                        })
                    }
                    <br/>
                    <Typography>Smart Health Rating: {this.state.rating}</Typography>
                </div>
            )
        }
        return (
            <Typography>Loading...</Typography>
        )
    }

    render() {
        return (
            <div>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                    style={{minHeight: '100vh'}}
                >
                    <Grid item xl={3}>
                        <this.showRecipeDetails/>
                        <AwesomeButton type="secondary" variant="contained"
                                onPress={() => this.props.history.push("/findRecipes", {
                                    name: this.props.location.state.name,
                                    ingredients: this.props.location.state.ingredients
                                })}>Back</AwesomeButton>
                        <br/><br/>
                        <AwesomeButton type="secondary" variant="contained" onPress={this.signOut}>Sign Out</AwesomeButton>
                        <br/><br/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(RecipeDetails)