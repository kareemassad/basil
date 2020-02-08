import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import firebase from "./index";

class FindRecipes extends React.Component {
    constructor(props) {
        super(props);
    }

    signOut() {
        firebase.auth().signOut().then(() => {
            this.props.history.push("/", {message: ""});
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
                    <Grid item xl={3} align='center'>
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