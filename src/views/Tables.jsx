import React from "react";
import { Link } from 'react-router-dom'
import Modal from 'react-modal';
import { db } from '../assets/config/firebase'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button
} from "reactstrap";

const modalStyles = {
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#f9f9f9',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderRadius: '25px',
    zIndex: 2000

  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2000
  },
};

class Tables extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      requests: [],
      modalIsOpen: false,
      detailToMadal: ''
    }
    this._isMounted = false

    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)
  }

  componentDidMount() {
    this._isMounted = true
    this._isMounted && this.getData();
  }

  getData() {
    db.collection('requests').orderBy('No').get().then(snapshot => {
      let requests = []
      snapshot.forEach(doc => {
        //let data = doc.data()
        requests.push(doc)
      })
      this._isMounted && this.setState({ requests })
      //console.log(this.state.requests)
    }).catch(error => console.log(error))
  }

  generateRequestsRows() {
    const requests = this.state.requests
    return (
      requests && requests.map(req => (
        <tr key={req.id}>
          <td>#{req.data().No}</td>
          <td>{req.data().name}&nbsp;{req.data().lastname}</td>
          <td>{req.data().address}</td>
          <td className="text-right">{this.statusLabel(req.data().status, req.data())}&nbsp;&nbsp;</td>
        </tr>
      ))
    )
  }

  statusLabel(status, detail) {
    if (status === false) {
      return (
        <Button
          className="regular-th"
          style={{ fontSize: '20px', fontWeight: 'normal', width: '150px' }}
          size="sm"
          outline
          color="warning"
          onClick={() => this.openModal(detail)}
        >รอการดำเนินการ
        </Button>
      )
    } else if (status === true) {
      return (
        <Button
          className="regular-th"
          style={{ fontSize: '20px', fontWeight: 'normal', width: '150px' }}
          size="sm"
          outline
          color="success"
          onClick={() => this.openModal(detail)}
        >ดำเนินการแล้ว
        </Button>
      )
    } else return null
  }

  openModal(detailToMadal) {
    console.log(detailToMadal)
    this.setState({ modalIsOpen: true })
    this.setState({ detailToMadal })
    console.log("state" + this.state.detailToMadal.name)
    document.body.style.overflow = 'hidden'
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
    document.body.style.overflow = 'unset'
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const detailToMadal = this.state.detailToMadal
    return (
      <>
        <div className="content regular-th">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">รายการคำร้องขอทั้งหมด</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ fontSize: '25px' }}>คำขอลำดับที่</th>
                        <th style={{ fontSize: '25px' }}>ชื่อ-นามสกุล</th>
                        <th style={{ fontSize: '25px' }}>ที่อยู่</th>
                        <th className="text-right" style={{ fontSize: '25px', PaddingRight: '10px' }}>สถานะ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.generateRequestsRows()}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <div style={{ width: '100%', height: '50px', backgroundColor: '#3c3c3c' }} >
          <div className="text-right regular-th" style={{ color: 'white' }}>
            &copy; {1900 + new Date().getYear()}, made with{" "}
            <i className="fa fa-heart heart" /> by IKHALAS
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          closeTimeoutMS={500}
          onRequestClose={this.closeModal}
          style={modalStyles}
          contentLabel="Confirm Modal"
        >

          <div className="box-header with-border regular-th" style={{ width: "500px" }}>
            <p style={{ fontSize: "35px", color: "black" }}><b>รายละเอียดคำร้อง</b></p>
          </div>
          <div className="box-body regular-th">
            {detailToMadal.status === true ?
              <div style={{ backgroundColor: "#6bd098", padding: '8px 10px 8px 20px', color: 'white' }}>
                <span style={{ fontSize: "25px" }}>
                  <b>สถานะการดำเนินการ&nbsp;
              <span style={{ fontSize: "35px" }}>ดำเนินการแล้ว</span>
                  </b>
                </span>
              </div>
              :
              <div style={{ backgroundColor: "#fbc658", padding: '8px 10px 8px 20px', color: 'white' }}>
                <span style={{ fontSize: "25px" }}>
                  <b>สถานะการดำเนินการ&nbsp;
            <span style={{ fontSize: "35px" }}>รอการดำเนินการ</span>
                  </b>
                </span>
              </div>
            }

            คำขอลำดับที่ : <b style={{ fontSize: "25px" }}>#{detailToMadal.No}</b>
            <br />
            เลขประจำตัวประชาชน : <b style={{ fontSize: "25px" }}>{detailToMadal.id}</b>&nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            ชื่อ-นามสกุล : <b style={{ fontSize: "25px" }}>{detailToMadal.name}&nbsp;&nbsp;{detailToMadal.lastname}</b>
            <br />
            เบอร์ติดต่อ : <b style={{ fontSize: "25px" }}>{detailToMadal.tel}</b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            อีเมล : <b style={{ fontSize: "25px" }}>{detailToMadal.email === "" ? '-' : detailToMadal.email}</b>
            <br />
            รายละเอียดเพิ่มเติม : <b style={{ fontSize: "25px" }}>{detailToMadal.note === "" ? '-' : detailToMadal.note}</b>
            <br />
            ที่อยู่ : <b style={{ fontSize: "25px", fontWeight: 'bold' }}>{detailToMadal.address}&nbsp;ต.กันตังใต้&nbsp;อ.กันตัง&nbsp;จ.ตรัง</b>
            <br /><br />
            <Row>
              <Col md="6">
                {detailToMadal.location &&
                  <a href={'https://www.google.com/maps/search/?api=1&query=' + detailToMadal.lat +',' + detailToMadal.lng} target="_blank" rel="noopener noreferrer">
                    <Button
                      className="regular-th btn-round"
                      style={{ fontWeight: 'normal', fontSize: "20px" }}
                      outline color="info"
                      size="sm"
                    >
                      ตำแหน่งบน Google Map
                </Button>
                  </a>
                }
              </Col>
              <Col md="6" style={{ textAlign: "end" }}>

                <Button
                  color="success"
                  className="regular-th"
                  style={{ borderRadius: '12px' }}
                  onClick={this.closeModal}>
                  <span style={{ fontSize: '20px', fontWeight: 'normal' }}>&nbsp;&nbsp;ตกลง&nbsp;&nbsp;</span>
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
      </>
    );
  }
}

export default Tables;
