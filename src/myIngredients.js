import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import firebase from "./index";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import { AwesomeButton } from 'react-awesome-button';


class MyIngredients extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ingredients: [],
            loaded: false,
            error: null,
            suggestions: [],
            errorMessage: "",
            ingredientValue: ""
        };

        this.getIngredientsMessage = this.getIngredientsMessage.bind(this);
        this.signOut = this.signOut.bind(this);
        this.listIngredients = this.listIngredients.bind(this);
        this.deleteIngredient = this.deleteIngredient.bind(this);
        this.getSuggestions = this.getSuggestions.bind(this);
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
        if (!user) {
            this.props.history.push("/", {message: "You have been signed out."});
            return;
        }
        firebase.firestore().collection("users").doc(user.email).collection("ingredients").get().then((snapshot) => {
            const ingredientList = [];
            snapshot.forEach(doc => {
                ingredientList.push(doc.id);
            })
            this.setState({ingredients: ingredientList});
            this.setState({loaded: true});
        }).catch((error) => {
            this.setState({error: error});
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
            <div key={ingredient + "_div"} style={{display: 'inline-flex'}}>
                <Typography key={ingredient + "_text"}>{ingredient}</Typography>
                <IconButton key={ingredient + "_button"} aria-label="delete"
                            onClick={() => this.deleteIngredient(ingredient)}>
                    <DeleteIcon/>
                </IconButton>
            </div>
        ))
    }

    deleteIngredient(ingredient) {
        firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).collection("ingredients").doc(ingredient).delete().then(() => {
            const ingredients = this.state.ingredients;
            ingredients.splice(ingredients.indexOf(ingredient), 1);
            this.setState({ingredients: ingredients});
        }).catch((error) => {
            this.setState({errorMessage: error})
        })
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            this.props.history.push("/", {message: ""});
        }).catch(() => {
            this.props.history.push("/", {message: "Error signing out."});
        })
    }

    getSuggestions(ingredientInput) {
        this.setState({ingredientValue: ingredientInput});
        if (ingredientInput.length > 0) {
            const myHeaders = new Headers();
            myHeaders.append("x-app-id", "8131cd2f");
            myHeaders.append("x-app-key", "0cd6e124b2fea85246abfbbad7d9d8fc");
            myHeaders.append("x-remote-user-id", "0");
            const requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            const path = "https://trackapi.nutritionix.com/v2/search/instant?query="
            const thisInstance = this;
            fetch(path + ingredientInput, requestOptions)
                .then(response => response.json())
                .then(result => {
                    let smallResult;
                    if (result.common.length > 4) {
                        smallResult = result.common.slice(0, 4);
                    } else {
                        smallResult = result;
                    }
                    if (smallResult.length > 0) {
                        const names = smallResult.map(res => res.food_name);
                        thisInstance.setState({suggestions: names})
                    }
                })
        }
    }

    onClickFirebase(event, value) {
        if (value !== null) {
            if (this.state.ingredients.indexOf(value) >= 0) {
                this.setState({errorMessage: "Ingredient is already in your list!"});
                this.setState({ingredientValue: ""});
                return;
            }
            this.setState({errorMessage: ""});
            firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).collection("ingredients").doc(value).set({}).then(() => {
                const ingredients = this.state.ingredients;
                ingredients.push(value);
                this.setState({ingredients: ingredients});
                this.setState({ingredientValue: ""});
            }).catch((error) => {
                this.setState({errorMessage: error})
            })
        }
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
                    <Grid item xl={6} align='center'>
                        <Typography variant="h5">{this.getIngredientsMessage()}</Typography>
                        <this.listIngredients/>
                        <br></br>

                        <Autocomplete
                            id="combo-box-demo"
                            options={this.state.suggestions}
                            style={{width: 300}}
                            value={this.state.ingredientValue}
                            onChange={(event, value) => this.onClickFirebase(event, value)}
                            renderInput={params => (
                                <TextField {...params} label="Enter your ingredients:"
                                           variant="outlined" fullWidth
                                           onChange={(event) => this.getSuggestions(event.target.value)}
                                />
                            )}
                        />

                        <br/><br/>
                        <AwesomeButton type="secondary" variant="contained"

                                onPress={() => this.props.history.push("/findRecipes", {
                                    name: this.props.location.state.name,
                                    ingredients: this.state.ingredients
                                })}>Find
                            Recipes</AwesomeButton>
                        <br/><br/>
                        <AwesomeButton type="secondary" variant="contained"
                                onPress={() => this.props.history.push("/welcome", {name: this.props.location.state.name})}>Back</AwesomeButton>
                        <br/><br/>
                        <AwesomeButton type="secondary" variant="contained" onPress={this.signOut}>Sign Out</AwesomeButton>
                        <br/><br/>
                        <Typography>{this.state.errorMessage}</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(MyIngredients)