import React from "react";
import "assets/demo/login.css";
import { Link, withRouter } from "react-router-dom";
import { auth } from "../api/firebase";
import { Alert } from "reactstrap";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      currentUser: null,
      message: ""
    };
    this._isMounted = false;
  }
  componentDidMount() {
    this._isMounted = true;

    this._isMounted &&
      auth.onAuthStateChanged(user => {
        if (user) this._isMounted && this.setState({ currentUser: user });
        else this._isMounted && this.setState({ currentUser: null });

        //console.log(Object(this.state.currentUser))
        if (this.state.currentUser) {
          this.props.history.push("/admin/dashboard");
        } else {
          this.props.history.push("/login");
        }
      });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onChange = e => {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;

    this._isMounted &&
      auth
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          this.setState({ currentUser: response.user });
          this.props.history.push("/admin/dashboard");
        })
        .catch(error => {
          console.log(error);
          if (error.code === "auth/user-not-found") {
            this._isMounted &&
              this.setState({
                message:
                  "ไม่มีรายการที่ตรงกับบัญชีผู้ใช้ที่กับที่ระบุ บัญชีผู้ใช้อาจถูกลบออกจากระบบแล้ว"
              });
          }
          if (error.code === "auth/invalid-email") {
            this._isMounted &&
              this.setState({ message: "รูปแบบอีเมลไม่ถูกต้อง" });
          }
        });
  };

  render() {
    const message = this.state.message;
    return (
      <>
        <div className="full-height regular-th">
          <h3 className="title">
            {" "}
            องค์การบริหารส่วนตำบลกันตังใต้ อำเภอกันตัง จังหวัดตรัง{" "}
          </h3>

          <div className="cont">
            <div className="form">
              <form onSubmit={this.onSubmit}>
                <h1 className="label">ลงชื่อเข้าใช้</h1>
                <input
                  type="email"
                  className="user regular-th"
                  style={{ fontSize: "25px" }}
                  placeholder="email"
                  name="email"
                  autoComplete="off"
                  onChange={this.onChange}
                />
                <input
                  type="password"
                  className="pass regular-th"
                  style={{ fontSize: "25px" }}
                  placeholder="Password"
                  name="password"
                  autoComplete="off"
                  onChange={this.onChange}
                />
                <div style={{ fontSize: "20px", textAlign: "center" }}>
                  {message ? <p className="text-danger">{message}</p> : null}
                </div>
                <button
                  className="login regular-th"
                  style={{ fontSize: "25px" }}
                  type="submit"
                >
                  เข้าสู่ระบบ
                </button>
                <div style={{ textAlign: "center" }}>
                  <Link to="/home" style={{ color: "#3598dc" }}>
                    กลับสู่หน้าหลัก
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            width: "300px",
            right: "5px",
            top: "550px"
          }}
        >
          <Alert
            color="primary"
            className="regular-th"
            style={{ textAlign: "center", lineHeight: "150%" }}
          >
            <span style={{ fontSize: "25px", fontWeight: "bold" }}>
              <b>ประกาศ</b>
            </span>{" "}
            <br />
            ท่านสามารถเข้าชมระบบจัดการในสถานะ Guest <br />
            E-mail :
            <span style={{ fontSize: "30px" }}>
              <b> test@example.com</b>
            </span>{" "}
            <br /> Password :
            <span style={{ fontSize: "30px" }}>
              <b> 123456</b>
            </span>{" "}
          </Alert>
        </div>
      </>
    );
  }
}

export default withRouter(Login);
