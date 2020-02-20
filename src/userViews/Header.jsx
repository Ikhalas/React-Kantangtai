import React from "react";
import '../assets/demo/home.css'
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
    render() {
        return (
            <div id="wrapper">
                <header id="js-header">
                    <div className="container clearfix">
                        <h1 id="logo">
                            <img id="logo-img" src={require('../assets/img/logo.png')} />
                            <img id="logo-name-1" src={require('../assets/img/SAO-logo.png')} />
                            <img id="logo-name-2" src={require('../assets/img/SAO-logo-2.png')} />
                        </h1>
                        <nav className="regular-th" style={{ fontSize: '25px' }}>
                            <a href="#">หน้าหลัก</a>
                            <a href="https://www.kantangtai.go.th/index.php" target="_blank">เว็บไซต์หลัก</a>
                            <Link to="/login">ลงชื่อเข้าใช้</Link>
                        </nav>
                    </div>
                </header>
            </div>
        )
    }
}