import React from "react";
import Grid from "@material-ui/core/Grid";
import {withRouter} from "react-router";
import Typography from "@material-ui/core/Typography";
import firebase from "./index";
import Button from "@material-ui/core/Button";
import { AwesomeButton } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";
import "./css/welcome.css"; 


class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {welcomeMessage: ""};

        this.getWelcomeMessage = this.getWelcomeMessage.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
        if (!user) {
            this.props.history.push("/", {message: "You have been signed out."});
            return;
        }
        const thisProps = this.props;
        this.setState({welcomeMessage: "Welcome, " + thisProps.location.state.name})
    }

    getWelcomeMessage() {
        return "Welcome, " + this.props.location.state.name;
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
                    <div>
                    {/* <img src="../../img/logo.svg" className="logo" alt="logo"/> */}
                    <Grid item xs={3} align='center'>
                        <Typography>{this.getWelcomeMessage()}</Typography>
                        <br/><br/>
                        <AwesomeButton type="secondary" variant="contained"
                                onPress={() => this.props.history.push("/ingredients", {name: this.props.location.state.name})}>My
                            Ingredients</AwesomeButton>
                        <br/><br/>
                        <AwesomeButton type="secondary" variant="contained" onPress={this.signOut}>Sign Out</AwesomeButton>
                    </Grid>
                    </div>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Welcome)