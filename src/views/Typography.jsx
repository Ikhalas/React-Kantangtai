import React from "react";
import { db } from '../assets/config/firebase'
import { Card, CardHeader, CardBody, Row, Col, Button, Table, TabContent, TabPane, Nav, NavItem, NavLink, CardTitle, CardText,  } from "reactstrap";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import classnames from 'classnames';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew-Bold.ttf',
    italics: 'THSarabunNew-Italic.ttf',
    bolditalics: 'THSarabunNew-BoldItalic.ttf'
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
}

const buttonGroupStyle = {
  fontWeight: 'normal',
  fontSize: "20px",
  width: '150px'
}

class Typography extends React.Component {

  constructor() {
    super();
    this.state = {
      requests: [],
      subHeader: '',
      activeTab: '1'

    }
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this._isMounted && this.getData();
  }

  toggleTab = tab => {
      if(this.state.activeTab !== tab) this.setState({activeTab:tab});
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

  generateFalseStatus = () => {
    const requests = this.state.requests

    let filtered = requests.filter((request) => {
      return request.status === false
    })

    console.log("false |" + filtered)
  }

  generateTrueStatus() {
    const requests = this.state.requests

    let filtered = requests.filter((request) => {
      return request.status === false
    })

    console.log("true |" + filtered)
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

  printPDF() {
    var docDefinition = {
      content: [
        { text: 'รายงานสรุปผลการดำเนินงาน', style: 'header' },
        { text: 'A simple table with nested elements', style: 'subheader' },
      ],
      defaultStyle: {
        font: 'THSarabunNew'
      }
    };
    pdfMake.createPdf(docDefinition).download()

  }

  componentWillUnmount() {
    this._isMounted = false;
  }


  render() {
    const activeTab = this.state.activeTab
    return (
      <>
        <div className="content regular-th">
        <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { this.toggleTab('1'); }}
            style={{color:'black'}}
          >
            รายการทั้งหมด
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { this.toggleTab('2'); }}
          >
            Tab2
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => { this.toggleTab('3'); }}
          >
            Tab3
          </NavLink>
        </NavItem>
      </Nav>


      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="12">
              <h4>Tab 1 Contents</h4>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <Row>
            <Col sm="12">
              <h4>Tab 2 Contents</h4>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="3">
          <Row>
            <Col sm="12">
              <h4>Tab 3 Contents</h4>
            </Col>
          </Row>
        </TabPane>
      </TabContent>
    </div>





































          <Row>
            <Col md="12">
              <Card>
                <Row>
                  <Col md="3" >
                    <h5 className="title regular-th" style={{ fontSize: "30px" }}>รายงานสรุปผลการดำเนินงาน</h5>
                  </Col>
                  <Col md="9">
                    <div className='text-right' style={{ paddingRight: '10px', paddingTop: '10px'  }}>
                      <Button onClick={this.printPDF} className="regular-th" style={buttonGroupStyle} outline color="primary">รายการทั้งหมด</Button>{' '}
                      <Button onClick={() => { this.generateFalseStatus() }} className="regular-th" style={buttonGroupStyle} outline color="warning">รอการดำเนินการ</Button>{' '}
                      <Button onClick={() => { this.generateTrueStatus() }} className="regular-th" style={buttonGroupStyle} outline color="success">ดำเนินการเสร็จสิ้น</Button>
                    </div>
                  </Col>
                </Row>
                <CardHeader>

                </CardHeader>
                <CardBody style={{ textAlign: "center", height: '400px' }}>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ fontSize: '25px' }}>#</th>
                        <th style={{ fontSize: '25px' }}>ชื่อ-นามสกุล</th>
                        <th style={{ fontSize: '25px' }}>ที่อยู่</th>
                        <th style={{ fontSize: '25px' }}>สถานะการดำเนินงาน</th>
                        <th className="text-right" style={{ fontSize: '25px' }}>วันที่ดำเนินการะ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>

                    </tbody>
                  </Table>
                  <Button
                    className="regular-th btn-round"
                    style={{ fontWeight: 'normal', fontSize: "25px" }}
                    outline color="info"
                    size="sm"
                    onClick={this.printPDF}
                  >
                    <i className="nc-icon nc-cloud-download-93" style={{ fontSize: "40px" }}></i><br />
                    ดาวน์โหลดไฟล์ PDF
                  </Button>

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
      </>
    );
  }
}

export default Typography;
