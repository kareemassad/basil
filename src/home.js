import React from "react";
import Grid from "@material-ui/core/Grid";
import {withRouter} from "react-router";
import Typography from "@material-ui/core/Typography";
import { AwesomeButton } from 'react-awesome-button';
import "react-awesome-button/dist/styles.css";
import "circular-std";
import Anime, {anime} from 'react-anime';


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
                    style={{minHeight: '25vh'}}
                >
                    <Grid item xl={3} align='center'>
                        <div className="logo"></div>

                        <br></br>
                        <Anime delay={anime.stagger(100)} scale={[.1, 2.5]}>
                            <h1>Basil.</h1>
                            <br></br>
                            <h2>A react-based recipe app that doesn't (totally) suck.</h2>
                        </Anime>

                        <br></br>
                        <AwesomeButton type="secondary" variant="contained" onPress={() => this.props.history.push('/login')}>Sign In</AwesomeButton>
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