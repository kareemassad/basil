import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {ThemeProvider} from '@material-ui/core/styles';
import firebase, {mediumFontTheme} from "./index";

class MyIngredients extends React.Component {
    constructor(props) {
        super(props);
        this.state = {ingredients: [], loaded: false};

        this.getIngredientsMessage = this.getIngredientsMessage.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
        if (!user) {
            this.props.history.push("/", {message: "You have been signed out."});
        }
    }

    getIngredientsMessage() {
        if (!this.state.loaded) {
            return "Loading..."
        } else if (this.state.ingredients.length === 0) {
            return "You do not have any ingredients yet."
        } else {
            return "Ingredients:"
        }
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            this.props.history.push("/", {message: "You have been signed out."});
        }).catch(() => {
            this.props.history.push("/", {message: "Error signing out."});
        })
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
                    <Grid item xs={3} align='center'>
                        <ThemeProvider theme={mediumFontTheme}>
                            <Typography>{this.getIngredientsMessage()}</Typography>
                        </ThemeProvider>
                        <br/><br/>
                        <Button variant="contained"
                                onClick={() => this.props.history.push("/welcome", {name: this.props.location.state.name})}>Back</Button>
                        <br/><br/>
                        <Button variant="contained" onClick={this.signOut}>Sign Out</Button>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(MyIngredients)