import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import firebase from "./index";
import Typography from "@material-ui/core/Typography";

class RecipeDetails extends React.Component {
    constructor(props) {
        super(props);

        this.signOut = this.signOut.bind(this);
        this.showRecipeDetails = this.showRecipeDetails.bind(this);
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

    showRecipeDetails() {
        if (this.props.location.state !== undefined) {
            const recipe = this.props.location.state.recipe;
            const recipeName = recipe.label + " - " + recipe.source;
            const recipeTime = "Total time: " + recipe.time + " minutes";

            return (
                <div>
                    <Typography>{recipeName}</Typography>
                    <Typography>{recipeTime}</Typography>
                    <Typography>Ingredients...</Typography>
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
                    <Grid item xl={3} align='center'>
                        <this.showRecipeDetails/>
                        <Button variant="contained"
                                onClick={() => this.props.history.push("/findRecipes", {name: this.props.location.state.name, ingredients: this.props.location.state.ingredients})}>Back</Button>
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