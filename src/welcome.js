import React from "react";
import Grid from "@material-ui/core/Grid";
import {withRouter} from "react-router";
import Typography from "@material-ui/core/Typography";
import firebase from "./index";

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {welcomeMessage: ""};

        this.getWelcomeMessage = this.getWelcomeMessage.bind(this);
    }

    componentDidMount() {
        const user = firebase.auth().currentUser;
        if (user) {
            const thisProps = this.props;
            this.setState({welcomeMessage: "Welcome, " + thisProps.location.state.name})
        } else {
            this.props.history.push("/", {message: "You have been signed out."});
        }
    }

    getWelcomeMessage() {
        return "Welcome, " + this.props.location.state.name;
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
                        <Typography>{this.getWelcomeMessage()}</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Welcome)