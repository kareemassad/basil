import React from "react";
import {withRouter} from "react-router";

class CreateAccount extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <h2>Create Account</h2>
        )
    }
}
export default withRouter(CreateAccount)