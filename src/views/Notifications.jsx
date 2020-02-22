import React from "react";
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
    zIndex: 2000,
    width: '600px',
    height: '600px'

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

const ComfirmModalStyles = {
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
    zIndex: 2000,
    width: '600px'
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

class Notifications extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      requests: [],
      modalIsOpen: false,
      confirmModal: false,
      detailToModal: '',
      detailToConfirmModal: ''
    }
    this._isMounted = false

    this.closeModal = this.closeModal.bind(this)
    this.openModal = this.openModal.bind(this)

    this.closeConfirmModal = this.closeConfirmModal.bind(this)
    this.openConfirmModal = this.openConfirmModal.bind(this)
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
        requests.push(doc.data())
      })
      this._isMounted && this.setState({ requests })
      //console.log(this.state.requests)
    }).catch(error => console.log(error))
  }

  generateRequestsRows() {
    const requests = this.state.requests

    const filtered = requests.filter((request) => {
      return request.status === false
    })
    return (
      filtered && filtered.map(fil => (
        <tr key={fil.id}>
          <td>#{fil.No}</td>
          <td>{fil.name}&nbsp;{fil.lastname}</td>
          <td>{this.statusLabel(fil.status, fil)}</td>
          <td className="text-right">{this.proceedLabel(fil.status, fil)}&nbsp;&nbsp;</td>
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
          color="info"
          onClick={() => this.openModal(detail)}
        >ดูรายละเอียด
        </Button>
      )
    } else return null
  }

  proceedLabel(status, detail) {
    if (status === false) {
      return (
        <Button
          className="regular-th"
          style={{ fontSize: '20px', fontWeight: 'normal', width: '250px' }}
          size="sm"
          outline
          color="success"
          onClick={() => this.openConfirmModal(detail)}
        ><i className="nc-icon nc-check-2"></i>&nbsp;ทำเครื่องหมายว่าดำเนินการเสร็จสิ้น
        </Button>
      )
    } else return null
  }

  updateToDatabase(requestNo) {
    //console.log(requestNo)
    let id = ''
    const newData = {
      status: true,
      successful: this.getCurrentDate()
    }

    db.collection('requests').where('No', '==', requestNo).get().then(snapshot => {
      snapshot.forEach(doc => {
        id = doc.id
      })
      //console.log(id)
      db.collection('requests').doc(id).update(newData).then(() => {
        window.location.reload();
      })
    }).catch(error => console.log(error))


  }



  getCurrentDate() {
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear() + 543;
    return `${date}/${month < 10 ? `0${month}` : `${month}`}/${year}`
  }

  openModal(detailToModal) {
    this.setState({ modalIsOpen: true })
    this.setState({ detailToModal })
    document.body.style.overflow = 'hidden'
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
    document.body.style.overflow = 'unset'
  }

  openConfirmModal(detailToConfirmModal) {
    this.setState({ confirmModal: true })
    this.setState({ detailToConfirmModal })
    document.body.style.overflow = 'hidden'
  }

  closeConfirmModal() {
    this.setState({ confirmModal: false })
    document.body.style.overflow = 'unset'
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const detailToModal = this.state.detailToModal
    const confirmDetail = this.state.detailToConfirmModal
    return (
      <>
        <div className="content regular-th">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">รายการคำร้องขอทั้งหมดที่อยู่ในสถานะรอดำเนินการ</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ fontSize: '25px' }}>คำขอลำดับที่</th>
                        <th style={{ fontSize: '25px' }}>ชื่อ-นามสกุล</th>
                        <th style={{ fontSize: '25px' }}>รายละเอียด</th>
                        <th className="text-right" style={{ fontSize: '25px' }}></th>
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
            &copy; {1900 + new Date().getYear()}, made with{" "}&nbsp;
            <i className="fa fa-heart heart" style={{ color: 'pink' }} />&nbsp; by IKHALAS
            &nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          closeTimeoutMS={500}
          onRequestClose={this.closeModal}
          style={modalStyles}
          contentLabel="Detail Modal"
        >
          <div className="box-header with-border regular-th" style={{ width: "500px" }}>
            <p style={{ fontSize: "35px", color: "black" }}><b>รายละเอียดคำร้องขอ</b></p>
          </div>
          <div className="box-body regular-th">
            {detailToModal.status === true ?
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
            <span style={{ fontWeight: "bold" }}>คำขอลำดับที่</span> : <b style={{ fontSize: "25px" }}>#{detailToModal.No}</b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style={{ fontWeight: "bold" }}>วันที่ยื่นคำขอ</span> : <b style={{ fontSize: "25px" }}>{detailToModal.date}</b>
            <br />
            <span style={{ fontWeight: "bold" }}>เลขประจำตัวประชาชน</span> : <b style={{ fontSize: "25px" }}>{detailToModal.id}</b>&nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            <span style={{ fontWeight: "bold" }}>ชื่อ-นามสกุล</span> : <b style={{ fontSize: "25px" }}>{detailToModal.name}&nbsp;&nbsp;{detailToModal.lastname}</b>
            <br />
            <span style={{ fontWeight: "bold" }}>เบอร์ติดต่อ</span> : <b style={{ fontSize: "25px" }}>{detailToModal.tel}</b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span style={{ fontWeight: "bold" }}>อีเมล</span> : <b style={{ fontSize: "25px" }}>{detailToModal.email === "" ? '-' : detailToModal.email}</b>
            <br />
            <span style={{ fontWeight: "bold" }}>รายละเอียดเพิ่มเติม</span> : <b style={{ fontSize: "25px" }}>{detailToModal.note === "" ? '-' : detailToModal.note}</b>
            <br />
            <span style={{ fontWeight: "bold" }}>ที่อยู่</span> : <b style={{ fontSize: "25px" }}>{detailToModal.address}&nbsp;ต.กันตังใต้&nbsp;อ.กันตัง&nbsp;จ.ตรัง</b>
            <br /><br />
            <Row>
              <Col md="6">
                {detailToModal.location &&
                  <a href={'https://www.google.com/maps/search/?api=1&query=' + detailToModal.lat + ',' + detailToModal.lng} target="_blank" rel="noopener noreferrer">
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

        <Modal
          isOpen={this.state.confirmModal}
          closeTimeoutMS={500}
          onRequestClose={this.closeConfirmModal}
          style={ComfirmModalStyles}
          contentLabel="Success Modal"
        >
          <div className="box-header with-border regular-th">
            <p style={{ fontSize: "35px", color: "black" }}><b>ดำเนินการเสร็จสิ้น</b></p>
          </div>
          <div className="box-body regular-th">
            <div style={{ backgroundColor: "#6bd098", padding: '8px 10px 8px 20px', color: 'white' }}>
              <span style={{ fontSize: "20px" }}>
                <b>การดำเนินการนี้จะเปลี่ยนสถานะของ&nbsp;
              <span style={{ fontSize: "25px", fontWeight: "bold" }}>"คำขอลำดับที่&nbsp;#{confirmDetail.No}"</span>
                  &nbsp;เป็น&nbsp;
              <span style={{ fontSize: "30px", fontWeight: "bold" }}>ดำเนินการเสร็จสิ้น</span>
                </b>
              </span>
            </div>
            <br />
            <span style={{ fontWeight: "bold" }}>คำขอลำดับที่</span> : <b style={{ fontSize: "25px" }}>#{confirmDetail.No}</b>
            <br />
            <span style={{ fontWeight: "bold" }}>เลขประจำตัวประชาชน</span> : <b style={{ fontSize: "25px" }}>{confirmDetail.id}</b>&nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            <span style={{ fontWeight: "bold" }}>ชื่อ-นามสกุล</span> : <b style={{ fontSize: "25px" }}>{confirmDetail.name}&nbsp;&nbsp;{confirmDetail.lastname}</b>
            <br />
            <span style={{ fontWeight: "bold" }}>ที่อยู่</span> : <b style={{ fontSize: "25px" }}>{detailToModal.address}&nbsp;ต.กันตังใต้&nbsp;อ.กันตัง&nbsp;จ.ตรัง</b>
            <br />
            <span style={{ fontWeight: "bold" }}>วันที่ดำเนินการ</span> : <b style={{ fontSize: "25px" }}>{this.getCurrentDate()}</b>
            <br /><br />
            <Row>
              <Col md="6">
                <p style={{ fontSize: '17px' }}>สามารถตรวจสอบรายการคำร้องขอทั้งหมดได้ในหน้า "รายการทั้งหมด"</p>
              </Col>
              <Col md="6" style={{ textAlign: "end" }}>
                <Button className="regular-th" outline color="secondary" style={{ borderRadius: '12px' }} onClick={this.closeConfirmModal}>
                  <span style={{ fontSize: '20px', fontWeight: 'normal' }}>&nbsp;&nbsp;ยกเลิก&nbsp;&nbsp;</span>
                </Button>
                &nbsp;&nbsp;
                                <Button
                  color="success"
                  className="regular-th"
                  style={{ borderRadius: '12px' }}
                  onClick={() => { this.updateToDatabase(confirmDetail.No) }}>
                  <span style={{ fontSize: '20px', fontWeight: 'normal' }}>&nbsp;&nbsp;ยืนยัน&nbsp;&nbsp;</span>
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
      </>
    );
  }
}

export default Notifications;
