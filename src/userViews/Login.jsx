import React from "react";
import Modal from 'react-modal';
import { Link, withRouter } from 'react-router-dom';


class Login extends React.Component {
    render(){
        return(
            <div>
                Login Page <br/>
                <Link to="/admin/dashboard"><span>go to dashboard</span></Link>
            </div>
        )
    }
}

export default withRouter(Login);