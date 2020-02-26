import React from "react";
import { Link } from 'react-router-dom'
import { db } from '../assets/config/firebase'
// react plugin used to create charts
import { Pie } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";
// core components
import { dashboardEmailStatisticsChart } from "variables/charts.jsx";

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      requests: [],
      users: []

    }
    this._isMounted = false
    this._chart = ''

  }

  componentDidMount() {
    this._isMounted = true
    this._isMounted && this.getData();
    this._isMounted && this.getUser();
    
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

  getUser() {
    db.collection('users').get().then(snapshot => {
      let users = []
      snapshot.forEach(doc => {
        //let data = doc.data()
        users.push(doc.data())
      })
      this._isMounted && this.setState({ users })
      //console.log(this.state.requests)
    }).catch(error => console.log(error))
  }

  getTotalList() {
    return this.state.requests.length
  }

  getTotalYellow() {
    let filtered = this.state.requests.filter((request) => {
      return request.status === false
    })

    return filtered.length
  }

  getTotalUser() {
    return this.state.users.length
  }

  getMoo() {
    const requests = this.state.requests

    let moo1 = requests.filter(request => request.moo === 1)
    let moo2 = requests.filter(request => request.moo === 2)
    let moo3 = requests.filter(request => request.moo === 3)
    let moo4 = requests.filter(request => request.moo === 4)
    let moo5 = requests.filter(request => request.moo === 5)
    let moo6 = requests.filter(request => request.moo === 6)

    this._chart = {
      data: canvas => {
        return {
          labels: ['หมู่ที่ 1', 'หมู่ที่ 2', 'หมู่ที่ 3', 'หมู่ที่ 4', 'หมู่ที่ 5', 'หมู่ที่ 6'],
          datasets: [
            {
              label: "Emails",
              pointRadius: 0,
              pointHoverRadius: 0,
              backgroundColor: ["#e171e8", "#4acccd", "#fcc468", "#ef8157", "pink", "#71b37c"],
              borderWidth: 0,
              data: [moo1.length, moo2.length, moo3.length, moo4.length, moo5.length, moo6.length]
            }
          ]
        };
      }
    };


  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    this.getMoo()
    return (
      <>
        <div className="content regular-th">
          <Row>
            <Col lg="4" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-bullet-list-67 text-info" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p style={{ fontSize: '20px' }} className="card-category">รายการทั้งหมด</p>
                        <CardTitle tag="p">{this.getTotalList()} รายการ</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    &nbsp;<i className="fas fa-info" /> &nbsp;
                    <Link to='/admin/tables'>
                      <span style={{ color: '#66615b' }}>ดูรายการทั้งหมด</span>
                    </Link>
                  </div>
                </CardFooter>

              </Card>
            </Col>
            <Col lg="4" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-paper text-warning" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p style={{ fontSize: '20px' }} className="card-category">คำขอที่ยังไม่ดำเนินการ</p>
                        <CardTitle tag="p">{this.getTotalYellow()} รายการ</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    &nbsp;<i className="fas fa-info" /> &nbsp;
                    <Link to='/admin/notifications'>
                      <span style={{ color: '#66615b' }}>ดำเนินการ</span>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="4" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-single-02 text-primary" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p style={{ fontSize: '20px' }} className="card-category">บัญชีผู้มีสิทธิ์ใช้งานระบบ</p>
                        <CardTitle tag="p">{this.getTotalUser()} บัญชี</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    &nbsp;<i className="fas fa-info" /> &nbsp;
                    <Link to='/admin/user-page'>
                      <span style={{ color: '#66615b' }}>จัดการบัญชีผู้ใช้</span>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5" style={{ color: 'black' }}>
                    สถิติหมู่บ้านที่ยื่นคำขอ
                    </CardTitle>
                  <p className="card-category">จากหมู่บ้านทั้งหมด 6 หมู่</p>
                </CardHeader>
                <CardBody>
                  <Pie
                    data={this._chart.data}
                    options={dashboardEmailStatisticsChart.options}
                  />
                </CardBody>
                <CardFooter>
                  <div className="legend text-right" style={{ paddingRight: '10px', fontSize: '25px' }}>
                    <Row>
                      <Col lg="12" md="12" sm="12">
                        <i className="fa fa-circle" style={{ color: "#e171e8" }} /> หมู่ที่ 1{" "}&nbsp;
                    <i className="fa fa-circle text-primary" /> หมู่ที่ 2{" "}&nbsp;
                    <i className="fa fa-circle text-warning" /> หมู่ที่ 3{" "}
                      </Col>
                      <Col lg="12" md="12" sm="12">
                        <i className="fa fa-circle text-danger" /> หมู่ที่ 4{" "}&nbsp;
                    <i className="fa fa-circle" style={{ color: "pink" }} /> หมู่ที่ 5{" "}&nbsp;
                    <i className="fa fa-circle" style={{ color: "#71b37c" }} /> หมู่ที่ 6
                    </Col>
                    </Row>
                  </div>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-map-marker-alt" /> ตำบลกันตังใต้ อำเภอกันตัง จังหวัดตรัง
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
