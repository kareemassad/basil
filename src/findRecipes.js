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
        const thisInstance = this;

        if (this.state.searchClicked) {
            console.log(this.state.recipeLabel);
            return this.state.recipeLabel.map(label => (
                <div>
                    <div key={label + "_div"} style={{display: 'inline-flex'}}>
                        <Typography key={label + "_text"}>Clicked recipeList {label}</Typography>
                    </div>
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

    search() {
        const thisInstance = this;
        fetch("https://api.edamam.com/search?q=chicken&app_id=" + recipeID + "&app_key=" + recipeAPIKey)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' + response.status);
                        return;
                    }

                    // Examine the text in the response
                    response.json().then((data) => {
                        thisInstance.setState({recipeJSON: data});
                        let tempLabel = [];
                        data.hits.map(recipe => {
                            tempLabel.push(recipe.recipe.label);
                        })
                        console.log("TempLabel: " + tempLabel);

                        thisInstance.setState({recipeLabel: tempLabel});
                        thisInstance.setState({searchClicked: true});

                    });
                }
            )

            .catch(function (err) {
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