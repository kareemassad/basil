import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withRouter } from "react-router";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import firebase from "./index";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import { array } from "prop-types";

class MyIngredients extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ingredients: [], loaded: false, error: null, suggestions: [], ingredient: "", errorMessage: "" };

        this.getIngredientsMessage = this.getIngredientsMessage.bind(this);
        this.signOut = this.signOut.bind(this);
        this.listIngredients = this.listIngredients.bind(this);
        this.deleteIngredient = this.deleteIngredient.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
        if (!user) {
            this.props.history.push("/", { message: "You have been signed out." });
            return;
        }
        firebase.firestore().collection("users").doc(user.email).collection("ingredients").get().then((snapshot) => {
            const ingredientList = [];
            snapshot.forEach(doc => {
                ingredientList.push(doc.id)
            })
            this.setState({ ingredients: ingredientList });
            this.setState({ loaded: true });
        }).catch((error) => {
            this.setState({ error: error })
        })
    }

    getIngredientsMessage() {
        if (!this.state.loaded) {
            return "Loading..."
        } else if (this.state.error != null) {
            return "Error: Failed to load ingredients."
        } else if (this.state.ingredients.length === 0) {
            return "You do not have any ingredients yet."
        } else {
            return "Ingredients:"
        }
    }

    listIngredients() {
        return this.state.ingredients.map(ingredient => (
            <div>
                <div key={ingredient + "_div"} style={{ display: 'inline-flex' }}>
                    <Typography key={ingredient + "_text"}>{ingredient}</Typography>
                    <IconButton aria-label="delete" onClick={() => this.deleteIngredient(ingredient)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </div>
        ))
    }

    deleteIngredient(ingredient) {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).collection("ingredients").doc(ingredient).delete().then(() => {
            const ingredients = this.state.ingredients;
            ingredients.splice(ingredients.indexOf(ingredient), 1);
            this.setState({ ingredients: ingredients });
        }).catch((error) => {
            this.setState({ errorMessage: error })
        })
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            this.props.history.push("/", { message: "" });
        }).catch(() => {
            this.props.history.push("/", { message: "Error signing out." });
        })
    }
    getSuggestions(ingredientInput) {
        const myHeaders = new Headers();
        myHeaders.append("x-app-id", "6022f84a");
        myHeaders.append("x-app-key", "403303b3cb1edb526069f56c5190bef8");
        myHeaders.append("x-remote-user-id", "0");
        console.log("peepepep");
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const path = "https://trackapi.nutritionix.com/v2/search/instant?query="
        const thisInstance = this;
        fetch(path + ingredientInput.target.value, requestOptions)
            .then(response => response.json())
            .then(result => {   
                const smallResult = result.slice(0,4);
                const names = smallResult.map(result => result.food_name);
                thisInstance.setState({suggestions: names})
                //slim down to 4 in json tree
                //add to an existing state var array
            })
        // .then(result => console.log(result))
        // .catch(error => console.log('error', error));
        
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
                    style={{ minHeight: '100vh' }}
                >
                    <Grid item xl={3} align='center'>
                        <Typography variant="h5">{this.getIngredientsMessage()}</Typography>
                        <this.listIngredients />
                        <br></br>

                        <TextField id="field-ingredients" label="Enter your ingredients:"
                            onChange={(event) => this.getSuggestions(event.target.value)} />

                        <Autocomplete 
                            id="combo-box-demo" 
                            options={this.state.suggestions} 
                            style={{ width: 300 }}
                            renderInput={params => (
                                <TextField {...params} label="Combo box" variant="outlined" fullWidth />
                            )}
                        />

                        <br /><br />
                        <Button variant="contained"
                            onClick={() => this.props.history.push("/addIngredients", { name: this.props.location.state.name })}>Add Ingredients</Button>
                        &nbsp;&nbsp;
                        <Button variant="contained"
                            onClick={() => this.props.history.push("/findRecipes", { name: this.props.location.state.name })}>Find
                            Recipes</Button>
                        <br /><br />
                        <Button variant="contained"
                            onClick={() => this.props.history.push("/welcome", { name: this.props.location.state.name })}>Back</Button>
                        <br /><br />
                        <Button variant="contained" onClick={this.signOut}>Sign Out</Button>
                        <br /><br />
                        <Typography>{this.state.errorMessage}</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(MyIngredients)