import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {withRouter} from "react-router";
import Typography from "@material-ui/core/Typography";
import {
    AwesomeButton,
    AwesomeButtonProgress,
    AwesomeButtonSocial,
} from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";


class Home extends React.Component {
    constructor(props) {
        super(props);

        this.getSignedOutMessage = this.getSignedOutMessage.bind(this);
    }

    getSignedOutMessage() {
        if (this.props.location.state !== undefined && this.props.location.state.message !== undefined) {
            return this.props.location.state.message;
        }
        return "";
    };
    
    Button() {
    return <AwesomeButton type="primary">Button</AwesomeButton>;
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
                        <AwesomeButton type="primary" variant="contained" onPress={() => this.props.history.push('/login')}>Sign In</AwesomeButton>
                        <br/><br/>

                        <AwesomeButton type="secondary" variant="contained" onPress={() => this.props.history.push('/createAccount')}>Create Account</AwesomeButton>
                        
                        <br/><br/>
                        <Typography>{this.getSignedOutMessage()}</Typography>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(Home)