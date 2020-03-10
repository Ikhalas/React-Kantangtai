import React from "react";
import { auth, db } from '../assets/config/firebase'
import { isMobile } from "react-device-detect";
import Select from 'react-select';

// reactstrap components
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
  Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";

const options = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Guest', label: 'Guest' },
  { value: 'User', label: 'User' },
];

class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      staffs: [],
      isShown: '',
      isAddModalOpen: false,
      selectedOption: null,
    }
    this._isMounted = false

  }
  componentDidMount() {
    if (isMobile) {
      alert("ปรับอุปกรณ์ของท่านเป็นแนวนอน เพื่อการแสดงตารางที่ชัดเจนและครบถ้วน")
    }
    this._isMounted = true
    this._isMounted && this.getData();
    this._isMounted && this.getCurrentUser();
  }

  getCurrentUser() {
    auth.onAuthStateChanged(user => {
      user && db.collection('users').where('authId', '==', user.uid).get().then(snapshot => {
        snapshot.forEach(doc => {
          this._isMounted && this.setState({ currentUser: doc.data().role })
        })
        //console.log(this.state.currentUser)
      }).catch(error => console.log(error))
    })
  }

  getData() {
    db.collection('users').orderBy('No').get().then(snapshot => {
      let staffs = []
      let fristShow = []
      snapshot.forEach(doc => {
        fristShow.push(doc.data())
        staffs.push(doc)
      })
      this._isMounted && this.setState({ staffs })
      this._isMounted && this.setState({ isShown: fristShow[0] })
      //console.log(this.state.isShown)
    }).catch(error => console.log(error))
  }

  generateStaffRows() {
    const staffs = this.state.staffs
    return (
      staffs && staffs.map(stf => (
        <tr key={stf.id} onClick={() => this.setState({ isShown: stf.data() })}>
          <td>{stf.data().staffId}</td>
          <td>{stf.data().name}&nbsp;{stf.data().lastname}</td>
          <td>{stf.data().role}</td>
        </tr>

      ))
    )
  }

  toggleAddModal() {
    this.setState({ isAddModalOpen: !this.state.isAddModalOpen })
  }

  handleSelectChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  render() {
    const { isShown, currentUser, isAddModalOpen, selectedOption } = this.state
    return (
      <>
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
                      <h5 className="title">{isShown.name} {isShown.lastname}</h5>
                    </a>
                    <p className="description">รหัสพนักงาน : {isShown.staffId}</p>
                  </div>
                  <p className="description text-center">
                    ตำแหน่ง : {isShown.role}
                  </p>
                </CardBody>
                <CardFooter>
                  <hr />

                  {currentUser === 'Admin' ?
                    <div className="button-container">
                      <Button
                        className="regular-th btn-round"
                        style={{ fontWeight: 'normal', fontSize: '20px', width: '100%' }}
                        outline color="info"
                        size="sm"
                        onClick={() => console.log(isShown.staffId)}
                      >
                        แก้ไข
                   </Button>
                    </div>
                    :
                    <>
                      <span className="text-danger" style={{ fontSize: '18px' }}>สิทธ์ของท่านไม่เพียงพอ เฉพาะ Admin เท่านั้น</span>
                      <div className="button-container">
                        <Button
                          className="regular-th btn-round"
                          style={{ fontWeight: 'normal', fontSize: '20px', width: '100%' }}
                          color="secondary"
                          size="sm"
                          disabled
                        >
                          แก้ไข
                   </Button>
                      </div>
                    </>
                  }
                </CardFooter>
              </Card>

              <Card>
                <CardBody>
                  {currentUser === 'Admin' ?
                    <div className="button-container">
                      <Button
                        className="regular-th btn-round"
                        style={{ fontWeight: 'normal', fontSize: '30px', width: '100%' }}
                        outline color="primary"
                        size="sm"
                        onClick={() => this.toggleAddModal()}
                      >
                        <i className="nc-icon nc-badge" style={{ fontSize: "40px" }}></i><br />เพิ่มผู้มีสิทธิ์เข้าสู่ระบบ
                   </Button>
                    </div>
                    :
                    <>
                      <span className="text-danger" style={{ fontSize: '18px' }}>สิทธ์ของท่านไม่เพียงพอ เฉพาะ Admin เท่านั้น</span>
                      <div className="button-container">
                        <Button
                          className="regular-th btn-round"
                          style={{ fontWeight: 'normal', fontSize: '30px', width: '100%' }}
                          color="secondary"
                          size="sm"
                          disabled
                        >
                          <i className="nc-icon nc-badge" style={{ fontSize: "40px" }}></i><br />เพิ่มผู้มีสิทธิ์เข้าสู่ระบบ
                   </Button>
                      </div>
                    </>
                  }
                </CardBody>
              </Card>

            </Col>

            <Col md="7">
              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h4" style={{ color: '#66615b' }}>รายชื่อผู้มีสิทธิ์เข้าระบบทั้งหมด</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive hover>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ fontSize: '25px' }}>รหัสพนักงาน</th>
                        <th style={{ fontSize: '25px' }}>ชื่อ-นามสกุล</th>
                        <th style={{ fontSize: '25px' }}>ตำแหน่ง</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.generateStaffRows()}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        <Modal isOpen={isAddModalOpen} toggle={() => this.toggleAddModal()} className="regular-th" style={{ width: '80%' }}>
          <ModalHeader toggle={() => this.toggleAddModal()}>เพิ่มผู้มีสิทธิ์เข้าสู่ระบบ</ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col md="6" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>ชื่อ</label>
                    <Input
                      type="text"
                      className="regular-th"
                      style={{ fontSize: "23px" }}
                      name="name"
                    />
                  </FormGroup>

                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>นามสกุล</label>
                    <Input
                      type="text"
                      style={{ fontSize: "23px" }}
                      className="regular-th"
                      name="lastname"


                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="12" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>อีเมล</label>
                    <Input
                      type="email"
                      className="regular-th"
                      style={{ fontSize: "23px" }}
                      name="email"
                    />
                  </FormGroup>

                </Col>
                <Col md="12" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>รหัสผ่าน</label>
                    <Input
                      type="password"
                      style={{ fontSize: "23px" }}
                      className="regular-th"
                      name="password"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="6" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>รหัสพนักงาน</label>
                    <Input
                      type="text"
                      className="regular-th"
                      style={{ fontSize: "23px" }}
                      name="staffId"
                    />
                  </FormGroup>

                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <label style={{ fontSize: "23px", color: "black" }}>ตำแหน่ง</label>
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
            <Button
              style={{ fontWeight: 'normal' }}
              className="btn-round regular-th"
              color="primary"
              onClick={() => this.toggleAddModal()}>&nbsp;&nbsp;ยืนยัน&nbsp;&nbsp;
            </Button>&nbsp;&nbsp;
            <Button
              style={{ fontWeight: 'normal' }}
              className="btn-round regular-th"
              color="secondary"
              onClick={() => this.toggleAddModal()}>&nbsp;&nbsp;ยกเลิก&nbsp;&nbsp;
            </Button>
          </ModalFooter>

        </Modal>
      </>
    );
  }
}

export default User;
