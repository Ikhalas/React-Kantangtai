import React from "react";
import { db } from "../api/firebase";
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
  ModalHeader
} from "reactstrap";

class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkDeviceModal: false,
      requests: [],
      detailModal: false,
      currentUser: "",
      detailToModal: ""
    };
    this._isMounted = false;
  }

  componentDidMount() {
    isMobile && this.setState({ checkDeviceModal: true });
    this._isMounted = true;
    this._isMounted && this.getData();
  }

  getData() {
    db.collection("requests")
      .orderBy("No")
      .get()
      .then(snapshot => {
        let requests = [];
        snapshot.forEach(doc => {
          //let data = doc.data()
          requests.push(doc);
        });
        this._isMounted && this.setState({ requests });
        //console.log(this.state.requests)
      })
      .catch(error => console.log(error));
  }

  generateRequestsRows() {
    const requests = this.state.requests;
    return (
      requests &&
      requests.map(req => (
        <tr key={req.id}>
          <td style={{ textAlign: "center" }}>#{req.data().No}</td>
          <td style={{ textAlign: "center" }}>
            {req.data().name}&nbsp;{req.data().lastname}
          </td>
          <td style={{ textAlign: "center" }}>
            {req.data().address}&nbsp;&nbsp; หมู่ที่&nbsp;{req.data().moo}
            &nbsp;&nbsp;
            {req.data().soi === "" ? null : <span>ซอย{req.data().soi}</span>}
            &nbsp;&nbsp;
            {req.data().road === "" ? null : <span>ถนน{req.data().road}</span>}
          </td>
          <td className="text-right">
            {this.statusLabel(req.data().status, req.data())}&nbsp;&nbsp;
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
          color="warning"
          onClick={() => this.toggleDetailModal(detail)}
        >
          รอการดำเนินการ
        </Button>
      );
    } else if (status === true) {
      return (
        <Button
          className="regular-th"
          style={{ fontSize: "20px", fontWeight: "normal", width: "150px" }}
          size="sm"
          outline
          color="success"
          onClick={() => this.toggleDetailModal(detail)}
        >
          ดำเนินการเสร็จสิ้น
        </Button>
      );
    } else return null;
  }

  toggleDetailModal = detailToModal => {
    this.setState({ detailModal: !this.state.detailModal }, () => {
      if (this.state.detailModal) this.setState({ detailToModal });
    });
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const detailToModal = this.state.detailToModal;
    return (
      <>
        <div className="content regular-th">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4" style={{ color: "#66615b" }}>
                    รายการคำร้องขอทั้งหมด
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Table>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ fontSize: "25px", textAlign: "center" }}>ลำดับ</th>
                        <th style={{ fontSize: "25px", textAlign: "center" }}>ชื่อ-นามสกุล</th>
                        <th style={{ fontSize: "25px", textAlign: "center" }}>ที่อยู่</th>
                        <th
                          className="text-right"
                          style={{ fontSize: "25px", PaddingRight: "10px" }}
                        >
                          สถานะ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            รายละเอียดคำร้อง
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
                      <span style={{ fontSize: "35px" }}>
                        ดำเนินการเสร็จสิ้น
                      </span>
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

export default Tables;
