import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {withRouter} from "react-router";

class Home extends React.Component {
    constructor(props) {
        super(props);
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
                style={{ minHeight: '100vh' }}
            >
                <Grid item xs={3} align='center'>
                    <Button variant="contained" onClick={() => this.props.history.push('/login')}>Sign In</Button>
                    <br/><br/>
                    <Button variant="contained" onClick={() => this.props.history.push('/createAccount')}>Create Account</Button>
                </Grid>
            </Grid>
        </div>
        )
    }
}
export default withRouter(Home)