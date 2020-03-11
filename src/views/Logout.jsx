import React from "react";
import { auth } from '../api/firebase'
import { Button, Row, Col } from "reactstrap";

export default class Logout extends React.Component {
  render() {
    return (
      <>
        <div className="content regular-th">
          <Row>
            <Col md="12" style={{ height: "300%", textAlign: 'center' }}>
              <div style={{marginTop:'100px', fontSize:'25px'}}>
              <p>ท่านต้องการออกจากระบบหรือไม่ ?</p>
                <Button
                  className="regular-th btn-round"
                  style={{ fontWeight: 'normal', fontSize: '30px', width: '300px' }}
                  outline color="danger"
                  size="sm"
                  onClick={() => auth.signOut().then(res => {this.props.history.push('/login')})}
                >
                  <i className="nc-icon nc-user-run" style={{ fontSize: "40px" }}></i><br />
                  ออกจากระบบ
                  </Button>
              </div>

            </Col>
          </Row>
        </div>
      </>
    );
  }
}

