import React from "react";
import { auth, db } from "../../api/firebase";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  CardBody,
  CardFooter,
  Card,
  Container,
  Button
} from "reactstrap";

import routes from "routes.js";
import "assets/demo/DemoNavbar.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      dropdownOpen: false,
      currentUser: "",
      userId: "",
      userDetail: "",
      color: "transparent"
    };
    this._isMounted = false;

    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.sidebarToggle = React.createRef();
  }
  toggle() {
    if (this.state.isOpen) {
      this.setState({
        color: "transparent"
      });
    } else {
      this.setState({
        color: "dark"
      });
    }
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  dropdownToggle(e) {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }
  getBrand() {
    let brandName = "Default Brand";
    routes.map((prop, key) => {
      if (window.location.href.indexOf(prop.layout + prop.path) !== -1) {
        brandName = prop.name;
      }
      return null;
    });
    return brandName;
  }
  openSidebar() {
    document.documentElement.classList.toggle("nav-open");
    this.sidebarToggle.current.classList.toggle("toggled");
  }
  // function that adds color dark/transparent to the navbar on resize (this is for the collapse)
  updateColor() {
    if (window.innerWidth < 993 && this.state.isOpen) {
      this.setState({
        color: "dark"
      });
    } else {
      this.setState({
        color: "transparent"
      });
    }
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateColor.bind(this));
    this._isMounted = true;
    this._isMounted && this.getUid();
  }

  getUid() {
    auth.onAuthStateChanged(user => {
      if (user) this._isMounted && this.setState({ currentUser: user });
      else this._isMounted && this.setState({ currentUser: null });

      //console.log(this.state.currentUser.email)
      this.state.currentUser && this.getUser(this.state.currentUser.email);
    });
  }

  getUser(email) {
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          //console.log(doc.id, '=>', doc.data());
          this._isMounted && this.setState({ userDetail: doc.data() });
        });
        //console.log("userDetail |" + this.state.userDetail.name)
      })
      .catch(error => console.log(error));
  }

  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      this.sidebarToggle.current.classList.toggle("toggled");
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const userDetail = this.state.userDetail;
    return (
      // add or remove classes depending if we are on full-screen-maps page or not
      <Navbar
        color={
          this.props.location.pathname.indexOf("full-screen-maps") !== -1
            ? "dark"
            : this.state.color
        }
        expand="lg"
        className={
          this.props.location.pathname.indexOf("full-screen-maps") !== -1
            ? "navbar-absolute fixed-top"
            : "navbar-absolute fixed-top " +
              (this.state.color === "transparent" ? "navbar-transparent " : "")
        }
      >
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-toggle">
              <button
                type="button"
                ref={this.sidebarToggle}
                className="navbar-toggler"
                onClick={() => this.openSidebar()}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand className="regular-th" style={{ fontSize: "30px" }}>
              {this.getBrand()}
            </NavbarBrand>
          </div>
          <NavbarToggler onClick={this.toggle}>
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
            <span className="navbar-toggler-bar navbar-kebab" />
          </NavbarToggler>

          {userDetail && (
            <>
              <Collapse
                isOpen={this.state.isOpen}
                navbar
                className="justify-content-end"
              >
                {userDetail.role === "Admin" ? (
                  <span
                    className="text-info regular-th"
                    style={{ fontWeight: "bold", fontSize: "22px" }}
                  >
                    (Administrator)
                  </span>
                ) : null}
                &nbsp;&nbsp;
                <span className="regular-th">
                  {userDetail.name}&nbsp;&nbsp;{userDetail.lastname}&nbsp;
                </span>
                <Nav navbar>
                  <Dropdown
                    nav
                    isOpen={this.state.dropdownOpen}
                    toggle={e => this.dropdownToggle(e)}
                  >
                    <DropdownToggle caret nav>
                      <img
                        alt="..."
                        src={userDetail.img}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%"
                        }}
                      />
                      &nbsp;&nbsp;
                      <p>
                        <span className="d-lg-none d-md-block">
                          &nbsp;{userDetail.name} {userDetail.lastname}
                          &nbsp;&nbsp;
                        </span>
                      </p>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <Card className="card-user">
                        <div className="image">
                          <img
                            alt="..."
                            src={require("assets/img/damir-bosnjak.jpg")}
                          />
                        </div>
                        <CardBody style={{ textAlign: "center" }}>
                          <div className="regular-th cardBody">
                            <div className="author">
                              <img
                                alt="..."
                                className="avatar border-gray"
                                src={userDetail.img}
                                style={{ borderRadius: "50%" }}
                              />
                            </div>
                            <hr />
                            <p className="title" style={{ fontSize: "30px" }}>
                              {userDetail.name} {userDetail.lastname}
                            </p>
                            <br />
                            <p className="title" style={{ fontSize: "25px" }}>
                              รหัสพนักงาน : {userDetail.staffId}
                            </p>
                            <br />
                            <p className="title" style={{ fontSize: "20px" }}>
                              ตำแหน่ง : {userDetail.role}
                            </p>
                          </div>
                        </CardBody>
                        <CardFooter>
                          <hr />
                          <div className="button-container">
                            <Button
                              className="regular-th btn-round"
                              style={{
                                fontWeight: "normal",
                                fontSize: "20px",
                                width: "100%"
                              }}
                              outline
                              color="danger"
                              size="sm"
                              onClick={() =>
                                auth.signOut().then(res => {
                                  this.props.history.push("/login");
                                })
                              }
                            >
                              ออกจากระบบ
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </DropdownMenu>
                  </Dropdown>
                </Nav>
              </Collapse>
              &nbsp;&nbsp;
            </>
          )}
        </Container>
      </Navbar>
    );
  }
}

export default Header;
