import React from "react";
import {withRouter} from "react-router";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

class CreateAccount extends React.Component {
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
                    style={{minHeight: '100vh'}}
                >
                    <Grid item xs={3} align='center'>
                        <TextField id="field-nickname" label="Nickname"/>
                        <br/><br/>
                        <TextField id="field-email" label="Email"/>
                        <br/><br/>
                        <TextField id="field-password" label="Password"/>
                        <br/><br/>
                        <TextField id="field-confirm" label="Confirm Password" />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withRouter(CreateAccount)