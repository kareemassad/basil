import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import firebase from "./index";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: "", password: "", errorMessage: ""};

        this.signIn = this.signIn.bind(this);
    }

    signIn() {
        if (this.state.email === "" || this.state.password === "") {
            this.setState({errorMessage: "Please enter an email and password."});
            return;
        }
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            firebase.firestore().collection("users").doc(this.state.email).get().then((doc) => {
                if (doc.exists) {
                    this.props.history.push("/welcome", {name: doc.get("name")})
                } else {
                    this.setState({errorMessage: "Error: Unable to retrieve data from Firebase."});
                }
            }).catch((error) =>{
                this.setState({errorMessage: error.message});
            });
        }).catch((error) => {
            this.setState({errorMessage: error.message});
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
                    justify="center"
                    style={{minHeight: '100vh'}}
                >
                    <Grid item xs={3} align='center'>
                        <TextField id="field-email" label="Email"
                                   onChange={(event) => this.setState({email: event.target.value})}/>
                        <br/><br/>
                        <TextField id="field-password" type="password" label="Password"
                                   onChange={(event) => this.setState({password: event.target.value})}/>
                        <br/><br/>
                        <Button variant="contained" onClick={this.signIn}>Sign In</Button>
                        <br/><br/>
                        <Typography>{this.state.errorMessage}</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Login)