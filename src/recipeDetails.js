import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import firebase from "./index";
import Typography from "@material-ui/core/Typography";

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
        let calories, vitamins = 0;
        const recipe = this.props.location.state.recipe;
        const keys = Object.keys(recipe.totalNutrients);
        keys.map(key => {
            console.log(key);
            if (key === "ENERC_KCAL") {
                calories = recipe.totalDaily[key].quantity * 4;
            } else if (key === "VITA_RAE" || key === "VITC" || key === "VITD" || key === "VITK1") {
                vitamins += recipe.totalDaily[key].quantity;
                const newRating = (vitamins / calories) * 100.0;
                this.setState({rating: Math.round(newRating) + "%"})
            }
        })
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            this.props.history.push("/", {message: ""});
        }).catch(() => {
            this.props.history.push("/", {message: "Error signing out."});
        })
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
                        <Button variant="contained"
                                onClick={() => this.props.history.push("/findRecipes", {
                                    name: this.props.location.state.name,
                                    ingredients: this.props.location.state.ingredients
                                })}>Back</Button>
                        <br/><br/>
                        <Button variant="contained" onClick={this.signOut}>Sign Out</Button>
                        <br/><br/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(RecipeDetails)