import React from "react";
import { Link } from "react-router-dom";
import "assets/demo/home.css";
import { Button } from "reactstrap";

export default class Header extends React.Component {
  handleClick() {
    window.open("https://www.kantangtai.go.th/index.php", "_blank");
  }

  render() {
    return (
      <div id="wrapper">
        <header id="js-header">
          <div className="container clearfix">
            <h1 id="logo">
              <img
                id="logo-img"
                src={require("../assets/img/logo.png")}
                alt="logo"
              />
              <img
                id="logo-name-1"
                src={require("../assets/img/SAO-logo.png")}
                alt="SAO-logo"
              />
              <img
                id="logo-name-2"
                src={require("../assets/img/SAO-logo-2.png")}
                alt="SAO-logo-2"
              />
            </h1>
            <nav className="regular-th" style={{ fontSize: "25px" }}>
              <Button                            
                outline
                color="danger"
                size="sm"
                onClick={this.handleClick}
              >
                <span
                  className="regular-th"
                  style={{ fontSize: "23px", fontWeight: "normal" }}
                >
                  เว็บไซต์หลัก
                </span>
              </Button>{" "}

              <Link to="/login">
                <Button outline color="danger" size="sm">
                  <span
                    className="regular-th"
                    style={{ fontSize: "23px", fontWeight: "normal" }}
                  >
                    ระบบการจัดการ{" "}
                    <span style={{ fontSize: "15px" }}>
                      (สำหรับเจ้าหน้าที่)
                    </span>
                  </span>
                </Button>{" "}
              </Link>
            </nav>
          </div>
        </header>
      </div>
    );
  }
}
