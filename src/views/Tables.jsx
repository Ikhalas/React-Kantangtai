import React from "react";
import Myfooter from './Myfooter'
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
      detailToModal: ''
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
          <td>
            {req.data().address}&nbsp;&nbsp;
            หมู่ที่&nbsp;{req.data().moo}&nbsp;&nbsp;
            {req.data().soi === "" ? null : <span>ซอย{req.data().soi}</span>}&nbsp;&nbsp;
            {req.data().road === "" ? null : <span>ถนน{req.data().road}</span>}
          </td>
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
        >ดำเนินการเสร็จสิ้น
        </Button>
      )
    } else return null
  }

  openModal(detailToModal) {
    //console.log(detailToModal)
    this.setState({ modalIsOpen: true })
    this.setState({ detailToModal })
    //console.log("state" + this.state.detailToModal.name)
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
    const detailToModal = this.state.detailToModal
    return (
      <>
        <div className="content regular-th">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4" style={{color:'#66615b'}}>รายการคำร้องขอทั้งหมด</CardTitle>
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
        
        <Modal
          isOpen={this.state.modalIsOpen}
          closeTimeoutMS={500}
          onRequestClose={this.closeModal}
          style={modalStyles}
          contentLabel="Confirm Modal"
        >

          <div className="box-header with-border regular-th">
            <p style={{ fontSize: "35px", color: "black" }}><b>รายละเอียดคำร้อง</b></p>
          </div>
          <div className="box-body regular-th">
            {detailToModal.status === true ?
              <div style={{ backgroundColor: "#6bd098", padding: '8px 10px 8px 20px', color: 'white' }}>
                <span style={{ fontSize: "25px" }}>
                  <b>สถานะการดำเนินการ&nbsp;
              <span style={{ fontSize: "35px" }}>ดำเนินการเสร็จสิ้น</span>
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
            <span style={{ fontWeight: "bold" }}>ที่อยู่</span> : &nbsp;
            <b style={{ fontSize: "20px" }}>
              บ้านเลขที่&nbsp;<b style={{ fontSize: "25px" }}>{detailToModal.address}</b>&nbsp;
              หมู่ที่&nbsp;<b style={{ fontSize: "25px" }}>{detailToModal.moo}</b>&nbsp;&nbsp;
              {detailToModal.soi === '' ? null :
                <span>ซอย<b style={{ fontSize: "25px" }}>{detailToModal.soi}</b>&nbsp;&nbsp;</span>
              }
              {detailToModal.road === '' ? null :
                <span>ถนน<b style={{ fontSize: "25px" }}>{detailToModal.road}</b>&nbsp;&nbsp;</span>
              }
              ต.กันตังใต้&nbsp;&nbsp;อ.กันตัง&nbsp;&nbsp;จ.ตรัง
            </b>
            <br />
            {detailToModal.status === true ? 
            <>
            <span style={{ fontWeight: "bold" }}>วันที่ดำเนินการ </span> : <b style={{ fontSize: "25px" }}>{detailToModal.successful}</b>
            </>
            : null
            
            }
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
        <Myfooter/>
      </>
    );
  }
}

export default Tables;
