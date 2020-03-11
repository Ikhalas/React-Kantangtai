import React, { createRef } from "react";
import { auth, db, storage } from "../api/firebase";
import { isMobile } from "react-device-detect";
import Select from "react-select";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Table,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner
} from "reactstrap";

const options = [
  { value: "Admin", label: "Admin" },
  { value: "Guest", label: "Guest" },
  { value: "Staff", label: "Staff" }
];

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      staffs: [],
      checkDeviceModal: false,
      isShown: "",
      isAddModalOpen: false,
      currentUser: "",

      emailCheck: true,
      staffIdCheck: true,
      inProgress: false,

      name: "",
      lastname: "",
      emailReg: "",
      passReg: "",
      staffId: "",
      selectedOption: null,

      imagePreviewUrl: "",
      haveImg: false
    };
    this._isMounted = false;
    this.scrollDiv = createRef();
    this._selectedFile = "";
    this._imgType = "";
  }
  componentDidMount() {
    isMobile && this.setState({ checkDeviceModal: true });
    this._isMounted = true;
    this._isMounted && this.getData();
    this._isMounted && this.getCurrentUser();
  }

  getCurrentUser() {
    auth.onAuthStateChanged(user => {
      user &&
        db
          .collection("users")
          .where("email", "==", user.email)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              this._isMounted &&
                this.setState({ currentUser: doc.data().role });
            });
            //console.log(this.state.currentUser);
          })
          .catch(error => console.log(error));
    });
  }

  getData() {
    db.collection("users")
      .orderBy("role")
      .get()
      .then(snapshot => {
        let staffs = [];
        let fristShow = [];
        snapshot.forEach(doc => {
          fristShow.push(doc.data());
          staffs.push(doc);
        });
        this._isMounted && this.setState({ staffs });
        this._isMounted && this.setState({ isShown: fristShow[0] });
        //console.log(this.state.isShown)
      })
      .catch(error => console.log(error));
  }

  generateStaffRows() {
    const staffs = this.state.staffs;
    return (
      staffs &&
      staffs.map(stf => (
        <tr
          key={stf.id}
          onClick={() => {
            this.setState({ isShown: stf.data() });
            this.scrollDiv.current.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <td>{stf.data().staffId}</td>
          <td>
            {stf.data().name}&nbsp;{stf.data().lastname}
          </td>
          <td>{stf.data().role}</td>
        </tr>
      ))
    );
  }

  toggleAddModal() {
    this.setState({ isAddModalOpen: !this.state.isAddModalOpen });
  }

  handleInputTextChange = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
    //console.log([e.target.name] + " ===> " + e.target.value);
  };

  handleSelectChange = selectedOption => {
    this.setState({ selectedOption });
    //console.log(`Option selected:`, selectedOption);
  };

  imgSelectedHandler = e => {
    this._selectedFile = e.target.files[0];
    this._imgType = this._selectedFile.type.replace("image/", "");

    let reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
        haveImg: true
      });
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  async handleSubmit(e) {
    e.preventDefault();
    const { emailReg, passReg, staffId, } = this.state;

    this.setState({ inProgress: true });
    this._isMounted &&
      (await db
        .collection("users")
        .where("email", "==", emailReg)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log("No matching documents. can submit");
            this.setState({ emailCheck: true }); //can submit
            return;
          }
          snapshot.forEach(doc => {
            let data = doc.data();
            console.log(emailReg + "|" + data.email + "can't submit");
            this.setState({ emailCheck: false, inProgress: false }); //can't submit
          });
        })
        .catch(error => console.log(error)));

    this._isMounted &&
      (await db
        .collection("users")
        .where("staffId", "==", staffId)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log("No matching documents. can submit");
            this.setState({ staffIdCheck: true }); //can submit
            return;
          }
          snapshot.forEach(doc => {
            let data = doc.data();
            console.log(staffId + "|" + data.staffId + "can't submit");
            this.setState({ staffIdCheck: false, inProgress: false }); //can't submit
          });
        })
        .catch(error => console.log(error)));


        
    if (this.state.emailCheck && this.state.staffIdCheck) {
    
      auth.createUserWithEmailAndPassword(emailReg, passReg).then(() => {
        //upload img
        const uploadTask = storage
          .ref(`imgs/${this.state.staffId}(${this.state.name})`)
          .put(this._selectedFile);
        uploadTask.on(
          "state_changed",
          snapshot => {
            /*progress function */
          },
          error => {
            console.log(error);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(url => {
              const dataUpload = {
                name: this.state.name,
                lastname: this.state.lastname,
                email: this.state.emailReg,
                staffId: this.state.staffId,
                role: this.state.selectedOption.label,
                img: url
              };
              db.collection("users")
                .add(dataUpload)
                .then(() => {
                  console.log("Upload complete !!");
                  this.setState({ inProgress: false });
                  window.location.reload();
                });
            });
          }
        );
      })
    }
    else{
      
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  render() {
    const { isShown, currentUser, isAddModalOpen } = this.state;
    const {
      emailCheck,
      staffIdCheck,
      imagePreviewUrl,
      haveImg,
      inProgress
    } = this.state;
    const {
      name,
      lastname,
      emailReg,
      passReg,
      staffId,
      selectedOption
    } = this.state;
    return (
      <>
        <div ref={this.scrollDiv}></div>
        <div className="content regular-th">
          <Row>
            <Col md="5">
              <Card className="card-user">
                <div className="image">
                  <img
                    alt="..."
                    src={require("assets/img/damir-bosnjak.jpg")}
                  />
                </div>
                <CardBody>
                  <div className="author">
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar border-gray"
                        src={isShown.img}
                      />
                      <h5 className="title">
                        {isShown.name} {isShown.lastname}
                      </h5>
                    </a>
                    <p className="description">
                      รหัสพนักงาน : {isShown.staffId}
                    </p>
                  </div>
                  <p className="description text-center">
                    ตำแหน่ง : {isShown.role}
                  </p>
                </CardBody>
                <CardFooter>
                  <hr />
                </CardFooter>
              </Card>

              <Card>
                <CardBody>
                  {currentUser === "Admin" ? (
                    <div className="button-container">
                      <Button
                        className="regular-th btn-round"
                        style={{
                          fontWeight: "normal",
                          fontSize: "30px",
                          width: "100%"
                        }}
                        outline
                        color="primary"
                        size="sm"
                        onClick={() => this.toggleAddModal()}
                      >
                        <i
                          className="nc-icon nc-badge"
                          style={{ fontSize: "40px" }}
                        ></i>
                        <br />
                        เพิ่มผู้มีสิทธิ์เข้าสู่ระบบ
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="text-danger"
                        style={{ fontSize: "18px" }}
                      >
                        สิทธ์ของท่านไม่เพียงพอ เฉพาะ Admin เท่านั้น
                      </span>
                      <div className="button-container">
                        <Button
                          className="regular-th btn-round"
                          style={{
                            fontWeight: "normal",
                            fontSize: "30px",
                            width: "100%"
                          }}
                          color="secondary"
                          size="sm"
                          disabled
                        >
                          <i
                            className="nc-icon nc-badge"
                            style={{ fontSize: "40px" }}
                          ></i>
                          <br />
                          เพิ่มผู้มีสิทธิ์เข้าสู่ระบบ
                        </Button>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>

            <Col md="7">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h4" style={{ color: "#66615b" }}>
                    รายชื่อผู้มีสิทธิ์เข้าระบบทั้งหมด
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive hover>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ fontSize: "25px" }}>รหัสพนักงาน</th>
                        <th style={{ fontSize: "25px" }}>ชื่อ-นามสกุล</th>
                        <th style={{ fontSize: "25px" }}>ตำแหน่ง</th>
                      </tr>
                    </thead>
                    <tbody>{this.generateStaffRows()}</tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        <Modal
          style={{ width: "100%" }}
          isOpen={isAddModalOpen}
          toggle={() => this.toggleAddModal()}
          className="regular-th"
        >
          <ModalHeader toggle={() => this.toggleAddModal()}>
            เพิ่มผู้มีสิทธิ์เข้าสู่ระบบ
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col md="12">
                  {" "}
                  <div>
                    {imagePreviewUrl ? (
                      <div style={{ width: "100%", textAlign: "center" }}>
                        <img src={imagePreviewUrl} alt="icon" width="200" />{" "}
                        <Button
                          className="regular-th"
                          size="sm"
                          outline
                          color="danger"
                          onClick={() =>
                            this.setState(
                              { imagePreviewUrl: "", haveImg: false },
                              () => {
                                this._selectedFile = "";
                              }
                            )
                          }
                          style={{
                            position: "absolute",
                            top: "0px",
                            right: "10px",
                            fontWeight: "normal"
                          }}
                        >
                          ยกเลิก
                        </Button>
                      </div>
                    ) : (
                      <>
                        <label
                          className="regular-th"
                          style={{ color: "#66615b", fontSize: "25px" }}
                        >
                          กดเลือกรูปภาพหรือลากมาวางในกรอบ{" "}
                          <span style={{ fontSize: "18px", color: "red" }}>
                            *เฉพาะไฟล์นามสกุล png, gif, jpeg, jpg
                          </span>
                        </label>

                        <input
                          type="file"
                          onChange={this.imgSelectedHandler}
                          accept="image/x-png,image/gif,image/jpeg"
                          className="regular-th"
                          style={{
                            width: "100%",
                            height: "100px",
                            border: "dashed #adb5bd 2px",
                            backgroundColor: "rgba(255,255,255,.8)",
                            textAlign: "center"
                          }}
                        />
                      </>
                    )}
                  </div>
                  <br />
                </Col>
              </Row>
              <Row>
                <Col md="6" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>
                      ชื่อ
                    </label>
                    <Input
                      type="text"
                      className="regular-th"
                      style={{ fontSize: "23px" }}
                      name="name"
                      onChange={this.handleInputTextChange}
                    />
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>
                      นามสกุล
                    </label>
                    <Input
                      type="text"
                      style={{ fontSize: "23px" }}
                      className="regular-th"
                      name="lastname"
                      onChange={this.handleInputTextChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="7" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>
                      อีเมล
                    </label>
                    <Input
                      type="email"
                      className="regular-th"
                      style={{ fontSize: "23px" }}
                      name="emailReg"
                      onChange={this.handleInputTextChange}
                    />
                    {!emailCheck ? (
                      <>
                        {" "}
                        <span style={{ fontSize: "18px", color: "red" }}>
                          e-mail นี้ถูกใช้งานแล้ว
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                  </FormGroup>
                </Col>
                <Col md="5" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>
                      รหัสผ่าน
                    </label>
                    <Input
                      type="password"
                      style={{ fontSize: "23px" }}
                      className="regular-th"
                      name="passReg"
                      onChange={this.handleInputTextChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="5" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>
                      รหัสพนักงาน
                    </label>
                    <Input
                      type="text"
                      className="regular-th"
                      style={{ fontSize: "23px" }}
                      name="staffId"
                      onChange={this.handleInputTextChange}
                    />
                    {!staffIdCheck ? (
                      <>
                        {" "}
                        <span style={{ fontSize: "18px", color: "red" }}>
                          รหัสพนักงาน นี้ถูกใช้งานแล้ว
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                  </FormGroup>
                </Col>
                <Col md="7" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>
                      ตำแหน่ง
                    </label>
                    <Select
                      value={selectedOption}
                      onChange={this.handleSelectChange}
                      options={options}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>

          <ModalFooter>
            {!haveImg ||
            !name ||
            !lastname ||
            !emailReg ||
            !passReg ||
            !staffId ||
            !selectedOption ? (
              <>
                <span style={{ fontSize: "18px", color: "red" }}>
                  กรุณาเลือกรูปภาพและกรอกข้อมูลให้ครบถ้วน&nbsp;&nbsp;&nbsp;
                </span>
              </>
            ) : (
              <> </>
            )}
            <Button
              className="btn-round regular-th"
              size="sm"
              outline
              color="secondary"
              onClick={() => this.toggleAddModal()}
              style={{
                fontSize: "25px",
                fontWeight: "normal",
                backgroundColor: "#f8f9fa",
                color: "gray"
              }}
              disabled={inProgress}
            >
              &nbsp;&nbsp;ยกเลิก&nbsp;&nbsp;
            </Button>
            &nbsp;&nbsp;
            <Button
              className="btn-round regular-th"
              size="sm"
              color="info"
              style={{ fontSize: "25px", fontWeight: "normal" }}
              onClick={this.handleSubmit.bind(this)}
              disabled={
                !haveImg ||
                !name ||
                !lastname ||
                !emailReg ||
                !passReg ||
                !staffId ||
                !selectedOption ||
                inProgress
              }
            >
              {inProgress ? (
                <>
                  &nbsp;&nbsp;<Spinner color="secondary" /> &nbsp;&nbsp;
                </>
              ) : (
                <>&nbsp;&nbsp;ยืนยัน&nbsp;&nbsp;</>
              )}
            </Button>
            &nbsp;&nbsp;
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.checkDeviceModal}
          toggle={() => {
            this.setState({ checkDeviceModal: false });
          }}
        >
          <ModalHeader
            className="regular-th"
            toggle={() => {
              this.setState({ checkDeviceModal: false });
            }}
          >
            แจ้งเตือน
          </ModalHeader>
          <ModalBody className="regular-th">
            ปรับอุปกรณ์ของท่านเป็นแนวนอน เพื่อการแสดงผลตารางที่ชัดเจนและครบถ้วน
          </ModalBody>
          <ModalFooter>
            <Button
              type="submit"
              className="btn-round regular-th"
              size="sm"
              color="primary"
              onClick={() => {
                this.setState({ checkDeviceModal: false });
              }}
              style={{ fontSize: "25px", fontWeight: "normal" }}
            >
              &nbsp;&nbsp; ยืนยัน &nbsp;&nbsp;
            </Button>
            &nbsp;&nbsp;
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default User;
