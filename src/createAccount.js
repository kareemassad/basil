import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import firebase from "./index";
import { AwesomeButton } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";
import "./css/createAccount.css";

class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {nickname: "", email: "", password: "", confirmPassword: "", errorMessage: ""};

        this.signUp = this.signUp.bind(this);
    }

    signUp() {
        if (this.state.nickname.length === 0) {
            this.setState({errorMessage: "Please enter a nickname."})
        } else if (this.state.email.length === 0) {
            this.setState({errorMessage: "Please enter an email."})
        } else if (this.state.password.length === 0) {
            this.setState({errorMessage: "Please enter a password."})
        } else if (this.state.password !== this.state.confirmPassword) {
            this.setState({errorMessage: "Passwords do not match!"})
        } else {
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(() => {
                firebase.firestore().collection("users").doc(this.state.email).set({
                    name: this.state.nickname,
                })
                    .then(() => {
                        //Create account successful
                        this.props.history.push("/welcome", {name: this.state.nickname})
                    })
                    .catch((error) => {
                        this.setState({errorMessage: error.message})
                    });
            }).catch((error) => {
                this.setState({errorMessage: error.message})
            });
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
                    <Grid item xs={3} align='center'>
                        <TextField id="field-nickname" label="Nickname"
                                   onChange={(event) => this.setState({nickname: event.target.value})}/>
                        <br/><br/>
                        <TextField id="field-email" label="Email"
                                   onChange={(event) => this.setState({email: event.target.value})}/>
                        <br/><br/>
                        <TextField id="field-password" type="password" label="Password"
                                   onChange={(event) => this.setState({password: event.target.value})}/>
                        <br/><br/>
                        <TextField id="field-confirm" type="password" label="Confirm Password"
                                   onChange={(event) => this.setState({confirmPassword: event.target.value})}/>
                        <br/><br/>
                        <AwesomeButton type="secondary" variant="contained" onPress={this.signUp}>Create Account</AwesomeButton>
                        <br/><br/>
                        <AwesomeButton type="secondary" variant="contained" onPress={() => this.props.history.push("/")}>Back</AwesomeButton>
                        <br/><br/>
                        <Typography>{this.state.errorMessage}</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(CreateAccount)