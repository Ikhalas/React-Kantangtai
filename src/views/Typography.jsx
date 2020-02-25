import React from "react";
import Myfooter from './Myfooter'
import { db } from '../assets/config/firebase'
import { Card, CardBody, Row, Col, Button, Table, } from "reactstrap";
import Loader from 'react-loader-spinner'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
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
  width: '160px'
}

const activeButtonGroupStyle = {
  fontWeight: 'normal',
  fontSize: "23px",
  width: '160px'
}



class Typography extends React.Component {

  constructor() {
    super();
    this.state = {
      requests: [],
      reportType: 'full',
      listToShow: [],
      showButton: false
    }
    this._isMounted = false
  }

  componentDidMount() {
    this._isMounted = true
    this._isMounted && this.getData();
  }

  getData() {
    db.collection('requests').orderBy('No').get().then(snapshot => {
      let requests = []
      snapshot.forEach(doc => {
        requests.push(doc.data())
      })
      this._isMounted && this.setState({ requests, listToShow: requests, showButton: true })
    }).catch(error => console.log(error))
  }

  fullReport = () => {
    this.setState({
      reportType: 'full',
      listToShow: this.state.requests
    })
  }

  yellowReport = () => {
    const requests = this.state.requests
    let filtered = requests.filter((request) => {
      return request.status === false
    })
    this.setState({
      reportType: 'unsuccess',
      listToShow: filtered
    })
  }

  greenReport = () => {
    const requests = this.state.requests
    let filtered = requests.filter((request) => {
      return request.status === true
    })
    this.setState({
      reportType: 'success',
      listToShow: filtered
    })
  }


  generateTable() {
    const listToShow = this.state.listToShow
    return (
      listToShow && listToShow.map(list => (
        <tr key={list.id}>
          <td>#{list.No}</td>
          <td>{list.name}&nbsp;{list.lastname}</td>
          <td>{list.address}&nbsp;&nbsp;หมู่ที่&nbsp;{list.moo}&nbsp;&nbsp;{list.soi === "" ? null : <span>ซอย{list.soi}</span>}&nbsp;&nbsp;{list.road === "" ? null : <span>ถนน{list.road}</span>}</td>
          <td>{list.status === true ? <p className="text-success" style={{ fontWeight: 'bold' }}>ดำเนินการเสร็จสิ้น</p> : <p className="text-warning" style={{ fontWeight: 'bold' }}>รอการดำเนินการ</p>}</td>
          <td className="text-right">{list.successful === "" ? <span style={{ paddingRight: '90px' }}>-</span> : <span style={{ paddingRight: '55px' }}>{list.successful}</span>}</td>
        </tr>
      ))
    )
  }

  printPDF = () => {
    const { reportType, listToShow } = this.state

    let subheader = 'ไม่มีหัวข้อ'
    if (reportType === 'full') subheader = 'รายการคำขอรับน้ำสะอาดเพื่ออุปโภคบริโภค "ทั้งหมด"'
    else if (reportType === 'unsuccess') subheader = 'รายการคำขอรับน้ำสะอาดเพื่ออุปโภคบริโภคที่อยู่ในสถานะ "รอดำเนินการ"'
    else if (reportType === 'success') subheader = 'รายการคำขอรับน้ำสะอาดเพื่ออุปโภคบริโภคที่อยู่ในสถานะ "ดำเนินการเสร็จสิ้น"'
    else console.log('error')

    const result = listToShow.map(list => {
      return (
        {
          "#": "#" + list.No,
          "ชื่อ-นามสกุล": list.name + " " + list.lastname,
          "ที่อยู่": list.address + " " + "หมู่ที่ " + list.moo + " " + (list.soi === "" ? "" : "ซอย" + list.soi) + " " + (list.road === "" ? "" : "ถนน" + list.road),
          "สถานะการดำเนินงาน": list.status === true ? "ดำเนินการเสร็จสิ้น" : "รอการดำเนินการ",
          "วันที่ดำเนินการ": list.successful === "" ? "-" : list.successful
        }
      )
    })

    var docDefinition = {
      content: [
        { text: 'รายงานสรุปผลการดำเนินงาน', style: 'header' },
        { text: subheader, style: 'subheader' },

        this.table(result, ['#', 'ชื่อ-นามสกุล', 'ที่อยู่', 'สถานะการดำเนินงาน', 'วันที่ดำเนินการ',]),
      ],

      footer: {
        columns: [
          { text: 'องค์การบริหารส่วนตำบลกันตังใต้ อำเภอกันตัง จังหวัดตรัง', style: 'footer' }
        ]
      },

      defaultStyle: {
        font: 'THSarabunNew'
      },
      styles: {
        header: {
          fontSize: 25,
          bold: true,
          alignment: 'center',
          margin: [0, 15, 0, 0]
        },
        subheader: {
          fontSize: 17,
          margin: [0, 5, 0, 0]
        },
        table: {
          fontSize: 16,
          alignment: 'center'
        },
        footer: {
          fontSize: 14,
          alignment: 'right',
          margin: [0, 0, 25, 0]
        }
      }

    };

    pdfMake.createPdf(docDefinition).download('รายงานสรุปผลการดำเนินงาน.pdf')
  }

  table(data, columns) {
    return {
      style: 'table',
      table: {
        widths: [20, 120, 150, 100, 80],
        headerRows: 1,
        body: this.buildTableBody(data, columns)
      }
    };
  }

  buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach((row) => {
      var dataRow = [];

      columns.forEach((column) => {
        dataRow.push(row[column].toString());
      })

      body.push(dataRow);
    });

    return body;
  }




  componentWillUnmount() {
    this._isMounted = false;
  }


  render() {
    return (
      <>
        <div className="content regular-th">
          <Row>
            <Col md="12">
              <Card>
                <Row>
                  <Col md="4" >
                    <h5 className="title regular-th" style={{ fontSize: "30px" }}>รายงานสรุปผลการดำเนินงาน</h5>
                  </Col>
                  <Col md="8">
                    <div className='text-right' style={{ paddingRight: '10px', paddingTop: '10px' }}>
                      {this.state.reportType === 'full' ?
                        <><Button onClick={() => { this.fullReport() }} className="regular-th" style={activeButtonGroupStyle} color="primary">รายการทั้งหมด</Button>&nbsp;</>
                        :
                        <><Button onClick={() => { this.fullReport() }} className="regular-th" style={buttonGroupStyle} outline color="primary">รายการทั้งหมด</Button>&nbsp;</>
                      }

                      {this.state.reportType === 'unsuccess' ?
                        <><Button onClick={() => { this.yellowReport() }} className="regular-th" style={activeButtonGroupStyle} color="warning">รอการดำเนินการ</Button>&nbsp;</>
                        :
                        <><Button onClick={() => { this.yellowReport() }} className="regular-th" style={buttonGroupStyle} outline color="warning">รอการดำเนินการ</Button>&nbsp;</>
                      }

                      {this.state.reportType === 'success' ?
                        <><Button onClick={() => { this.greenReport() }} className="regular-th" style={activeButtonGroupStyle} color="success">ดำเนินการเสร็จสิ้น</Button></>
                        :
                        <><Button onClick={() => { this.greenReport() }} className="regular-th" style={buttonGroupStyle} outline color="success">ดำเนินการเสร็จสิ้น</Button></>
                      }
                      <p style={{ fontSize: '17px' }}>*เลือกรายการที่ต้องการจัดทำเอกสาร&nbsp;</p>
                    </div>
                  </Col>
                </Row>
                <CardBody style={{ textAlign: "center" }}>
                  <Table responsive>
                    <thead className="text-primary">
                      <tr>
                        <th style={{ fontSize: '25px' }}>#</th>
                        <th style={{ fontSize: '25px' }}>ชื่อ-นามสกุล</th>
                        <th style={{ fontSize: '25px' }}>ที่อยู่</th>
                        <th style={{ fontSize: '25px' }}>สถานะการดำเนินงาน</th>
                        <th className="text-right" style={{ fontSize: '25px' }}>วันที่ดำเนินการ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.generateTable()}
                    </tbody>
                  </Table>
                  {this.state.showButton === true ?
                    <Button
                      className="regular-th btn-round"
                      style={{ fontWeight: 'normal', fontSize: '25px', width: '300px' }}
                      outline color="info"
                      size="sm"
                      onClick={() => { this.printPDF() }}
                    >
                      <i className="nc-icon nc-cloud-download-93" style={{ fontSize: "40px" }}></i><br />
                      ดาวน์โหลดไฟล์ PDF
                  </Button>
                    :
                    <div>
                      <br/>
                      <Loader
                        type="Oval"
                        color="#51cbce"
                        height={50}
                        width={50}
                      />
                      <br/>
                    </div>

                  }

                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>

        <Myfooter />
      </>
    );
  }
}

export default Typography;
