import React from "react";
import { auth, db } from "../api/firebase";
import { isMobile } from "react-device-detect";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner
} from "reactstrap";

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      detailModal: false,
      confirmModal: false,
      detailToModal: "",
      detailToConfirmModal: "",
      buttonEnable: false,
      checkDeviceModal: false,
      currentUser: ""
    };
    this._isMounted = false;
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
            //console.log(this.state.currentUser)
          })
          .catch(error => console.log(error));
    });
  }

  getData() {
    db.collection("requests")
      .orderBy("No")
      .get()
      .then(snapshot => {
        let requests = [];
        snapshot.forEach(doc => {
          //let data = doc.data()
          requests.push(doc.data());
        });
        this._isMounted && this.setState({ requests });
        //console.log(this.state.requests)
      })
      .catch(error => console.log(error));
  }

  generateRequestsRows() {
    const requests = this.state.requests;

    const filtered = requests.filter(request => {
      return request.status === false;
    });
    return (
      filtered &&
      filtered.map(fil => (
        <tr key={fil.id}>
          <td style={{ textAlign: "center" }}>#{fil.No}</td>
          <td style={{ textAlign: "center" }}>
            {fil.name}&nbsp;{fil.lastname}
          </td>
          <td style={{ textAlign: "center" }}>
            {this.statusLabel(fil.status, fil)}
          </td>
          <td className="text-right">
            {this.proceedLabel(fil.status, fil)}&nbsp;&nbsp;
          </td>
        </tr>
      ))
    );
  }

  statusLabel(status, detail) {
    if (status === false) {
      return (
        <Button
          className="regular-th"
          style={{ fontSize: "20px", fontWeight: "normal", width: "150px" }}
          size="sm"
          outline
          color="info"
          onClick={() => this.toggleDetailModal(detail)}
        >
          ดูรายละเอียด
        </Button>
      );
    } else return null;
  }

  proceedLabel(status, detail) {
    //console.log(this.state.currentUser)
    let isDisable = false;
    this.state.currentUser === "Guest"
      ? (isDisable = true)
      : (isDisable = false);
    //console.log(isDisable)
    if (status === false) {
      return (
        <Button
          className={isDisable ? "regular-th text-white" : "regular-th"}
          style={{ fontSize: "20px", fontWeight: "normal", width: "250px" }}
          size="sm"
          outline
          color={isDisable ? "secondary" : "success"}
          onClick={() => this.toggleConfirmModal(detail)}
          disabled={isDisable}
        >
          <i className="nc-icon nc-check-2"></i>
          &nbsp;ทำเครื่องหมายว่าดำเนินการเสร็จสิ้น
        </Button>
      );
    } else return null;
  }

  updateToDatabase(requestNo) {
    this.setState({ buttonEnable: true });
    let id = "";
    const newData = {
      status: true,
      successful: this.getCurrentDate()
    };

    db.collection("requests")
      .where("No", "==", requestNo)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          id = doc.id;
        });
        //console.log(id)
        db.collection("requests")
          .doc(id)
          .update(newData)
          .then(() => {
            this.setState({ buttonEnable: false }, () => {
              window.location.reload();
            });
          });
      })
      .catch(error => console.log(error));
  }

  getCurrentDate() {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear() + 543;
    return `${date}/${month < 10 ? `0${month}` : `${month}`}/${year}`;
  }

  toggleDetailModal = detailToModal => {
    this.setState({ detailModal: !this.state.detailModal }, () => {
      if (this.state.detailModal) this.setState({ detailToModal });
    });
  };

  toggleConfirmModal = detailToConfirmModal => {
    this.setState({ confirmModal: !this.state.confirmModal }, () => {
      if (this.state.confirmModal) this.setState({ detailToConfirmModal });
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const detailToModal = this.state.detailToModal;
    const confirmDetail = this.state.detailToConfirmModal;
    return (
      <>
        <div className="content regular-th">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4" style={{ color: "#66615b" }}>
                    รายการคำร้องขอทั้งหมดที่อยู่ในสถานะรอดำเนินการ
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Table>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ fontSize: "25px", textAlign: "center" }}>
                          ลำดับ
                        </th>
                        <th style={{ fontSize: "25px", textAlign: "center" }}>
                          ชื่อ-นามสกุล
                        </th>
                        <th style={{ fontSize: "25px", textAlign: "center" }}>
                          รายละเอียด
                        </th>
                        <th className="text-right" style={{ fontSize: "25px" }}>
                          {this.state.currentUser === "Guest" ? (
                            <>
                              <span
                                className="text-danger"
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "normal"
                                }}
                              >
                                สิทธ์ของท่านไม่เพียงพอ เฉพาะ Admin หรือ Staff
                                เท่านั้น
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>{this.generateRequestsRows()}</tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        <Modal
          isOpen={this.state.detailModal}
          toggle={this.toggleDetailModal}
          style={{ overlay: { zIndex: 2000 } }}
          backdrop="static"
        >
          <ModalHeader toggle={this.toggleDetailModal} className="regular-th">
            รายละเอียดคำร้องขอ
          </ModalHeader>

          <ModalBody>
            <div className="box-body regular-th">
              {detailToModal.status === true ? (
                <div
                  style={{
                    backgroundColor: "#6bd098",
                    padding: "8px 10px 8px 20px",
                    color: "white"
                  }}
                >
                  <span style={{ fontSize: "25px" }}>
                    <b>
                      สถานะการดำเนินการ&nbsp;
                      <span style={{ fontSize: "35px" }}>ดำเนินการแล้ว</span>
                    </b>
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: "#fbc658",
                    padding: "8px 10px 8px 20px",
                    color: "white"
                  }}
                >
                  <span style={{ fontSize: "25px" }}>
                    <b>
                      สถานะการดำเนินการ&nbsp;
                      <span style={{ fontSize: "35px" }}>รอการดำเนินการ</span>
                    </b>
                  </span>
                </div>
              )}
              <span style={{ fontWeight: "bold" }}>คำขอลำดับที่</span> :{" "}
              <b style={{ fontSize: "25px" }}>#{detailToModal.No}</b>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span style={{ fontWeight: "bold" }}>วันที่ยื่นคำขอ</span> :{" "}
              <b style={{ fontSize: "25px" }}>{detailToModal.date}</b>
              <br />
              <span style={{ fontWeight: "bold" }}>
                เลขประจำตัวประชาชน
              </span> : <b style={{ fontSize: "25px" }}>{detailToModal.id}</b>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <br />
              <span style={{ fontWeight: "bold" }}>ชื่อ-นามสกุล</span> :{" "}
              <b style={{ fontSize: "25px" }}>
                {detailToModal.name}&nbsp;&nbsp;{detailToModal.lastname}
              </b>
              <br />
              <span style={{ fontWeight: "bold" }}>เบอร์ติดต่อ</span> :{" "}
              <b style={{ fontSize: "25px" }}>{detailToModal.tel}</b>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span style={{ fontWeight: "bold" }}>อีเมล</span> :{" "}
              <b style={{ fontSize: "25px" }}>
                {detailToModal.email === "" ? "-" : detailToModal.email}
              </b>
              <br />
              <span style={{ fontWeight: "bold" }}>
                รายละเอียดเพิ่มเติม
              </span> :{" "}
              <b style={{ fontSize: "25px" }}>
                {detailToModal.note === "" ? "-" : detailToModal.note}
              </b>
              <br />
              <span style={{ fontWeight: "bold" }}>ที่อยู่</span> : &nbsp;
              <b style={{ fontSize: "20px" }}>
                บ้านเลขที่&nbsp;
                <b style={{ fontSize: "25px" }}>{detailToModal.address}</b>
                &nbsp; หมู่ที่&nbsp;
                <b style={{ fontSize: "25px" }}>{detailToModal.moo}</b>
                &nbsp;&nbsp;
                {detailToModal.soi === "" ? null : (
                  <span>
                    ซอย<b style={{ fontSize: "25px" }}>{detailToModal.soi}</b>
                    &nbsp;&nbsp;
                  </span>
                )}
                {detailToModal.road === "" ? null : (
                  <span>
                    ถนน<b style={{ fontSize: "25px" }}>{detailToModal.road}</b>
                    &nbsp;&nbsp;
                  </span>
                )}
                ต.กันตังใต้&nbsp;&nbsp;อ.กันตัง&nbsp;&nbsp;จ.ตรัง
              </b>
            </div>
          </ModalBody>
          <ModalFooter>
            {detailToModal.location && (
              <a
                href={
                  "https://www.google.com/maps/search/?api=1&query=" +
                  detailToModal.lat +
                  "," +
                  detailToModal.lng
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className="regular-th btn-round"
                  style={{ fontWeight: "normal", fontSize: "20px" }}
                  outline
                  color="info"
                  size="sm"
                >
                  ตำแหน่งบน Google Map
                </Button>
              </a>
            )}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              className="btn-round regular-th"
              size="sm"
              color="info"
              onClick={() => {
                this.toggleDetailModal();
              }}
              style={{ fontSize: "25px", fontWeight: "normal" }}
            >
              &nbsp;&nbsp;ตกลง&nbsp;&nbsp;
            </Button>
            &nbsp;&nbsp;
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.confirmModal}
          toggle={this.toggleConfirmModal}
          style={{ overlay: { zIndex: 2000 } }}
          backdrop="static"
        >
          <ModalHeader toggle={this.toggleConfirmModal} className="regular-th">
            ดำเนินการเสร็จสิ้น
          </ModalHeader>

          <ModalBody>
            <div className="box-body regular-th">
              <div
                style={{
                  backgroundColor: "#6bd098",
                  padding: "8px 10px 8px 20px",
                  color: "white"
                }}
              >
                <span style={{ fontSize: "20px" }}>
                  <b>
                    เปลี่ยนสถานะของ&nbsp;
                    <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                      "คำขอลำดับที่&nbsp;#{confirmDetail.No}"
                    </span>
                    &nbsp;เป็น&nbsp;
                    <span style={{ fontSize: "30px", fontWeight: "bold" }}>
                      ดำเนินการเสร็จสิ้น
                    </span>
                  </b>
                </span>
              </div>
              <br />
              <span style={{ fontWeight: "bold" }}>คำขอลำดับที่</span> :{" "}
              <b style={{ fontSize: "25px" }}>#{confirmDetail.No}</b>
              <br />
              <span style={{ fontWeight: "bold" }}>
                เลขประจำตัวประชาชน
              </span> : <b style={{ fontSize: "25px" }}>{confirmDetail.id}</b>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <br />
              <span style={{ fontWeight: "bold" }}>ชื่อ-นามสกุล</span> :{" "}
              <b style={{ fontSize: "25px" }}>
                {confirmDetail.name}&nbsp;&nbsp;{confirmDetail.lastname}
              </b>
              <br />
              <span style={{ fontWeight: "bold" }}>ที่อยู่</span> : &nbsp;
              <b style={{ fontSize: "20px" }}>
                บ้านเลขที่&nbsp;
                <b style={{ fontSize: "25px" }}>{confirmDetail.address}</b>
                &nbsp; หมู่ที่&nbsp;
                <b style={{ fontSize: "25px" }}>{confirmDetail.moo}</b>
                &nbsp;&nbsp;
                {confirmDetail.soi === "" ? null : (
                  <span>
                    ซอย<b style={{ fontSize: "25px" }}>{confirmDetail.soi}</b>
                    &nbsp;&nbsp;
                  </span>
                )}
                {confirmDetail.road === "" ? null : (
                  <span>
                    ถนน<b style={{ fontSize: "25px" }}>{confirmDetail.road}</b>
                    &nbsp;&nbsp;
                  </span>
                )}
                ต.กันตังใต้&nbsp;&nbsp;อ.กันตัง&nbsp;&nbsp;จ.ตรัง
              </b>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="btn-round regular-th"
              size="sm"
              outline
              color="secondary"
              onClick={this.toggleConfirmModal}
              disabled={this.state.buttonEnable}
              style={{
                fontSize: "25px",
                fontWeight: "normal",
                backgroundColor: "#f8f9fa",
                color: "gray"
              }}
            >
              &nbsp;&nbsp;ยกเลิก&nbsp;&nbsp;
            </Button>
            &nbsp;&nbsp;
            <Button
              type="submit"
              className="btn-round regular-th"
              size="sm"
              color="success"
              onClick={() => {
                this.updateToDatabase(confirmDetail.No);
              }}
              style={{ fontSize: "25px", fontWeight: "normal" }}
              disabled={this.state.buttonEnable}
            >
              &nbsp;&nbsp;
              {this.state.buttonEnable ? (
                <>
                  <Spinner color="light" />
                </>
              ) : (
                <>ยืนยัน</>
              )}
              &nbsp;&nbsp;
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

export default Notifications;
