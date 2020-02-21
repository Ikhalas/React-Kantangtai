import React from "react";
import '../assets/demo/login.css'
import { Link, withRouter } from 'react-router-dom'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
        //document.body.style.overflow = 'hidden'
        //this.props.history.push('/admin/dashboard')
    }

    render() {
        return (
            <div className="full-height regular-th">
                <h2 className="title"> องค์การบริหารส่วนตำบลกันตังใต้ อำเภอกันตัง จังหวัดตรัง </h2>

                <div className="cont">
                    <div className="form">
                        <form>
                            <h1 className="label">ลงชื่อเข้าใช้</h1>
                            <input type="text" className="user" placeholder="Username" autoComplete="off" />
                            <input type="password" className="pass" placeholder="Password" autoComplete="off" />
                            <button 
                                className="login regular-th" 
                                style={{fontSize:"25px"}}
                                onClick={() => this.props.history.push('/admin/dashboard')}
                            >
                            เข้าสู่ระบบ
                            </button>
                            <div style={{textAlign:"center"}}>
                            <Link to="/home" style={{color:"#3598dc"}}>กลับสู่หน้าหลัก</Link>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(Login)