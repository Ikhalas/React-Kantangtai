import React from "react";
import { Link } from 'react-router-dom';
import 'assets/demo/home.css'

export default class Header extends React.Component {
    render() {
        return (
            <div id="wrapper">
                <header id="js-header">
                    <div className="container clearfix">
                        <h1 id="logo">
                            <img id="logo-img" src={require('../assets/img/logo.png')} alt="logo" />
                            <img id="logo-name-1" src={require('../assets/img/SAO-logo.png')} alt="SAO-logo" />
                            <img id="logo-name-2" src={require('../assets/img/SAO-logo-2.png')} alt="SAO-logo-2" />
                        </h1>
                        <nav className="regular-th" style={{ fontSize: '25px' }}>
                            <a href="https://www.kantangtai.go.th/index.php" target="_blank" rel="noopener noreferrer">เว็บไซต์หลัก</a>
                            <Link to="/login">ระบบการจัดการ <span style={{ fontSize: '15px' }}>(สำหรับเจ้าหน้าที่)</span></Link>
                        </nav>
                    </div>
                </header>
            </div>
        )
    }
}