import React from "react";
import { Link, withRouter } from 'react-router-dom';

class Home extends React.Component {
    render(){
        return(
            <div>
                Home Page <br/>
                <Link to="/login"><span>go to login page</span></Link>
            </div>
        )
    }
}

export default withRouter(Home);